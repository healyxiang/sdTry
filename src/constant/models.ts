interface Model {
  id: string
  name: string
  description: string
  previewImage: string
  prompt: string
}

export const models: Model[] = [
  {
    id: 'ae-sdxl-v1',
    name: 'AE SDXL V1',
    description: 'Professional business portraits',
    previewImage: '/models/ae-sdxl-v1.jpg',
    prompt:
      'masterpiece, best quality, stick figure, cartoon cat, calico cat, yellow petal pattern, drop shaped pupil and iris, petal like hair at the tip of the ear, hydrangea fabric collar on the neck, soft watercolor texture, warm morning light, 2.5 q version of the head and body, simple and smooth lines, no shadows and high saturation illustrations',
  },
  {
    id: 'pony-v6',
    name: 'Pony v6',
    description: 'Japanese anime style portraits',
    previewImage: '/models/pony-v6.jpg',
    prompt:
      'masterpiece, best quality, stick figure, cartoon cat, calico cat, yellow petal pattern, drop shaped pupil and iris, petal like hair at the tip of the ear, hydrangea fabric collar on the neck, soft watercolor texture, warm morning light, 2.5 q version of the head and body, simple and smooth lines, no shadows and high saturation illustrations',
  },
  {
    id: 'crystal-clear-xlv1',
    name: 'Crystal Clear XLV1',
    description: 'Creative artistic portraits',
    previewImage: '/models/crystal-clear-xlv1.jpg',
    prompt:
      'stunning curls of honey colored hair, showcasing their shine and bouncy texture, illuminated elegantly by gentle, natural light., high quality, high details, hd, perfect composition, 4k epic detailed, highly detailed, sharp focus hyperrealistic, full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K',
  },
]
