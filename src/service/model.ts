import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import { ModelLabResponse } from '@/types/ModelLab'
// import { Prompt } from '@/constant/prompt'
import { TaskStatus } from '@prisma/client'
import { models } from '@/constant/models'

interface ImgBody {
  initImg: string
  modelId: string
}

const communityImg2ImgApi = async ({ initImg, modelId }: ImgBody) => {
  const model = models.find((model) => model.id === modelId)
  const response = await fetch('/api/images/img2img', {
    method: 'POST',
    body: JSON.stringify({
      // model_id: 'dark-sushi-25d-v4',
      model_id: model?.id,
      // lora_model: 'kitagawa-marin',
      // model_id: 'arienmixxl',
      // model_id: 'flux-pro-1.1',
      // model_id: 'realistic-vision-v60',
      // lora_model: '(((POVSittingBlowjob)))',
      scheduler: 'UniPCMultistepScheduler',
      // prompt: Prompt.test, // 替换为实际提示
      prompt: model?.prompt,
      init_image: initImg,
    }),
  })
  const data = (await response.json()) as ModelLabResponse
  return data
  if (data.status === TaskStatus.success) {
    return data
  } else {
    throw new Error('Network response was not ok')
  }
}

// API 请求函数
// const fetchModelLab = async (data: any): Promise<ModelLabResponse> => {
//   const response = await fetch('/api/realtime/text2img', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error('Network response was not ok')
//   }

//   return response.json()
// }

// 封装的查询钩子
// export const useFetchModelLab = (data: any) => {
//   return useQuery<ModelLabResponse, Error>(['modelLab', data], () => fetchModelLab(data), {
//     enabled: !!data, // 只有在 data 存在时才执行请求
//   })
// }

// // 封装的变更钩子
// export const useCreateModelLab = () => {
//   return useMutation<ModelLabResponse, Error, any>({
//     mutationFn:
//   })
// }

// communityImg2Img
export function useImg2ImgApi() {
  const mutation = useMutation({
    mutationFn: async (body: ImgBody) => {
      return await communityImg2ImgApi(body)
    },
  })
  return mutation
}
