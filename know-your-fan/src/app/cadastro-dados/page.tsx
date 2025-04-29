'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CadastroDados() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('uid');

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cpf, setCpf] = useState('');
  const [aniversario, setAniversario] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return alert('ID de usuário não encontrado');

    await updateDoc(doc(db, 'usuarios', userId), {
      nome,
      endereco,
      cpf,
      aniversario
    });

    alert('Dados salvos com sucesso!');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Dados</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Aniversário"
          value={aniversario}
          onChange={(e) => setAniversario(e.target.value)}
          className="border rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800"
        >
          Salvar e Continuar
        </button>
      </form>
    </main>
  );
}
