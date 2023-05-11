import { useState } from 'react'
import { BN, utils, web3 } from '@project-serum/anchor'

import { Button, Col, InputNumber, Row, Space, Typography } from 'antd'
import {  HighlightOutlined } from '@ant-design/icons'

import { deriveTreasurerAddress, useProgram } from 'hooks/useProgram'
import { useWrapAndUnwrapSolIfNeed } from 'hooks/useWrapAndUnwrapSolIfNeed'
import { useAnchorProvider } from 'hooks/useAnchor'
import { utilsBN } from 'helper/utilsBN'
import { MOVE_ADDRESS, SOL_ADDRESS } from 'constant'

const CreatePool = () => {
  const [loading, setLoading] = useState(false)
  const program = useProgram()
  const [amountMove, setAmountMove] = useState(0)
  const [amountSol, setAmountSol] = useState(0)
  const { createWrapSolTxIfNeed } = useWrapAndUnwrapSolIfNeed()
  const provider = useAnchorProvider()

  const handleCreatePool = async () => {
    if (!program  || !program.provider.publicKey || !provider) return
    try {
      setLoading(true)
      const pool = web3.Keypair.generate()
        const xTokenPublicKey = new web3.PublicKey(SOL_ADDRESS)
      const yTokenPublicKey = new web3.PublicKey(MOVE_ADDRESS)
      const srcXAccountPublicKey = await utils.token.associatedAddress({
        mint: xTokenPublicKey,
        owner: program.provider.publicKey,
      })
      const srcYAccountPublicKey = await utils.token.associatedAddress({
        mint: yTokenPublicKey,
        owner: program.provider.publicKey,
      })
      const treasurerAddress = await deriveTreasurerAddress(
        pool.publicKey.toBase58(),
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
      .createPool(new BN(amountSolDecimal), new BN(amountMoveDecimal))
      .accounts({
          authority: program.provider.publicKey,
          pool: pool.publicKey,
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
      })
      .transaction()

      transactions.push({tx, signers:[pool]})

      await provider.sendAll(
        transactions.map(({tx, signers}) => {
          return { tx, signers }
        }),
      )

      window.notify({
        type: 'success',
        description: 'Sign contract successfully!',
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
    <Row wrap gutter={[24,24]}>
        <Col span={24}>
            <Typography.Title level={3} style={{textAlign: 'center'}}>
                Create Pool
            </Typography.Title>
        </Col>
        <Col span={24} >
            <Space style={{width: '100%', justifyContent:"center"}} align="center" >
                <InputNumber value={amountSol} 
                    onChange={(value)=>{
                        if(value === null) setAmountSol(0)
                        else setAmountSol(value)}
                    }
                    style={{width: 200}}
                />
                <Typography.Text strong> SOL</Typography.Text>
            </Space>
        </Col>
        <Col span={24}>
            <Space style={{width: '100%', justifyContent:"center"}} align="center">
                <InputNumber value={amountMove} 
                    onChange={(value)=>{
                        if(value === null) setAmountMove(0)
                        else setAmountMove(value)}
                    }
                    style={{width: 200}}
                />
                <Typography.Text strong> MOVE</Typography.Text>
            </Space>
        </Col>
        <Col span={24} >
          <Space style={{width: '100%', justifyContent:"center"}} align="center">
            <Button
            type="primary"
            onClick={handleCreatePool}
            loading={loading}
            icon={<HighlightOutlined />}
            >
                CreatePool
            </Button>
          </Space>
        </Col>
    </Row>
        
    
    
  )
}

export default CreatePool
