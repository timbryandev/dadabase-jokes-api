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
import WarningNSFW from '~/components/WarningNSFW'
import deepClone from '~/utils/deepClone'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }]
}

type JokeListItem = {
  id: Joke['id']
  name: Joke['name']
  nsfw: Joke['nsfw']
  createdAt: Joke['createdAt'] | string
}

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
  jokeListItems: Array<JokeListItem>
  showNsfw: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const showNsfw = await getNsfwPreference(request)

  const jokeListItems = await db.joke.findMany({
    take: 100, // TODO: Need to add some pagination
    orderBy: { name: 'asc' },
    select: { id: true, name: true, nsfw: true, createdAt: true },
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

/**
 * Sort jokes list the three newest jokes at the top of the list
 */
const sortByNewestThree = (
  jokeList: Array<JokeListItem>,
): Array<JokeListItem> => {
  const clone = deepClone<typeof jokeList>(jokeList)
  const sortedByDate = [...clone].sort((a, b) => {
    const d1 = new Date(a.createdAt)
    const d2 = new Date(b.createdAt)
    return d2.getTime() - d1.getTime()
  })
  const newest = sortedByDate.slice(0, 3)
  const newestIds = newest.map(({ id }) => id)
  const rest = clone.filter((original) => !newestIds.includes(original.id))
  newest.forEach((joke) => (joke.name = `🆕 ${joke.name}`))
  return newest.concat(rest)
}

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>()
  const submit = useSubmit()
  const transition = useTransition()
  const actionData = useActionData()
  const shouldShowNsfw = actionData?.showNsfw || data.showNsfw
  const sortedJokeListItems = sortByNewestThree(data.jokeListItems)

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    submit(event.currentTarget, { replace: true })
  }

  const renderJokesList = () => {
    return sortedJokeListItems.map((joke) => (
      <li key={joke.id}>
        {joke.nsfw && <WarningNSFW />} <Link to={joke.id}>{joke.name}</Link>
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
                  disabled={transition.state === 'submitting'}
                />
                <label htmlFor='nsfwCheck'>
                  Include <abbr title='Not Safe For Work'>NSFW</abbr>
                </label>
              </p>
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
