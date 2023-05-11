import { Card, Col, Modal, Row, Typography } from 'antd'

import { Address } from '@project-serum/anchor'
import { usePool } from 'hooks/usePool'
import { useState } from 'react'
import PoolAction from './poolAction'
import { utilsBN } from 'helper/utilsBN'

import './index.css'

type PoolDetailPros = {
    poolAddress: Address
}

const PoolDetail = ({poolAddress}: PoolDetailPros) => {
    const poolData = usePool(poolAddress)
    const [ openModal, setOpenModal ] = useState(false)

    return (
        <Card bodyStyle={{background: '#0050ff42', cursor:"pointer"}} onClick={()=>setOpenModal(true)} className='clickable'>
            <Row>
                <Col span={24}>
                    <Typography.Text strong style={{color: '#219f85'}}>Address: </Typography.Text>
                    <Typography.Text >{poolAddress.toString()} </Typography.Text>
                </Col>
                <Col span={24}>
                    <Typography.Text strong style={{color: '#219f85'}}>{poolData.xToken.toBase58()}:  </Typography.Text>
                    <Typography.Text >{utilsBN.undecimalize(poolData.x, 9)} </Typography.Text>
                </Col>
                <Col span={24}>
                    <Typography.Text strong style={{color: '#219f85'}}>{poolData.yToken.toString()}: </Typography.Text>
                    <Typography.Text >{utilsBN.undecimalize(poolData.y, 9)} </Typography.Text>
                </Col>
            </Row>
            <Modal 
                open={openModal}
                destroyOnClose
                onCancel={(e)=>{
                    setOpenModal(false)
                    e.stopPropagation()
                }}
                closable={false}
                footer={null}
            >
                <PoolAction poolAddress={poolAddress}/>
            </Modal>
        </Card>
        
    )

}

export default PoolDetail
