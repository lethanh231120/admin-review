import React from 'react'
import { Table, Typography } from 'antd'
import './listProduct.scss'
// import { CopyOutlined } from '@ant-design/icons'

const { Title } = Typography

const ListDuplicate = ({ loading, total, setPage, page, dataSearch, handleClickItem }) => {
  const PAGE_SIZE = 100

  // const copyAddress = (e, text) => {
  //   e.stopPropagation()
  //   navigator.clipboard.writeText(text)
  //   message.success({
  //     content: 'Copy address successfully',
  //     duration: 3
  //   })
  // }

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
        render: (_, record) => <span>
            <div>
                <Title level={5}>{record?.name}</Title>
            </div>
        </span>
    },
    {
        title: "Product Symbol",
        dataIndex: "symbol",
        render: (_, record) => <span>
            <div>
                <Title level={5}>{record?.symbol}</Title>
            </div>
        </span>
    },
    // {
    //     title: "Address",
    //     dataIndex: "address",
    //     render: (_, record) => (<span>
    //       {record?.address && (
    //         <>
    //           {record?.address}
    //           <CopyOutlined style={{ marginLeft: '0.5rem' }} onClick={(e) => copyAddress(e, record?.address)}/>
    //         </>
    //       )}
    //     </span>)
    // },
    {
        title: "Number",
        dataIndex: "count",
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.count - b.count,
        render: (_, record) => (<span>
            {record?.count}
        </span>)
    }
  ]

  const handleChangePage = (value) => {
    setPage(value)
  }

  return (
    <div>
        <Table
            style={{ width: '100%' }}
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
            onRow={(record) => ({
                onClick: () => { handleClickItem(record) }
            })}
            rowKey={(record) => record?.name}
            scroll={{ x: 'max-content' }}
        />
    </div>
  )
}

export default ListDuplicate
