import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const name = form.get('name')
  const content = form.get('content')
  const nsfw = form.get('nsfw')

  if (typeof name !== 'string' || typeof content !== 'string') {
    throw new Error(`Form not submitted correctly.`)
  }

  const fields = { name, content, nsfw: nsfw === 'on' }
  const joke = await db.joke.create({ data: fields })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  return (
    <article>
      <p>Add your own hilarious joke</p>
      <form method='post'>
        <div>
          <label>
            Name: <input type='text' name='name' required />
          </label>
        </div>
        <div>
          <label>
            Mark as <abbr title='Not Safe For Work'>NSFW</abbr>:{' '}
            <input type='checkbox' name='nsfw' />
          </label>
        </div>
        <div>
          <label>
            Content: <textarea name='content' required />
          </label>
        </div>
        <div>
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </form>
    </article>
  )
}
