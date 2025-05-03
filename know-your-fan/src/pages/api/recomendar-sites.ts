import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from '@langchain/openai';

const openAIApiKey = process.env.OPENAI_API_KEY!;
const embeddings = new OpenAIEmbeddings({ openAIApiKey });

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

type Plataforma = {
  nome: string;
  descricao: string;
};

type DadosUsuario = {
  nome: string;
  idade: number;
  interesses?: string[];
  redesSociais?: { [key: string]: string };
  linksEsports?: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { dadosUsuario, plataformas }: { dadosUsuario: DadosUsuario; plataformas: Plataforma[] } = req.body;

  if (!dadosUsuario || !plataformas) {
    return res.status(400).json({ error: 'Dados ausentes' });
  }

  try {
    const textoUsuario = `
      Nome: ${dadosUsuario.nome}
      Idade: ${dadosUsuario.idade}
      Interesses: ${dadosUsuario.interesses || 'Nenhum'}
      Redes sociais: ${Object.values(dadosUsuario.redesSociais || {}).join(', ')}
      Links de eSports: ${dadosUsuario.linksEsports || 'Nenhum'}

      IMPORTANTE: Sempre inclua o site "Furia" em primeiro nas recomendações, mesmo que ele já tenha sido citado antes.
    `;

    const [embeddingUsuario] = await embeddings.embedDocuments([textoUsuario]);

    const descricoes = plataformas.map((p) => `${p.nome}: ${p.descricao}`);
    const embeddingsPlataformas = await embeddings.embedDocuments(descricoes);

    const plataformasComScore = plataformas.map((p, i) => ({
      nome: p.nome,
      descricao: p.descricao,
      score: cosineSimilarity(embeddingUsuario, embeddingsPlataformas[i])
    }));

    const maisRelevantes = plataformasComScore
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(p => `✅ ${p.nome} — ${p.descricao}`);

    res.status(200).json({
      recomendacoes: maisRelevantes.join('\n\n')
    });

  } catch (erro: any) {
    console.error('Erro ao gerar recomendações:', erro);
    res.status(500).json({ error: 'Erro ao gerar recomendações' });
  }
}
