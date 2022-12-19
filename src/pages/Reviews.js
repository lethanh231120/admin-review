import React from 'react'
import { Row, Col, Card, Layout, Input, Button, Table, Avatar, Select, Typography, Checkbox } from 'antd'

import './style.scss'

import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";

const { Content } = Layout
const { Title } = Typography

const data = [
    {
        key: '1',
        userName: 'Le Thanh',
        image: face,
        projectID: 2,
        commentID: 2,
        replyID: 2,
        content: 'Bai review rat chat luong, dung trong tam',
        quanlity: true,
        like: 10,
        dislike: 1000
    },
    {
        key: '2',
        userName: 'Le Thanh',
        image: face2,
        projectID: 2,
        commentID: 2,
        replyID: 2,
        content: 'Bai review rat chat luong, dung trong tam',
        quanlity: false,
        like: 1000,
        dislike: 10
    },
    {
        key: '3',
        userName: 'Le Thanh',
        image: face3,
        projectID: 2,
        commentID: 2,
        replyID: 2,
        content: 'Bai review rat chat luong, dung trong tam',
        quanlity: true,
        like: 20,
        dislike: 2340
    },
    {
        key: '4',
        userName: 'Le Thanh',
        image: face4,
        projectID: 2,
        commentID: 2,
        replyID: 2,
        content: 'Bai review rat chat luong, dung trong tam',
        quanlity: false,
        like: 10003,
        dislike: 1034
    },
    {
        key: '5',
        userName: 'Le Thanh',
        image: face5,
        projectID: 2,
        commentID: 2,
        replyID: 2,
        content: 'Bai review rat chat luong, dung trong tam',
        quanlity: true,
        like: 1000,
        dislike: 10
    }
]
const Reviews = () => {
//   const [data, setData] = useState([
//     {
//         key: '1',
//         userName: 'Le Thanh',
//         image: face,
//         projectID: 2,
//         commentID: 2,
//         replyID: 2,
//         content: 'Bai review rat chat luong, dung trong tam',
//         quanlity: true,
//         like: 10,
//         dislike: 1000
//     },
//     {
//         key: '2',
//         userName: 'Le Thanh',
//         image: face2,
//         projectID: 2,
//         commentID: 2,
//         replyID: 2,
//         content: 'Bai review rat chat luong, dung trong tam',
//         quanlity: false,
//         like: 1000,
//         dislike: 10
//     },
//     {
//         key: '3',
//         userName: 'Le Thanh',
//         image: face3,
//         projectID: 2,
//         commentID: 2,
//         replyID: 2,
//         content: 'Bai review rat chat luong, dung trong tam',
//         quanlity: true,
//         like: 20,
//         dislike: 2340
//     },
//     {
//         key: '4',
//         userName: 'Le Thanh',
//         image: face4,
//         projectID: 2,
//         commentID: 2,
//         replyID: 2,
//         content: 'Bai review rat chat luong, dung trong tam',
//         quanlity: false,
//         like: 10003,
//         dislike: 1034
//     },
//     {
//         key: '5',
//         userName: 'Le Thanh',
//         image: face5,
//         projectID: 2,
//         commentID: 2,
//         replyID: 2,
//         content: 'Bai review rat chat luong, dung trong tam',
//         quanlity: true,
//         like: 1000,
//         dislike: 10
//     }
//   ])

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
        title: "Project ID",
        dataIndex: "projectID",
    },
    {
        title: "Comment ID",
        dataIndex: "commentID",
    },
    {
        title: "Reply ID",
        dataIndex: "replyID",
    },
    {
        title: "Content",
        dataIndex: "content",
    },
    {
        title: "Quanlity",
        dataIndex: "quanlity",
        render: (_, record) => <>
            <Checkbox
            //   onChange={() => handleReliability(record)}
            defaultChecked={record?.quanlity}
            >Quanlity</Checkbox>
        </>
    },
    {
        title: "Like",
        dataIndex: "like",
        sorter: (a, b) => a.like - b.like
    },
    {
        title: "Dislike",
        dataIndex: "dislike",
        sorter: (a, b) => a.dislike - b.dislike
    },
    {
        title: "Action",
        render: () => (
        <Button type='primary' danger>Delete</Button>
        )
    },
  ]
  const handleChangeSelect = (value) => {
    console.log(value)
  }

  return (
    <div>
        <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
                <Card
                    bordered={false}
                    className="criclebox tablespace mb-24"
                    title="List User"
                    extra={
                        <Button type='primary' danger>Delete All</Button>
                    }
                >
                    <Row>
                        <Col span={22} offset={1}> 
                            <Content
                            //   className='card-content'
                                style={{
                                borderRadius: '1.2rem',
                                margin: '2rem 0',
                                padding: '2rem',
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Input placeholder='Enter key word....'/>
                                    </Col>
                                    <Col span={8}>
                                        <Input placeholder='Enter user name....'/>
                                    </Col>
                                    <Col span={8}>
                                    <Select
                                        defaultValue="great than 1000"
                                        style={{
                                            width: '100%',
                                        }}
                                        onChange={handleChangeSelect}
                                        placeholder='Amount dislike'
                                        options={[
                                            {
                                                value: 'great than 1000',
                                                label: '> 1000',
                                            },
                                            {
                                                value: 'less than 1000',
                                                label: '< 1000',
                                            }
                                        ]}
                                        />
                                    </Col>
                                </Row>
                                <div className='review-button-search'
                                    
                                >
                                    <Button type='primary'>Submit</Button>
                                    <Button>Reset</Button>
                                </div>
                            </Content>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22} offset={1}> 
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
                                        dataSource={data}
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

export default Reviews
