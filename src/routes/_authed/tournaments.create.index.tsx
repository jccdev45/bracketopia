import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/tournaments/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/tournaments/create/"!</div>
}
