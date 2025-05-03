import { Suspense } from 'react'
import Dashboard from './Dashboard'

export default function CadastroPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Dashboard />
    </Suspense>
  )
}
