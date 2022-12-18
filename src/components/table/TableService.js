import React, { useState, useEffect } from 'react'
import { Table, Button, Tooltip, Input } from 'antd'
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { del, get, patch } from '../../api/monitor';
import bitcoin from '../../assets/images/bitcoin.png'
import './tableToken.scss'

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
const TableService = () => {
    const PAGE_SIZE = 20
    const navigate = useNavigate()
    const [reloadService, setReloadService] = useState(false)
    const [services, setServices] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [dataModal, setDataModal] = useState()
    const [addEndpoint, setAddEndpoint] = useState({
        isAddEndpoint: false,
        index: '',
        base: ''
    })
    const [addMaintain, setAddMaintain] = useState({
        isAddMaintain: false,
        index: '',
        base: ''
    })

    const [page, setPage] = useState(1)

    const handleDeleteService = async(e, record) => {
        e.stopPropagation()
        await del('service_monitor/remove-service', {  "base":  record?.base })
        setReloadService(true)
    }

    const handleDeleteEndpoint = async(e, item, record) => {
        e.stopPropagation()
        const data = {
            base: record?.base,
            endpoints: [item]
        }
        await patch('service_monitor/remove-endpoints', data)
        setReloadService(true)
    }

    const handleDeleteMaintain = async(e, item, record) => {
        e.stopPropagation()
        const data = {
            base: record?.base,
            maintainers: [item]
        }
        await patch('service_monitor/remove-maintainers', data)
        setReloadService(true)
    }

    const handleAddEndPoint = async(e) => {
        if (e.key === 'Enter') {
            const data = {
                base: addEndpoint?.base,
                endpoints: [e.target.value]
            }
            await patch('service_monitor/add-endpoints', data)
            setAddEndpoint({
                isAddEndpoint: false,
                index: '',
                base: ''
            })
            setReloadService(true)
        }
    }
    const handleAddMaintain = async(e) => {
        if (e.key === 'Enter') {
            const data = {
                base: addMaintain?.base,
                maintainers: [e.target.value]
            }
            await patch('service_monitor/add-maintainers', data)
            setAddMaintain({
                isAddMaintain: false,
                index: '',
                base: ''
            })
            setReloadService(true)
        }
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
            title: "Service Name",
            dataIndex: "name"
        },
        {
            title: "Base URL",
            dataIndex: "base"
        },
        {
            title: 'Endpoints',
            dataIndex: "endpoints",
            render: (_, record, index) => (
                <>
                    {(addEndpoint?.isAddEndpoint && addEndpoint?.index === index) ? (
                        <Input
                            placeholder='Enter New Endpoint'
                            onKeyPress={handleAddEndPoint}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                {record?.endpoints?.map((item) => (
                                    <div>
                                        <a
                                            href={`${record?.base}${item}`}
                                            target='_blank'
                                            rel="noreferrer"
                                        >
                                            {item}
                                        </a>
                                        <Tooltip title="Delete Endpoint">
                                            <DeleteOutlined
                                                style={{ marginLeft: '1rem', cursor: 'pointer' }}
                                                onClick={(e) => handleDeleteEndpoint(e, item, record)}
                                            />
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                            <Tooltip title="Add New Endpoint">
                                <PlusCircleOutlined
                                    style={{ marginLeft: '1rem', cursor: 'pointer' }}
                                    onClick={() => setAddEndpoint({
                                        isAddEndpoint: true,
                                        index: index,
                                        base: record?.base
                                    })}
                                />
                            </Tooltip>
                        </div>
                    )}
                </>
            )
        },
        {
            title: "Maintainers",
            render: (_, record, index) => (
                <>
                    {(addMaintain?.isAddMaintain && addMaintain?.index === index) ? (
                        <Input
                            placeholder='Enter New Endpoint'
                            onKeyPress={handleAddMaintain}
                        />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                {record?.maintainers?.map((item) => (
                                    <div>
                                        {item}
                                        <Tooltip title="Delete Maintainer">
                                            <DeleteOutlined
                                                style={{ marginLeft: '1rem', cursor: 'pointer' }}
                                                onClick={(e) => handleDeleteMaintain(e, item, record)}
                                            />
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                            <Tooltip title="Add New Maintain">
                                <PlusCircleOutlined
                                    style={{ marginLeft: '1rem', cursor: 'pointer' }}
                                    onClick={() => setAddMaintain({
                                        isAddMaintain: true,
                                        index: index,
                                        base: record?.base
                                    })}
                                />
                            </Tooltip>
                        </div>
                    )}
                
                </>
            )
        },
        {
            title: "Action",
            render: (_, record) => (<>
                <Button type='primary' danger onClick={(e) => handleDeleteService(e, record)}>Delete</Button>
            </>)
        },
    ]

    useEffect(() => {
        const getAll = async() => {
            const services = await get('service_monitor/all')
            setServices(services?.data?.services)
            setReloadService(false)
        }
        getAll()
    }, [reloadService])

    const handleChangePage = (value) => {
        setPage(value)
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={services}
                pagination={{
                    defaultCurrent: 1,
                    pageSize: PAGE_SIZE,
                    showSizeChanger: false,
                    total: data?.length,
                    onChange: (curren) => handleChangePage(curren)
                }}
                style={{ borderRadius: '1.8rem' }}
                className="ant-border-space"
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default TableService
