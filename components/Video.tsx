'use client'
import { useState } from 'react'
import { Container } from '@/components/Container'

interface VideoProps {
  videoId: string
}

export function Video({ videoId }: Readonly<VideoProps>) {
  const [playVideo, setPlayVideo] = useState(false)

  if (!videoId) return null

  return (
    <Container>
      <div className="relative mx-auto h-[500px] w-full max-w-4xl cursor-pointer overflow-hidden rounded-2xl bg-indigo-300 bg-gradient-to-tr from-purple-400 to-indigo-700 lg:mb-20">
        {!playVideo && (
          <button
            onClick={() => setPlayVideo(!playVideo)}
            className="absolute inset-auto left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform text-white lg:h-28 lg:w-28"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16  lg:h-28 lg:w-28"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Play Video</span>
          </button>
        )}
        {playVideo && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?controls=0&autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="aspect-video h-full w-full"
          ></iframe>
        )}
      </div>
    </Container>
  )
}
