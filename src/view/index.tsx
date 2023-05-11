import React, {  useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Col, Layout, Row } from 'antd'
import { Content, Footer } from 'antd/lib/layout/layout'
import Banner from './banner'
import Home from './home'
import UILoader from 'uiloader'
import Aos from 'aos'
import PoolWatcher from 'watcher/pool.watcher'
import 'aos/dist/aos.css'

const App: React.FC = () => {
  
  useEffect(function () {
    Aos.init({ duration: 1000 })
  }, [])


  return (
    <UILoader>
      <Layout>
        <PoolWatcher/>
        <Content>
          <Row justify="center">
            <Col span={24}>
              <Banner />
            </Col>

            <Col span={24} style={{ minHeight: 350 }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/*" element={<Home />} />
              </Routes>
            </Col>

            <Col span={24}>
              <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2018 Created by Ant UED
              </Footer>
            </Col>
          </Row>
        </Content>
      </Layout>
    </UILoader>
  )
}

export default App
