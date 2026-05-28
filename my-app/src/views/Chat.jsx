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
        <div style={{ maxWidth: 600, margin: "auto" }}>
            <div style={{ minHeight: 400, border: "1px solid #ccc", padding: 10 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ margin: "10px 0" }}>
                        <b>{m.role}:</b> {m.text}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about books..."
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
}