import React, { useState, useEffect } from 'react'
import { Table, Avatar, Typography, Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom';
import { del, get, patch } from '../../api/products';

const { Title } = Typography

const ListProject = ({ dataSearch }) => {
  const PAGE_SIZE = 20
  const navigate = useNavigate()
  const [total, setTotal] = useState(1)
  const [reloadVerify, setReloadVerify] = useState(false)

  const [page, setPage] = useState(1)

  const [data, setData] = useState([])

  const handleVerifyProduct = async(e, record) => {
    e.stopPropagation()
    await patch(`reviews/research/verify/projectId=${record?.id}`)
    setReloadVerify(true)
  }

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
                <Title level={5}>{record?.name}</Title>
            </div>
        </Avatar.Group>
        </>
    },
    {
        title: "Market",
        dataIndex: "marketCap"
    },
    {
        title: "Volumn",
        dataIndex: "volumeTrading",
        render: (_, record) => (<span>
            {record?.volumeTrading}
        </span>)
    },
    {
        title: "Verify",
        render: (_, record) => (<span
        >
            <Tag color={record?.isVerify ? 'volcano' : 'geekblue'}>
                {record?.isVerify ? 'Verify' : 'Pending'}
            </Tag>
        </span>)
    },
    {
        title: 'Founder',
        dataIndex: "founder",
        render: (_, record) => <>
            {record?.detail?.founders?.map((item) => <span>{item?.name}</span>)}
        </>
    },
    {
        title: 'Holders',
        dataIndex: "holders",
        render: (_, record) => <>{record?.detail?.holders}</>
    },
    {
        title: "Action",
        render: (_, record) => (<>
            <Button
                type='primary'
                danger onClick={(e) => handleVerifyProduct(e, record)}
                style={{ marginRight: '20px' }}
            >
                Verify
            </Button>
            <Button type='primary' danger onClick={(e) => handleDeleteProduct(e, record)}>Delete</Button>
        </>)
    },
  ]

  useEffect(() => {
    const getProducts = async() => {
        const projects = await get(`reviews/research?page=${page}`)
        setData(projects?.data?.projects)
        setTotal(projects?.data?.count)
        setReloadVerify(false)
    }
    getProducts()
  }, [page, reloadVerify])


  const handleChangePage = (value) => {
    setPage(value)
  }

  return (
    <div>
        <Table
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
        />
    </div>
  )
}

export default ListProject
