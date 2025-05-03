'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

const plataformasEsports = [
  {
    nome: 'GamersClub',
    url: 'https://gamersclub.com.br',
    descricao:
      'A GamersClub é a maior plataforma de CS:GO da América Latina, oferecendo servidores dedicados, sistema de ligas ranqueadas, anti-cheat próprio, torneios mensais e uma comunidade ativa com suporte a clãs, coachings e conteúdos exclusivos para membros.'
  },
  {
    nome: 'Faceit',
    url: 'https://www.faceit.com',
    descricao:
      'A FACEIT é uma das maiores plataformas competitivas de eSports do mundo, conhecida por seu sistema avançado de matchmaking, ligas profissionais, sistema de ELO competitivo e integração com campeonatos oficiais.'
  },
  {
    nome: 'Liquipedia',
    url: 'https://liquipedia.net',
    descricao:
      'A Liquipedia é uma enciclopédia colaborativa de eSports mantida pela Team Liquid. Ela reúne informações detalhadas sobre jogadores, times, torneios e estatísticas dos principais jogos competitivos.'
  },
  {
    nome: 'Challengermode',
    url: 'https://challengermode.com',
    descricao:
      'A Challengermode é uma plataforma global de torneios online que permite que jogadores e organizadores criem, participem e gerenciem campeonatos de forma automatizada, com suporte a diversos jogos.'
  },
  {
    nome: 'Furia',
    url: 'https://www.furia.gg/',
    descricao:
      'A FURIA é uma das maiores organizações brasileiras de eSports e oferece uma loja oficial com roupas e acessórios exclusivos que combinam identidade gamer e streetwear.'
  }
];

// Mapeia nome para URL
const plataformasComLinks: Record<string, string> = Object.fromEntries(
  plataformasEsports.map((p) => [p.nome, p.url])
);

// Substitui nomes de plataformas por links HTML no texto
function formatRecomendacao(texto: string): string {
  return texto.replace(
    /\b(GamersClub|Faceit|Liquipedia|Challengermode|Furia)\b/g,
    (match) =>
      `<a href="${plataformasComLinks[match]}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline font-semibold">${match}</a>`
  );
}

export default function DashboardFinal() {
  const searchParams = useSearchParams();
  const uid = searchParams?.get('uid');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dadosUsuario, setDadosUsuario] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [recomendacoes, setRecomendacoes] = useState<string[]>([]);

  useEffect(() => {
    const buscarUsuario = async () => {
      if (!uid) return;

      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDadosUsuario(docSnap.data());
      } else {
        console.error('Usuário não encontrado no Firestore');
      }

      setLoadingUser(false);
    };

    buscarUsuario();
  }, [uid]);

  useEffect(() => {
    const buscarRecomendacoes = async () => {
      if (!dadosUsuario) return;

      const resp = await fetch('/api/recomendar-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dadosUsuario, plataformas: plataformasEsports })
      });

      const data = await resp.json();
      setRecomendacoes(data.recomendacoes?.split('\n\n') || []);
    };

    buscarRecomendacoes();
  }, [dadosUsuario]);

  return (
    <main className="flex flex-col md:flex-row gap-6 min-h-screen p-6 bg-[#121212] text-white">
      
      {/* CARD DE USUÁRIO */}
      <Card className="md:w-1/4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-4">
        <CardContent className="p-0 text-base">
          {loadingUser ? (
            <div className="flex items-center text-gray-400">
              <Loader2 className="animate-spin mr-2" /> Carregando usuário...
            </div>
          ) : dadosUsuario ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Informações do Usuário</h2>
              
              {dadosUsuario.nome && (
                <p className="mb-1"><span className="font-semibold">Nome:</span> {dadosUsuario.nome}</p>
              )}
              {dadosUsuario.endereco && (
                <p className="mb-1"><span className="font-semibold">Endereço:</span> {dadosUsuario.endereco}</p>
              )}
              {dadosUsuario.cpf && (
                <p className="mb-1"><span className="font-semibold">CPF:</span> {dadosUsuario.cpf}</p>
              )}
              {dadosUsuario.aniversario && (
                <p className="mb-3"><span className="font-semibold">Nascimento:</span> {dadosUsuario.aniversario}</p>
              )}

              {dadosUsuario.interesses && (
                <div className="mb-3">
                  <p className="text-lg font-semibold mb-1">Interesses</p>
                  <p className="text-gray-300">{dadosUsuario.interesses}</p>
                </div>
              )}

              {dadosUsuario.atividades && (
                <div className="mb-3">
                  <p className="text-lg font-semibold mb-1">Atividades</p>
                  <p className="text-gray-300">{dadosUsuario.atividades}</p>
                </div>
              )}

              {dadosUsuario.eventos && (
                <div className="mb-3">
                  <p className="text-lg font-semibold mb-1">Eventos</p>
                  <p className="text-gray-300">{dadosUsuario.eventos}</p>
                </div>
              )}

              {dadosUsuario.compras && (
                <div className="mb-3">
                  <p className="text-lg font-semibold mb-1">Compras</p>
                  <p className="text-gray-300">{dadosUsuario.compras}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-400">Usuário não encontrado.</p>
          )}
        </CardContent>
      </Card>

      {/* RECOMENDAÇÕES */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recomendacoes.length ? (
          recomendacoes.map((rec, index) => (
            <Card
              key={index}
              className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-4 h-fit"
            >
              <CardContent className="p-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-400 uppercase font-medium tracking-wide">
                    Recomendação {index + 1}
                  </p>
                  <CheckCircle className="text-yellow-400 w-5 h-5" />
                </div>
                <p
                  className="text-base text-gray-200 leading-snug font-medium"
                  dangerouslySetInnerHTML={{ __html: formatRecomendacao(rec) }}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Carregando recomendações...
          </div>
        )}
      </div>
    </main>
  );
}