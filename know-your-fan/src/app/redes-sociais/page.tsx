'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProgressoAtual from '@/components/ProgressoAtual';
import FloatingInput from '@/components/FloatingInput';

export default function RedesSociaisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams?.get('uid');

  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarRedes = async () => {
      if (!userId) return;
      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const dados = docSnap.data();
        setInstagram(dados?.redesSociais?.instagram || '');
        setTwitter(dados?.redesSociais?.twitter || '');
        setTiktok(dados?.redesSociais?.tiktok || '');
      }
    };
    buscarRedes();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setCarregando(true);
    const docRef = doc(db, 'usuarios', userId);
    await updateDoc(docRef, {
      redesSociais: {
        instagram,
        twitter,
        tiktok
      }
    });
    setCarregando(false);
    router.push(`/links?uid=${userId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <ProgressoAtual etapaAtual={3} totalEtapas={5} />

        <h1 className="text-2xl font-bold mb-6 text-center">Redes Sociais</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          <FloatingInput label="Twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <FloatingInput label="TikTok" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </main>
  );
}
