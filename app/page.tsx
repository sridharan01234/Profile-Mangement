"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; 
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ChatInterface from "@/app/components/ChatInterface";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    setIsChatLoading(true);
    const newMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, newMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader?.read() || { done: true, value: undefined };
        if (done) break;

        const text = decoder.decode(value);
        const chunks = text.split('\n').filter(Boolean);

        for (const chunk of chunks) {
          try {
            const data = JSON.parse(chunk);
            setChatMessages((prev) => [...prev, data]);
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsChatLoading(false);
      setChatInput("");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center"><h1 className="text-xl font-semibold">Profile Management</h1></div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.username}!</span>
                  <div className="relative">
                    <Image src={`/profile/${user.userId}.jpg`} alt="Profile picture" className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer" width={60} height={50} onClick={() => setProfilePicture(!profilePicture)} />
                    {profilePicture && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</Link>
                        <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); router.push("/login"); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-medium p-4 border-b bg-white">Chat Assistant</h3>
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50 max-h-[calc(100vh-280px)]">
                <ChatInterface chatMessages={chatMessages} />
                {isChatLoading && <div className="text-center mt-4"><div className="animate-pulse">Processing...</div></div>}
              </div>
              <div className="p-4 border-t bg-white flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleChat()} placeholder="Type your message..." className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleChat} disabled={isChatLoading} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors">Send</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
