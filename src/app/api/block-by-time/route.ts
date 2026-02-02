import { NextRequest, NextResponse } from 'next/server'

const etherscanApiKey = process.env.ETHERSCAN_API_KEY ?? ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timestamp = searchParams.get('timestamp')
  const closest = searchParams.get('closest') ?? 'before'

  if (!timestamp) {
    return NextResponse.json({ error: 'timestamp is required' }, { status: 400 })
  }

  if (!etherscanApiKey) {
    return NextResponse.json({ error: 'Etherscan API key not configured' }, { status: 500 })
  }

  const resp = await fetch(
    `https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=${closest}&apikey=${etherscanApiKey}`
  )
  const data = await resp.json()

  return NextResponse.json(data)
}
