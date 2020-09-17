export function panic(message: string):never {
  console.error(message)
  process.exit(-1)
}