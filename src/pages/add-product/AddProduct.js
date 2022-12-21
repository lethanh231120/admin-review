import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Radio, Button, Space, Select, Checkbox, Card } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { get, post } from '../../api/products'
import { regexFloatNumber } from '../../utils/regex'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCookie, STORAGEKEY } from '../../utils/storage'

import './formAddProduct.scss'

const { Option } = Select
const { TextArea } = Input

const defaultValue = [
    { name: 'type', value: '' },
    { name: 'address', value: '' },
    { name: 'chainId', value: '' },
    { name: 'chainName', value: '' },
    { name: 'symbol', value: '' },
    { name: 'name', value: '' },
    { name: 'category', value: 'Crypto Projects' },
    { name: 'subCategory', value: [] },
    { name: 'newCategory', value: '' },
    { name: 'newSubCategory', value: [] },
    { name: 'image', value: '' },
    { name: 'desc', value: '' },
    { name: 'isWarning', value: false },
    { name: 'isshow', value: false },
    { name: ['evaluate', 'isScam'], value: false },
    { name: ['evaluate', 'reason'], value: '' },
    { name: ['evaluate', 'sources'], value: [] },
    { name: ['evaluate', 'userId'], value: '' },
    { name: ['evaluate', 'userName'], value: [] },
    { name: ['evaluate', 'userRole'], value: [] },
    { name: ['evaluate', 'isVerify'], value: false },
    { name: ['detail', 'marketcap'], value: '' },
    { name: ['detail', 'totalSupply'], value: '' },
    { name: ['detail', 'maxSupply'], value: '' },
    { name: ['detail', 'volumeTrading'], value: '' },
    { name: ['detail', 'holder'], value: '' },
    { name: 'contract', value: [] },
    { name: 'moreInfo', value: [] },
    { name: 'founders', value: [] },
    { name: 'funds', value: [] },
    { name: ['community', 'facebook'], value: [] },
    { name: ['community', 'twitter'], value: [] },
    { name: ['community', 'discord'], value: [] },
    { name: ['community', 'telegram'], value: [] },
    { name: ['community', 'instagram'], value: [] },
    { name: ['community', 'youtube'], value: [] },
    { name: 'communities', value: [] },
    { name: ['sourceCode', 'bitbucket'], value: [] },
    { name: ['sourceCode', 'github'], value: [] },
    { name: 'sourceCodes', value: [] },
    { name: 'decimals', value: [] },
    { name: 'websites', value: [] },
    { name: ['website', 'announcement'], value: [] },
    { name: ['website', 'blockchainSite'], value: [] },
    { name: ['website', 'homepage'], value: [] }
]

const AddProduct = () => {
  const navigate = useNavigate()
  const userInfo = getCookie(STORAGEKEY.USER_INFO)
  const TYPE_COIN = 'coin'
  const TYPE_TOKEN = 'token'
  const TYPE_PROJECT = 'project'
  const TYPE_ICO = 'ico'
  const [form] = Form.useForm()
  const [openReason, setOpenReason] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [defaultCategory, setDefaultCategory] = useState(1)
  const [params, setParams] = useState([])


  const TYPE_CHOOSE_CATEGORY = 'choose category'
  const TYPE_ADD_CATEGORY = 'add category'
  const [typeCategory, setTypeCategory] = useState(TYPE_CHOOSE_CATEGORY)
  const [disableSubCategory, setDisableSubCategory] = useState('')

  console.log(userInfo)
  const onFinish = async(values) => {
    console.log('values', values)
    const regex = /^[0-9]*$/
    const {
        communities,
        community,
        decimals,
        detail,
        // evaluate,
        founders,
        funds,
        sourceCode,
        sourceCodes,
        moreInfo,
        category,
        subCategory,
        // contract,
        symbol,
        website,
        websites,
        ...rest
    } = values
    let body = {}
    const listSub = []

    console.log(values)
    subCategory?.forEach((item) => {
        if (item.match(regex)) {
            const newItem = subCategories?.find((itemSub) => itemSub?.id === parseInt(item))
            listSub.push(newItem?.name)
        } else {
            listSub.push(`new:${item}`)
        }
    })

    const newCommunity = { ...community }
    communities?.forEach((item) => {
        newCommunity[`${item?.key}`] = item?.value
    })

    const newDecimals = {}
    decimals?.forEach((item) => {
        newDecimals[`${item?.chain}`] = {
            'contract_address': item?.contract_address,
            'decimal_place': item?.decimal_place
        }
    })

    const newSource = { ...sourceCode }
    sourceCodes?.forEach((item) => {
        newSource[`${item?.key}`] = item?.value
    })

    const newWebsite = { ...website }
    websites?.forEach((item) => {
        newWebsite[`${item?.key}`] = item?.value
    })

    if (category === undefined) {
        body = {
            ...rest,
            category: '',
            subCategory: [],
            symbol: symbol?.toLowerCase(),
            userId: userInfo?.id,
            userName: userInfo?.userName,
            userRole: `${userInfo?.userrole}`,
            detail:  {
                ...detail,
                community: newCommunity,
                decimals: newDecimals,
                sourceCode: newSource,
                website: newWebsite,
                moreInfo: moreInfo,
                funds: funds,
                founders: founders
            },
        }
    } else {
        body = {
            ...rest,
            category: category,
            newCategory: "",
            subCategory: listSub,
            newSubCategory: [],
            symbol: symbol?.toLowerCase(),
            userId: userInfo?.id,
            userName: userInfo?.userName,
            userRole: `${userInfo?.userrole}`,
            detail:  {
                ...detail,
                community: newCommunity,
                decimals: newDecimals,
                sourceCode: newSource,
                website: newWebsite,
                moreInfo: moreInfo,
                funds: funds,
                founders: founders
            },
        }
    }
    console.log(body)
    await post('reviews/product/add', body)
    navigate('../../dashboard')
  }

  const handleChangeCategory = (value) => {
    const category = categories?.find((item) => item?.name === value)
    setDefaultCategory(category?.id)
  }

  const handleChangeType = (value) => {
    if (value === TYPE_COIN) {
        const category = categories?.find((item) => item?.name === 'Blockchain Games')
        setDefaultCategory(category?.id)
        form.setFieldsValue({ "category": category?.name })
    }
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
        const subCategory = await get(`reviews/sub-category/categoryId=${defaultCategory}`)
        setSubCategories(subCategory?.data?.subCategories)
    }
    getSubCategory()
  }, [defaultCategory])

  useEffect(() => {
    const getParams = async() => {
        const tokens = await get(`reviews/product/list-value-fields`)
        const chainName = tokens?.data?.chainName?.filter((item) => item !== '')
        const newParams = {
            ...tokens?.data,
            chainName: chainName,
        }
        setParams(newParams)
    }
    getParams()
  }, [])

  return (
    <div className='form-add'>
        <Form
            form={form}
            onFinish={onFinish}
            fields={defaultValue}
        >
            <div className='form-add-title'>Submit Product Infomation</div>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card
                    title={<span className='form-add-card-title'>Project Info</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Type:</div>
                        <Form.Item
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Enter a valid market cap!',
                                }
                            ]}
                        >
                            <Select
                                placeholder="Please select a type"
                                onChange={handleChangeType}
                            >
                                <Option value={TYPE_COIN}>Coin</Option>
                                <Option value={TYPE_TOKEN}>Token</Option>
                                <Option value={TYPE_PROJECT}>Project</Option>
                                <Option value={TYPE_ICO}>ICO</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Contract Address:</div>
                        <Form.Item name="address">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Chain ID:</div>
                        <Form.Item name="chainId">
                            <Input type='number'/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Chain Name:</div>
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
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Symbol:</div>
                        <Form.Item name="symbol">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Project Name:</div>
                        <Form.Item name="name">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>
                            <div>
                                <span
                                    style={{
                                        color: typeCategory === TYPE_CHOOSE_CATEGORY ? 'blue' : '',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setTypeCategory(TYPE_CHOOSE_CATEGORY)}
                                >
                                    Choose Category
                                </span>
                                <span> / </span>
                                <span
                                    style={{
                                        color: typeCategory === TYPE_ADD_CATEGORY ? 'blue' : '',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setTypeCategory(TYPE_ADD_CATEGORY)}
                                >
                                    Add Category:
                                </span>    
                            </div>
                        </div>
                        <Form.Item
                            name={`${typeCategory === TYPE_CHOOSE_CATEGORY ? 'category' : 'newCategory'}`}
                        >
                            {typeCategory === TYPE_CHOOSE_CATEGORY ? (
                                <Select
                                    placeholder="Please select category"
                                    onChange={(value) => handleChangeCategory(value)}
                                    defaultValue={defaultCategory}
                                >
                                    {categories?.map((item) => (
                                        <Option key={item?.id} value={item?.name}>{item?.name}</Option>
                                    ))}
                                </Select>
                            ) : <Input
                                placeholder='Enter new Category'
                                onChange={(e) => setDisableSubCategory(e.target.value)}
                            />}
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>
                            {(typeCategory === TYPE_CHOOSE_CATEGORY) ? 'Sub Category' : 'New Sub Category'}:
                        </div>
                        <Form.Item
                            name={`${typeCategory === TYPE_CHOOSE_CATEGORY ? 'subCategory' : 'newSubCategory'}`}
                        >
                            {typeCategory === TYPE_CHOOSE_CATEGORY ? (
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
                                    
                            ) : 
                                <Select
                                    placeholder="Please select category"
                                    mode="tags"
                                    disabled={disableSubCategory === ''}
                                />
                            }
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Link Image:</div>
                        <Form.Item
                            name="image"
                        >
                            <Input placeholder='https://'/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Description:</div>
                        <Form.Item name='desc'>
                            <TextArea placeholder="Enter Description" rows={4}/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Warning:</div>
                        <Form.Item name="isWarning" valuePropName="checked">
                            <Checkbox>Warning</Checkbox>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Show:</div>
                        <Form.Item name="isshow" valuePropName="checked">
                            <Checkbox>Show</Checkbox>
                        </Form.Item>
                    </div>
                </Card>

                {/* <Card
                    title={<span className='form-add-card-title'>Categories</span>}
                    bordered={true}
                >
                    <Form.List name="categories">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={23}>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Choose Category</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'category']}
                                            >
                                                <Select
                                                    placeholder="Please select sub category"
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                                    filterSort={(optionA, optionB) =>
                                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                    }
                                                    options={categories?.map((item) => ({
                                                        value: `${item?.id}`,
                                                        label: item?.name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Sub Category</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'subCategory']}
                                            >
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
                                        </div>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Category
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card> */}

                {/* contract */}
                <Card
                    title={<span className='form-add-card-title'>Contract</span>}
                    bordered={true}
                >
                    <Form.List name="contract">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={23}>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Chain Name:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'chainName']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing name',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter Founder Name" />
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Chain ID:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'chainId']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing name',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter chain id" />
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>address:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'address']}
                                            >
                                                <Input placeholder="Enter address" />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Contract
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>

                {/* more info */}
                <Card
                    title={<span className='form-add-card-title'>More Info</span>}
                    bordered={true}
                >
                    <Row>
                        <Col span={24}>
                            <Form.List name="moreInfo">
                                {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{ display: 'flex', marginBottom: 8 }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing key',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter key" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'value']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing value',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter Value" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add More Info
                                        </Button>
                                    </Form.Item>
                                </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                </Card>

                {/* founders */}
                <Card
                    title={<span className='form-add-card-title'>Founder</span>}
                    bordered={true}
                >
                    <Form.List name="founders">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={23}>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Founder Name:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing name',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter Founder Name" />
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Social:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'social']}
                                            >
                                                <Select
                                                    placeholder="Enter multiple link social"
                                                    mode="tags"
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Founder
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>
                
                {/* funds */}
                <Card
                    title={<span className='form-add-card-title'>Funds</span>}
                    bordered={true}
                >
                    <Form.List name="funds">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={23}>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Fund Name:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing name',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter name" />
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Link Image:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'image']}
                                                rules={[
                                                    {
                                                        type: 'url',
                                                        message: 'Enter a valid url image!',
                                                    }
                                                ]}
                                            >
                                                <Input placeholder='Enter Link Image'/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Fund
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>
                
                {/* // detail */}
                <Card
                    title={<span className='form-add-card-title'>Project Detail</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Market Cap:</div>
                        <Form.Item
                            name={['detail', 'marketcap']}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Total Supply:</div>
                        <Form.Item
                            name={['detail', 'totalSupply']}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Max Supply:</div>
                        <Form.Item
                            name={['detail', 'maxSupply']}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Volumn Trading:</div>
                        <Form.Item
                            name={['detail', 'volumeTrading']}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Holders:</div>
                        <Form.Item
                            name={['detail', 'holder']}
                            rules={[
                                {
                                    message: 'Enter a valid number holder!',
                                    pattern: new RegExp(regexFloatNumber)
                                }
                            ]}
                        >
                            <Input placeholder="Enter Holders" />
                        </Form.Item>
                    </div>
                </Card>
        
                {/* community */}
                <Card
                    title={<span className='form-add-card-title'>Community</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Facebook:</div>
                        <Form.Item
                            name={['community', 'facebook']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Twitter:</div>
                        <Form.Item
                            name={['community', 'twitter']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Discord:</div>
                        <Form.Item
                            name={['community', 'discord']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Telegram:</div>
                        <Form.Item
                            name={['community', 'telegram']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Instagram:</div>
                        <Form.Item
                            name={['community', 'instagram']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Youtube:</div>
                        <Form.Item
                            name={['community', 'youtube']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <Form.List name="communities">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'key']}
                                            rules={[
                                                {
                                                required: true,
                                                message: 'Missing key',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter key" />
                                        </Form.Item>
                                    </div>
                                    <div className='form-add-new'>
                                        <div className='form-add-new-item'>
                                            <div className='form-add-item'>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: 'Missing value',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Enter Link url"
                                                        mode="tags"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </div>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Community
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>

                {/* source code */}
                <Card
                    title={<span className='form-add-card-title'>Source Code</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Bit Bucket:</div>
                        <Form.Item
                            name={['sourceCode', 'bitbucket']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Github:</div>
                        <Form.Item
                            name={['sourceCode', 'github']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <Form.List name="sourceCodes">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'key']}
                                            rules={[
                                                {
                                                required: true,
                                                message: 'Missing key',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter key" />
                                        </Form.Item>
                                    </div>
                                    <div className='form-add-new'>
                                        <div className='form-add-new-item'>
                                            <div className='form-add-item'>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: 'Missing value',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Enter Link url"
                                                        mode="tags"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </div>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Source Code
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>
                
                {/* decimals */}
                <Card
                    title={<span className='form-add-card-title'>Decimals</span>}
                    bordered={true}
                >
                    <Form.List name="decimals">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={24} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Col span={23}>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Chain Name:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'chain']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing chain name',
                                                    },
                                                ]}
                                            >
                                            <Input placeholder="Enter chain name" />
                                        </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Contract Address:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'contract_address']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing contract address',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter contract address"/>
                                            </Form.Item>
                                        </div>
                                        <div className='form-add-item'>
                                            <div className='form-add-item-label'>Decimal:</div>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'decimal_place']}
                                                rules={[
                                                    {
                                                    required: true,
                                                    message: 'Missing decimal',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter decimal"/>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Decimal
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>
                
                {/* website */}
                <Card
                    title={<span className='form-add-card-title'>Website</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Announcement:</div>
                        <Form.Item
                            name={['website', 'announcement']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Blockchain Site:</div>
                        <Form.Item
                            name={['website', 'blockchainSite']}
                        >
                            <Select
                                placeholder="Enter link blockchain site"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Homepage:</div>
                        <Form.Item
                            name={['website', 'homepage']}
                        >
                            <Select
                                placeholder="Enter Link url"
                                mode="tags"
                            />
                        </Form.Item>
                    </div>
                    <Form.List name="websites">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'key']}
                                            rules={[
                                                {
                                                required: true,
                                                message: 'Missing key',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter key" />
                                        </Form.Item>
                                    </div>
                                    <div className='form-add-new'>
                                        <div className='form-add-new-item'>
                                            <div className='form-add-item'>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'value']}
                                                    rules={[
                                                        {
                                                        required: true,
                                                        message: 'Missing value',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Enter Link url"
                                                        mode="tags"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </div>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" style={{ width: 'fit-content' }} onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add New Source Code
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Card>

                <Card
                    title={<span className='form-add-card-title'>Conclusion</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Evaluate:</div>
                        <Form.Item name={['evaluate', 'isScam']}>
                            <Radio.Group value={openReason} buttonStyle="solid" onChange={(e) => setOpenReason(e.target.value)}>
                                <Radio.Button value={false}>Not Scam</Radio.Button>
                                <Radio.Button value={true}>Scam</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {(openReason === true) && (
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Reason:</div>
                            <Form.Item name={['evaluate', 'reason']}>
                                <TextArea placeholder='Enter reason project evaluate ...' rows={5}/>
                            </Form.Item>
                        </div>
                    )}
                    {(openReason === true) && (
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Source:</div>
                            <Form.Item name={['evaluate', 'sources']}>
                                <Select
                                    placeholder="https://"
                                    mode="tags"
                                />
                            </Form.Item>
                        </div>
                    )}
                    {(openReason === true) && (
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Verify:</div>
                            <Form.Item name={['evaluate', 'isVerify']} valuePropName="checked">
                                <Checkbox>Verify</Checkbox>
                            </Form.Item>
                        </div>
                    )}
                </Card>
            </Space>

            <Form.Item>
                <Button type='primary' htmlType='submit' style={{ marginTop: '20px' }}>Add Project</Button>
            </Form.Item>
        </Form>
    </div>
  )
}

export default AddProduct
