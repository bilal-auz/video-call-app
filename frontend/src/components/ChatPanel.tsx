import React, { useContext, useEffect } from "react";
import { SocketContext } from "../context/VideoCallContext";

interface ChatPanelProps {}
interface Message {
  sender: string;
  receiver: string;
  content: string;
  time: string;
}

const ChatPanel: React.FC<ChatPanelProps> = () => {
  const {
    myName,
    myId,
    guestId,
    isCameraAvailable,
    myVideoRef,
    guestRef,
    callRoom,
    guestConnected,
    isCalling,
    socket,
  } = useContext(SocketContext);

  const [newMessageContent, setNewMessageContent] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    socket.on("newMessage", (newMessage: Message) => {
      setMessages((oldMessages) => [...oldMessages, newMessage]);
    });
  }, []);

  useEffect(() => {
    const chats = document.getElementById("chats");
    if (chats) {
      chats.scrollTop = chats.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const newMessage: Message = {
      sender: myName,
      receiver: guestId,
      content: newMessageContent,
      time: new Date().toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("sendMessage", newMessage);

    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col justify-around bg-[#1f272f] rounded-lg h-[481px]">
      <div className="flex flex-row justify-center items-center w-full">
        <p className="text-[#15E8D8]">Chat</p>
      </div>
      <div
        className="bg-[#1f272f] h-4/6 overflow-y-scroll scroll-smooth p-2"
        id="chats"
      >
        {messages.map((message, index) => {
          if (message.sender === myName) {
            return (
              <div className="chat chat-end" key={index}>
                <div className="chat-header">{myName}</div>
                <div className="chat-bubble text-base">{message.content}</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">{message.time}</time>
                </div>
              </div>
            );
          } else {
            return (
              <div className="chat chat-start" key={index}>
                <div className="chat-header">{message.sender}</div>
                <div className="chat-bubble text-base text-left">
                  {message.content}
                </div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">{message.time}</time>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="flex flex-row justify-center items-center w-full">
        <input
          className="input w-8/12 focus:border-0 focus:outline-[#15E8D8] mr-2"
          type="text"
          disabled={!guestConnected}
          placeholder={guestConnected ? "Type a message..." : "No one here"}
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button
          className="btn text-[#15E8D8]"
          onClick={sendMessage}
          disabled={!guestConnected}
        >
          send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
