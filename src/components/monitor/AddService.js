import React from 'react'
import { Form, Input, Button, Space, Select, Card } from 'antd'
import { post } from '../../api/monitor'
import { useNavigate } from 'react-router-dom'

import './addService.scss'

const defaultValue = [
    { name: 'address', value: '' },
    { name: 'chainId', value: '' },
    { name: 'decimals', value: '' },
    { name: 'image', value: '' },
    { name: 'isVerify', value: false },
    { name: 'marketCap', value: '' },
    { name: 'maxSupply', value: '' },
    { name: 'name', value: '' },
    { name: 'symbol', value: '' },
    { name: 'totalSupply', value: '' },
    { name: 'type', value: '' },
    { name: 'volumeTrading', value: '' },
    { name: 'category', value: 'Crypto Projects' },
    { name: 'newCategory', value: '' },
    { name: 'subCategory', value: [] },
    { name: 'newSubCategory', value: [] },
    { name: 'founders', value: [] },
    { name: 'funds', value: [] },
    { name: ['detail', 'description'], value: '' },
    { name: ['detail', 'holders'], value: '' },
    { name: ['detail', 'sourceCode'], value: '' },
    { name: ['detail', 'website'], value: '' },
    { name: 'moreInfo', value: [] },
    { name: ['community', 'discord'], value: '' },
    { name: ['community', 'facebook'], value: '' },
    { name: ['community', 'telegram'], value: '' },
    { name: ['community', 'instagram'], value: '' },
    { name: ['community', 'twitter'], value: '' },
    { name: ['evaluate', 'isScam'], value: false },
    { name: ['evaluate', 'reason'], value: '' },
    { name: ['evaluate', 'sources'], value: [] },
    { name: ['evaluate', 'userId'], value: '' },
    { name: ['evaluate', 'userName'], value: [] },
    { name: ['evaluate', 'userRole'], value: [] },
    { name: ['evaluate', 'isVerify'], value: false }
]

const AddService = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = async(values) => {
        await post('service_monitor/add-service', values)
        navigate('../../monitor')
    }

    return (
        <div className='form-add'>
            <Form
                form={form}
                onFinish={onFinish}
                fields={defaultValue}
            >
                <div className='form-add-title'>Submit Service Infomation</div>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Card
                        title={<span className='form-add-card-title'>Project Info</span>}
                        bordered={true}
                    >
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Sevice Name:</div>
                            <Form.Item name="name">
                                <Input placeholder='Enter Service Name'/>
                            </Form.Item>
                        </div>
                        
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Base URL:</div>
                            <Form.Item
                                name="base"
                                rules={[
                                    {
                                        type: 'url',
                                        required: true,
                                        message: 'Enter a valid base url!',
                                    }
                                ]}
                            >
                                <Input placeholder='Enter Base URL'/>
                            </Form.Item>
                        </div>
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>End Point:</div>
                            <Form.Item
                                name="endpoints"
                            >
                                <Select
                                    placeholder="Enter multiple endpoint"
                                    mode="tags"
                                />
                            </Form.Item>
                        </div>
                        <div className='form-add-item'>
                            <div className='form-add-item-label'>Maintain:</div>
                            <Form.Item
                                name="maintainers"
                            >
                                <Select
                                    placeholder="Enter multiple maintainer"
                                    mode="tags"
                                />
                            </Form.Item>
                        </div>
                    </Card>
                </Space>

                <Form.Item>
                    <Button type='primary' htmlType='submit' style={{ marginTop: '20px' }}>Add Service</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddService
