'use client'

import { useState, useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uploadToR2 } from '@/lib/upload'
import { ModelLabResponse } from '@/types/ModelLab'
import { Prompt } from '../../../constant/prompt'
import { useImg2ImgApi } from '@/service/model'

const Img2Img = () => {
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSquare, setIsSquare] = useState(false)
  const { mutate, data, isPending } = useImg2ImgApi()

  const fileImg = useMemo(() => {
    if (files.length) {
      return files.map((file) => URL.createObjectURL(file))
    }
  }, [files])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length <= 3) {
      setFiles(selectedFiles)
    } else {
      alert('Please upload a maximum of 3 files.')
    }
  }

  useEffect(() => {
    if (data) {
      setImageUrls(data.output)
    }
  }, [data])

  const handleUpload = async () => {
    if (files) {
      try {
        const file = files[0]
        const result = await uploadToR2(file, file.type)
        console.log('result:', result)

        // 调用 /api/realtime/text2img 接口
        // const response = await fetch('/api/realtime/img2img', {
        const response = mutate({ initImg: result })
        console.log('response after mutate:')
        // setImageUrls(data.output)
      } catch (error) {
        console.error('Upload or API call failed:', error)
      }
    }
  }

  const handleSquareChange = () => {
    setIsSquare(!isSquare)
  }

  const handleContinue = async () => {
    // 处理继续操作
    console.log('Files:', files)
    console.log('Is Square:', isSquare)
    await handleUpload()
    // 这里可以添加进一步的逻辑，例如调用 API
  }

  return (
    <div className="flex gap-4">
      <div className="flex w-1/2 flex-col items-start gap-4 rounded-lg border p-4">
        <h2>Upload Your Potential</h2>
        <p>Upload 1-3 selfie photos to kickstart your success!</p>
        <div className="w-full rounded-md border-2 border-dashed border-gray-300 p-4">
          <Input type="file" multiple onChange={handleFileChange} />
          {fileImg?.length &&
            fileImg.map((img, index) => (
              <img key={index} src={img} alt={`Uploaded ${index + 1}`} className="w-full" />
            ))}
          <p>PNG, JPG up to 10MB (1-3 files for best results)</p>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isSquare} onChange={handleSquareChange} />
            Square (1:1)
          </label>
        </div>
        <Button onClick={handleContinue}>Create Avatar</Button>
        <p className="text-[12px]">
          For your privacy, uploaded and generated images are automatically deleted after 1 hour.
          Please download and save any images you wish to keep.
        </p>
      </div>
      <div className={cn('flex w-1/2 flex-col rounded-lg border p-4')}>
        <h3 className="mb-2 font-semibold">Your Path to Success</h3>
        <div
          className={cn(
            'flex h-full w-full flex-wrap items-center justify-center gap-2 rounded-lg',
            {
              'bg-slate-100': !imageUrls.length,
              'dark:bg-slate-700': !imageUrls.length,
              'animate-pulse rounded-md bg-slate-100': isPending,
            }
          )}
        >
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index + 1}`} className="w-full" />
          ))}
          {!imageUrls.length && !isPending && (
            <p className="text-">Your success images begins here</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Img2Img
