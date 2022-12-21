import React, { useEffect, useState, useContext } from 'react'
import { Card, Col, Row } from 'antd'
import { Layout, Select } from 'antd'
import { get, patch } from '../api/products';
import ListDuplicate from '../components/product-tab/ListDuplicate';
import './styles/product.scss'
import './styles/duplicate.scss'
import { useNavigate } from 'react-router-dom';
import { ChainNameContext } from '../components/layout/Main';

const { Content } = Layout

const Duplicate = () => {
  const contextChainName = useContext(ChainNameContext)
  const navigate = useNavigate()
  const [chains, setChains] = useState([])

  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [dataSearch, setDataSearch] = useState()
  const [params, setParams] = useState([])

  useEffect(() => {
    const getParams = async() => {
        const tokens = await get(`reviews/product/list-value-fields`)
        const types = []
        tokens?.data?.type?.map((item) => (
          types.push(item?.split(', '))
        ))
        const onlyUnique = (value, index, self) => {
          return (self.indexOf(value) === index && value !== '');
        }
        const unique = types?.flat(1)?.filter(onlyUnique)

        const src = tokens?.data?.src?.filter((item) => item !== '')
        const category = tokens?.data?.category?.filter((item) => item !== '')
        const chainName = tokens?.data?.chainName?.filter((item) => item !== '')
        const newParams = {
            src: src,
            category: category,
            chainName: chainName,
            type: unique
        }
        setParams(newParams)
    }
    getParams()
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {
      chainname: contextChainName?.chainName,
      page: page
    }
    const getProducts = async() => {
        const product = await get('reviews/product/list-symbol-name', params)
        setDataSearch(product?.data?.nameAndSymbols)
        setLoading(false)
    }
    getProducts()
  }, [contextChainName, page])

  const handleClickItem = async(record) => {
    navigate(`${contextChainName?.chainName}`, { state: { record: { ...record, chainName: contextChainName?.chainName } }})
  }

  return (
    <>
      <div className="layout-content">
        <div>
            <Row style={{ padding: '1rem' }}>
                <Col xs="24" xl={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24 duplicate-select"
                        title={<span>
                            Duplicate
                            <Select
                                style={{ width: 200, marginLeft: '1rem' }}
                                placeholder="Chain name"
                                showSearch
                                onChange={(value) => contextChainName?.handleSetChainName(value)}
                                defaultValue={contextChainName?.chainName}
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={params?.chainName?.map((item) => ({
                                    value: item,
                                    label: item,
                                }))}
                            />
                        </span>}
                    >
                        <Row>
                            <Col span={24}> 
                                <Content
                                    style={{
                                        margin: 0
                                    }}
                                >
                                        {/* <Table
                                            loading={loading}
                                            columns={columns}
                                            dataSource={listDataDuplicate}
                                            pagination={{
                                                defaultCurrent: 1,
                                                pageSize: PAGE_SIZE,
                                                showSizeChanger: false,
                                                total: total,
                                                onChange: (curren) => handleChangePage(curren)
                                            }}
                                            onRow={(record) => ({
                                                onClick: () => { handleDetailItem(record) }
                                            })}
                                            rowKey={(record) => record?.name}
                                            scroll={{ x: 'max-content' }}
                                        /> */}
                                    <ListDuplicate
                                        dataSearch={dataSearch}
                                        loading={loading}
                                        total={total}
                                        page={page}
                                        setPage={setPage}
                                        handleClickItem={handleClickItem}
                                    />
                                </Content>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
      </div>
    </>
  );
}

export default Duplicate;
