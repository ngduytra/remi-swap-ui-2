import { useCallback } from "react"
import { Address, web3 } from "@project-serum/anchor"
import { useConnection } from "@solana/wallet-adapter-react"
import {LAMPORTS_PER_SOL} from '@solana/web3.js'

export const useNativeBalance = ()=>{
    const { connection } = useConnection()
    const getNativeBalance = useCallback(async(mint: Address)=>{
        const balance = await connection.getBalance(new web3.PublicKey(mint))
        return balance/LAMPORTS_PER_SOL
    }, [connection])

    const getTokenBalance = async(ata: web3.PublicKey) => {
        const tokenBalance = await connection.getTokenAccountBalance(ata)
    
        return tokenBalance.value.uiAmount
    }

    return { getNativeBalance, getTokenBalance }
}


