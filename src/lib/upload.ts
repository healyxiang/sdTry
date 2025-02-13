import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

// import { Readable } from 'stream';
import ShortUniqueId from 'short-unique-id'

const ACCOUNT_ID = '9b4b502a16c473b0529ab28c74e4a0c1'
const ACCESS_KEY_ID = '93bc948318d9213aeb6810f0be74976f'
const SECRET_ACCESS_KEY = '6db447593c7d9c09b1d45e569c34190a7abcbdcfd30f5f2ff6ea1a33828bd8ce'
const BUCKET_NAME = 'test-bucket-1'

const AssetsHost = 'https://assets.yt2pod.one'

const { randomUUID } = new ShortUniqueId({ length: 10 })

// 配置 Cloudflare R2 的 S3 客户端
const s3Client = new S3Client({
  region: 'auto', // Cloudflare R2 使用 'auto' 区域
  // endpoint: 'https://<your-account-id>.r2.cloudflarestorage.com', // 替换为您的 R2 端点
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID || '', // 替换为您的访问密钥 ID
    secretAccessKey: SECRET_ACCESS_KEY || '', // 替换为您的秘密访问密钥
  },
})

// 封装上传函数
export const uploadToR2 = async (file: Buffer | Blob, type: string) => {
  const fileKey = `${randomUUID()}.${type.split('/')[1]}`
  const fileUrl = `${AssetsHost}/${fileKey}`
  // https://assets.yt2pod.one/mUX7Prkz6F.jpeg
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey, // 设置文件名为 fileName,
    Body: file,
    ContentType: type,
    Metadata: { fileUrl },
    // ContentType: `audio/${AudioType}`,
  }
  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    })

    const result = await upload.done()
    console.log('Upload successful:', result)
    return fileUrl
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
