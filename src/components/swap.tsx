import { useState } from 'react'

import { Button, Col, InputNumber, Row, Space, Typography } from 'antd'
import { CheckCircleOutlined, HighlightOutlined } from '@ant-design/icons'

import { deriveTreasurerAddress, useProgram } from 'hooks/useProgram'
import { BN, utils, web3 } from '@project-serum/anchor'
import { isAddress } from 'utils'

const Swap = ({poolAddress}: {poolAddress: string}) => {
  const [loading, setLoading] = useState(false)
  const program = useProgram()
  const [swapAmount, setSwapAmount] = useState(0)
  const [sourceToken, setSourceToken] = useState('')

  const handleSwap = async () => {
    if (!program  || !program.provider.publicKey) return
    try {
      setLoading(true)
      if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
    if (swapAmount === 0)
      throw new Error('The token amount must be greater than zero')

    const poolPublicKey = new web3.PublicKey(poolAddress)
    
    const { xToken: xTokenPublicKey, yToken: yTokenPublicKey } =
      await program.account.pool.fetch(poolAddress)

    let desToken = yTokenPublicKey
    if(sourceToken !== xTokenPublicKey.toBase58()) {
        desToken = xTokenPublicKey
    }

    const srcXAccountPublicKey = await utils.token.associatedAddress({
      mint: xTokenPublicKey,
      owner: program.provider.publicKey,
    })
    const dstYAccountPublicKey = await utils.token.associatedAddress({
      mint: yTokenPublicKey,
      owner: program.provider.publicKey,
    })

    const treasurerAddress = await deriveTreasurerAddress(poolAddress)
    const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
    const xTreasuryPublicKey = await utils.token.associatedAddress({
      mint: xTokenPublicKey,
      owner: treasurerPublicKey,
    })
    const yTreasuryPublicKey = await utils.token.associatedAddress({
      mint: yTokenPublicKey,
      owner: treasurerPublicKey,
    })

    const swapAmountDecimal = swapAmount * (10**8)

    await program.methods
    .swap(new BN(swapAmountDecimal))
    .accounts({
        authority: program.provider.publicKey,
        pool: new web3.PublicKey(poolAddress),
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
    })
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
                <InputNumber value={swapAmount} 
                    onChange={(value)=>{
                        if(value === null) setSwapAmount(0)
                        else setSwapAmount(value)}
                    }
                />
                <Typography.Text strong> SOL</Typography.Text>
            </Space>
        </Col>
        <Col span={24}>
            <Space style={{width: '100%'}}>
                <Typography.Text>You will receive </Typography.Text>
                <Typography.Text strong> MOVE</Typography.Text>
            </Space>
        </Col>
        <Col span={24}>
            <Button
            type="primary"
            onClick={handleSwap}
            loading={loading}
            icon={<HighlightOutlined />}
            >
                Swap
            </Button>
        </Col>
    </Row>
        
    
    
  )
}

export default Swap
