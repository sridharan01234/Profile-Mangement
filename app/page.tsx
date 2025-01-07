"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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
          model: "qwen2.5-coder:1.5b",
          messages: [...chatMessages, newMessage],
        }),
      });

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message.content },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsChatLoading(false);
      setChatInput("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Profile Management</h1>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    Welcome, {user.username}!
                  </span>
                  <div className="relative">
                    <Image
                      src={`/profile/${user.userId}.jpg`}
                      alt="Profile picture"
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer"
                      width={60}
                      height={50}
                      onClick={() => setProfilePicture(!profilePicture)}
                    />
                    {profilePicture && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={async () => {
                            await fetch("/api/auth/logout", {
                              method: "POST",
                              credentials: "include",
                            });
                            router.push("/login");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>{" "}
                      </div>
                    )}
                  </div>{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            {/* Chatbot Section */}
            <div className="mt-8 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Chat Assistant</h3>
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-center">
                    <div className="animate-pulse">Processing...</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleChat()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={handleChat}
                  disabled={isChatLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
