import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { Joke as TJoke, User as TUser } from '@prisma/client'
import { json, redirect } from '@remix-run/node'
import { useCatch, useLoaderData, useParams } from '@remix-run/react'

import Joke from '~/components/Joke'

import { db } from '~/utils/db.server'
import { requestUserId, requireUserId } from '~/utils/session.server'

type LoaderData = { joke: TJoke; jokester?: TUser['username'], isJokeOwner: Boolean }

export const loader: LoaderFunction = async ({ params, request }) => {
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

  const userId = await requestUserId(request)

  const data: LoaderData = {
    joke,
    jokester: jokester?.username,
    isJokeOwner: userId === joke.jokesterId,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()

  if (form.get('_method') !== 'delete') {
    throw new Response(`The _method ${form.get('_method')} is not supported`, {
      status: 400,
    })
  }

  const userId = await requireUserId(request)

  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  })

  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    })
  }

  if (joke.jokesterId !== userId) {
    throw new Response("Pssh, nice try. That's not your joke", {
      status: 401,
    })
  }

  await db.joke.delete({ where: { id: params.jokeId } })

  return redirect('/jokes')
}

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <Joke {...data.joke} jokester={data.jokester} />
      {data.isJokeOwner && (
        <form method='post'>
          <input type='hidden' name='_method' value='delete' />
          <button type='submit' className='button'>
            Delete
          </button>
        </form>
      )}
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  const params = useParams()
  switch (caught.status) {
    case 400: {
      return (
        <div className='error-container'>
          What you're trying to do is not allowed.
        </div>
      )
    }
    case 404: {
      return (
        <div className='error-container'>
          Huh? What the heck is {params.jokeId}?
        </div>
      )
    }
    case 401: {
      return (
        <div className='error-container'>
          Sorry, but {params.jokeId} is not your joke.
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`)
    }
  }
}

export function ErrorBoundary() {
  const { jokeId } = useParams()
  return (
    <div className='error-container'>{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  )
}
