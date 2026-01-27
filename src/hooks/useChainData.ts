'use client';

import { useState } from 'react'
import { createPublicClient, http, parseAbiItem, formatUnits, type Chain } from 'viem'
import { mainnet } from 'viem/chains'

export interface TokenTransfer {
    txHash: string
    blockNumber: bigint
    from: string
    to: string
    amount: string
    direction: 'in' | 'out'
}

export function useChainData() {
    const [transfers, setTransfers] = useState<TokenTransfer[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? ''
    const rpc = process.env.NEXT_PUBLIC_MAINNET_RPC ?? ''

    const mainnetChain = {
        id: 1,
        name: "Mainnet",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [rpc] }, public: { http: [rpc] } }
    } as const satisfies Chain

    const client = createPublicClient({
        chain: mainnetChain,
        transport: http()
    })

    const step = 2000

    const getBlock = async (selectedRange: any, walletAddress: string, tokenAddress: string) => {
        if (!selectedRange || !walletAddress || !tokenAddress) return

        setIsLoading(true)
        setTransfers([])
        const foundTransfers: TokenTransfer[] = []

        try {
            const startTimestamp = Math.floor(Date.parse(selectedRange.start) / 1000)
            const endTimestamp = Math.floor(Date.parse(selectedRange.end) / 1000)

            console.log('Finding block range...')

            const respStart = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${startTimestamp}&closest=before&apikey=${etherscanApiKey}`)
            const respEnd = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${endTimestamp}&closest=before&apikey=${etherscanApiKey}`)
            const responseStart = await respStart.json()
            const responseEnd = await respEnd.json()

            const startBlock = Number(responseStart.result)
            const endBlock = Number(responseEnd.result)
            const totalBlocks = endBlock - startBlock

            const walletLower = walletAddress.toLowerCase()

            for (let from = startBlock; from <= endBlock; from += step) {
                const to = Math.min(from + step - 1, endBlock)
                const progressPct = Math.round(((from - startBlock) / totalBlocks) * 100)
                console.log(`Scanning blocks ${from.toLocaleString()} - ${to.toLocaleString()} (${progressPct}%)`)

                const blockLogs = await client.getLogs({
                    address: tokenAddress as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
                    fromBlock: BigInt(from),
                    toBlock: BigInt(to)
                })

                for (const log of blockLogs) {
                    const logFrom = (log.args.from as string).toLowerCase()
                    const logTo = (log.args.to as string).toLowerCase()

                    if (logFrom === walletLower || logTo === walletLower) {
                        const transfer: TokenTransfer = {
                            txHash: log.transactionHash,
                            blockNumber: log.blockNumber,
                            from: log.args.from as string,
                            to: log.args.to as string,
                            amount: formatUnits(log.args.value as bigint, 18),
                            direction: logFrom === walletLower ? 'out' : 'in'
                        }
                        foundTransfers.push(transfer)
                        setTransfers([...foundTransfers])
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching transfers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        getBlock,
        transfers,
        isLoading
    }
}