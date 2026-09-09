import { useState, useEffect, useRef } from "react";
import { sendChatMessage, getConversation, startConversation } from "../api/chat";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Chat({ onClose }) {
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

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-[#f8f6f2]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d8d1c8] border-t-[#b5202d]" />

          <p className="text-sm text-[#77716b]">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[540px] flex-col overflow-hidden rounded-2xl border border-[#e5dfd7] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between border-b border-[#eee9e3] bg-white px-4 py-3">
        <div>
          <p className="font-['Playfair'] text-[19px] font-semibold text-[#171717]">
            Ivy
          </p>

          <p className="mt-0.5 text-xs text-[#96908a]">
            Your personal book asistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewConversation}
            className="
              rounded-full border border-[#ded8d1]
              px-4 py-2 text-xs font-semibold
              text-[#171717] transition
              hover:border-[#b5202d]
              hover:bg-[#b5202d]
              hover:text-white
            "
          >
            New chat
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full text-[#77716b]
              transition
              hover:bg-[#f3f0ea]
              hover:text-[#171717]
              hover:cursor-pointer
            "
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#faf8f5] px-4 py-5">
        {messages.length === 0 && !thinking && (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-[280px] text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#efe9df]">
                <span className="font-['Playfair'] text-lg font-semibold text-[#b5202d]">
                  Ivy
                </span>
              </div>

              <h3 className="font-['Playfair'] text-[20px] font-semibold text-[#171717]">
                Looking for your next read?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#8b8580]">
                Tell Ivy what you're in the mood for and she'll help you find the right book.
              </p>
            </div>
          </div>
        )}

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
                max-w-[78%] px-4 py-3
                text-sm leading-6
                ${
                  m.role === "user"
                    ? "rounded-2xl rounded-br-md bg-[#171717] text-white"
                    : "rounded-2xl rounded-bl-md border border-[#e5dfd7] bg-white text-[#3d3935] shadow-[0_4px_14px_rgba(0,0,0,0.03)]"
                }
              `}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#e5dfd7] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.03)]">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9b958f] [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9b958f] [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9b958f]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#eee9e3] bg-white p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-[#ded8d1] bg-[#faf9f7] p-2 transition focus-within:border-[#b5202d] focus-within:bg-white">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="
              max-h-[110px] min-h-[42px] flex-1
              resize-none bg-transparent
              px-2 py-2 text-sm leading-5
              text-[#171717]
              outline-none
              placeholder:text-[#aaa49d]
            "
            placeholder="Ask about a book..."
            rows={1}
          />

          <button
            onClick={sendMessage}
            disabled={thinking || !input.trim()}
            className="
              flex h-10 items-center justify-center
              rounded-xl bg-[#171717]
              px-4 text-sm font-semibold text-white
              transition
              hover:bg-[#b5202d]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Send
          </button>
        </div>

        <p className="mt-2 px-1 text-[11px] text-[#aaa49d]">
            Ask for help with book recommendations, stock, details, or reviews.
        </p>
      </div>
    </div>
  );
}