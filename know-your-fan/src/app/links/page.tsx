import { Suspense } from 'react'
import Links from './Links'

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Links />
    </Suspense>
  )
}
