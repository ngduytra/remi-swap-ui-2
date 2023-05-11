import { Col, Row} from 'antd'
import PoolDetail from './poolDetail'

import { usePools } from 'hooks/usePool'

const ListPool = () => {
  const pools = usePools()

  return (
    <Row wrap gutter={[24,24]} style={{marginBottom: 24}}>
        {
            Object.keys(pools).map(poolAddress=>{
                return (
                    <Col span={24} key={poolAddress}>
                        <PoolDetail poolAddress={poolAddress}/>
                    </Col>
                )
            })
        }
        
    </Row>
        
    
    
  )
}

export default ListPool
