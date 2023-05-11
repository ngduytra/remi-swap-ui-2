import { Row, Col, Space } from 'antd'

import MenuHeader from 'components/header'

const Banner = () => {
  return (
    <Row>
      <Col span={24}>
        <Row
          justify="center"
          style={{
           
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            padding: '8px 100px',
          }}
        >
          <Col span={24}>
            <MenuHeader />
          </Col>
          <Col span={24} style={{ marginTop: 120, textAlign: 'center' }}>
            <Space style={{ fontSize: 45, fontWeight: 200 }}>
              <span className="title-word title-word-1">Remi</span>
              <span className="title-word title-word-2">Swap</span>
              <span className="title-word title-word-3">On Solana</span>
            </Space>
          </Col>
          
        </Row>
      </Col>
    </Row>
  )
}

export default Banner
