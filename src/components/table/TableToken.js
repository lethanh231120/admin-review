import React, { useState, useEffect } from 'react'
import { Table, Avatar, Typography, Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom';
import { del, get } from '../../api/products';
import bitcoin from '../../assets/images/bitcoin.png'
import './tableToken.scss'

const { Title } = Typography

const data = [
    {
        name: 'bitcoin',
        symbol: 'BTC',
        decimals: 8,
        src: 'https://www.facebook.com/',
        image: bitcoin,
        type: 'coin',
        marketcap : 434736267,
        chainId: 0,
        tag: 'DEX'
    },
    {
        name: 'bitcoin',
        symbol: 'BTC',
        decimals: 8,
        src: 'https://www.facebook.com/',
        image: bitcoin,
        type: 'coin',
        marketcap : 434736267,
        chainId: 0,
        tag: 'CEX'
    },
    {
        name: 'bitcoin',
        symbol: 'BTC',
        decimals: 8,
        src: 'https://www.facebook.com/',
        image: bitcoin,
        type: 'coin',
        marketcap : 434736267,
        chainId: 0,
        tag: ''
    },
]
const TableToken = ({ page, setPage, setReloadVerify, total, dataSearch, loading }) => {
  const PAGE_SIZE = 20
  const navigate = useNavigate()

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
        title: "Token Name",
        dataIndex: "name",
        render: (_, record) => <>
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
                <Title level={5}>{record?.symbol}</Title>
            </div>
        </Avatar.Group>
        </>
    },
    {
        title: "Chain ID",
        dataIndex: "chainId"
    },
    {
        title: "SRC",
        dataIndex: "src",
        render: (_, record) => (<a href={record?.src} target='_blank' rel="noreferrer">
            {record?.src}
        </a>)
    },
    {
        title: "Type",
        render: (_, record) => (<span
        >
            <Tag color={record?.type === 'coin' ? 'volcano' : 'geekblue'}>
                {record?.type}
            </Tag>
        </span>)
    },
    {
        title: 'Tags',
        dataIndex: "tag",
        render: (_, record) => <>
            {
                record?.tag?.split(',')?.map((item) => (
                    <Tag color={item === 'coin' ? 'volcano' : 'geekblue'}>
                        {item}
                    </Tag>
                ))
            }
        </>
    },
    {
        title: 'Decimals',
        dataIndex: "decimals",
        render: (_, record) => <>{record?.decimals}</>
    },
    {
        title: "Action",
        render: (_, record) => (<>
            <Button type='primary' danger onClick={(e) => handleDeleteProduct(e, record)}>Delete</Button>
        </>)
    },
  ]

//   useEffect(() => {
//     const getProducts = async() => {
//         const tokens = await get(`reviews/list-coin?page=${page}`)
//         // setData(projects?.data?.projects)
//         console.log(tokens)
//         // setTotal(tokens?.data?.count)
//         // setReloadVerify(false)
//     }
//     getProducts()
//   }, [page, reloadVerify])

  const handleChangePage = (value) => {
    setPage(value)
  }

  return (
    <div>
        <Table
            loading={loading}
            columns={columns}
            dataSource={dataSearch}
            pagination={{
                defaultCurrent: 1,
                pageSize: PAGE_SIZE,
                showSizeChanger: false,
                total: total,
                onChange: (curren) => handleChangePage(curren)
            }}
            style={{ borderRadius: '1.8rem' }}
            className="ant-border-space"
            scroll={{ x: 'max-content' }}
            onRow={(record) => ({
                onClick: () => { handleClickItem(record) }
            })}
        />
    </div>
  )
}

export default TableToken
