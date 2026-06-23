import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../api/chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [thinking, setThinking] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    let cid = localStorage.getItem("conversation_id");

    if (!cid) {
      cid = "conv_" + Date.now();
      localStorage.setItem("conversation_id", cid);
    }

    setConversationId(cid);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setThinking(true);

    try {
      const res = await sendChatMessage({
        message: userMessage,
        conversation_id: conversationId,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);

      setConversationId(res.data.conversation_id);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "AI service error" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-[#e5e5e5] rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 border-[#e5e5e5]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[70%] px-3 py-2 rounded-2xl text-sm
                ${m.role === "user"
                  ? "bg-[#e52334] text-white rounded-br-sm"
                  : "bg-white border border-[#e5e5e5] rounded-bl-sm"
                }
              `}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border px-3 py-2 rounded-2xl flex gap-1 items-end">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t border-[#e5e5e5] flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-[#e5e5e5] rounded px-3 py-2 text-sm"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-[#e52334] text-white px-4 py-2 rounded hover:cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}