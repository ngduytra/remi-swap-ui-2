import { web3 } from '@project-serum/anchor'
import {
    NATIVE_MINT,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createCloseAccountInstruction,
} from '@solana/spl-token-v3'

export const createATAIx = async (wallet: web3.PublicKey) => {
    const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)
  
    return createAssociatedTokenAccountInstruction(
      wallet,
      ATA,
      wallet,
      NATIVE_MINT,
    )
  }
  
  export const createWrapSolIx = async (
    amount: number | bigint,
    wallet: web3.PublicKey,
  ) => {
    const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)
  
    return web3.SystemProgram.transfer({
      fromPubkey: wallet,
      toPubkey: ATA,
      lamports: amount,
    })
  }
  
  export const createUnWrapSolIx = async (wallet: web3.PublicKey) => {
    const ATA = await getAssociatedTokenAddress(NATIVE_MINT, wallet)
  
    return createCloseAccountInstruction(ATA, wallet, wallet)
  }