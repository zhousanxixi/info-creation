export async function fetcher (...args) {
  const resp = await fetch(...args)
  return await resp.json()
}
