'use client';

import { useState, useCallback } from 'react'
import { formatUnits } from 'viem'
import { TimeRange } from '@/types/timeline'

export interface TokenTransfer {
    txHash: string
    blockNumber: bigint
    from: string
    to: string
    amount: string
    direction: 'in' | 'out'
    symbol: string
}

export function useChainData() {
    const [transfers, setTransfers] = useState<TokenTransfer[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const step = 2000

    const getBlock = async (
        selectedRange: TimeRange | null,
        walletAddress: string,
        tokenAddress: string,
        onComplete?: (transfers: TokenTransfer[]) => void
    ) => {
        if (!selectedRange || !walletAddress || !tokenAddress) return

        setIsLoading(true)
        setTransfers([])
        setProgress(0)
        const foundTransfers: TokenTransfer[] = []

        try {
            const startTimestamp = Math.floor(selectedRange.start.getTime() / 1000)
            const endTimestamp = Math.floor(selectedRange.end.getTime() / 1000)

            console.log('Finding block range...')

            const [respStart, respEnd] = await Promise.all([
                fetch(`/api/block-by-time?timestamp=${startTimestamp}&closest=before`),
                fetch(`/api/block-by-time?timestamp=${endTimestamp}&closest=before`)
            ])
            const responseStart = await respStart.json()
            const responseEnd = await respEnd.json()

            const startBlock = Number(responseStart.result)
            const endBlock = Number(responseEnd.result)
            const totalBlocks = endBlock - startBlock

            // Fetch token decimals and symbol
            const tokenInfoResp = await fetch(`/api/token-info?address=${tokenAddress}`)
            const tokenInfo = await tokenInfoResp.json()

            if (tokenInfo.error) {
                throw new Error(tokenInfo.error)
            }

            const { decimals, symbol } = tokenInfo
            console.log(`Token: ${symbol}, decimals: ${decimals}`)

            const walletLower = walletAddress.toLowerCase()

            for (let from = startBlock; from <= endBlock; from += step) {
                const to = Math.min(from + step - 1, endBlock)
                const progressPct = Math.round(((from - startBlock) / totalBlocks) * 100)
                setProgress(progressPct)
                console.log(`Scanning blocks ${from.toLocaleString()} - ${to.toLocaleString()} (${progressPct}%)`)

                const logsResp = await fetch(`/api/logs?tokenAddress=${tokenAddress}&fromBlock=${from}&toBlock=${to}`)
                const logsData = await logsResp.json()

                if (logsData.error) {
                    throw new Error(logsData.error)
                }

                for (const log of logsData.logs) {
                    const logFrom = (log.args.from as string).toLowerCase()
                    const logTo = (log.args.to as string).toLowerCase()

                    if (logFrom === walletLower || logTo === walletLower) {
                        console.log('Raw transfer log:', {
                            txHash: log.transactionHash,
                            blockNumber: log.blockNumber,
                            from: log.args.from,
                            to: log.args.to,
                            rawValue: log.args.value,
                        })
                        const transfer: TokenTransfer = {
                            txHash: log.transactionHash,
                            blockNumber: BigInt(log.blockNumber),
                            from: log.args.from as string,
                            to: log.args.to as string,
                            amount: formatUnits(BigInt(log.args.value), decimals),
                            direction: logFrom === walletLower ? 'out' : 'in',
                            symbol
                        }
                        console.log('Formatted transfer:', transfer)
                        foundTransfers.push(transfer)
                        setTransfers([...foundTransfers])
                    }
                }
            }
            setProgress(100)
            // Call onComplete with the found transfers
            if (onComplete && foundTransfers.length > 0) {
                onComplete(foundTransfers)
            }
        } catch (error) {
            console.error('Error fetching transfers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // TODO: Remove - for testing UI
    const setMockTransfers = (mockData: TokenTransfer[]) => {
        setTransfers(mockData)
    }

    const resolveEns = useCallback(async (name: string): Promise<string | null> => {
        try {
            const resp = await fetch(`/api/ens?name=${encodeURIComponent(name)}`)
            const data = await resp.json()
            return data.address
        } catch (error) {
            console.error('ENS resolution failed:', error)
            return null
        }
    }, [])

    return {
        getBlock,
        transfers,
        isLoading,
        progress,
        setMockTransfers,
        resolveEns
    }
}
