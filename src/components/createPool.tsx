import { useState } from 'react'

import { Button, Col, InputNumber, Row, Space, Typography } from 'antd'
import { CheckCircleOutlined, HighlightOutlined } from '@ant-design/icons'

import { deriveTreasurerAddress, useProgram } from 'hooks/useProgram'
import { BN, utils, web3 } from '@project-serum/anchor'

const CreatePool = () => {
  const [loading, setLoading] = useState(false)
  const program = useProgram()
  const [amountMove, setAmountMove] = useState(0)
  const [amountSol, setAmountSol] = useState(0)

  const handleCreatePool = async () => {
    if (!program  || !program.provider.publicKey) return
    try {
      setLoading(true)
      const pool = web3.Keypair.generate()
      const xTokenPublicKey = new web3.PublicKey('4BgwN3LoH6q4hJXMMjzmMhwBRUy5gqpk35uFK8nJzd7f')
    const yTokenPublicKey = new web3.PublicKey('31rZHxhusWS9Wy13U511pjaWpapK87xtwv5Jifrh2Pk8')

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

    console.log('thong tin pool=> ', pool.publicKey.toBase58())
    const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
    const xTreasuryPublicKey = await utils.token.associatedAddress({
      mint: xTokenPublicKey,
      owner: treasurerPublicKey,
    })
    const yTreasuryPublicKey = await utils.token.associatedAddress({
      mint: yTokenPublicKey,
      owner: treasurerPublicKey,
    })

    const amountSolDecimal = amountSol * (10**8)
    const amountMoveDecimal = amountMove * (10**8)

    await program.methods
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
    }).signers([pool])
    .rpc()
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
            <Typography.Title level={3}>
                Create Pool
            </Typography.Title>
        </Col>
        <Col span={24}>
            <Space style={{width: '100%'}}>
                <InputNumber value={amountSol} 
                    onChange={(value)=>{
                        if(value === null) setAmountSol(0)
                        else setAmountSol(value)}
                    }
                />
                <Typography.Text strong> SOL</Typography.Text>
            </Space>
        </Col>
        <Col span={24}>
            <Space style={{width: '100%'}}>
                <InputNumber value={amountMove} 
                    onChange={(value)=>{
                        if(value === null) setAmountMove(0)
                        else setAmountMove(value)}
                    }
                />
                <Typography.Text strong> MOVE</Typography.Text>
            </Space>
        </Col>
        <Col span={24}>
            <Button
            type="primary"
            onClick={handleCreatePool}
            loading={loading}
            icon={<HighlightOutlined />}
            >
                CreatePool
            </Button>
        </Col>
    </Row>
        
    
    
  )
}

export default CreatePool
