import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Layout, Button, Input, Select, Form } from 'antd'
import TableToken from '../components/table/TableToken'
import { get } from '../api/products'
import _ from 'lodash'

const { Content } = Layout

const Tokens = () => {
  const [params, setParams] = useState([])
  const [dataSearch, setDataSearch] = useState([])
  const [form] = Form.useForm()
  const [page, setPage] = useState(1)
  const [reloadVerify, setReloadVerify] = useState(false)
  const [total, setTotal] = useState(1)
  const [loading, setLoading] = useState(true)

  const handleResetForm = () => {
    form.resetFields()
  }

  const onFinish = async(values) => {
    console.log(values)
    form.resetFields()
  }

  useEffect(() => {
    const getProducts = async() => {
        const tokens = await get(`reviews/list-coin?page=${page}`)
        setDataSearch(tokens?.data?.coins)
        setTotal(tokens?.data?.count)
        setReloadVerify(false)
        setLoading(false)
    }
    getProducts()
  }, [page, reloadVerify])

  useEffect(() => {
    const getParams = async() => {
        const tokens = await get(`reviews/coin/list-value-fields`)
        const types = []
        tokens?.data?.type?.map((item) => (
            types.push(item?.split(', '))
        ))
        const onlyUnique = (value, index, self) => {
            return (self.indexOf(value) === index && value !== '');
        }
        const unique = types?.flat(1)?.filter(onlyUnique)
        const newParams = {
            ...tokens.data,
            type: unique
        }
        setParams(newParams)
    }
    getParams()
  }, [])

  const searchData = async(value) => {
    console.log(value)
    // const dataSearch = await search('search/suggest', { keyword: value })
    // setDataSearch(dataSearch?.data?.products)
  }
  const handleSearch = _.debounce(searchData, 250)

  return (
    <div>
        <Row>
            <Col xs="24" xl={24}>
                <Card
                    bordered={false}
                    className="criclebox tablespace mb-24"
                    title="Products"
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
                                <Row gutter={24}>
                                    <Col span={20} offset={2}>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item name="keyword">
                                                    <Input
                                                        placeholder='Enter Token Name'
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Form form={form} onFinish={onFinish}>
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Form.Item name="src">
                                                <Select
                                                    placeholder="Please select a source"
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
                                            <Form.Item name="type">
                                                <Select
                                                    placeholder="Please select a type"
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
                                                    placeholder="Please select chain name"
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
                        <Col span={22} offset={1}> 
                            <Content
                                style={{
                                    borderRadius: '1.2rem',
                                    border: '1px solid rgba(0, 0, 0, 0.3)',
                                    margin: 0
                                }}
                            >
                                <TableToken
                                    page={page}
                                    setPage={setPage}
                                    setReloadVerify={setReloadVerify}
                                    total={total}
                                    dataSearch={dataSearch}
                                    loading={loading}
                                />
                            </Content>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default Tokens
