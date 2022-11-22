import type { LinksFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import stylesUrl from '~/styles/jokes.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
]

export default function JokesRoute() {
  return (
    <>
      <header>
        <h1>J😝kes</h1>
        <hr />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <hr />
        <p>J😝kes</p>
      </footer>
    </>
  )
}
