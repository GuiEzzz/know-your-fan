# Know-your-fan

Este projeto é uma plataforma de cadastro inteligente voltada para jogadores de eSports. O sistema permite o envio e validação de documentos via OCR e IA, coleta dados pessoais, redes sociais e links de plataformas gamers, e recomenda sites com base no perfil do usuário.

## ✨ Funcionalidades

- Upload e validação de documento com OCR e IA  
- Cadastro multietapas: dados pessoais, redes sociais e links de eSports  
- Armazenamento seguro no Firestore  
- Recomendação personalizada de plataformas gamers com IA  
- Dashboard final com as sugestões personalizadas  

---

## 🚀 Tecnologias Utilizadas

- Next.js  
- Firebase Firestore  
- TailwindCSS  
- OpenAI Models
- OpenAI Embeddings via LangChain  
- Google Cloud Vision OCR
- Lucide React Icons  

---

## 📦 Instalação

1. **Clone o repositório**:  
   ```bash
   git clone https://github.com/GuiEzzz/know-your-fan.git
   cd know-your-fan
   ```

2. **Instale as dependências**:  
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:  

   Crie um arquivo `.env.local` com as seguintes chaves:

   ```env
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   OPENAI_API_KEY=...
   GOOGLE_CREDENTIALS=...
   ```

   > 🔐 Consulte o painel do Firebase, da OpenAI e do Google Cloud para obter suas chaves.

---

## 🧠 Configuração da IA

O sistema usa `@langchain/openai` para gerar embeddings e comparar interesses com plataformas como:  
- Furia
- GamersClub  
- Faceit  
- Liquipedia  
- Challengermode  

Os dados do usuário são enviados para a API `/api/recomendar-sites`, onde a IA retorna os sites mais compatíveis com o perfil do usuário.

---

## 🔄 Scripts úteis

```ba
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera a build de produção
npm run start    # Inicia o servidor em produção
```

---

## 🧪 Teste

- Acesse: [http://localhost:3000](http://localhost:3000)  
- Faça o cadastro, envie um documento válido e prossiga para as etapas seguintes.  
- Veja recomendações personalizadas no dashboard final.

---

## 📁 Estrutura do Projeto

```📦 src
 ┣ 📂app
 ┃ ┣ 📜page.tsx            ← Tela inicial
 ┃ ┣ 📂redes-sociais       ← Página de redes sociais
 ┃ ┣ 📂links               ← Página de links de eSports
 ┃ ┣ 📂dashboard-final     ← Recomendação com IA
 ┃ ┣ 📂cadastro-dados      ← Cadastro de informções básicas
 ┃ ┣ 📂documento           ← Validação do documento com IA
 ┗ 📂pages
 ┃ ┣📂api
 ┃  ┣ 📜validar-documento.ts
 ┃  ┗ 📜recomendar-sites.ts
 ┃  ┣ 📜ocr.ts
 ┣ 📂components
 ┃ ┣ 📜ProgressoAtual.tsx
 ┃ ┣ 📜FloatingInput.tsx
 ┃ ┗ 📂ui (shadcn components)
 ┃ ┃ ┗ 📜card.tsx
 ┣ 📂lib
 ┃ ┣ 📜firebase.ts
 ┃ ┣ 📜openai.ts
 ┃ ┗ 📜visionCliient.ts
```

---

## 🧑‍💻 Autor

Feito com 💻 por [Guilherme Enz](https://github.com/GuiEzzz)
