'use client'

import { useState } from 'react'
import { uploadToR2 } from '@/lib/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ImageInput = () => {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (file) {
      try {
        const bucketName = '<your-bucket-name>' // 替换为您的 R2 桶名称
        const key = file.name // 使用文件名作为键
        const blob = new Blob([file], { type: file.type })
        const result = await uploadToR2(file, file.type)
        console.log('result:', result)
        // const uploadedImageUrl = `https://<your-account-id>.r2.cloudflarestorage.com/${bucketName}/${key}` // 替换为您的 R2 端点
        // setImageUrl(result)

        // 调用 /api/realtime/text2img 接口
        const response = await fetch('/api/realtime/img2img', {
          method: 'POST',
          body: JSON.stringify({
            prompt: 'Add glasses to the character and put on a winter hat.', // 替换为实际提示
            init_image: result,
          }),
        })
        const data = await response.json()
        console.log('Image upload image2image', data)
      } catch (error) {
        console.error('Upload or API call failed:', error)
      }
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload and Generate</Button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2" />}
    </div>
  )
}

export default ImageInput
