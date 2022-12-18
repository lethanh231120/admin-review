import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Radio, Button, Space, Select, Checkbox, Card } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { get, post } from '../../api/products'
import { regexFloatNumber } from '../../utils/regex'
import { useNavigate } from 'react-router-dom'

import './formAddProduct.scss'

const { Option } = Select
const { TextArea } = Input

const defaultValue = [
    { name: 'address', value: '' },
    { name: 'chainId', value: '' },
    { name: 'decimals', value: '' },
    { name: 'image', value: '' },
    // { name: 'isVerify', value: false },
    { name: 'marketCap', value: '' },
    { name: 'maxSupply', value: '' },
    { name: 'name', value: '' },
    { name: 'symbol', value: '' },
    { name: 'totalSupply', value: '' },
    { name: 'type', value: '' },
    { name: 'volumeTrading', value: '' },
    { name: 'category', value: 'Crypto Projects' },
    { name: 'newCategory', value: '' },
    { name: 'subCategory', value: [] },
    { name: 'newSubCategory', value: [] },
    { name: 'founders', value: [] },
    { name: 'funds', value: [] },
    { name: ['detail', 'description'], value: '' },
    { name: ['detail', 'holders'], value: '' },
    { name: ['detail', 'sourceCode'], value: '' },
    { name: ['detail', 'website'], value: '' },
    { name: 'moreInfo', value: [] },
    { name: ['community', 'discord'], value: '' },
    { name: ['community', 'facebook'], value: '' },
    { name: ['community', 'telegram'], value: '' },
    { name: ['community', 'instagram'], value: '' },
    { name: ['community', 'twitter'], value: '' },
    { name: ['evaluate', 'isScam'], value: false },
    { name: ['evaluate', 'reason'], value: '' },
    { name: ['evaluate', 'sources'], value: [] },
    { name: ['evaluate', 'userId'], value: '' },
    { name: ['evaluate', 'userName'], value: [] },
    { name: ['evaluate', 'userRole'], value: [] },
    { name: ['evaluate', 'isVerify'], value: false }
]

const AddProduct = () => {
  const navigate = useNavigate()
  const TYPE_COIN = 'coin'
  const TYPE_TOKEN = 'token'
  const TYPE_PROJECT = 'project'
  const TYPE_ICO = 'ico'
  const TYPE_CHOOSE_CATEGORY = 'choose category'
  const TYPE_ADD_CATEGORY = 'add category'
  const [form] = Form.useForm()
  const [openReason, setOpenReason] = useState(false)
  const [typeCategory, setTypeCategory] = useState(TYPE_CHOOSE_CATEGORY)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [defaultCategory, setDefaultCategory] = useState(1)
  const [disableSubCategory, setDisableSubCategory] = useState('')

  const onFinish = async(values) => {
    const regex = /^[0-9]*$/
    const { detail, community, moreInfo, evaluate, category, subCategory, funds, founders, ...rest } = values
    let body = {}
    const listSub = []

    subCategory?.forEach((item) => {
        if (item.match(regex)) {
            const newItem = subCategories?.find((itemSub) => itemSub?.id === parseInt(item))
            listSub.push(newItem?.name)
        } else {
            listSub.push(`new:${item}`)
        }
    })
    if (category === undefined) {
        body = {
            ...rest,
            category: '',
            subCategory: [],
            detail:  {
                ...detail,
                community: community,
                moreInfo: moreInfo,
                funds: funds,
                founders: founders
            },
            evaluate: {
                ...evaluate,
                userId: 1,
                userName: 'lethanh',
                userRole: 'admin'
            }
        }
    } else {
        body = {
            ...rest,
            category: category,
            newCategory: "",
            subCategory: listSub,
            newSubCategory: [],
            detail:  {
                ...detail,
                community: community,
                moreInfo: moreInfo,
                funds: funds,
                founders: founders
            },
            evaluate: {
                ...evaluate,
                userId: 1,
                userName: 'lethanh',
                userRole: 'admin'
            }
        }
    }
    console.log(body)
    await post('reviews/research/add-product', body)
    navigate('../../products')
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

  const handleChangeCategory = (value) => {
    const category = categories?.find((item) => item?.name === value)
    setDefaultCategory(category?.id)
  }

  useEffect(() => {
    const getSubCategory = async() => {
        const subCategory = await get(`reviews/sub-category/categoryId=${defaultCategory}`)
        setSubCategories(subCategory?.data?.subCategories)
    }
    getSubCategory()
  }, [defaultCategory])

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
                        <Form.Item name="type">
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
                        <div className='form-add-item-label'>Decimal:</div>
                        <Form.Item name="decimals">
                            <Input type='number'/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Market Cap:</div>
                        <Form.Item
                            name="marketCap"
                            rules={[
                                {
                                    message: 'Enter a valid market cap!',
                                    pattern: new RegExp(regexFloatNumber)
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Total Supply:</div>
                        <Form.Item
                            name="totalSupply"
                            rules={[
                            {
                                message: 'Enter a valid total supply!',
                                pattern: new RegExp(regexFloatNumber)
                            }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Max Supply:</div>
                        <Form.Item
                            name="maxSupply"
                            rules={[
                                {
                                    message: 'Enter a valid max supply!',
                                    pattern: new RegExp(regexFloatNumber)
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Volumn Trading:</div>
                        <Form.Item
                            name="volumeTrading"
                            rules={[
                                {
                                    message: 'Enter a valid volumn trading!',
                                    pattern: new RegExp(regexFloatNumber)
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Link Image Project:</div>
                        <Form.Item
                            name="image"
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url image!',
                                }
                            ]}
                        >
                            <Input placeholder='https://'/>
                        </Form.Item>
                    </div>
                    {/* <div className='form-add-item'>
                        <div className='form-add-item-label'>Verify:</div>
                        <Form.Item name="isVerify" valuePropName="checked">
                            <Checkbox>Verify</Checkbox>
                        </Form.Item>
                    </div> */}
                </Card>

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
                
                <Card
                    title={<span className='form-add-card-title'>Project Detail</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Holders:</div>
                        <Form.Item
                            name={['detail', 'holders']}
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
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Website:</div>
                        <Form.Item
                            name={['detail', 'website']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url website!',
                                }
                            ]}
                        >
                            <Input placeholder='https://'/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Source Code:</div>
                        <Form.Item
                            name={['detail', 'sourceCode']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url source sode!',
                                }
                            ]}
                        >
                            <Input placeholder="https://"/>
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Description:</div>
                        <Form.Item name={['detail', 'description']}>
                            <TextArea placeholder="Enter Description" rows={4}/>
                        </Form.Item>
                    </div>
                </Card>
        
                <Card
                    title={<span className='form-add-card-title'>Community</span>}
                    bordered={true}
                >
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Facebook:</div>
                        <Form.Item
                            name={['community', 'facebook']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url facebook!',
                                }
                            ]}
                        >
                            <Input placeholder="https://" />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Twitter:</div>
                        <Form.Item
                            name={['community', 'twitter']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url twitter!',
                                }
                            ]}
                        >
                            <Input placeholder="https://" />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Discord:</div>
                        <Form.Item
                            name={['community', 'discord']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url discord!',
                                }
                            ]}
                        >
                            <Input placeholder="https://" />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Telegram:</div>
                        <Form.Item
                            name={['community', 'telegram']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url telegram!',
                                }
                            ]}
                        >
                            <Input placeholder="https://" />
                        </Form.Item>
                    </div>
                    <div className='form-add-item'>
                        <div className='form-add-item-label'>Instagram:</div>
                        <Form.Item
                            name={['community', 'instagram']}
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Enter a valid url instagram!',
                                }
                            ]}
                        >
                            <Input placeholder="https://" />
                        </Form.Item>
                    </div>
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
