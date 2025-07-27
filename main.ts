// main.ts
const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SECRET_PATH = Deno.env.get("SECRET_PATH") || "webhook";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname !== `/${SECRET_PATH}`) {
    return new Response("Not found", { status: 404 });
  }

  const update = await req.json();
  const chat_id = update?.message?.chat?.id;
  const text = update?.message?.text;

  if (text === "/start") {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text: "Welcome! Your bot is running on Deno." }),
    });
  } else if (text) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text: `You said: ${text}` }),
    });
  }

  return new Response("OK");
});
