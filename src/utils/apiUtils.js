/**
 * Public API endpoints used by the Data Fetcher tool.
 * All are free, no-auth, CORS-friendly APIs.
 */

export const API_SOURCES = [
  {
    id: 'jokes',
    label: '😂 Dev Jokes',
    url: 'https://official-joke-api.appspot.com/jokes/programming/ten',
    transform: (data) =>
      data.map(j => ({ id: j.id, title: j.setup, body: j.punchline, tag: 'joke' })),
  },
  {
    id: 'posts',
    label: '📝 Sample Posts',
    url: 'https://jsonplaceholder.typicode.com/posts?_limit=12',
    transform: (data) =>
      data.map(p => ({ id: p.id, title: p.title, body: p.body, tag: `user ${p.userId}` })),
  },
  {
    id: 'users',
    label: '👤 Sample Users',
    url: 'https://jsonplaceholder.typicode.com/users',
    transform: (data) =>
      data.map(u => ({ id: u.id, title: u.name, body: `${u.email} · ${u.company.name}`, tag: u.address.city })),
  },
  {
    id: 'cats',
    label: '🐱 Cat Facts',
    url: 'https://catfact.ninja/facts?limit=10',
    transform: (data) =>
      data.data.map((f, i) => ({ id: i + 1, title: `Fact #${i + 1}`, body: f.fact, tag: 'cat' })),
  },
]

/**
 * Fetch and transform data from a given API source config.
 * @param {{ url: string, transform: Function }} source
 * @returns {Promise<Array>}
 */
export async function fetchFromSource(source) {
  const res = await fetch(source.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  return source.transform(data)
}
