import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Instanciar o OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json(); // Recebe o prompt do frontend

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Você é um assistente que valida informações de e-sports." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7, 
      max_tokens: 100, // Número de tokens da resposta
    });

    const message = response.choices[0]?.message?.content;

    return NextResponse.json({ message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao validar com IA" }, { status: 500 });
  }
}
