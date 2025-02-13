export interface Meta {
  base64: string
  enhance_prompt: string
  enhance_style: string | null
  file_prefix: string
  guidance_scale: number
  height: number
  id: string | null
  init_image: string
  instant_response: string
  n_samples: number
  negative_prompt: string
  opacity: number
  outdir: string
  padding_down: number
  padding_right: number
  pag_scale: number
  prompt: string
  rescale: string
  safety_checker: string
  safety_checker_type: string
  scale_down: number
  seed: number
  strength: number
  temp: string
  track_id: string | null
  watermark: string
  webhook: string | null
  width: number
}

export interface ModelLabResponse {
  status: string
  generationTime: number
  id: number
  output: string[]
  proxy_links: string[]
  meta: Meta
}
