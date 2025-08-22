// src/api.ts

// Replace this with the Production URL you copied from your n8n Webhook node.
const N8N_WEBHOOK_URL = "https://governorxd.app.n8n.cloud/webhook/b22ba19e-c229-4d2b-a6dd-c1bf2572c939";

// This function sends a message to the n8n bot and gets a reply
export const sendMessageToBot = async (message: string, sessionId:string): Promise<string> => {
  try {
    const response = await fetch(`${N8N_WEBHOOK_URL}?cid=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();

    // n8n sends back { "reply": "The AI's answer" }
    return data.reply || "Sorry, I couldn't get a response.";

  } catch (error) {
    console.error("Error communicating with the bot:", error);
    return "Sorry, there was an error connecting to the AI assistant.";
  }
};