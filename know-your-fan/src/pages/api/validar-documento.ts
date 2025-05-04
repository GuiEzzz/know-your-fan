import type { NextApiRequest, NextApiResponse } from 'next';
import { extrairTextoGoogleVision } from '@/pages/api/ocr';
import { openai } from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64Imagem, nomeInformado, cpfInformado } = req.body;

  if (!base64Imagem || !nomeInformado || !cpfInformado)
    return res.status(400).json({ erro: 'Dados incompletos.' });

  try {
    const textoExtraido = await extrairTextoGoogleVision(base64Imagem);

    console.log('Texto extraído:', textoExtraido);

    const prompt = `
O seguinte texto foi extraído de um documento de identidade (RG ou CPF):
"""
${textoExtraido}
"""

Compare com os dados informados:
- Nome: "${nomeInformado}"
- CPF: "${cpfInformado}"

Responda se os dados batem com o documento ("Válido! Em instantes, você será redirecionado..."), apenas com essas palavras mencionadas. Caso seja negativo, de uma resposta simples do porquê foi negado.
`;

    const resposta = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 50
    });

    const resultado = resposta.choices[0].message.content;
    res.status(200).json({ resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao validar documento.' });
  }
}
