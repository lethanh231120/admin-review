import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button, Space, Select, Card, Image, Spin, message, Checkbox } from 'antd'
import { MinusCircleOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { get, patch } from '../../api/products'
import { regexFloatNumber } from '../../utils/regex'
import { useParams, useLocation } from 'react-router-dom'
import _ from 'lodash'
import { getCookie, STORAGEKEY } from '../../utils/storage'

const { Option } = Select
const { TextArea } = Input

const DetailProduct = () => {
    const userInfo = getCookie(STORAGEKEY.USER_INFO)
    const { productId } = useParams()
    const TYPE_COIN = 'coin'
    const TYPE_ICO = 'ico'
    const TYPE_TOKEN = 'token'
    const TYPE_PROJECT = 'project'
    const TYPE_CHOOSE_CATEGORY = 'choose category'
    const TYPE_ADD_CATEGORY = 'add category'
    const [form] = Form.useForm()

    const location = useLocation()
    const [categories, setCategories] = useState([])
    const [typeCategory, setTypeCategory] = useState(TYPE_CHOOSE_CATEGORY)
    const [defaultCategory, setDefaultCategory] = useState()
    const [subCategories, setSubCategories] = useState([])
    const [disableSubCategory, setDisableSubCategory] = useState('')
    const [isEditProduct, setIsEditProduct] = useState(location?.state?.isEdit)
    const [productInfo, setProductInfo] = useState([])
    const [reloadData, setReloadData] = useState(false)
    const [params, setParams] = useState([])
    const [defaultValueForm, setDefaultValueForm] = useState()

    const onFinish = async(values) => {
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
            contract,
            ...rest
        } = values

        let body = {}
        const listSub = []

        subCategory?.forEach((item) => {
            if (item.match(regex)) {
                const newItem = subCategories?.find((itemSub) => itemSub?.id === parseInt(item))
                listSub.push(newItem?.name)
            } else {
                const newItem = subCategories?.find((itemSub) => itemSub?.name === item)
                if (newItem) {
                    console.log('ton tai')
                    listSub.push(item)
                } else {
                    console.log('khong ton tai')
                    listSub.push(`new:${item}`)
                }
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
                contract: { contract: contract },
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
                contract: { contract: contract },
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

        console.log(values)
        console.log(body)
        await patch(`reviews/product/update/productId=${productId}`, body)
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
            const product = await get(`reviews/product/productId=${productId}`)
            setProductInfo([product?.data])
        }
        getDataProduct()
    }, [productId, reloadData])

    // for mat default value for communities, sourceCodes, websites, decimals
    useEffect(() => {
        const communities = []
        productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && Object.keys(productInfo[0]?.detail?.community)?.forEach((key) => {
            if (key !== 'facebook' && key !== 'youtube' && key !== 'telegram' && key !== 'instagram' && key !== 'discord' && key !== 'twitter') {
                communities.push({
                    key: key,
                    value: productInfo[0]?.detail?.community[key]
                })
            }
        })
        const decimals = []
        productInfo[0]?.detail !== null && productInfo[0]?.detail?.decimals && Object.keys(productInfo[0]?.detail?.decimals)?.forEach((key) => {
            decimals.push({
                chain: key,
                ...productInfo[0]?.detail?.decimals[key]
            })
        })
        const sourceCodes = []
        productInfo[0]?.detail !== null && productInfo[0]?.detail?.sourceCode && Object.keys(productInfo[0]?.detail?.sourceCode)?.forEach((key) => {
            if (key !== 'bitbucket' && key !== 'github') {
                sourceCodes.push({
                    key: key,
                    value: productInfo[0]?.detail?.sourceCode[key]
                })
            }
        })
        const websites = []
        productInfo[0]?.detail !== null && productInfo[0]?.detail?.website && Object.keys(productInfo[0]?.detail?.website)?.forEach((key) => {
            if (key !== 'announcement' && key !== 'blockchainSite' && key !== 'homepage') {
                websites.push({
                    key: key,
                    value: productInfo[0]?.detail?.website[key]
                })
            }
        })
        
        const category = categories?.find((item) => item?.name === productInfo[0]?.category)
        if (category === undefined) {
            setDefaultCategory('')
        } else {
            setDefaultCategory(category?.id)
        }

        setDefaultValueForm({
            communities: communities,
            decimals: decimals,
            sourceCodes: sourceCodes,
            websites: websites
        })
    }, [productInfo])

    console.log(productInfo)
    const copyAddress = (e, text) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        message.success({
          content: 'Copy address successfully',
          duration: 3
        })
    }

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

    const defaultValue = [
        { name: 'type', value: productInfo[0]?.type },
        { name: 'address', value: productInfo[0]?.address },
        { name: 'chainId', value: productInfo[0]?.chainId },
        { name: 'chainName', value: productInfo[0]?.chainName },
        { name: 'symbol', value: productInfo[0]?.symbol },
        { name: 'name', value: productInfo[0]?.name },
        { name: 'category', value: productInfo[0]?.category !== null ? productInfo[0]?.category : '' },
        { name: 'subCategory', value: (productInfo[0]?.subcategory !== '') ?productInfo[0]?.subcategory?.split(',') : [] },
        // { name: 'newCategory', value: '' },
        // { name: 'newSubCategory', value: [] },
        { name: 'image', value: productInfo[0]?.image },
        { name: 'desc', value: productInfo[0]?.desc !== null ? productInfo[0]?.desc : ''  },
        { name: 'isWarning', value: productInfo[0]?.isWarning },
        { name: 'isshow', value: productInfo[0]?.isshow },
        { name: ['evaluate', 'isScam'], value: false },
        { name: ['evaluate', 'reason'], value: '' },
        { name: ['evaluate', 'sources'], value: [] },
        { name: ['evaluate', 'userId'], value: '' },
        { name: ['evaluate', 'userName'], value: [] },
        { name: ['evaluate', 'userRole'], value: [] },
        { name: ['evaluate', 'isVerify'], value: false },
        { name: ['detail', 'marketcap'], value: productInfo[0]?.detail !== null ? productInfo[0]?.detail?.marketcap : '' },
        { name: ['detail', 'totalSupply'], value: productInfo[0]?.detail !== null ? productInfo[0]?.detail?.totalSupply : '' },
        { name: ['detail', 'maxSupply'], value: productInfo[0]?.detail !== null ? productInfo[0]?.detail?.maxSupply : ''},
        { name: ['detail', 'volumeTrading'], value: productInfo[0]?.detail !== null ? productInfo[0]?.detail?.volumeTrading : '' },
        { name: ['detail', 'holder'], value: productInfo[0]?.detail !== null ? productInfo[0]?.detail?.holder : ''},
        { name: 'contract', value: productInfo[0]?.contract !== null ? productInfo[0]?.contract?.contract : [] },
        { name: 'moreInfo', value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.moreInfo ? productInfo[0]?.detail?.moreInfo : [] },
        { name: 'founders', value: productInfo[0]?.detail?.founders ? productInfo[0]?.detail?.founders : [] },
        { name: 'funds', value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.funds ? productInfo[0]?.detail?.funds : [] },
        {
            name: ['community', 'facebook'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['facebook']
                ? productInfo[0]?.detail?.community['facebook'] : []
        },
        {
            name: ['community', 'twitter'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['twitter']
                ? productInfo[0]?.detail?.community['twitter'] : []
        },
        {
            name: ['community', 'discord'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['discord']
                ? productInfo[0]?.detail?.community['discord'] : []
        },
        {
            name: ['community', 'telegram'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['telegram']
                ? productInfo[0]?.detail?.community['telegram'] : []
        },
        {
            name: ['community', 'instagram'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['instagram']
            ? productInfo[0]?.detail?.community['instagram'] : []
        },
        {
            name: ['community', 'youtube'],
            value: productInfo[0]?.detail !== null && productInfo[0]?.detail?.community && productInfo[0]?.detail?.community['youtube']
                ? productInfo[0]?.detail?.community['youtube'] : []
        },
        {
            name: 'communities',
            value: defaultValueForm?.communities
        },
        {
            name: ['sourceCode', 'bitbucket'],
            value: productInfo[0]?.detail?.sourceCode && productInfo[0]?.detail?.sourceCode['bitbucket']
                ? productInfo[0]?.detail?.sourceCode['bitbucket'] : []
        },
        {
            name: ['sourceCode', 'github'],
            value: productInfo[0]?.detail?.sourceCode && productInfo[0]?.detail?.sourceCode['github']
                ? productInfo[0]?.detail?.sourceCode['github'] : []
        },
        { name: 'sourceCodes', value: defaultValueForm?.sourceCodes },
        { name: 'decimals', value: defaultValueForm?.decimals },
        { name: 'websites', value: defaultValueForm?.websites },
        {
            name: ['website', 'announcement'],
            value: productInfo[0]?.detail?.website && productInfo[0]?.detail?.website['announcement']
                ? productInfo[0]?.detail?.website['announcement'] : []
        },
        {
            name: ['website', 'blockchainSite'],
            value: productInfo[0]?.detail?.website && productInfo[0]?.detail?.website['blockchainSite']
                ? productInfo[0]?.detail?.website['blockchainSite'] : []
        },
        {
            name: ['website', 'homepage'],
            value: productInfo[0]?.detail?.website && productInfo[0]?.detail?.website['homepage']
                ? productInfo[0]?.detail?.website['homepage'] : []
        }
    ]

    // {productInfo[0]?.detail?.sourceCode && Object.keys(productInfo[0]?.detail?.sourceCode).map((key) => {
    //     return (<div style={{ display: 'flex' }}>
    //         <span style={{ textTransform: 'capitalize' }}>{key}:</span>
    //         <div style={{ marginLeft: '0.5rem' }}>
    //             {productInfo[0]?.detail?.sourceCode[key]?.map((item) => (
    //                 <a href={item} target='_blank'  rel="noreferrer">{item}</a>
    //             ))}
    //         </div>
    //     </div>)
    // })}
    return (
        <>
            {!_.isEmpty(productInfo) ? (
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
                                    <div className='form-add-item-label'>Image:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name="image"
                                        >
                                            <Input placeholder='https://'/>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.image && <Image style={{ width: '5rem' }} src={productInfo[0]?.image} preview={false}/>}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Type:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="type">
                                            <Select
                                                placeholder="Please select a type"
                                                onChange={handleChangeType}
                                            >
                                                <Option value={TYPE_ICO}>ICO</Option>
                                                <Option value={TYPE_COIN}>Coin</Option>
                                                <Option value={TYPE_TOKEN}>Token</Option>
                                                <Option value={TYPE_PROJECT}>Project</Option>
                                            </Select>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.type?.toUpperCase()}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Contract Address:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="address">
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.address}
                                        <CopyOutlined style={{ marginLeft: '0.5rem' }} onClick={(e) => copyAddress(e, productInfo[0]?.address)}/>
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Chain ID:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="chainId">
                                            <Input type='number'/>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.chainId}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Chain Name:</div>
                                    {isEditProduct ? (
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
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.chainName}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Symbol:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="symbol">
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.symbol}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Project Name:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="name">
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.name}</span>)}
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
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.category}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Sub Category</div>
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
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.subcategory}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Description:</div>
                                    {isEditProduct ? (
                                        <Form.Item name='desc'>
                                            <TextArea placeholder="Enter Description" rows={4}/>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.desc}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Warning:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="isWarning" valuePropName="checked">
                                            <Checkbox>Warning</Checkbox>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.isWarning ? 'TRUE' : 'FALSE'}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Show:</div>
                                    {isEditProduct ? (
                                        <Form.Item name="isshow" valuePropName="checked">
                                            <Checkbox>Show</Checkbox>
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.isshow ? 'TRUE' : 'FALSE'}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Holders:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name={['detail', 'holder']}
                                        >
                                            <Input placeholder="Enter Holders" />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.holders}</span>)}
                                </div>
                            </Card>
                            
                            {/* contract */}
                            <Card
                                title={<span className='form-add-card-title'>Contract</span>}
                                bordered={true}
                            >
                                {isEditProduct ? (
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
                                ) : (
                                    <span className='form-add-item-content'>
                                        contract
                                        {/* {productInfo[0]?.detail?.moreInfo && productInfo[0]?.detail?.moreInfo?.map((item) => (
                                            <div>{item?.key}: <span>{item?.value}</span></div>
                                        ))} */}
                                    </span>
                                )}
                            </Card>

                            {/* more Info */}
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
                                            <span className='form-add-item-content'>
                                                {productInfo[0]?.detail?.moreInfo && productInfo[0]?.detail?.moreInfo?.map((item) => (
                                                    <div>{item?.key}: <span>{item?.value}</span></div>
                                                ))}
                                            </span>
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                    
                            {/* founders */}
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
                                    <span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.founders && productInfo[0]?.detail?.founders?.map((item) => (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>{item?.name}: 
                                                <span style={{ marginLeft: '1rem' }}>
                                                    {item?.social?.map((itemLink) => (
                                                        <div>{itemLink}</div>
                                                    ))}
                                                </span>
                                            </div>
                                        ))}
                                    </span>
                                )}
                            </Card>
                            
                            {/* funds */}
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
                                    <span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.funds && productInfo[0]?.detail?.funds?.map((item) => (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {item?.name}: 
                                                <Image src={item?.image} preview={false}/>
                                            </div>
                                        ))}
                                    </span>
                                )}
                            </Card>
                            
                            {/* project detail */}
                            <Card
                                title={<span className='form-add-card-title'>Project Detail</span>}
                                bordered={true}
                            >
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Market Cap:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name={['detail', 'marketCap']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.marketcap}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Total Supply:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name={['detail', 'totalSupply']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.detail?.totalSupply}</span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Max Supply:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name={['detail', 'maxSupply']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.maxSupply}
                                    </span>)}
                                </div>
                                <div className='form-add-item'>
                                    <div className='form-add-item-label'>Volumn Trading:</div>
                                    {isEditProduct ? (
                                        <Form.Item
                                            name={['detail', 'volumnTrading']}
                                        >
                                            <Input />
                                        </Form.Item>
                                    ) : (<span className='form-add-item-content'>{productInfo[0]?.detail?.volumeTrading}</span>)}
                                </div>
                            </Card>
                    
                            {/* community */}
                            <Card
                                title={<span className='form-add-card-title'>Community</span>}
                                bordered={true}
                            >
                                {isEditProduct ? (
                                    <>
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
                                        <Form.List
                                            name="communities"
                                            initialValue={defaultValueForm}
                                        >
                                            {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <div className='form-add-item'>
                                                        <div className='form-add-item-label'>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'key']}
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
                                    </>
                                ) : (
                                    <span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.community && Object.keys(productInfo[0]?.detail?.community).map((key) => {
                                            return (<div style={{ display: 'flex' }}>
                                                <span style={{ textTransform: 'capitalize' }}>{key}:</span>
                                                <div style={{ marginLeft: '0.5rem' }}>
                                                    {productInfo[0]?.detail?.community[key]?.map((item) => (
                                                        <a href={item} target='_blank'  rel="noreferrer">{item}</a>
                                                    ))}
                                                </div>
                                            </div>)
                                        })}
                                    </span>
                                )}
                            </Card>

                            {/* source code */}
                            <Card
                                title={<span className='form-add-card-title'>Source Code</span>}
                                bordered={true}
                            >
                                {isEditProduct ? (
                                    <>
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
                                    </>
                                ) : (
                                    <span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.sourceCode && Object.keys(productInfo[0]?.detail?.sourceCode).map((key) => {
                                            return (<div style={{ display: 'flex' }}>
                                                <span style={{ textTransform: 'capitalize' }}>{key}:</span>
                                                <div style={{ marginLeft: '0.5rem' }}>
                                                    {productInfo[0]?.detail?.sourceCode[key]?.map((item) => (
                                                        <a href={item} target='_blank'  rel="noreferrer">{item}</a>
                                                    ))}
                                                </div>
                                            </div>)
                                        })}
                                    </span>
                                )}
                            </Card>

                            {/* decimals */}
                            <Card
                                title={<span className='form-add-card-title'>Decimals</span>}
                                bordered={true}
                            >
                                {isEditProduct ? (
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
                                ) : (<span className='form-add-item-content'>
                                        {productInfo[0]?.detail?.decimals && Object.keys(productInfo[0]?.detail?.decimals)?.map((key) => {
                                            return (<div style={{ marginBottom: '1rem' }}>
                                                <div>Chain Name: <span style={{ marginLeft: '0.5rem' }}>{key}</span></div>
                                                <div>Contract: 
                                                    <span style={{ marginLeft: '0.5rem' }}>
                                                        {productInfo[0]?.detail?.decimals[key]?.contract_address}
                                                    </span>
                                                </div>
                                                <div>Decimals: 
                                                    <span style={{ marginLeft: '0.5rem' }}>
                                                        {productInfo[0]?.detail?.decimals[key]?.decimal_place}
                                                    </span>
                                                </div>
                                            </div>)
                                        })}
                                    </span>
                                )}
                            </Card>

                            {/* website */}
                            <Card
                                title={<span className='form-add-card-title'>Website</span>}
                                bordered={true}
                            >
                                {isEditProduct ? (
                                    <>
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
                                    </>
                                ) : (<span>website</span>)}
                            </Card>


                            {/* {isEditProduct ? '' : (
                                <Card
                                    title={<span className='form-add-card-title'>Conclusion</span>}
                                    bordered={true}
                                >
                                    <div className='form-add-item'>
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
                                    </div>
                                </Card>
                            )} */}
                        </Space>

                        {isEditProduct && (
                            <Form.Item>
                                <Button type='primary' htmlType='submit' style={{ marginTop: '20px' }}>Update Project</Button>
                            </Form.Item>
                        )}
                    </Form>
                </div>
            ) : (<Spin size="large" />)}
        </>
    )
}

export default DetailProduct
