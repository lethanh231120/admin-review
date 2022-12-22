import React, { useState, useEffect } from 'react'
import { Table, Avatar, Button, Tag, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom';
import { del, get } from '../../api/products';
import './listProduct.scss'
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import _ from 'lodash';

const { Title } = Typography

const ListProduct = ({ loading, total, setReloadProduct, setPage, page, dataSearch }) => {
  const PAGE_SIZE = 100
  const navigate = useNavigate()

  const handleDeleteProduct = async(e, record) => {
    e.stopPropagation()
    await del(`reviews/product/productId=${record?.id}`)
    setReloadProduct(true)
    message.success({
        content: `Delete ${record?.name ? record?.name : record?.id} successfully`,
        duration: 3
    })
  }

  const handleEditProduct = async(e, record) => {
    e.stopPropagation()
    // navigate(`../products/${record?.id}`, { state: { isEdit: true }})
  }

//   const handleClickItem = (record) => {
//     navigate(`../products/${record?.id}`, { state: { isEdit: false }})
//   }
 
  const copyAddress = (e, text) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    message.success({
      content: 'Copy address successfully',
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
                        <div className={`${record?.symbol ? 'avatar-info-symbol' : ''}`}>{record?.symbol ? record?.symbol : ''}</div>
                    )}
                </div>
            </Avatar.Group>
        </a>
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
        title: "Category",
        render: (_, record) => (<span
        >
            {record?.category}
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
            {record?.address && (
                <>
                    {record?.address}
                    <CopyOutlined style={{ marginLeft: '0.5rem' }} onClick={(e) => copyAddress(e, record?.address)}/>
                </>
            )}
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
        title: 'Show',
        dataIndex: "isshow",
        render: (_, record) => (<span>
            {record?.isshow ? 'TRUE' : 'FALSE'}
        </span>)
    },
    {
        title: 'From By',
        dataIndex: "fromBy",
        render: (_, record) => (<span>
            {record?.fromBy}
        </span>)
    },
    {
        title: "Action",
        render: (_, record) => (<div className='product-icon-action'>
            <EditOutlined onClick={(e) => handleEditProduct(e, record)}/>
            <DeleteOutlined onClick={(e) => handleDeleteProduct(e, record)}/>
        </div>)
    },
  ]

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
                total: total,
                showSizeChanger: false,
                onChange: (curren) => handleChangePage(curren)
            }}
            rowKey={(record) => record?.id}
            scroll={{ x: 'max-content' }}
        />
    </div>
  )
}

export default ListProduct
