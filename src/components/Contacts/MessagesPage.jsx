import { useEffect, useState } from "react";
import axios from "axios";

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5001/messages")
            .then(response => setMessages(response.data))
            .catch(error => console.error("❌ Error fetching messages:", error));
    }, []);

    const handleSendResponse = async () => {
        if (!selectedMessageId || !response.trim()) {
            alert("Please enter a response.");
            return;
        }
    
        try {
            await axios.post(`http://localhost:5001/messages/${selectedMessageId}/respond`, { response });
            alert("Response sent successfully!");
    
            // ✅ Update message list after response
            setMessages(messages.map(msg => 
                msg.id === selectedMessageId ? { ...msg, admin_response: response } : msg
            ));
    
            setResponse("");
            setSelectedMessageId(null);
        } catch (error) {
            console.error("❌ Error sending response:", error);
            alert("Failed to send response.");
        }
    };
    

    return (
        <div className="flex flex-col p-8 bg-white min-h-screen">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Messages</h2>

            <div className="bg-white shadow-sm border rounded-lg">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="text-gray-600 bg-gray-100 border-b">
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 p-4">
                                    No messages yet.
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr key={msg.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{msg.name}</td>
                                    <td className="p-3">{msg.phone}</td>
                                    <td className="p-3">{msg.message}</td>
                                    <td className="p-3">
    {msg.admin_response ? (
        <p className="text-green-600">{msg.admin_response}</p>
    ) : (
        <input
            type="text"
            className="border p-2 rounded w-full"
            value={selectedMessageId === msg.id ? response : ""}
            onChange={(e) => {
                setSelectedMessageId(msg.id);
                setResponse(e.target.value);
            }}
        />
    )}
    {!msg.admin_response && (
        <button onClick={handleSendResponse} className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Send Response
        </button>
    )}
</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MessagesPage;
