import { NextResponse } from 'next/server'
import { uploadMedia, createFileObject } from '@/lib/cosmic'

function detectFileType(mimeType: string, fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''

  if (mimeType.startsWith('image/gif') || ext === 'gif') return 'GIF'
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.startsWith('audio/')) return 'Audio'
  if (mimeType.startsWith('video/')) return 'Video'
  if (ext === 'm3u8' || mimeType.includes('mpegurl')) return 'M3U8 Playlist'
  return 'Other'
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const originalName = file.name
    const epochMs = Date.now().toString()
    const ext = originalName.split('.').pop() || ''
    const epochName = `${epochMs}${ext ? '.' + ext : ''}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileSize = buffer.length

    // Upload media to Cosmic
    const uploadResult = await uploadMedia(buffer, epochName)

    if (!uploadResult?.media?.name) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const fileType = detectFileType(file.type, originalName)

    // Determine if the file is an image for thumbnail
    const isImage = fileType === 'Image'

    const metadata: Record<string, unknown> = {
      file: uploadResult.media.name,
      original_name: originalName,
      epoch_name: epochMs,
      file_type: fileType,
      file_size_bytes: fileSize,
      upload_progress: 100,
      uploaded_at: parseInt(epochMs, 10),
      is_cloud_enabled: true,
      playback_mode: 'Repeat',
      notes: '',
    }

    // Set thumbnail for images
    if (isImage) {
      metadata.thumbnail_image = uploadResult.media.name
    }

    const fileObject = await createFileObject({
      title: epochMs,
      slug: epochMs,
      metadata,
    })

    return NextResponse.json({
      success: true,
      file: fileObject,
      media: uploadResult.media,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}