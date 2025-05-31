import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import clsx from "clsx";

function Chat({ rideId, senderId, senderType }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { socket } = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-private-chat", { rideId });

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("private-message", handleMessage);

    return () => {
      socket.off("private-message", handleMessage);
    };
  }, [socket, rideId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("private-message", {
        rideId,
        senderId,
        senderType,
        message: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-md mx-auto border rounded shadow bg-white overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx(
              "max-w-[75%] p-2 rounded-lg text-sm",
              msg.senderId === senderId
                ? "bg-yellow-400 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            )}
          >
            <div className="font-medium text-xs mb-1">
              {msg.senderType.toUpperCase()}
            </div>
            <div>{msg.message}</div>
            <div className="text-[10px] text-right mt-1 opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex border-t p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-l outline-none focus:ring-2 focus:ring-yellow-100"
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-400 text-white px-4 py-2 rounded-r hover:bg-yellow-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
