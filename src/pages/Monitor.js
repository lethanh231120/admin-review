import React from 'react'
import { Row, Col, Card, Layout, Button, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import TableService from '../components/table/TableService'

const { Content } = Layout

const Monitor = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const onFinish = (values) => {
    form.resetFields()
  }

  return (
    <div>
        <Form
            form={form}
            onFinish={onFinish}
        >
            <Row gutter={[24, 0]}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Monitor"
                        extra={
                            <Button
                                type='primary'
                                onClick={() => navigate('../monitor/add-service')}
                            >
                                Add Service
                            </Button>
                        }
                    >
                        <Row>
                            <Col span={24}> 
                                <Content
                                    style={{
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        margin: '3rem 2rem'
                                    }}
                                >
                                    <TableService/>
                                </Content>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export default Monitor
