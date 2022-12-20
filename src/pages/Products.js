import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Layout, Button, Input, Select, Tabs, Form, Image } from 'antd'

// import ProductPending from '../components/product-tab/ProductPending'
// import ProductScam from '../components/product-tab/ProductScam'
import { useNavigate } from 'react-router-dom'
import Verify from '../components/product-tab/ListProject'
import { get } from '../api/products'
import { search } from '../api/search'
import _ from 'lodash'
import './styles/product.scss'

const { Content } = Layout
const { TabPane } = Tabs
const { Option } = Select

const Products = () => {
  const TYPE_PROJECT = 'project'
  const TYPE_PRODUCT = 'product'
  const TYPE_CRYPTO = 'crypto'
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [defaulCategory, setDefaultCategory] = useState('Crypto Projects')
  const [dataSearch, setDataSearch] = useState()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [product, setProduct] = useState()
  const [type, setType] = useState('project')

//   const handleResetForm = () => {
//     form.resetFields()
//   }

  const onFinish = (values) => {
    form.resetFields()
  }

  useEffect(() => {
    const getCategory = async() => {
        const categories = await get('reviews/category')
        setCategories(categories?.data?.categories)
    }
    getCategory()
  }, [])

  useEffect(() => {
    const getSubCategory = async() => {
        const category = categories?.find((item) => item?.name === defaulCategory)
        const subCategory = await get(`reviews/sub-category/categoryId=${category?.id}`)
        setSubCategories(subCategory?.data?.subCategories)
    }
    getSubCategory()
  }, [defaulCategory, categories])

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
    // const dataSearch = await search('search/suggest', { keyword: value })
    // setDataSearch(dataSearch?.data?.products)
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
                        title='Products'
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
                                            <Row gutter={16}>
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
                                        <TabPane tab="List Project" key="1">
                                            <div className="table-responsive">
                                                <Verify dataSearch={dataSearch}/>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Pending" key="2">
                                            <div className="table-responsive">
                                                {/* <ProductPending/> */}
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Scam" key="3">
                                            <div className="table-responsive">
                                                {/* <ProductScam/> */}
                                            </div>
                                        </TabPane>
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

