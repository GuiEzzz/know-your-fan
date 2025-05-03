import { Suspense } from 'react'
import CadastroDados from './CadastroDados'

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CadastroDados />
    </Suspense>
  )
}
