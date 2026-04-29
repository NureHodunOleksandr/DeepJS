const API_URL = 'https://picsum.photos/v2/list'

export async function fetchImages(page = 1, limit = 20) {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}
