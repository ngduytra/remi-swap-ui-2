import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import {  Row, Col, Space } from 'antd'

function MenuHeader() {
  return (
    <Row justify="space-between">
      <Col></Col>
      <Col>
        <Space>
          <WalletMultiButton style={{ background: '#ffab40' }} />
        </Space>
      </Col>
    </Row>
  )
}

export default MenuHeader
