import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from "@remix-run/react";
import type { Joke as TJoke, User as TUser } from '@prisma/client'
import Joke from '~/components/Joke'

import { db } from '~/utils/db.server'
import createApiHeaders from '~/utils/apiHeaders.server'


type LoaderData = { randomJoke: TJoke; jokester?: TUser['username'] }

export const loader: LoaderFunction = async ({ request, params }) => {


  const count = await db.joke.count({where: params.showNsfw ? {} : {nsfw: false}})
  const randomRowNumber = Math.floor(Math.random() * count)

  const [randomJoke] = await db.joke.findMany({
    where: params.showNsfw ? {} : { nsfw: false },
    take: 1,
    skip: randomRowNumber,
  })

  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    })
  }

  const jokester = await db.user.findUnique({
    where: { id: randomJoke.jokesterId },
    select: { username: true },
  })

  const jokeDate: LoaderData = {
    randomJoke,
    jokester: jokester?.username,
  }

  return json({ ...jokeDate }, { headers: createApiHeaders(request) })
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

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div className='error-container'>There are no jokes to display.</div>
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}

export function ErrorBoundary() {
  return (
    <div className='error-container'>
      Ooops! If you can see me, something went wrong...
    </div>
  )
}
