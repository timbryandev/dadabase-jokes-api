import React, { useEffect } from 'react'
import { Link, useTransition } from '@remix-run/react'
import WarningNSFW from '~/components/WarningNSFW'

type JokeProps = {
  content: string
  id: string
  jokester?: string
  name: string
  nsfw: boolean
}

export default function Joke({ content, id, jokester, name, nsfw }: JokeProps) {
  const { state } = useTransition()

  useEffect(() => {
    if (state === 'loading') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [state])

  return (
    <section className='joke'>
      {state === 'loading' && (
        <progress
          style={{
            position: 'absolute',
            top: '-1rem',
            left: '0',
            width: '100%',
          }}
        />
      )}
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
