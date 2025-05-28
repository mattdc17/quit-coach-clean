import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function getChatCompletion(messages: any[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  return completion.choices[0]?.message?.content || "Sorry, I didn’t catch that.";
}
