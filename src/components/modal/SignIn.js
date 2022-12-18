import React from 'react'
import { Modal, Layout, Row, Col, Typography, Form, Input, Button } from 'antd'
import { post } from '../../api/products'
import { setCookie, STORAGEKEY } from '../../utils/storage'
// import { login } from '../../redux/userInfo'
// import { useDispatch } from 'react-redux'

const { Title } = Typography
const { Content } = Layout
const SignIn = ({ openModal, setOpenModal }) => {
    // const dispatch = useDispatch()
    const [form] = Form.useForm()
    const onFinish = async(values) => {
        const signin = await post('reviews/signin', values)
        const token = signin?.data[0]?.token
        if (token) {
            await setCookie(STORAGEKEY.ACCESS_TOKEN, token)
            await setCookie(STORAGEKEY.USER_INFO, signin?.data[1])
            await setCookie(STORAGEKEY.IS_AUTHENTICATED, true)
            setOpenModal(false)
            form.resetFields()
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Modal
            visible={openModal}
            onOk={() => setOpenModal(false)}
            onCancel={() => setOpenModal(false)}
            footer={false}
        >
            <Content className="signin">
                <Row gutter={[24, 0]} justify="space-around">
                    <Col span={24}>
                        <Title className="mb-15">Sign In</Title>
                        <Form
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            className="row-col"
                            form={form}
                        >
                            {/* <Form.Item
                                className="username"
                                label="User Name"
                                name="userName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your name!",
                                    },
                                ]}
                            >
                                <Input placeholder="UserName" />
                            </Form.Item> */}

                            <Form.Item
                                className="username"
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email!",
                                    },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                className="username"
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input placeholder="Password" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%" }}
                                >
                                    SIGN IN
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col
                        className="sign-img"
                        style={{ padding: 12 }}
                        xs={{ span: 24 }}
                        lg={{ span: 12 }}
                        md={{ span: 12 }}
                    >
                        {/* <img src={signinbg} alt="" /> */}
                    </Col>
                </Row>  
            </Content>
        </Modal>
    )
}

export default SignIn
