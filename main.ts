const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SECRET_PATH = Deno.env.get("SECRET_PATH") || "webhook";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Respond to browser visits
  if (req.method === "GET") {
    return new Response("🤖 Hello from your Telegram bot!", { status: 200 });
  }

  // Respond only to POST on the correct secret path
  if (url.pathname !== `/${SECRET_PATH}` || req.method !== "POST") {
    return new Response("Not found", { status: 404 });
  }

  let update;
  try {
    update = await req.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const chat_id = update?.message?.chat?.id;
  const text = update?.message?.text;

  if (chat_id && text) {
    let reply = "You said: " + text;
    if (text === "/start") {
      reply = "Hi! I'm your bot on Deno Deploy.";
    }

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text: reply }),
    });
  }

  return new Response("OK");
});
