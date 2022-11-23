import type { User } from '@prisma/client'
import { db } from './db.server'
import bcrypt from 'bcryptjs'
import { createCookieSessionStorage, redirect } from '@remix-run/node'

type LoginForm = {
  username: string
  password: string
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

export const login = async ({ username, password }: LoginForm) => {
  const user: User | null = await db.user.findUnique({
    where: { username },
  })

  if (!user) {
    return null
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) {
    return null
  }

  return { id: user.id, username }
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'jokes_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}
