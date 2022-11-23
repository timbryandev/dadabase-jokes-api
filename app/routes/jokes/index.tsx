import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Joke as TJoke, User as TUser } from '@prisma/client'
import Joke from '~/components/Joke'

import { db } from '~/utils/db.server'

type LoaderData = { randomJoke: TJoke; jokester?: TUser['username'] }

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count()
  const randomRowNumber = Math.floor(Math.random() * count)

  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  })

  const jokester = await db.user.findUnique({
    where: { id: randomJoke.jokesterId },
    select: { username: true },
  })

  const jokeDate: LoaderData = {
    randomJoke,
    jokester: jokester?.username,
  }

  return json({ ...jokeDate })
}

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <p>Here's a random joke:</p>
      <Joke {...data.randomJoke} jokester={data.jokester} />
    </>
  )
}
