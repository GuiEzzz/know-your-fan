'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProgressoAtual from '@/components/ProgressoAtual';
import FloatingInput from '@/components/FloatingInput';

export default function LinksEsportsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams?.get('uid');

  const [gamersClub, setGamersClub] = useState('');
  const [faceit, setFaceit] = useState('');
  const [liquipedia, setLiquipedia] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarLinks = async () => {
      if (!userId) return;
      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const dados = docSnap.data();
        setGamersClub(dados?.linksEsports?.gamersClub || '');
        setFaceit(dados?.linksEsports?.faceit || '');
        setLiquipedia(dados?.linksEsports?.liquipedia || '');
      }
    };
    buscarLinks();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setCarregando(true);
    const docRef = doc(db, 'usuarios', userId);
    await updateDoc(docRef, {
      linksEsports: {
        gamersClub,
        faceit,
        liquipedia
      }
    });
    setCarregando(false);
    alert('Cadastro finalizado com sucesso!');
    // Você pode redirecionar para uma tela de sucesso aqui, se quiser
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <ProgressoAtual etapaAtual={5} totalEtapas={5} />

        <h1 className="text-2xl font-bold mb-6 text-center">Links de eSports</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Link do GamersClub" value={gamersClub} onChange={(e) => setGamersClub(e.target.value)} />
          <FloatingInput label="Link do Faceit" value={faceit} onChange={(e) => setFaceit(e.target.value)} />
          <FloatingInput label="Link do Liquipedia" value={liquipedia} onChange={(e) => setLiquipedia(e.target.value)} />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </main>
  );
}
