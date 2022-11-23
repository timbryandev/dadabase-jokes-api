import type { LoaderFunction } from '@remix-run/node'
import type { Joke as TJoke, User as TUser } from '@prisma/client'
import Joke from '~/components/Joke'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'

type LoaderData = { joke: TJoke; jokester?: TUser['username'] }

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) throw new Error('Joke not found')

  const jokester = await db.user.findUnique({
    where: { id: joke.jokesterId },
    select: { username: true },
  })

  const data: LoaderData = { joke, jokester: jokester?.username }
  return json(data)
}

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>()

  return <Joke {...data.joke} jokester={data.jokester} />
}
