import React from 'react'
import { Link } from '@remix-run/react'
import WarningNSFW from '~/components/WarningNSFW'

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
          {nsfw && <WarningNSFW />} {name}
        </h2>
      </header>
      <blockquote className='joke-content'>{content}</blockquote>
      {typeof jokester === 'string' && <p>Credit: {jokester}</p>}
      <Link to={`/jokes/${id}`}>Permalink for "{name}"</Link>
    </section>
  )
}
