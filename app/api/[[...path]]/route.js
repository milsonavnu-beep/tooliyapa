import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Tooliyapa', message: 'All PDF processing happens client-side.' })
}

export async function POST() {
  return NextResponse.json({ status: 'ok', message: 'No backend processing required.' })
}
