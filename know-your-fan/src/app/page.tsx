'use client'

import { useEffect } from "react";
import { db } from "../lib/firebase";
import dotenv from 'dotenv';
dotenv.config();

export default function Home() {
  useEffect(() => {
    console.log(db); // Verifica se o Firestore foi inicializado corretamente
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Know Your Fan!</h1>
    </div>
  );
}
