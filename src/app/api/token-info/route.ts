import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const rpc = process.env.MAINNET_RPC ?? ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenAddress = searchParams.get('address')

  if (!tokenAddress) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  if (!rpc) {
    return NextResponse.json({ error: 'RPC not configured' }, { status: 500 })
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpc)
  })

  try {
    const [decimals, symbol] = await Promise.all([
      client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: [{ type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }] }],
        functionName: 'decimals'
      }),
      client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: [{ type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }] }],
        functionName: 'symbol'
      })
    ])

    return NextResponse.json({ decimals: Number(decimals), symbol })
  } catch (error) {
    console.error('Error fetching token info:', error)
    return NextResponse.json({ error: 'Failed to fetch token info' }, { status: 500 })
  }
}
