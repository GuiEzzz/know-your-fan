'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

import FloatingInput from '@/components/FloatingInput';
import ProgressoAtual from '@/components/ProgressoAtual';

export default function CadastroDados() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams?.get('uid');

  const [step, setStep] = useState(1); // Etapa atual
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cpf: '',
    aniversario: '',
    interesses: '',
    atividades: '',
    eventos: '',
    compras: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validarPrimeiraEtapa = () => {
    const { nome, endereco, cpf, aniversario } = formData;

    if (nome.trim().length < 3) return 'Nome muito curto.';
    if (endereco.trim().length < 5) return 'Endereço inválido.';
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) return 'CPF inválido.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(aniversario)) return 'Data de nascimento inválida (formato).';

    const [dia, mes, ano] = aniversario.split('/').map(Number);
    const nascimentoDate = new Date(ano, mes - 1, dia);
    const dataEhValida =
      nascimentoDate.getFullYear() === ano &&
      nascimentoDate.getMonth() === mes - 1 &&
      nascimentoDate.getDate() === dia;

    if (!dataEhValida) return 'Data de nascimento inválida (não existe).';

    return null;
  };

  const handleNext = () => {
    const erro = validarPrimeiraEtapa();
    if (erro) return alert(erro);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert('ID de usuário não encontrado.');

    await updateDoc(doc(db, 'usuarios', userId), formData);
    
    router.push(`/documento?uid=${userId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <ProgressoAtual etapaAtual={step - 1} totalEtapas={5} />

      <h1 className="text-2xl font-bold mb-6">
        {step === 1 ? 'Cadastro de Dados Pessoais' : 'Informações Complementares'}
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {step === 1 && (
          <>
            <FloatingInput
              label="Nome Completo"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
            />
            <FloatingInput
              label="Endereço"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
            />
            <FloatingInput
              label="CPF (Com Pontuação)"
              value={formData.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
            />
            <FloatingInput
              label="Data de Nascimento"
              value={formData.aniversario}
              onChange={(e) => handleChange('aniversario', e.target.value)}
            />
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-black text-white py-2 mt-2 rounded hover:bg-gray-800 transition border border-white/20"
            >
              Próximo
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <FloatingInput
              label="Interesses"
              value={formData.interesses}
              onChange={(e) => handleChange('interesses', e.target.value)}
            />
            <FloatingInput
              label="Atividades"
              value={formData.atividades}
              onChange={(e) => handleChange('atividades', e.target.value)}
            />
            <FloatingInput
              label="Eventos frequentados"
              value={formData.eventos}
              onChange={(e) => handleChange('eventos', e.target.value)}
            />
            <FloatingInput
              label="Compras (último ano)"
              value={formData.compras}
              onChange={(e) => handleChange('compras', e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-1/2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
