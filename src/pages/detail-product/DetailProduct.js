import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button, Space, Select, Card, Image } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { get, patch } from '../../api/products'
import { regexFloatNumber } from '../../utils/regex'
import { useParams } from 'react-router-dom'

const { Option } = Select
const { TextArea } = Input

const DetailProduct = () => {
    const { productId } = useParams()
    const TYPE_COIN = 'coin'
    const TYPE_TOKEN = 'token'
    const TYPE_PROJECT = 'project'
    const TYPE_CHOOSE_CATEGORY = 'choose category'
    const TYPE_ADD_CATEGORY = 'add category'
    const [form] = Form.useForm()

    const [categories, setCategories] = useState([])
    const [typeCategory, setTypeCategory] = useState(TYPE_CHOOSE_CATEGORY)
    const [defaultCategory, setDefaultCategory] = useState(1)
    const [subCategories, setSubCategories] = useState([])
    const [disableSubCategory, setDisableSubCategory] = useState('')
    const [isEditProduct, setIsEditProduct] = useState(false)
    const [productInfo, setProductInfo] = useState([])
    const [reloadData, setReloadData] = useState(false)

    // const navigate = useNavigate()

    const onFinish = async(values) => {
        const regex = /^[0-9]*$/
        const { detail, community, moreInfo, category, subCategory, funds, founders, ...rest } = values
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
                }
            }
        }
        console.log(body)
        await patch(`reviews/research/update/projectId=${productId}`, body)
        setReloadData(true)
        setIsEditProduct(false)
      }
    
    const handleChangeType = (value) => {
        if (value === TYPE_COIN) {
            const category = categories?.find((item) => item?.name === 'Crypto Projects')
            setDefaultCategory(category?.id)
            form.setFieldsValue({ "category": category?.name })
        }
    }
      
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

    useEffect(() => {
        const getCategory = async() => {
            const categories = await get('reviews/category')
            setCategories(categories?.data?.categories)
        }
        getCategory()
    }, [])

    useEffect(() => {
        const getDataProduct = async() => {
            const abc = await get(`reviews/research/projectId=${productId}`)
            setProductInfo(abc?.data)
        }
        getDataProduct()
    }, [productId, reloadData])

    const defaultValue = [
        { name: 'address', value: productInfo?.[0]?.address },
        { name: 'chainId', value: productInfo?.[0]?.chainId },
        { name: 'decimals', value: productInfo?.[0]?.decimals },
        { name: 'image', value: productInfo?.[0]?.image },
        // { name: 'isVerify', value: productInfo?.[0]?.isVerify },
        { name: 'marketCap', value: productInfo?.[0]?.marketCap },
        { name: 'maxSupply', value: productInfo?.[0]?.maxSupply },
        { name: 'name', value: productInfo?.[0]?.name },
        { name: 'symbol', value: productInfo?.[0]?.symbol },
        { name: 'totalSupply', value: productInfo?.[0]?.totalSupply },
        { name: 'type', value: productInfo?.[0]?.type },
        { name: 'volumeTrading', value: productInfo?.[0]?.volumnTrading },
        { name: 'category', value: productInfo?.[0]?.category },
        { name: 'newCategory', value: productInfo?.[0]?.newCategory },
        { name: 'subCategory', value: (productInfo?.[0]?.subCategory !== '') ?productInfo?.[0]?.subCategory?.split(',') : [] },
        { name: 'newSubCategory', value: [] },
        { name: 'founders', value: productInfo[0]?.detail?.founders },
        { name: 'funds', value: productInfo[0]?.detail?.funds },
        { name: ['detail', 'description'], value: productInfo?.[0]?.detail?.description },
        { name: ['detail', 'holders'], value: productInfo?.[0]?.detail?.holders },
        { name: ['detail', 'sourceCode'], value: productInfo?.[0]?.detail?.sourceCode },
        { name: ['detail', 'website'], value: productInfo?.[0]?.detail?.website },
        { name: 'moreInfo', value: productInfo?.[0]?.detail?.moreInfo},
        { name: ['community', 'discord'], value: productInfo?.[0]?.detail?.community?.discord },
        { name: ['community', 'facebook'], value: productInfo?.[0]?.detail?.community?.facebook },
        { name: ['community', 'telegram'], value: productInfo?.[0]?.detail?.community?.telegram },
        { name: ['community', 'instagram'], value: productInfo?.[0]?.detail?.community?.instagram },
        { name: ['community', 'twitter'], value: productInfo?.[0]?.detail?.community?.twitter }
    ]

    return (
        <>
            <div className='form-add'>
                <Form
                    form={form}
                    onFinish={onFinish}
                    fields={defaultValue}
                >
                    <div className='form-add-title'>Detail Product Infomation</div>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Card
                            title={<span className='form-add-card-title'>Project Info</span>}
                            bordered={true}
                            extra={<Button
                                type='primary'
                                onClick={() => setIsEditProduct(true)}
                            >
                                Edit Product
                            </Button>}
                        >
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Type:</div>
                                {isEditProduct ? (
                                    <Form.Item name="type">
                                        <Select
                                            placeholder="Please select a type"
                                            onChange={handleChangeType}
                                        >
                                            <Option value={TYPE_COIN}>Coin</Option>
                                            <Option value={TYPE_TOKEN}>Token</Option>
                                            <Option value={TYPE_PROJECT}>Project</Option>
                                        </Select>
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.type?.toUpperCase()}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Contract Address:</div>
                                {isEditProduct ? (
                                    <Form.Item name="address">
                                        <Input />
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.address}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Chain ID:</div>
                                {isEditProduct ? (
                                    <Form.Item name="chainId">
                                        <Input type='number'/>
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.chainId}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Symbol:</div>
                                {isEditProduct ? (
                                    <Form.Item name="symbol">
                                        <Input />
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.symbol}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Project Name:</div>
                                {isEditProduct ? (
                                    <Form.Item name="name">
                                        <Input />
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.name}</span>)}
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
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.category}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>
                                    {(typeCategory === TYPE_CHOOSE_CATEGORY) ? 'Sub Category' : 'New Sub Category'}:
                                </div>
                                {isEditProduct ? (
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
                                ) : (<span>
                                    {productInfo[0]?.subCategory}
                                </span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Decimal:</div>
                                {isEditProduct ? (
                                    <Form.Item name="decimals">
                                        <Input type='number'/>
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.decimals}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Market Cap:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.marketCap}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Total Supply:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.totalSupply}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Max Supply:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.maxSupply}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Volumn Trading:</div>
                                {isEditProduct ? (
                                    <Form.Item
                                        name="volumnTrading"
                                        rules={[
                                            {
                                                message: 'Enter a valid volumn trading!',
                                                pattern: new RegExp(regexFloatNumber)
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.volumeTrading}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Link Image Project:</div>
                                {isEditProduct ? (
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
                                ) : (<span>
                                    <Image src={productInfo[0]?.image} preview={false}/>
                                </span>)}
                            </div>
                        </Card>
                        
                        <Card
                            title={<span className='form-add-card-title'>More Info</span>}
                            bordered={true}
                        >
                            <Row>
                                <Col span={24}>
                                    {isEditProduct ? (
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
                                    ) : (
                                        <>
                                            {productInfo[0]?.detail?.moreInfo?.map((item) => (
                                                <div>{item?.key}: <span>{item?.value}</span></div>
                                            ))}
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                
                        <Card
                            title={<span className='form-add-card-title'>Founder</span>}
                            bordered={true}
                        >
                            {isEditProduct ? (
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
                            ) : (
                                <>
                                    {productInfo[0]?.detail?.founders?.map((item) => (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>{item?.name}: 
                                            <span style={{ marginLeft: '1rem' }}>
                                                {item?.social?.map((itemLink) => (
                                                    <div>{itemLink}</div>
                                                ))}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Card>
                        
                        <Card
                            title={<span className='form-add-card-title'>Funds</span>}
                            bordered={true}
                        >
                            {isEditProduct ? (
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
                            ) : (
                                <>
                                    {productInfo[0]?.detail?.funds?.map((item) => (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {item?.name}: 
                                            <Image src={item?.image} preview={false}/>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Card>
                        
                        <Card
                            title={<span className='form-add-card-title'>Project Detail</span>}
                            bordered={true}
                        >
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Holders:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.holders}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Website:</div>
                                {isEditProduct ? (
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
                                ) : (<a href={productInfo[0]?.detail?.website} target='_blank'  rel="noreferrer">{productInfo[0]?.detail?.website}</a>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Source Code:</div>
                                {isEditProduct ? (
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
                                ) : (<a href={productInfo[0]?.detail?.sourceCode} target='_blank'  rel="noreferrer">{productInfo[0]?.detail?.sourceCode}</a>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Description:</div>
                                {isEditProduct ? (
                                    <Form.Item name={['detail', 'description']}>
                                        <TextArea placeholder="Enter Description" rows={4}/>
                                    </Form.Item>
                                ) : (<span>{productInfo[0]?.detail?.description}</span>)}
                            </div>
                        </Card>
                
                        <Card
                            title={<span className='form-add-card-title'>Community</span>}
                            bordered={true}
                        >
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Facebook:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.community?.facebook}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Twitter:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.community?.twitter}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Discord:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.community?.discord}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Telegram:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.community?.telegram}</span>)}
                            </div>
                            <div className='form-add-item'>
                                <div className='form-add-item-label'>Instagram:</div>
                                {isEditProduct ? (
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
                                ) : (<span>{productInfo[0]?.detail?.community?.instagram}</span>)}
                            </div>
                        </Card>

                        {isEditProduct ? '' : (
                            <Card
                                title={<span className='form-add-card-title'>Conclusion</span>}
                                bordered={true}
                            >
                                <div className='form-add-item'>
                                    {isEditProduct ? (<></>) : (
                                        <>
                                            {productInfo[1]?.evaluates?.map((item) => (
                                                <>
                                                    <div>
                                                        <div>Is Scam: {item?.isScam ? 'TRUE' : 'FALSE'}</div>
                                                        {item?.isScam && (
                                                            <>
                                                                <div>Reason: {item?.reason}</div>
                                                                <div>Source:
                                                                    <a href={item?.sources} target='_blank' rel="noreferrer">
                                                                        {item?.sources}
                                                                    </a>
                                                                </div>
                                                                <div>Verify: {item?.isVerify ? 'TRUE' : 'FALSE'}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </Card>
                        )}
                    </Space>

                    {isEditProduct && (
                        <Form.Item>
                            <Button type='primary' htmlType='submit' style={{ marginTop: '20px' }}>Update Project</Button>
                        </Form.Item>
                    )}
                </Form>
            </div>
        </>
    )
}

export default DetailProduct
