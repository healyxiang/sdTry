export const ApiPrefix = 'https://modelslab.com/api/v6/'
// export const ApiKey = 'DM8h4pkpDv9FMZBetKOw229DN4vJk0GFp4yR62jt1wmPZYxsiP9C4gcC1DJT'
// DM8h4pkpDv9FMZBetKOw229DN4vJk0GFp4yR62jt1wmPZYxsiP9C4gcC1DJT
// KJ5LABAXNi6WNlgYNVZQsV5ZeUeNp03DEo4EU11QBeNqFhS6KqHS0ZjMBYzl
export const ApiKey = 'KJ5LABAXNi6WNlgYNVZQsV5ZeUeNp03DEo4EU11QBeNqFhS6KqHS0ZjMBYzl'

const BASE_URL = 'https://modelslab.com/api/v6'

interface FetchOptions extends RequestInit {
  baseURL?: string
}

export function stringifyBody(body: Record<string, unknown>) {
  if (typeof body === 'object') {
    return JSON.stringify({ ...body, key: ApiKey })
  }
  return body
}

export const customFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<Response> => {
  const { baseURL = BASE_URL, headers = {}, ...restOptions } = options
  // 确保 URL 是以 '/' 开头的
  let fullUrl = url
  if (!url.startsWith('https://')) {
    fullUrl = url.replace('https://', '')
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`

    // 组合完整的 URL
    fullUrl = `${baseURL}${normalizedUrl}`
    console.log('fullUrl:', fullUrl)
  }
  try {
    console.log('fullUrl:', fullUrl)
    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`)
    // }
    console.log('response:', response)
    const data = (await response.json()) as T
    console.log('response data customFetch:', data)
    const res = Response.json(data, { status: 200 })
    return res
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export default customFetch
