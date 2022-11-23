import type { LoaderFunction } from '@remix-run/node'
import type { Joke as TJoke, User as TUser } from '@prisma/client'
import Joke from '~/components/Joke'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData, useParams } from '@remix-run/react'

import { db } from '~/utils/db.server'

type LoaderData = { joke: TJoke; jokester?: TUser['username'] }

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    })
  }

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

export function CatchBoundary() {
  const caught = useCatch()
  const params = useParams()
  if (caught.status === 404) {
    return (
      <div className='error-container'>
        Huh? What the heck is "{params.jokeId}"?
      </div>
    )
  }
  throw new Error(`Unhandled error: ${caught.status}`)
}

export function ErrorBoundary() {
  const { jokeId } = useParams()
  return (
    <div className='error-container'>{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  )
}
