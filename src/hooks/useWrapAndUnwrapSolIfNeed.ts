import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
} from '@solana/spl-token-v3'

import { SOL_DECIMALS } from 'constant'
import { createWrapSolIx, createATAIx, createUnWrapSolIx } from 'helper'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useNativeBalance } from './useBalance'
import { utilsBN } from 'helper/utilsBN'
import { useAccount } from './useAccount'


export const useWrapAndUnwrapSolIfNeed = () => {
  const {  getTokenBalance } = useNativeBalance()
  const {checkAccount} = useAccount()
  const wallet = useAnchorWallet()

  const createWrapSolTxIfNeed = useCallback(
    async (
      mint: string,
      amount: number | string,
    ): Promise<web3.Transaction | undefined> => {
      if(!wallet) return
      const tx = new web3.Transaction()
      const walletAddress = wallet.publicKey
      const wSolATA = await getAssociatedTokenAddress(
        NATIVE_MINT,
        new web3.PublicKey(walletAddress),
      )
      const balance  = await getTokenBalance(wSolATA)
 
      if (mint !== NATIVE_MINT.toBase58() || balance === null || balance >= Number(amount)) return

      const decimalizedAmount = utilsBN.decimalize(amount, SOL_DECIMALS)
      const decimalizedBalance = utilsBN.decimalize(balance, SOL_DECIMALS)
      const neededWrappedSol = decimalizedAmount.sub(decimalizedBalance)
      
      // Create token account to hold your wrapped SOL if haven't existed
      const isAccountExist = checkAccount(wSolATA)
      if (!isAccountExist) {
        const creatingATAIx = await createATAIx(
          new web3.PublicKey(walletAddress),
        )
        tx.add(creatingATAIx)
      }
      console.log('thong tin wrap => ', neededWrappedSol.toNumber(), 'balance wrapsol=> ', balance)
      const wSolIx = await createWrapSolIx(
        neededWrappedSol.toNumber(),
        new web3.PublicKey(walletAddress),
      )
      tx.add(wSolIx, createSyncNativeInstruction(wSolATA))

      return tx
    },
    [checkAccount, getTokenBalance, wallet],
  )

  const createUnWrapSolTxIfNeed = async (
    mint: string,
  ): Promise<web3.Transaction | undefined> => {
    if(!wallet) return
    const walletAddress = wallet.publicKey
    if (mint !== NATIVE_MINT.toBase58()) return

    const uwSolIx = await createUnWrapSolIx(new web3.PublicKey(walletAddress))

    return new web3.Transaction().add(uwSolIx)
  }

  return { createWrapSolTxIfNeed, createUnWrapSolTxIfNeed }
}