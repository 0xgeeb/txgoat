'use client';

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export function useChainData() {

    const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? ''

    const client = createPublicClient({
        chain: mainnet,
        transport: http()
    })

    const step = 1000

    const getBlock = async (selectedRange: any) => {
        const startTimestamp = Math.floor(Date.parse(selectedRange.start) / 1000)
        const endTimestamp = Math.floor(Date.parse(selectedRange.end) / 1000)
        console.log('converted timestamps', startTimestamp, endTimestamp)
        const respStart = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${startTimestamp}&closest=before&apikey=${etherscanApiKey}`)
        const respEnd = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${endTimestamp}&closest=before&apikey=${etherscanApiKey}`)
        const responseStart = await respStart.json()
        const responseEnd = await respEnd.json()
        console.log('api responses', responseStart, responseEnd)

        const startBlock = responseStart.result
        const endBlock = responseEnd.result
        for(let from = startBlock; from <= endBlock; from += step) {
            const to = Math.min(from + step - 1, endBlock)

            const blockLogs = await client.getLogs({
                address: '0xcBf203F2ee13702Ec41404856f75357e0872484e',
                event: 
            })
        }
    }

    return {
        getBlock
    }
}