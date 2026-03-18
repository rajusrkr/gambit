import { createContext, useContext, useEffect, useRef, useState } from "react";
import { type Message } from "@repo/types";

interface WebSocketContextType {
  lastMessage: string | null;
  sendMessage: (msg: Message) => void;
  status: string;
}
const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
  url,
}: {
  children: any;
  url: string;
}) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState<"closed" | "open">(
    "closed",
  );
  const socketRef = useRef<null | WebSocket>(null);
  const reconnectCount = useRef(0);

  const connect = () => {
    if (socketRef.current !== null) return;
    socketRef.current = new WebSocket(url);
    socketRef.current.onopen = () => {
      console.log("Socket connection open now");
      setConnectionStatus("open");
      reconnectCount.current = 0;
    };

    socketRef.current.onmessage = (msg) => {
      setLastMessage(msg.data);
    };

    socketRef.current.onclose = () => {
      socketRef.current = null;
      setConnectionStatus("closed");
      handleReconnect();
    };
  };

  const handleReconnect = () => {
    const delay = Math.min(Math.pow(2, reconnectCount.current) * 1000, 30000);
    console.log(`Trying to reconnect again after ${delay}`);
    setTimeout(() => {
      reconnectCount.current++;
      connect();
    }, delay);
  };

  useEffect(() => {
    connect();
    return () => {
      socketRef.current && socketRef.current.close();
    };
  }, [url]);

  //   Value for websocket context provider
  const value: WebSocketContextType = {
    lastMessage,
    status: connectionStatus,
    sendMessage: (msg) => {
      if (!socketRef.current) {
        throw new Error("No socket connection available to send message");
      }
      socketRef.current.send(JSON.stringify(msg));
    },
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebsocket must be used within a WebSocketProvider");
  }
  return context;
};
