'use client'

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../lib/firebase";
import dotenv from 'dotenv';
dotenv.config();

export default function Home() {
  const router = useRouter();

  const handleStart = async () => {
    const userId = uuidv4();

    // Cria documento inicial no Firestore
    await setDoc(doc(db, 'usuarios', userId), {
      userId,
      criadoEm: new Date().toISOString(),
    });

    // Redireciona para /cadastro-dados com userId como query param
    router.push(`/cadastro-dados?uid=${userId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Know Your Fan!</h1>
      <button
        onClick={handleStart}
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
      >
        Começar
      </button>
    </main>
  );
}