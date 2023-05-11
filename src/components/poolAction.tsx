import { useState } from 'react'
import { Address, BN, utils, web3 } from '@project-serum/anchor'

import { Button, Card, Col, InputNumber, Row, Select, Space, Typography } from 'antd'
import {  HighlightOutlined } from '@ant-design/icons'

import { deriveTreasurerAddress, useProgram } from 'hooks/useProgram'
import { isAddress } from 'utils'
import { utilsBN } from 'helper/utilsBN'
import { useWrapAndUnwrapSolIfNeed } from 'hooks/useWrapAndUnwrapSolIfNeed'
import { SOL_ADDRESS } from 'constant'
import { useAnchorProvider } from 'hooks/useAnchor'

type PoolActionProps = {
    poolAddress: Address
}
const PoolAction = ({poolAddress}: PoolActionProps) => {
  return (
    <Row gutter={[24,24]}>
        <Col span={12}>
            <AddLiquidity poolAddress={poolAddress}/>
        </Col>
        <Col span={12}>
            <Swap poolAddress={poolAddress}/>
        </Col>
    </Row>
        
    
    
  )
}

export default PoolAction

const AddLiquidity = ({poolAddress}:  {poolAddress: Address})=>{
    const [loading, setLoading] = useState(false)

    const [amountMove, setAmountMove] = useState(0)
    const [amountSol, setAmountSol] = useState(0)
    const program = useProgram()
    const { createWrapSolTxIfNeed } = useWrapAndUnwrapSolIfNeed()
    const provider = useAnchorProvider()

    const handleAddLiquidity = async () => {
        if (!program  || !program.provider.publicKey || !provider) return
        if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
        setLoading(true)
        try {
            const poolPublicKey = new web3.PublicKey(poolAddress)
            const { xToken: xTokenPublicKey, yToken: yTokenPublicKey } =
            await program.account.pool.fetch(poolAddress)
            const srcXAccountPublicKey = await utils.token.associatedAddress({
            mint: xTokenPublicKey,
            owner: program.provider.publicKey,
            })
            const srcYAccountPublicKey = await utils.token.associatedAddress({
            mint: yTokenPublicKey,
            owner: program.provider.publicKey,
            })
            const treasurerAddress = await deriveTreasurerAddress(
            poolAddress.toString()
            )
            const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
            const xTreasuryPublicKey = await utils.token.associatedAddress({
            mint: xTokenPublicKey,
            owner: treasurerPublicKey,
            })
            const yTreasuryPublicKey = await utils.token.associatedAddress({
            mint: yTokenPublicKey,
            owner: treasurerPublicKey,
            })
        
            const amountSolDecimal = utilsBN.decimalize(amountSol, 9)
            const amountMoveDecimal =  utilsBN.decimalize(amountMove, 9)
            const transactions: {tx: web3.Transaction, signers: web3.Keypair[]}[] = []
            const wrapSolTx = await createWrapSolTxIfNeed(
              SOL_ADDRESS,
              amountSol,
            )
            if(wrapSolTx) transactions.push({tx: wrapSolTx, signers: []})
        
            const tx = await program.methods
            .addLiquidity(new BN(amountSolDecimal), new BN(amountMoveDecimal))
            .accounts({
                authority: program.provider.publicKey,
                pool: poolPublicKey,
                xToken: xTokenPublicKey,
                yToken: yTokenPublicKey,
                srcXAccount: srcXAccountPublicKey,
                srcYAccount: srcYAccountPublicKey,
                treasurer: treasurerPublicKey,
                xTreasury: xTreasuryPublicKey,
                yTreasury: yTreasuryPublicKey,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
                associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY,
            }).transaction()

            transactions.push({tx, signers:[]})

            await provider.sendAll(
                transactions.map(({tx, signers}) => {
                  return { tx, signers }
                }),
              )

            window.notify({
                type: 'success',
                description: 'Add Liquidity successfully!',
            })
        } catch (error: any) {
          window.notify({
            type: 'error',
            description: error.message,
          })
        } finally {
          setLoading(false)
        }
      }
    

    return (
        <Card>
            <Space direction="vertical" size={12} style={{width: '100%', justifyContent:"center"}}>
                <Typography.Title level={3} style={{textAlign: 'center'}}>
                    Add Pool Liquidity
                </Typography.Title>
                <Space style={{width: '100%'}} >
                    <InputNumber value={amountSol} 
                        onChange={(value)=>{
                            if(value === null) setAmountSol(0)
                            else setAmountSol(value)}
                        }
                    />
                    <Typography.Text strong> SOL</Typography.Text>
                </Space>
                <Space style={{width: '100%'}} >
                    <InputNumber value={amountMove} 
                        onChange={(value)=>{
                            if(value === null) setAmountMove(0)
                            else setAmountMove(value)}
                        }
                    />
                    <Typography.Text strong> MOVE</Typography.Text>
                </Space>
                <Button
                        type="primary"
                        onClick={handleAddLiquidity}
                        loading={loading}
                        icon={<HighlightOutlined />}
                        block
                    >
                        Add Liquidity
                    </Button>
            </Space>
        </Card>
    )
}

const Swap = ({poolAddress}:  {poolAddress: Address})=>{
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState(0)
    const [isRevert, setIsRevert] = useState(false)
    const program = useProgram()
    const { createWrapSolTxIfNeed } = useWrapAndUnwrapSolIfNeed()
    const provider = useAnchorProvider()

    const handleSwap = async () => {
        if (!program  || !program.provider.publicKey || !provider) return
        if (!amount)
            throw new Error('The token amount must be greater than zero')
        if (!isAddress(poolAddress)) throw new Error('Invalid pool address')

        setLoading(true)
        try {
            const poolPublicKey = new web3.PublicKey(poolAddress)
            const { xToken: xTokenPublicKey, yToken: yTokenPublicKey } =
            await program.account.pool.fetch(poolAddress)
            const srcXAccountPublicKey = await utils.token.associatedAddress({
            mint: xTokenPublicKey,
            owner: program.provider.publicKey,
            })
            const dstYAccountPublicKey = await utils.token.associatedAddress({
            mint: yTokenPublicKey,
            owner: program.provider.publicKey,
            })
            const treasurerAddress = await deriveTreasurerAddress(
            poolAddress.toString()
            )
            const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
            const xTreasuryPublicKey = await utils.token.associatedAddress({
            mint: xTokenPublicKey,
            owner: treasurerPublicKey,
            })
            const yTreasuryPublicKey = await utils.token.associatedAddress({
            mint: yTokenPublicKey,
            owner: treasurerPublicKey,
            })
        
            const transactions: {tx: web3.Transaction, signers: web3.Keypair[]}[] = []

            if(!isRevert) {
                const wrapSolTx = await createWrapSolTxIfNeed(
                    SOL_ADDRESS,
                    amount,
                )
                if(wrapSolTx) transactions.push({tx: wrapSolTx, signers: []})
            }

            const amountDecimal = utilsBN.decimalize(amount, 9)
        
            const tx = await program.methods
            .swap(new BN(amountDecimal), isRevert)
            .accounts({
                authority: program.provider.publicKey,
                pool: poolPublicKey,
                xToken: xTokenPublicKey,
                yToken: yTokenPublicKey,
                srcXAccount: srcXAccountPublicKey,
                dstYAccount: dstYAccountPublicKey,
                treasurer: treasurerPublicKey,
                xTreasury: xTreasuryPublicKey,
                yTreasury: yTreasuryPublicKey,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
                associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY,
            }).transaction()

            console.log('transaction', transactions)
            console.log('is revert=> ', isRevert)

            transactions.push({tx, signers:[]})

            await provider.sendAll(
                transactions.map(({tx, signers}) => {
                  return { tx, signers }
                }),
              )

            window.notify({
                type: 'success',
                description: 'Swap successfully!',
            })
        } catch (error: any) {
          window.notify({
            type: 'error',
            description: error.message,
          })
        } finally {
          setLoading(false)
        }
    }
    
    const handleChange = (value: string) => {
        switch(value){
            case 'move':
                setIsRevert(true);
                break
            default:
                setIsRevert(false)
        }

    };
    

    return (
        <Card>
            <Space direction="vertical" size={12} style={{width: '100%', justifyContent:"center"}}>
                <Typography.Title level={3} style={{textAlign: 'center'}}>
                    Swap
                </Typography.Title>
                <Space style={{width: '100%', justifyContent:"center"}} >
                    <InputNumber value={amount} 
                        onChange={(value)=>{
                            if(value === null) setAmount(0)
                            else setAmount(value)}
                        }
                    />
                  
                    <Select
                        defaultValue="sol"
                    
                        onChange={handleChange}
                        options={[
                            { value: 'sol', label: 'SOL' },
                            { value: 'move', label: 'MOVE' },
                        ]}
                    />
                </Space>
                <Button
                    type="primary"
                    onClick={handleSwap}
                    loading={loading}
                    icon={<HighlightOutlined />}
                    block
                >
                    Swap
                </Button>

            </Space>
        </Card>
        
    )
}