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
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [defaulCategory, setDefaultCategory] = useState('Crypto Projects')
  const [dataSearch, setDataSearch] = useState()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [product, setProduct] = useState()

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
    const dataSearch = await search('search/suggest', { keyword: value })
    setDataSearch(dataSearch?.data?.products)
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
                                            <Row>
                                                <Col span={24}>
                                                    <Form.Item name="keyword">
                                                        <Input
                                                            placeholder='Enter key word....'
                                                            onChange={(e) => handleSearch(e.target.value)}
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
                                        {/* <Col span={8}>
                                            <Form.Item name="category">
                                                <Select
                                                    placeholder="Please select a category"
                                                    defaultValue={defaulCategory}
                                                    onChange={(value) => handleChangeCategory(value)}
                                                >
                                                    {categories?.map((item) => (
                                                        <Option value={item?.name}>{item?.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="amountDislike">
                                                <Select
                                                    placeholder="Please select sub category"
                                                    showSearch
                                                    mode="tags"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                                    filterSort={(optionA, optionB) =>
                                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                    }
                                                    options={subCategories?.map((item) => ({
                                                        value: `${item?.id}`,
                                                        label: item?.name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </Col> */}
                                        {/* <Col span={8}>
                                            <Form.Item name="amountDislike">
                                                <Select
                                                    placeholder="Please select a type"
                                                    defaultValue="great than 1000"
                                                    // onChange={handleChangeType}
                                                >
                                                    <Option value={'great than 1000'}>Great than 1000</Option>
                                                    <Option value={'less than 1000'}>Less than 1000</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col> */}
                                    </Row>
                                </div>
                                {/* <div className='review-button-search'
                                    
                                >
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>Search</Button>
                                        <Button onClick={handleResetForm}>Reset</Button>
                                    </Form.Item>
                                </div> */}
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
