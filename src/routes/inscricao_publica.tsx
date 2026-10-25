import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inscricao_publica')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/inscricao_publica"!</div>
}
