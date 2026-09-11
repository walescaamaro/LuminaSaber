import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError.js';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // confira modelos disponíveis em console.groq.com/docs/models

async function chamarGemini(prompt: string): Promise<string> {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) throw new Error('GEMINI_API_KEY não configurada');

  const resposta = await fetch(`${GEMINI_URL}?key=${chave}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Gemini falhou (${resposta.status}): ${erro}`);
  }

  const dados = await resposta.json();
  const texto = dados.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texto) throw new Error('Gemini retornou resposta vazia');
  return texto;
}

async function chamarGroq(prompt: string): Promise<string> {
  const chave = process.env.GROQ_API_KEY;
  if (!chave) throw new Error('GROQ_API_KEY não configurada');

  const resposta = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${chave}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Groq falhou (${resposta.status}): ${erro}`);
  }

  const dados = await resposta.json();
  const texto = dados.choices?.[0]?.message?.content;
  if (!texto) throw new Error('Groq retornou resposta vazia');
  return texto;
}

export async function analisar(req: Request, res: Response, next: NextFunction) {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      throw new HttpError(400, 'Campo "prompt" é obrigatório.');
    }

    let texto: string;
    let fonte: 'gemini' | 'groq';

    try {
      texto = await chamarGemini(prompt);
      fonte = 'gemini';
    } catch (erroGemini) {
      console.warn('[IA] Gemini indisponível, usando Groq como fallback:', (erroGemini as Error).message);
      texto = await chamarGroq(prompt);
      fonte = 'groq';
    }

    console.log(`[IA] Resposta gerada via ${fonte}`);

    // Mantém o formato do Gemini pra não precisar mexer no front-end
    res.json({
      candidates: [{ content: { parts: [{ text: texto }] } }],
      _fonte: fonte,
    });
  } catch (erro) {
    next(erro);
  }
}