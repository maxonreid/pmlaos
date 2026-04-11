import { auth } from '@/lib/auth'
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return Response.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return Response.json({ error: 'File must be an image.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'File must be under 10 MB.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`

  try {
    const uploadOptions: UploadApiOptions = {
      folder: 'pmlaos/listings',
      resource_type: 'image',
    }

    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)
    return Response.json({ url: result.secure_url }, { status: 201 })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 502 })
  }
}
