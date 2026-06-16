import {
  createContext,
  useContext,
  useState,
  useCallback,
  lazy,
  Suspense,
} from 'react';
import { useNavigate } from 'react-router-dom';

const ShatterPortalOverlay = lazy(
  () => import('../components/ShatterPortalOverlay'),
);

export interface TileTransitionOpts {
  path: string;
  rect: DOMRect;
  image: string;
  label: string;
  tagline: string;
  previewImages: string[];
}

type Phase = 'animating' | 'covered' | 'revealing';

interface TransitionState {
  opts: TileTransitionOpts;
  phase: Phase;
}

interface PageTransitionContextValue {
  trigger: (opts: TileTransitionOpts) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  trigger: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

const ANIM_DURATION = 1500;  // ms — must match ShatterPortalOverlay timing
const REVEAL_DURATION = 700; // ms — fade-out after navigation

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<TransitionState | null>(null);

  const trigger = useCallback(
    (opts: TileTransitionOpts) => {
      if (state) return; // ignore if already transitioning

      // Phase 1: animation plays; cover div is invisible
      setState({ opts, phase: 'animating' });

      setTimeout(() => {
        // Phase 2: instantly cover the screen (masks Home unmounting)
        setState({ opts, phase: 'covered' });
        navigate(opts.path);

        // Phase 3: two rAFs so the CSS transition registers the opacity change
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setState({ opts, phase: 'revealing' });
            setTimeout(() => setState(null), REVEAL_DURATION);
          });
        });
      }, ANIM_DURATION);
    },
    [navigate, state],
  );

  // Cover div opacity per phase:
  //   animating  → 0 (invisible; shatter animation is visible)
  //   covered    → 1 (instant black; masks the unmount flash)
  //   revealing  → 0 with CSS transition (smooth reveal of new page)
  const coverVisible = state !== null;

  return (
    <PageTransitionContext.Provider value={{ trigger, isTransitioning: !!state }}>
      {children}

      {/* Shatter overlay — rendered at layout level so it survives navigation */}
      {state && (
        <Suspense fallback={null}>
          <ShatterPortalOverlay
            rect={state.opts.rect}
            image={state.opts.image}
            label={state.opts.label}
            tagline={state.opts.tagline}
            previewImages={state.opts.previewImages}
            isTriggered
            onComplete={() => {}}
          />
        </Suspense>
      )}

      {/* Black cover div — appears instantly at navigate, then fades out */}
      {coverVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0C0A09',
            zIndex: 10000,
            pointerEvents: 'none',
            opacity: state.phase === 'revealing' ? 0 : state.phase === 'covered' ? 1 : 0,
            transition:
              state.phase === 'revealing'
                ? `opacity ${REVEAL_DURATION}ms ease`
                : 'none',
          }}
        />
      )}
    </PageTransitionContext.Provider>
  );
}
