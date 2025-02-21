'use client'

import { useState, useEffect, useMemo } from 'react'
import { LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import ImgUploader from '@/components/ImgUploader'
import { cn } from '@/lib/utils'
import { uploadToR2 } from '@/lib/upload'
import { ModelLabResponse } from '@/types/ModelLab'
import { Prompt } from '../../../constant/prompt'
import { useImg2ImgApi } from '@/service/model'
import ModelSelector from './ModelSelector'

const Img2Img = () => {
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSquare, setIsSquare] = useState(false)
  const { mutate, data, isPending } = useImg2ImgApi()
  const [selectedModel, setSelectedModel] = useState<string>('realistic')

  const fileImg = useMemo(() => {
    if (files.length) {
      return files.map((file) => URL.createObjectURL(file))
    }
  }, [files])

  const handleFileChange = (files: File[]) => {
    if (files.length <= 1) {
      setFiles(files)
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
        console.log('result after uploadToR2:', result)

        // 调用 /api/realtime/text2img 接口
        // const response = await fetch('/api/realtime/img2img', {
        const response = mutate({ initImg: result, modelId: selectedModel })
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

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const handleContinue = async () => {
    // 处理继续操作
    console.log('Files:', files)
    console.log('Is Square:', isSquare)
    await handleUpload()
    // 这里可以添加进一步的逻辑，例如调用 API
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] gap-4">
      <div className="flex w-1/2 flex-col items-start gap-4 rounded-lg border p-4">
        {/* <h2>Upload Your Potential</h2> */}
        <h2>Upload 1-3 selfie photos to kickstart your success!</h2>
        <ImgUploader
          className="h-[300px]"
          imgs={fileImg}
          onChange={handleFileChange}
          limitNum={1}
        />
        <div>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={isSquare} onChange={handleSquareChange} />
            Square (1:1)
          </label>
        </div>
        <ModelSelector onModelSelect={handleModelSelect} />
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
              'bg-slate-100': !imageUrls?.length,
              'dark:bg-slate-700': !imageUrls?.length,
              'animate-pulse rounded-md bg-slate-100': true,
            }
          )}
        >
          {isPending && <LoaderCircle className=" animate-spin" />}
          {imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index + 1}`} className="h-full" />
          ))}
          {!imageUrls.length && (
            <p className="text-lg">
              {isPending ? 'Processing...' : 'Your success images begins here'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Img2Img
