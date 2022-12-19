import React, { useState } from 'react'
import { Row, Col, Card, Layout, Button, Input, Tabs, Form, Image, Select } from 'antd'

import { useNavigate } from 'react-router-dom'
import ListProduct from '../components/product-tab/ListProducts'
import ProductResearch from '../components/product-tab/ProductResearch'
import { search } from '../api/search'
import _ from 'lodash'
import './styles/product.scss'

const { Option } = Select
const { Content } = Layout
const { TabPane } = Tabs

const Products = () => {
  const TYPE_PROJECT = 'project'
  const TYPE_PRODUCT = 'product'
  const TYPE_CRYPTO = 'crypto'
  const [dataSearch, setDataSearch] = useState()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [type, setType] = useState('project')

  const onFinish = (values) => {
    console.log(values)
    form.resetFields()
  }

  const searchData = async(value) => {
    const params = {
        type: type,
        keyword: value
    }
    const dataSearch = await search('search/suggest', params)
    let data = []
    if (type === TYPE_PROJECT) {
        data = dataSearch?.data?.projects
    } 
    if (type === TYPE_PRODUCT) {
        data = dataSearch?.data?.products
    }
    if (type === TYPE_CRYPTO) {
        data = dataSearch?.data?.cryptos
    }
    setDataSearch(data)
    setType('project')
  }

  const handleSearch = _.debounce(searchData, 250)

  const handleDetailProduct = (id) => {
    setDataSearch()
    navigate(`${id}`)
  }

  return (
    <div>
        <Form
            form={form}
            onFinish={onFinish}
        >
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title='Products Research'
                        extra={
                            <>
                                <Button
                                    type='primary'
                                    onClick={() => navigate('../products/add-product')}
                                >
                                    Add product
                                </Button>
                                
                            </>
                        }
                    >
                        <Row>
                            <Col span={22} offset={1}> 
                                <div className='banner-content-form'>
                                    <Row gutter={24}>
                                        <Col span={16} offset={4}>
                                            <Row gutter={12}>
                                                <Col span={4}>
                                                    <Select
                                                        placeholder="Select Type"
                                                        onChange={(value) => setType(value)}
                                                        value={type}
                                                    >
                                                        <Option value={TYPE_PROJECT}>Project</Option>
                                                        <Option value={TYPE_PRODUCT}>Product</Option>
                                                        <Option value={TYPE_CRYPTO}>Crypto</Option>
                                                    </Select>
                                                </Col>
                                                <Col span={20}>
                                                    <Form.Item name="keyword">
                                                        <Input
                                                            placeholder='Enter key word....'
                                                            onChange={(e) => handleSearch(e.target.value)}
                                                            disabled={!type}
                                                            onBlur={() => {
                                                                setDataSearch()
                                                                form.resetFields()
                                                            }}
                                                        />
                                                        <div className={`${dataSearch ? 'active' : ''} banner-content-form-data`}>
                                                        {dataSearch?.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className='banner-content-form-data-item'
                                                                onClick={() => handleDetailProduct(item?.id)}
                                                            >
                                                                <div className='banner-content-form-data-item-data'>
                                                                    <Image src={item?.image} preview={false}/>
                                                                    {item?.name}
                                                                </div>
                                                                <div className='banner-content-form-data-item-category'>
                                                                    {item?.category}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22} offset={1}> 
                                <Content
                                    style={{
                                        borderRadius: '1.2rem',
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        margin: 0
                                    }}
                                >
                                    <Tabs type="card">
                                        <TabPane tab="Product Research" key="1">
                                            <div className="table-responsive">
                                                <ProductResearch/>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Product" key="2">
                                            <div className="table-responsive">
                                                <ListProduct/>
                                            </div>
                                        </TabPane>
                                        {/* <TabPane tab="Pending" key="2">
                                            <div className="table-responsive">
                                                <ProductPending/>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Scam" key="3">
                                            <div className="table-responsive">
                                                <ProductScam/>
                                            </div>
                                        </TabPane> */}
                                    </Tabs>
                                </Content>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export default Products
