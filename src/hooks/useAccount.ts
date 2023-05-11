import { web3 } from "@project-serum/anchor"
import { useConnection } from "@solana/wallet-adapter-react"
import { useCallback } from "react"

export const useAccount = () => {
    const { connection } = useConnection()
    const checkAccount = useCallback(async(pda: web3.PublicKey) => {
        const accountInfo = await connection.getAccountInfo(pda)
        return accountInfo !== null

    }, [connection])
    
    return {checkAccount}
}