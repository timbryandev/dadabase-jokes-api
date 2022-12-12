import { Prisma, PrismaClient } from '@prisma/client'
const db = new PrismaClient()

export const clearData = async () => {
  const users = await db.user.findMany({})
  const jokes = await db.joke.findMany({})

  // @ts-ignore
  type User = Prisma.UserGetPayload<typeof users>
  // @ts-ignore
  type Joke = Prisma.UserGetPayload<typeof jokes>

  const deleteUser = async (user: User) => {
    return await db.user.delete({
      where: { id: user.id },
    })
  }
  const deleteJoke = async (joke: Joke) => {
    return await db.joke.delete({
      where: { id: joke.id },
    })
  }

  const deleteJokes = async () => {
    // @ts-ignore
    return Promise.all(jokes.map(joke => deleteJoke(joke)))
  }

  const deleteUsers = async () => {
    return Promise.all(users.map(user => deleteUser(user)))
  }

  await deleteJokes()
  await deleteUsers()
}

clearData()