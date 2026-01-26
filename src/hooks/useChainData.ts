'use client';

export function useChainData() {

    const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? ''

    const getBlock = async (selectedRange: any) => {
        const startTimestamp = Math.floor(Date.parse(selectedRange.start) / 1000)
        const endTimestamp = Math.floor(Date.parse(selectedRange.end) / 1000)
        console.log('converted timestamps', startTimestamp, endTimestamp)
        const respStart = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${startTimestamp}&closest=before&apikey=${etherscanApiKey}`)
        const respEnd = await fetch(`https://api.etherscan.io/v2/api?chainid=1&module=block&action=getblocknobytime&timestamp=${endTimestamp}&closest=before&apikey=${etherscanApiKey}`)
        const responseStart = await respStart.json()
        const responseEnd = await respEnd.json()
        console.log('api responses', responseStart, responseEnd)
    }

    return {
        getBlock
    }
}