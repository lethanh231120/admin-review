import React, { useState, useEffect } from 'react'
import { Table, Avatar, Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom';
import { del, get } from '../../api/products';

const ListProduct = ({ dataSearch }) => {
  const PAGE_SIZE = 20
  const navigate = useNavigate()
  const [total, setTotal] = useState(1)
  const [reloadVerify, setReloadVerify] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const handleDeleteProduct = async(e, record) => {
    e.stopPropagation()
    await del(`reviews/research/projectId=${record?.id}`)
    setReloadVerify(true)
  }

  const handleClickItem = (record) => {
    navigate(`${record?.id}`)
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
        render: (_, record) => <>
        <Avatar.Group>
            <Avatar
                className="shape-avatar"
                shape="square"
                size={40}
                src={record?.image}
            />
            <div className="avatar-info">
                <span>{record?.name}</span>
            </div>
        </Avatar.Group>
        </>
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
        </span>)
    },
    {
        title: 'Total Reviews',
        dataIndex: "totalReviews",
        render: (_, record) => <>
            {record?.detail?.founders?.map((item, index) => <span key={index}>{item?.name}, </span>)}
        </>
    },
    {
        title: 'Scam',
        dataIndex: "totalIsScam",
        render: (_, record) => (<span>
            {record?.totalIsScam !== 'NULL' ? record?.totalIsScam : ''}
        </span>)
    },
    {
        title: "Action",
        render: (_, record) => (<>
            <Button type='primary' danger onClick={(e) => handleDeleteProduct(e, record)}>Delete</Button>
        </>)
    },
  ]

  useEffect(() => {
    const getProducts = async() => {
        const product = await get(`reviews/product?page=${page}`)
        console.log(product?.data?.products)
        setData(product?.data?.products)
        setTotal(product?.data?.count)
        setReloadVerify(false)
        setLoading(false)
    }
    getProducts()
  }, [page, reloadVerify])


  const handleChangePage = (value) => {
    setPage(value)
  }

  return (
    <div>
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={{
                defaultCurrent: 1,
                pageSize: PAGE_SIZE,
                showSizeChanger: false,
                total: total,
                onChange: (curren) => handleChangePage(curren)
            }}
            style={{ borderRadius: '1.8rem' }}
            className="ant-border-space"
            onRow={(record) => ({
                onClick: () => { handleClickItem(record) }
            })}
            rowKey={(record) => record?.name}
        />
    </div>
  )
}

export default ListProduct
