import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import type { Joke } from '@prisma/client'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'
import stylesUrl from '~/styles/jokes.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

type LoaderData = {
  jokeListItems: Array<Joke>
}

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokeListItems: await db.joke.findMany({
      orderBy: { name: 'asc' },
    }),
  }
  return json(data)
}

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>()

  function renderJokesList() {
    return data.jokeListItems.map(joke => (
      <li key={joke.id}>
        <Link to={joke.id}>{joke.name}</Link>
      </li>
    ))
  }

  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>🤪</span>
              <span className='logo-medium'>J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <Link to='.'>Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>{renderJokesList()}</ul>
            <Link to='new' className='button'>
              Add your own
            </Link>
          </div>
          <div className='jokes-outlet'>
            <Outlet />
          </div>
        </div>
      </main>
      <footer className='jokes-footer'>
        <div className='container'>
          <p>
            Not 100% satisfied? Maybe try the infinitely superior{' '}
            <a href='https://icanhazdadjoke.com/'>icanhazdadjoke.com</a>!
          </p>
          <p>
            Developed by <a href='https://timbryan.dev'>Tim Bryan.dev</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}
