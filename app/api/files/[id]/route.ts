// app/api/files/[id]/route.ts
import { NextResponse } from 'next/server'
import { deleteFileObject } from '@/lib/cosmic'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'File ID required' }, { status: 400 })
  }

  try {
    await deleteFileObject(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}