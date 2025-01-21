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
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";
    let accumulatedContent = ""; // Add this to accumulate the message content

    const stream = new TransformStream({
      async transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                // Accumulate the content instead of sending immediately
                accumulatedContent += json.message.content;

                // Send the accumulated content
                const chunk = encoder.encode(
                  JSON.stringify({
                    role: "assistant",
                    content: accumulatedContent,
                  }) + "\n"
                );
                controller.enqueue(chunk);
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      },
      flush(controller) {
        if (buffer) {
          try {
            const json = JSON.parse(buffer);
            if (json.message?.content) {
              accumulatedContent += json.message.content;
              const chunk = encoder.encode(
                JSON.stringify({
                  role: "assistant",
                  content: accumulatedContent,
                }) + "\n"
              );
              controller.enqueue(chunk);
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      },
    });

    return new Response(response.body?.pipeThrough(stream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
