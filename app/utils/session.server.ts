import type { User } from '@prisma/client'
import { db } from './db.server'
import bcrypt from 'bcryptjs'

type LoginForm = {
  username: string
  password: string
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
