'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProgressoAtual from '@/components/ProgressoAtual';

export default function DocumentoPage() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('uid') || '';
  const [imagem, setImagem] = useState<File | null>(null);
  const [resultado, setResultado] = useState('');
  const [dadosUsuario, setDadosUsuario] = useState<{ nome: string; cpf: string } | null>(null);

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      if (!userId) return;
      
      const docRef = doc(db, 'usuarios', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDadosUsuario({
          nome: data.nome || '',
          cpf: data.cpf || ''
        });
      }
    };

    buscarDadosUsuario();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem || !dadosUsuario) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Imagem = reader.result?.toString();

      const resp = await fetch('/api/validar-documento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Imagem,
          nomeInformado: dadosUsuario.nome,
          cpfInformado: dadosUsuario.cpf
        })
      });

      const dados = await resp.json();
      setResultado(dados.resultado);
    };

    reader.readAsDataURL(imagem);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <ProgressoAtual etapaAtual={2} totalEtapas={3} />

        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload de Documento
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
              required
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition border border-white/20"
            disabled={!dadosUsuario}
          >
            Validar Documento
          </button>
        </form>

        {resultado && (
          <div className={`mt-4 p-4 rounded-lg ${
            resultado.includes('válido') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <p className="font-medium text-center text-lg">
              {resultado}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
