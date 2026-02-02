import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const rpc = process.env.MAINNET_RPC ?? ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  if (!rpc) {
    return NextResponse.json({ error: 'RPC not configured' }, { status: 500 })
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpc)
  })

  try {
    const address = await client.getEnsAddress({ name: normalize(name) })
    return NextResponse.json({ address })
  } catch (error) {
    console.error('ENS resolution failed:', error)
    return NextResponse.json({ address: null })
  }
}
