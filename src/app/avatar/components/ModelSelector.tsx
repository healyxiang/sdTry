/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { models } from '@/constant/models'

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void
}

const ModelSelector = ({ onModelSelect }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModel] = useState<string>('realistic')

  const handleModelClick = (modelId: string) => {
    setSelectedModel(modelId)
    onModelSelect(modelId)
  }

  return (
    <div className="w-full">
      <h3 className="mb-2 font-semibold">Select Style</h3>
      <div className="grid grid-cols-3 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={cn(
              'flex h-40 cursor-pointer flex-col items-start justify-between rounded-lg border p-2 transition-all hover:shadow-md',
              {
                'border-red-600': selectedModel === model.id,
                'border-gray-200': selectedModel !== model.id,
              }
            )}
            onClick={() => handleModelClick(model.id)}
          >
            <NextImage
              src={model.previewImage}
              alt={model.name}
              width={100}
              height={100}
              className="mb-2 w-full rounded-md object-cover"
            />
            <p className="gap-1 text-xs font-medium">
              <span className="mr-1">{model.name}</span>
              {selectedModel === model.id && <span className="text-xs text-red-600">Selected</span>}
            </p>
            {/* <p className="text-sm text-gray-500">{model.description}</p> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModelSelector
