import { useState, useEffect, useRef } from "react";
import { sendChatMessage, getConversation, startConversation } from "../api/chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const res = await getConversation();

        setMessages(res.data.messages ?? []);
        setConversationId(res.data.conversation_id ?? null);
      } catch (err) {
        console.error("Could not load conversation", err);

      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const handleNewConversation = async () => {
  try {
    const res = await startConversation();

    setConversationId(res.data.conversation_id);
    setMessages([]);
  } catch (err) {
    console.error("Could not start conversation", err);
  }
};

const sendMessage = async () => {
  const message = input.trim();

  if (!message || thinking) return;

  setThinking(true);

  try {
    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const startRes = await startConversation();

      activeConversationId = startRes.data.conversation_id;
      setConversationId(activeConversationId);
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");

    const res = await sendChatMessage({
      message,
      conversation_id: activeConversationId,
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: res.data.reply,
      },
    ]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "AI service error",
      },
    ]);
  } finally {
    setThinking(false);
  }
};

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border border-[#e5e5e5] rounded-lg overflow-hidden">
      <button
        onClick={handleNewConversation}
        className="text-sm px-3 py-1 border rounded hover:cursor-pointer hover:bg-[#e52334] hover:text-white transition-all duration-200"
      >
        New chat
      </button>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[70%] px-3 py-2 rounded-2xl text-sm
                ${
                  m.role === "user"
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
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border border-[#e5e5e5] rounded px-3 py-2 text-sm resize-none"
          placeholder="Type a message..."
          rows={1}
        />

        <button
          onClick={sendMessage}
          disabled={thinking}
          className="bg-[#e52334] text-white px-4 py-2 rounded hover:cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}