import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Typography } from "antd";
import { Layout, Button, Input, Form, Select, Checkbox } from 'antd'
import { get } from '../api/products';

import { useNavigate } from 'react-router-dom'
import ListProduct from '../components/product-tab/ListProducts'
import './styles/product.scss'

const { Content } = Layout
const { Title } = Typography;

const dataDefault = [
  { name: 'name', value: '' },
  { name: 'symbol', value: '' },
  { name: 'address', value: '' },
  { name: 'show', value: true },
  { name: 'scam', value: false }
]

const Home = () => {
  const [metric, setMetric] = useState()
  const dollor = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
        fill="#fff"
      ></path>
      <path
        d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
        fill="#fff"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
        fill="#fff"
      ></path>
    </svg>,
  ];
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [params, setParams] = useState([])
  const [defaultValue, setDefaultValue] = useState(dataDefault)

  const [reloadProduct, setReloadProduct] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [dataSearch, setDataSearch] = useState()
  const [paramsSearch, setParamSearch] = useState()
  const [total, setTotal] = useState(1)
  const [isSearch, setIsSearch] = useState(false)


  const getAll = async() => {
    const product = await get(`reviews/product/all?page=${page}`)
    if (product?.data) {
      setTotal(product?.data?.count)
      setDataSearch(product?.data?.products)
      setReloadProduct(false)
      setLoading(false)
    }
  }

  // filter
  const getDataSearch = async(params) => {
    const dataSearch = await get('reviews/product/filter', params)
    if (dataSearch?.data) {
      setDataSearch(dataSearch?.data?.products)
      setIsSearch(true)
      setTotal(dataSearch?.data?.count)
      setLoading(false)
      setReloadProduct(false)
      setDefaultValue(dataDefault)
    }
  }

  const onFinish = async(values) => {
    setLoading(true)
    const params = {
      ...values,
      name: values?.name?.toLowerCase(),
      symbol: values?.symbol?.toLowerCase(),
      address: values?.address?.toLowerCase(),
      category: values?.category !== undefined ? values?.category?.toLowerCase() : '',
      chainName: values?.chainName !== undefined ? values?.chainName : '',
      src: values?.src !== undefined ? values?.src : '',
      type: values?.type !== undefined ? values?.type : '',
      page: page,
    }
    setParamSearch({
      ...values,
      address: values?.address?.toLowerCase(),
      category: values?.category?.toLowerCase(),
      page: 1
    })
    getDataSearch(params)
    form.resetFields()
  }

  const handleResetForm = () => {
    form.resetFields()
  }
  
  // get param form search
  useEffect(() => {
    const getParams = async() => {
        const tokens = await get(`reviews/product/list-value-fields`)
        const types = []
        tokens?.data?.type?.map((item) => (
          types.push(item?.split(', '))
        ))
        const onlyUnique = (value, index, self) => {
          return (self.indexOf(value) === index && value !== '');
        }
        const unique = types?.flat(1)?.filter(onlyUnique)

        const src = tokens?.data?.src?.filter((item) => item !== '')
        const category = tokens?.data?.category?.filter((item) => item !== '')
        const chainName = tokens?.data?.chainName?.filter((item) => item !== '')
        const newParams = {
            src: src,
            category: category,
            chainName: chainName,
            type: unique
        }
        setParams(newParams)
    }
    getParams()
  }, [])

  // get metric
  useEffect(() => {
    const getMetric = async() => {
      const metric = await get('reviews/metric/all')
      setMetric(metric?.data)
    }
    getMetric()
  }, [])

  useEffect(() => {
    setLoading(true)
    if (isSearch) {
      getDataSearch(paramsSearch)
    } else {
      getAll()
    }
  }, [reloadProduct])

  // get data all
  useEffect(() => {
    !isSearch && getAll()
  }, [page, isSearch])

  return (
    <>
      <div className="layout-content">
        {metric && (
          <Row className="rowgap-vbox" gutter={[24, 0]} style={{ padding: '1rem' }}>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total tokens</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'token')?.count)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total ICOs</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'ico')?.count)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total dapp</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'project')?.count)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Total coins</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'coin')?.count)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Product othes</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.productTypes?.find((item) => item?.type === 'other')?.count)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Scam products</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.scamProduct)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Mod add</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.totalProjectResearch)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Categories</span>
                      <Title level={3}>
                        {new Intl.NumberFormat().format(metric?.categories?.length)}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{dollor}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        )}
        <div>
          <Row style={{ padding: '1rem' }}>
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
                          <Content
                              style={{
                                  borderRadius: '1.2rem',
                                  margin: '2rem 0',
                                  padding: '2rem',
                                  border: '1px solid rgba(0, 0, 0, 0.3)'
                              }}
                          >
                              <Form
                                form={form}
                                onFinish={onFinish}
                                fields={defaultValue}
                              >
                                <Row gutter={24}>
                                  <Col span={8}>
                                      <Form.Item name="name">
                                          <Input
                                            placeholder='Enter token name'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="symbol">
                                          <Input
                                            placeholder='Enter token symbol'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="address">
                                          <Input
                                            placeholder='Enter address'
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="src">
                                          <Select
                                              placeholder="Source"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.src?.map((item) => ({
                                                  value: item,
                                                  label: item,
                                              }))}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="category">
                                          <Select
                                              placeholder="Category"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.category?.map((item) => ({
                                                  value: item,
                                                  label: item,
                                              }))}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="type">
                                          <Select
                                              placeholder="Type"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.type?.map((item) => ({
                                                  value: item,
                                                  label: item,
                                              }))}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="chainName">
                                          <Select
                                              placeholder="Chain name"
                                              showSearch
                                              optionFilterProp="children"
                                              filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                              filterSort={(optionA, optionB) =>
                                                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                              }
                                              options={params?.chainName?.map((item) => ({
                                                  value: item,
                                                  label: item,
                                              }))}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="show" valuePropName="checked">
                                          <Checkbox>Show</Checkbox>
                                      </Form.Item>
                                  </Col>
                                  <Col span={8}>
                                      <Form.Item name="scam" valuePropName="checked">
                                          <Checkbox>Scam</Checkbox>
                                      </Form.Item>
                                  </Col>
                                </Row>
                                <div className='review-button-search'>
                                    <Form.Item>
                                        <Button type='primary' htmlType='submit'>Search</Button>
                                        <Button onClick={handleResetForm}>Reset</Button>
                                    </Form.Item>
                                </div>
                              </Form>
                          </Content>
                      </Col>
                    </Row>
                    <Row>
                        <Col span={24}> 
                            <Content
                                style={{
                                    margin: 0
                                }}
                            >
                                <ListProduct
                                  dataSearch={dataSearch}
                                  loading={loading}
                                  setReloadProduct={setReloadProduct}
                                  page={page}
                                  setPage={setPage}
                                  total={total}
                                />
                            </Content>
                        </Col>
                    </Row>
                </Card>
              </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;
