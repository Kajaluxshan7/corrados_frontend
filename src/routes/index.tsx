import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layouts';
import PageLoader from '../components/PageLoader';

const Home       = lazy(() => import('../pages/Home'));
const About      = lazy(() => import('../pages/About'));
const Menus      = lazy(() => import('../pages/Menus'));
const Specials   = lazy(() => import('../pages/Specials'));
const PartyMenus = lazy(() => import('../pages/PartyMenus'));
const FamilyMeals = lazy(() => import('../pages/FamilyMeals'));
const Events     = lazy(() => import('../pages/Events'));
const Gallery    = lazy(() => import('../pages/Gallery'));
const GiftCards  = lazy(() => import('../pages/GiftCards'));
const Contact    = lazy(() => import('../pages/Contact'));
const NotFound   = lazy(() => import('../pages/NotFound'));


function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/',              element: withSuspense(<Home />) },
      { path: '/about',         element: withSuspense(<About />) },
      { path: '/menus',         element: withSuspense(<Menus />) },
      { path: '/specials',      element: withSuspense(<Specials />) },
      { path: '/party-menus',   element: withSuspense(<PartyMenus />) },
      { path: '/family-meals',  element: withSuspense(<FamilyMeals />) },
      { path: '/events',        element: withSuspense(<Events />) },
      { path: '/gallery',       element: withSuspense(<Gallery />) },
      { path: '/gift-cards',    element: withSuspense(<GiftCards />) },
      { path: '/contact',       element: withSuspense(<Contact />) },
      { path: '*',              element: withSuspense(<NotFound />) },
    ],
  },
]);

export default router;
