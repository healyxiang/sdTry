'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const negativePrompt =
  'painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime (child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy'

export default function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState<string[]>([
    'https://modelslab-bom.s3.amazonaws.com/modelslab/d4916e79-64b8-4cab-a96f-76308823a75d-0.png',
  ])

  const handleGenerate = async () => {
    console.log(prompt)
    try {
      const response = await fetch('/api/realtime/text2img', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          samples: 2,
          width: '1024',
          height: '1024',
        }),
      })
      const data = await response.json()
      if (data?.output) {
        setImages(data.output)
      }
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <span>PromptInput</span>
      <Input onChange={(e) => setPrompt(e.target.value)} />
      <Button onClick={handleGenerate}>Generate</Button>
      <div className="flex">
        {images.map((image, index) => (
          <img key={index} src={image} alt="" className="aspect-square w-[400px]" />
        ))}
      </div>
    </div>
  )
}
