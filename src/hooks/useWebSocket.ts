import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

export type WsEventHandler = (data?: unknown) => void;

interface UseWebSocketOptions {
  enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { enabled = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<string, Set<WsEventHandler>>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
      query: { type: "public" },
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socketRef.current = socket;

    // Re-attach any existing handlers registered before socket was ready
    handlersRef.current.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        socket.on(event, handler);
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [enabled]);

  const on = useCallback(
    (event: string, handler: WsEventHandler): (() => void) => {
      if (!handlersRef.current.has(event)) {
        handlersRef.current.set(event, new Set());
      }
      handlersRef.current.get(event)!.add(handler);

      if (socketRef.current) {
        socketRef.current.on(event, handler);
      }

      return () => {
        handlersRef.current.get(event)?.delete(handler);
        if (socketRef.current) {
          socketRef.current.off(event, handler);
        }
      };
    },
    [],
  );

  const off = useCallback((event: string, handler?: WsEventHandler) => {
    if (handler) {
      handlersRef.current.get(event)?.delete(handler);
      socketRef.current?.off(event, handler);
    } else {
      handlersRef.current.delete(event);
      socketRef.current?.removeAllListeners(event);
    }
  }, []);

  return { connected, on, off };
}
