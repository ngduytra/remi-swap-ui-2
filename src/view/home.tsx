import { Row, Col} from 'antd'

import CreatePool from 'components/createPool'
import ListPool from 'components/listPool'

const Home = () => {
 

  return (
    <Row justify={"center"} gutter={[36, 36]}>
      <Col span="16">
        <CreatePool/>
      </Col>
      <Col span="16">
        <ListPool/>
      </Col>
    </Row>
  )
}

export default Home
