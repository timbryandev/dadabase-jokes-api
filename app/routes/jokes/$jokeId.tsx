import type { LoaderFunction } from '@remix-run/node'
import type { Joke } from '@prisma/client'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

type LoaderData = { joke: Joke }

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) throw new Error('Joke not found')

  const data: LoaderData = { joke }
  return json(data)
}

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>()

  return (
    <div>
      <h2>{data.joke.name}</h2>
      <p>{data.joke.content}</p>
      <Link to={'.'}>Permalink for "{data.joke.name}"</Link>
    </div>
  )
}
