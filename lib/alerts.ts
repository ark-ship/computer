async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    }
  );

  return response.ok;
}

async function sendDiscord(message: string) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return false;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content: message,
    }),
  });

  return response.ok;
}

export async function sendAlert(message: string) {
  const results = await Promise.allSettled([
    sendTelegram(message),
    sendDiscord(message),
  ]);

  return results.some(
    (result) => result.status === "fulfilled" && result.value === true
  );
}