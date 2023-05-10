import { Row, Col, Typography, Statistic } from 'antd'
import { ContainerOutlined } from '@ant-design/icons'

import Card from 'antd/lib/card/Card'
import SubBanner from './subBanner'
import { useSelector } from 'react-redux'
import { AppState } from 'store'
import CreatePool from 'components/createPool'

const Home = () => {
 

  return (
    <Row>
      <Col span="8">
        <CreatePool/>
      </Col>
    </Row>
  )
}

export default Home
