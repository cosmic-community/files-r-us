import { NextResponse } from 'next/server'
import { getFiles } from '@/lib/cosmic'

export async function GET() {
  try {
    const files = await getFiles()
    return NextResponse.json({ files, total: files.length })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}