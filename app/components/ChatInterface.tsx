import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "react-copy-to-clipboard";

interface ChatMessage {
  role: "user" | "assistant"; 
  content: string;
}

interface ChatInterfaceProps {
  chatMessages: ChatMessage[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatMessages }) => {
  const extractCodeFromMessage = (content: string) => {
    if (content.includes("```")) {
      const codeContent = content.split("```")[1];
      return codeContent ? codeContent.trim() : "";
    }
    return content;
  };

  const formatMessageContent = (content: string) => {
    // Split content into paragraphs based on double newlines
    return content.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-2">
        {paragraph.trim()}
      </p>
    ));
  };

  const renderMessageContent = (content: string) => {
    if (content.includes("```")) {
      const parts = content.split("```");
      const beforeCode = parts[0];
      const afterCode = parts[2];
      
      return (
        <>
          {beforeCode && formatMessageContent(beforeCode)}
          <div className="max-w-2xl">
            <div className="bg-gray-800 text-white p-2 rounded-t-md flex justify-between items-center">
              <span className="text-sm">Code</span>
              <CopyToClipboard text={extractCodeFromMessage(content)}>
                <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                  Copy
                </button>
              </CopyToClipboard>
            </div>
            <SyntaxHighlighter
              language="javascript"
              style={coy}
              className="rounded-b-md shadow-lg"
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {extractCodeFromMessage(content)}
            </SyntaxHighlighter>
          </div>
          {afterCode && formatMessageContent(afterCode)}
        </>
      );
    }

    // Handle streaming response
    const handleStreamingResponse = async (response: Response) => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          try {
            while (true) {
              const { done, value } = await reader!.read();
              if (done) break;
              const text = new TextDecoder().decode(value);
              controller.enqueue(encoder.encode(text));
            }
          } finally {
            controller.close();
            reader?.releaseLock();
          }
        },
      });
      return stream;
    };

    return formatMessageContent(content);
  };

  return (
    <div className="chat-container">
      {chatMessages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
        >
          <div
            className={`inline-block p-2 rounded-lg whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 shadow-sm"
            }`}
          >
            {renderMessageContent(msg.content)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatInterface;
