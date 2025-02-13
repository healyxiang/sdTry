'use client'
import { useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function UserBtn() {
  const { data: session } = useSession()
  console.log('session in UserBtn:', session)

  useEffect(() => {
    const testApiCall = async () => {
      const response = await fetch('/api/test', {
        method: 'GET',
        // body: JSON.stringify({
        //   model_id: 'dark-sushi-25d-v4',
        //   scheduler: 'UniPCMultistepScheduler',
        //   prompt: Prompt.test, // 替换为实际提示
        //   init_image: initImg,
        // }),
      })
      const data = await response.json()
      console.log('testApiCall data::', data)
      return data
    }
    testApiCall()
  }, [])

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
