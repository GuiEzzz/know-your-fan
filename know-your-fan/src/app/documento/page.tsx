import { Suspense } from 'react'
import Documento from './Documento'

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Documento />
    </Suspense>
  )
}
