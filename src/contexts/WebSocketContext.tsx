import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { useWebSocket, type WsEventHandler } from "../hooks/useWebSocket";

// Mirror the backend WsEvent enum — public-relevant events only
export const WsEvent = {
  MENU_UPDATED: "menu:updated",
  MENU_ITEM_CREATED: "menu:item:created",
  MENU_ITEM_UPDATED: "menu:item:updated",
  MENU_ITEM_DELETED: "menu:item:deleted",
  SPECIAL_CREATED: "special:created",
  SPECIAL_UPDATED: "special:updated",
  SPECIAL_DELETED: "special:deleted",
  EVENT_CREATED: "event:created",
  EVENT_UPDATED: "event:updated",
  EVENT_DELETED: "event:deleted",
  OPENING_HOURS_UPDATED: "openingHours:updated",
  STORY_UPDATED: "story:updated",
  PARTY_MENU_UPDATED: "partyMenu:updated",
} as const;

interface WebSocketContextType {
  connected: boolean;
  on: (event: string, handler: WsEventHandler) => () => void;
  off: (event: string, handler?: WsEventHandler) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { connected, on, off } = useWebSocket({ enabled: true });

  return (
    <WebSocketContext.Provider value={{ connected, on, off }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWs() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWs must be used within a WebSocketProvider");
  }
  return context;
}

export function useWsEvent(event: string, handler: WsEventHandler) {
  const { on } = useWs();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const stableHandler: WsEventHandler = (data) => handlerRef.current(data);
    const cleanup = on(event, stableHandler);
    return cleanup;
  }, [event, on]);
}

export function useWsRefresh(event: string, fetchFn: () => void) {
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  useWsEvent(
    event,
    useCallback(() => {
      fetchRef.current();
    }, []),
  );
}
