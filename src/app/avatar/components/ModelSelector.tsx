'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Model {
  id: string
  name: string
  description: string
  previewImage: string
}

const models: Model[] = [
  {
    id: 'realistic',
    name: 'Realistic Style',
    description: 'Professional business portraits',
    previewImage: '/models/realistic-preview.jpg',
  },
  {
    id: 'anime',
    name: 'Anime Style',
    description: 'Japanese anime style portraits',
    previewImage: '/models/anime-preview.jpg',
  },
  {
    id: 'artistic',
    name: 'Artistic Style',
    description: 'Creative artistic portraits',
    previewImage: '/models/artistic-preview.jpg',
  },
]

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
            className={cn('cursor-pointer rounded-lg border p-2 transition-all hover:shadow-md', {
              'border-primary bg-primary/10': selectedModel === model.id,
              'border-gray-200': selectedModel !== model.id,
            })}
            onClick={() => handleModelClick(model.id)}
          >
            <img
              src={model.previewImage}
              alt={model.name}
              className="mb-2 h-32 w-full rounded-md object-cover"
            />
            <h4 className="font-medium">{model.name}</h4>
            <p className="text-sm text-gray-500">{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModelSelector
