import bcrypt from 'bcryptjs'

const SALT_LENGTH = 10

export default async function createPasswordHash(password: string) {
  const passwordHash = await bcrypt.hash(password, SALT_LENGTH)
  return passwordHash
}
