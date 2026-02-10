import { NextResponse } from 'next/server'
import { getStorageSettings } from '@/lib/cosmic'

export async function GET() {
  try {
    const settings = await getStorageSettings()
    if (!settings) {
      return NextResponse.json({ settings: null }, { status: 404 })
    }
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}