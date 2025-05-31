import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "../context/SocketContext";

function SocketProvider({ children }) {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_BASE_URL}`);

    socket.current.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
