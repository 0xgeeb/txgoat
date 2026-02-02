import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const rpc = process.env.MAINNET_RPC ?? ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenAddress = searchParams.get('tokenAddress')
  const fromBlock = searchParams.get('fromBlock')
  const toBlock = searchParams.get('toBlock')

  if (!tokenAddress || !fromBlock || !toBlock) {
    return NextResponse.json({ error: 'tokenAddress, fromBlock, and toBlock are required' }, { status: 400 })
  }

  if (!rpc) {
    return NextResponse.json({ error: 'RPC not configured' }, { status: 500 })
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(rpc)
  })

  try {
    const logs = await client.getLogs({
      address: tokenAddress as `0x${string}`,
      event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
      fromBlock: BigInt(fromBlock),
      toBlock: BigInt(toBlock)
    })

    // Serialize BigInt values for JSON response
    const serializedLogs = logs.map(log => ({
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber.toString(),
      args: {
        from: log.args.from,
        to: log.args.to,
        value: log.args.value?.toString()
      }
    }))

    return NextResponse.json({ logs: serializedLogs })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
