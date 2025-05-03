import { Suspense } from 'react'
import RedesSociais from './RedesSociais'

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedesSociais />
    </Suspense>
  )
}
