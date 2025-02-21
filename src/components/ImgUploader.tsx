/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'

import { useState, useRef, DragEvent } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface ImgUploaderProps {
  onChange: (files: File[]) => void
  multiple?: boolean
  limitNum?: number
  className?: string
  imgs?: string[]
  children?: React.ReactNode
}

export default function ImgUploader({
  onChange,
  multiple = false,
  limitNum = 1,
  className,
  imgs = [],
  children,
}: ImgUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > limitNum) {
      alert(`Maximum ${limitNum} files allowed`)
      return
    }

    // Filter for image files
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length !== files.length) {
      alert('Only image files are allowed')
      return
    }

    onChange(imageFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > limitNum) {
      alert(`Maximum ${limitNum} files allowed`)
      return
    }
    onChange(files)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemoveImage = (index: number) => {
    const newImgs = [...imgs]
    newImgs.splice(index, 1)
    onChange([]) // Clear files
  }

  return (
    <button
      type="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
      className={cn(
        'relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100',
        {
          'border-primary bg-primary/5': isDragging,
        },
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileChange}
      />

      {imgs.length > 0 ? (
        <div className="flex h-full w-full flex-nowrap justify-center gap-2">
          {imgs.map((img, index) => (
            <div key={index} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Uploaded ${index + 1}`}
                className="h-full rounded-lg object-cover"
              />
              <span
                role="button"
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage(index)
                }}
              >
                <X className="h-4 w-4 text-white" />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {children || (
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-500">
                {isDragging ? 'Drop images here' : 'Click or drag images here to upload'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          )}
        </>
      )}
    </button>
  )
}
