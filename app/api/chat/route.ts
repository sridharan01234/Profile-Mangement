export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5-coder:1.5b",
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      role: "assistant", 
      content: data.message.content
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
