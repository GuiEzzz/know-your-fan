'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProgressoAtual from '@/components/ProgressoAtual';

export default function DocumentoPage() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('uid') || '';
  const router = useRouter();

  const [imagem, setImagem] = useState<File | null>(null);
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false); // 👈 estado para loading
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

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Imagem = reader.result?.toString();

      try {
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

        if (dados.resultado?.toLowerCase().includes('válido')) {
          setTimeout(() => {
            router.push(`/redes-sociais?uid=${userId}`);
          }, 1500);
        } else if (dados.mensagem) {
          setResultado(prev => `${prev} - ${dados.mensagem}`);
        }
      } catch (error) {
        console.error('Erro na validação:', error);
        setResultado('Erro ao validar o documento.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(imagem);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 relative">
      {/* Overlay de loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg">Validando documento...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <ProgressoAtual etapaAtual={2} totalEtapas={5} />

        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload de Documento
        </h1>

        <p className='text-md mb-6 text-center'>O documento deve conter seu nome completo e CPF.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
            {!imagem ? (
              <>
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-gray-400 hover:underline"
                >
                  Selecionar arquivo
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagem(e.target.files?.[0] || null)}
                  required
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex items-center justify-between bg-gray-800 text-white p-2 rounded">
                <span className="truncate">{imagem.name}</span>
                <button
                  type="button"
                  onClick={() => setImagem(null)}
                  className="ml-2 text-red-400 hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </div>
            )}
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
            resultado.includes('Válido') 
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
