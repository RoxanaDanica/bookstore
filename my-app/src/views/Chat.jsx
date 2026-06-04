import { useState } from "react";
import axios from "axios";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setInput("");

        const res = await axios.post("http://localhost:3000/api/chat", {
            message: userMessage
        });

        setMessages(prev => [
            ...prev,
            { role: "assistant", text: res.data.reply }
        ]);
        console.log(res.data.reply);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="min-h-[400px] border border-gray-300 p-2">
                {messages.map((m, i) => (
                    <div key={i} className="mb-2">
                        <b>{m.role}:</b> {m.text}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about books..."
            />

            <button onClick={sendMessage} className="mt-2 px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer">
                Send
            </button>
        </div>
    );
}