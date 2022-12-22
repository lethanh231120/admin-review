import React, { useEffect, useState } from 'react'
import { Table, Card, Col, Row, Avatar, Tag, Typography, message, Tooltip } from 'antd'
import { Layout } from 'antd'
import { get, patch, del } from '../../api/products';
import { CopyOutlined, WarningOutlined, FireOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import '../../pages/styles/product.scss'
import '../../pages/styles/duplicate.scss'
import { useLocation } from 'react-router-dom';

const { Content } = Layout
const { Title } = Typography

const ListProductDuplicate = () => {
  const { state } = useLocation()
  const PAGE_SIZE = 100
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [listDataDuplicate, setListDataDuplicate] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getData = async() => {
        const params = {
            name: state?.record?.name?.toLowerCase(),
            // address: state?.record?.address?.toLowerCase(),
            symbol: state?.record?.symbol?.toLowerCase(),
            page: 1,
            chainName: state?.record?.chainName?.toLowerCase(),
            scam: false,
            warning: false
        }
        const dataDuplicate = await get('reviews/product/filter', params)
        setListDataDuplicate(dataDuplicate?.data?.products)
        setTotal(dataDuplicate?.data?.count)
        setLoading(false)
        setReload(false)
    }
    getData()
  }, [state, page, reload])

  const copyAddress = (e, text) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    message.success({
      content: 'Copy address successfully',
      duration: 3
    })
  }

  const handleWarning = async(e, record) => {
    setLoading(true)
    e.stopPropagation()
    await patch(`reviews/product/isWarning/productId=${record?.id}`)
    const itemInListData = listDataDuplicate?.findIndex((item) => item?.id === record?.id)
    const newListData = [...listDataDuplicate]
    newListData[itemInListData] = {
        ...listDataDuplicate[itemInListData],
        isWarning: !newListData[itemInListData]?.isWarning
    }
    setLoading(false)
    setListDataDuplicate(newListData)
    message.success({
        content: `Report warning for ${record?.name ? record?.name : record?.id} successfully`,
        duration: 3
    })
  }
  
  const handleScam = async(e, record) => {
    e.stopPropagation()
    await patch(`reviews/product/isScam/productId=${record?.id}`)
    const itemInListData = listDataDuplicate?.findIndex((item) => item?.id === record?.id)
    const newListData = [...listDataDuplicate]
    newListData[itemInListData] = {
        ...listDataDuplicate[itemInListData],
        isScam: !newListData[itemInListData]?.isScam
    }
    setListDataDuplicate(newListData)
    message.success({
        content: `Report scam for ${record?.name ? record?.name : record?.id} successfully`,
        duration: 3
    })
  }

  const handleDeleteProduct = async(e, record) => {
    e.stopPropagation()
    await del(`reviews/product/productId=${record?.id}`)
    setReload(true)
    message.success({
        content: `Delete ${record?.name ? record?.name : record?.id} successfully`,
        duration: 3
    })
  }

  const columns = [
    {
        title: "#",
        dataIndex: "key",
        render: (_, record, index)=>(<span style={{ color: '#A8ADB3' }}>
            {(page - 1) * PAGE_SIZE + index + 1}
        </span>)
    },
    {
        title: "Product Name",
        dataIndex: "name",
        render: (_, record) => <a href={`../../products/${record?.id}`} rel="noreferrer">
            <Avatar.Group>
                {record?.image  ? (
                    <Avatar
                        className="shape-avatar"
                        shape="square"
                        size={40}
                        src={record?.image}
                    />
                ) : (
                <span className='table-icon-coin-logo'>
                    {(record?.symbol !== null)
                    ? record?.symbol?.slice(0, 3)?.toUpperCase()
                    : (record?.name !== null)
                        ? record?.name?.slice(0, 3)?.toUpperCase()
                        : ''}
                </span>
                )}
                <div className="avatar-info">
                    <Title level={5}>{record?.name}</Title>
                    {record?.symbol && (
                        <div className='avatar-info-symbol'>{record?.symbol ? record?.symbol : ''}</div>
                    )}
                </div>
            </Avatar.Group>
        </a>
    },
    {
        title: 'Show',
        dataIndex: "isshow",
        render: (_, record) => (<span>
            {record?.isshow ? (
                <CheckCircleOutlined style={{ color: 'green' }}/>
            ) : 'FALSE'}
        </span>)
    },
    {
        title: "Type",
        render: (_, record) => (<span
        >
            <Tag color={record?.type === 'token' ? 'volcano' : 'geekblue'}>
                {record?.type}
            </Tag>
        </span>)
    },
    {
        title: "Chain Name",
        dataIndex: "chainName",
        render: (_, record) => (<span>
            {record?.chainName !== null ? record?.chainName : ''}
        </span>)
    },
    {
        title: "Address",
        dataIndex: "address",
        render: (_, record) => (<span>
            {record?.type === 'token' ? record?.address : ''}
            <CopyOutlined style={{ marginLeft: '0.5rem' }} onClick={(e) => copyAddress(e, record?.address)}/>
        </span>)
    },
    {
        title: "Category",
        render: (_, record) => (<span
        >
            {record?.category}
        </span>)
    },
    {
        title: 'Sub Category',
        dataIndex: "subcategory",
        render: (_, record) => <>
            {record?.subcategory?.split(',')?.map((item) => (<div>
                {item}
            </div>))}
        </>
    },
    {
        title: 'From By',
        dataIndex: "fromBy",
        render: (_, record) => (<span>
            {record?.fromBy}
        </span>)
    },
    {
        title: "Warning / Scam",
        render: (_, record) => (<div className='product-icon-action'>
            <Tooltip title="Report warning">
                <WarningOutlined
                    onClick={(e) => handleWarning(e, record)}
                    style={{
                        color: record?.isWarning === true ? 'orange' : ''
                    }}
                />
            </Tooltip>
            <Tooltip title="Report scam">
                <FireOutlined
                    onClick={(e) => handleScam(e, record)}
                    style={{
                        color: record?.isScam === true ? 'red' : ''
                    }}
                />
            </Tooltip>
            <Tooltip title="Delete product">
                <DeleteOutlined
                    onClick={(e) => handleDeleteProduct(e, record)}
                />
            </Tooltip>
        </div>)
    },
  ]

  const handleChangePage = (value) => {
    setPage(value)
  }

  return (
    <>
      <div className="layout-content">
        <div>
            <Row style={{ padding: '1rem' }}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24 duplicate-select"
                        title={<span>
                            Duplicate
                        </span>}
                    >
                        <Row>
                            <Col span={24}> 
                                <Content style={{ margin: 0 }}>
                                    <Table
                                        loading={loading}
                                        columns={columns}
                                        dataSource={listDataDuplicate}
                                        pagination={{
                                            defaultCurrent: 1,
                                            pageSize: PAGE_SIZE,
                                            showSizeChanger: false,
                                            total: total,
                                            onChange: (curren) => handleChangePage(curren)
                                        }}
                                        // onRow={(record) => ({
                                        //     onClick: () => { handleDetailItem(record) }
                                        // })}
                                        rowKey={(record) => record?.id}
                                        scroll={{ x: 'max-content' }}
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

export default ListProductDuplicate;
