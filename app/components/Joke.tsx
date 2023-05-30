import React from 'react'
import { Link } from '@remix-run/react'

type JokeProps = {
  content: string
  id: string
  jokester?: string
  name: string
  nsfw: boolean
}

export default function Joke({ content, id, jokester, name, nsfw }: JokeProps) {
  return (
    <section className='joke'>
      <header>
        <h2>
          {nsfw && (
            <span
              className='warning warning__nsfw'
              title='This joke is marked "not safe for work" and may not be appropriate for all audiences - view with caution!'
            >
              ⚠️
            </span>
          )}{' '}
          {name}
        </h2>
      </header>
      <blockquote className='joke-content'>{content}</blockquote>
      {typeof jokester === 'string' && <p>Credit: {jokester}</p>}
      <Link to={`/jokes/${id}`}>Permalink for "{name}"</Link>
    </section>
  )
}
