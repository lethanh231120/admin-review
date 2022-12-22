import React, { useState } from 'react'
import { Row, Col, Card, Radio, Table, Button, Typography, Avatar, Tag, Checkbox, Layout, Input } from 'antd'

import './style.scss'

import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";

const { Title } = Typography
const { Content } = Layout
  
const data = [
  {
    key: '1',
    userName: 'Le Thanh',
    image: face,
    status: 'active',
    reliability: true,
    reviews: 1000,
    createdDate: '10/10/2022'
  },
  {
    key: '2',
    userName: 'Le Thanh',
    image: face2,
    status: 'active',
    reliability: true,
    reviews: 20,
    createdDate: '10/10/2022'
  },
  {
    key: '3',
    userName: 'Le Thanh',
    image: face3,
    status: 'block',
    reliability: false,
    reviews: 10,
    createdDate: '10/10/2022'
  },
  {
    key: '4',
    userName: 'Le Thanh',
    image: face4,
    status: 'active',
    reliability: true,
    reviews: 1000,
    createdDate: '10/10/2022'
  },
  {
    key: '5',
    userName: 'Le Thanh',
    image: face5,
    status: 'block',
    reliability: false,
    reviews: 30,
    createdDate: '10/10/2022'
  }
]
const User = () => {
  // const [data, setData] = useState([
  //   {
  //     key: '1',
  //     userName: 'Le Thanh',
  //     image: face,
  //     status: 'active',
  //     reliability: true,
  //     reviews: 1000,
  //     createdDate: '10/10/2022'
  //   },
  //   {
  //     key: '2',
  //     userName: 'Le Thanh',
  //     image: face2,
  //     status: 'active',
  //     reliability: true,
  //     reviews: 20,
  //     createdDate: '10/10/2022'
  //   },
  //   {
  //     key: '3',
  //     userName: 'Le Thanh',
  //     image: face3,
  //     status: 'block',
  //     reliability: false,
  //     reviews: 10,
  //     createdDate: '10/10/2022'
  //   },
  //   {
  //     key: '4',
  //     userName: 'Le Thanh',
  //     image: face4,
  //     status: 'active',
  //     reliability: true,
  //     reviews: 1000,
  //     createdDate: '10/10/2022'
  //   },
  //   {
  //     key: '5',
  //     userName: 'Le Thanh',
  //     image: face5,
  //     status: 'block',
  //     reliability: false,
  //     reviews: 30,
  //     createdDate: '10/10/2022'
  //   }
  // ])

  const [dataSearch, setDataSearch] = useState()

  const handleChangeStatus = (e) => {
    const newData = [...data]
    const listUser = newData?.filter((item) => item?.status === e.target.value)
    setDataSearch(listUser)
  }

  const handleReliability = (record) => {
    console.log(record)
  }

  const columns = [
    {
      title: "#",
      dataIndex: "key",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (_, record) => <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={record?.image}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>{record?.userName}</Title>
          </div>
        </Avatar.Group>
      </>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <>
        <Tag color={record?.status === 'active' ? 'green' : 'volcano'} key={record?.key}>
          {record?.status?.toUpperCase()}
        </Tag>
      </>
    },
    {
      title: "Reliability",
      dataIndex: "reliability",
      render: (_, record) => <>
        <Checkbox
          onChange={() => handleReliability(record)}
          defaultChecked={record?.reliability}
        >Reputation</Checkbox>
      </>
    },
    {
      title: "Reviews",
      dataIndex: "reviews",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
    },
    {
      title: "Action",
      render: () => (
        <Button type='primary' danger>Block</Button>
      )
    },
  ]

  return (
    <div>
        <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
                <Card
                    bordered={false}
                    className="criclebox tablespace mb-24"
                    title="List User"
                    extra={
                        <>
                            <Radio.Group onChange={handleChangeStatus} defaultValue="active">
                                <Radio.Button value="active">Active</Radio.Button>
                                <Radio.Button value="block">Block</Radio.Button>
                            </Radio.Group>
                        </>
                    }
                >
                    <Row>
                        <Col span={20} offset={2}> 
                            <Content
                              className='card-content'
                              style={{
                                borderRadius: '1.2rem',
                                margin: '2rem 0',
                                padding: '2rem 10%',
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                display: 'flex'
                              }}
                            >
                                <Input placeholder='Enter key word....'/>
                                <Button type='primary'>Submit</Button>
                                <Button>Reset</Button>
                            </Content>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}> 
                            <Content
                              style={{
                                borderRadius: '1.2rem',
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                margin: 0
                              }}
                            >
                                <div className="table-responsive">
                                    <Table
                                        columns={columns}
                                        dataSource={dataSearch ? dataSearch : data}
                                        pagination={false}
                                        style={{ borderRadius: '1.8rem' }}
                                        className="ant-border-space"
                                    />
                                </div>
                            </Content>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default User
