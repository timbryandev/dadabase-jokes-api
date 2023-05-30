import React from 'react'
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from '@remix-run/node'
import type { Joke } from '@prisma/client'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  Scripts,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from '@remix-run/react'
import { db } from '~/utils/db.server'
import {
  getNsfwPreference,
  getUser,
  setNsfwPreference,
} from '~/utils/session.server'
import stylesUrl from '~/styles/jokes.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
  jokeListItems: Array<{
    id: Joke['id']
    name: Joke['name']
    nsfw: Joke['nsfw']
  }>
  showNsfw: boolean
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const sessionNsfw = await getNsfwPreference(request)
  const showNsfw = sessionNsfw || params.showNsfw === 'true'

  const jokeListItems = await db.joke.findMany({
    take: 100, // TODO: Need to add some pagination
    orderBy: { name: 'asc' },
    select: { id: true, name: true, nsfw: true },
    where: showNsfw ? {} : { nsfw: false },
  })

  const user = await getUser(request)

  const data: LoaderData = {
    jokeListItems,
    user,
    showNsfw,
  }

  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()
  const nsfw = body.get('nsfwCheck')
  const nsfwBool = nsfw === 'true' || nsfw === 'on'
  return await setNsfwPreference(nsfwBool)
}

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>()
  const submit = useSubmit()
  const transition = useTransition()
  const actionData = useActionData()
  const shouldShowNsfw = actionData?.showNsfw || data.showNsfw

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    submit(event.currentTarget, { replace: true })
  }

  const renderJokesList = () => {
    return data.jokeListItems.map((joke) => (
      <li key={joke.id}>
        {joke.nsfw && (
          <span
            className='warning warning__nsfw'
            title='This joke is marked "not safe for work" and may not be appropriate for all audiences - view with caution!'
          >
            ⚠️{' '}
          </span>
        )}
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
          {data.user ? (
            <div className='user-info'>
              <span>{`Hi ${data.user.username}`}</span>
              <Form action='/logout' method='post'>
                <button type='submit' className='button'>
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <article className='jokes-list'>
            <p>
              <Link to='.'>Get a random joke</Link>
            </p>
            <p>
              <Link to='new' className='button'>
                Add your own
              </Link>
            </p>
            <Form action='/jokes' method='post' onChange={handleChange}>
              <p>
                <input
                  type='checkbox'
                  name='nsfwCheck'
                  id='nsfwCheck'
                  defaultChecked={shouldShowNsfw}
                />
                <label htmlFor='nsfwCheck'>
                  Include <abbr title='Not Safe For Work'>NSFW</abbr>
                </label>
              </p>
              {transition.state === 'submitting' ? <p>Saving...</p> : null}
            </Form>

            <p>Here are a few more jokes to check out:</p>
            <ul>{renderJokesList()}</ul>
          </article>
          <article className='jokes-outlet'>
            <Outlet />
          </article>
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
      <Scripts />
    </div>
  )
}
