import React, {Component, Fragment} from 'react'
import { Divider,Card,Button,Form,Row,Col,message,Modal,Select} from 'antd'
import CurrentTitle from '@/common/CurrentTitle/Index'
import StandardTable from '@/common/StandardTable'
import ModalFrom from '@/common/ModalForm'
import AddExecl from '@/common/AddExecl/Index'
import styles from '../../layouts/global.less'
import { defaultPage, getButtonAuth } from '@/utils/utils'
import { connect } from '@/common/Plugins'
import { router } from '../../common/Plugins'
import {searchLayout} from '../../../public/config'

const { confirm } = Modal
const { Option } = Select
const pageName = 'pointCheckTable'

@Form.create()
@connect(({pointCheckTable,   pointCheckCar, pointCheckSystem, loading}) => ({pointCheckTable,   pointCheckCar, pointCheckSystem, loading: loading.models.pointCheckTable}))

class CheckPointTableList extends Component {
  state = {
    confirmLoading: false, // 提交按钮loading状态
    searchParams: {},
    pageInfo: defaultPage, // 当前分页信息
    carList: [],
    systemList: [],
    modalData: {
      modalTitle: '', // 模态框标题
      modalVisible: false, // 显示模态框
      modalFormData: {} // 用于模态框表单数据: 添加的时候为空, 修改或删除的时候对应该条数据信息
    }
  }

  componentDidMount() {
    this.initData()
    this.getCarList()
    this.getSystemList()
  }

  // 表格配置
  columns = [{
      title: '车型',
      dataIndex: 'vehicleModelName',
      name: 'vehicleModelName'
    },{
      title: '系统名称',
      dataIndex: 'checkSystemName',
      name: 'checkSystemName'
    },{
      title: '状态',
      dataIndex: 'state',
      name: 'state',
      render: state => {
        let stateText = ''
        switch(state){
          case 1:
          stateText = '待审核'
          break
          case 2:
          stateText = '已审核'
          break
          default:
          stateText = '未通过'
        }
        return stateText
      }
    },
  {
      title: '操作',
      name: 'operation',
      width: 180,
      render: (record) => {
        return (
          <Fragment>
            {getButtonAuth(67) ? <a onClick={() => this.showDetail(record, 0)}>查看</a> : null}
            {record.state === 1 && getButtonAuth(68) ? (
              <Fragment>
              <Divider type="vertical"/>
              <a onClick={() => this.showDetail(record, 1)}>审核</a>
              </Fragment>
            ) : null}
            {getButtonAuth(69) ? (
              <Fragment>
                <Divider type="vertical"/>
                <a onClick={() => this.update(record)}>修改</a>
              </Fragment>
            ) : null}
            {getButtonAuth(70) ? <Fragment>
              <Divider type="vertical"/>
              <a onClick={() => this.del(record)}>删除</a>
            </Fragment> : null}
          </Fragment>
        )
      }
    }
  ]

  // 显示详情
  showDetail(record, type){
      router.push(`/pointCheckTable/detail/${record.batchNo}/${type}`)
  }

  // 添加项目
  addTable(){
    router.push('/pointCheckTable/add')
  }

  // 修改项目
  update(record){
    router.push(`/pointCheckTable/update/${record && record.batchNo || ''}`)
  }

  // 获取车型库
  getCarList() {
    const {dispatch, pointCheckCar: {
        data
      }} = this.props
    const callback = response => {
      const carList = response.data.list || response.list
      this.setState({carList})
    }
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'pointCheckCar/fetch'
      dispatch({type: actionType, payload: defaultPage, callback})
    } else {
      callback(data)
    }
  }

  // 获取系统库
  getSystemList() {
    const {dispatch} = this.props
    const callback = response => {
      const systemList = response.data.list || response.list
      this.setState({systemList})
    }
    const actionType = 'pointCheckSystem/fetch'
    dispatch({type: actionType, payload: {pageNum: 1, pageSize: 100}, callback})
  }

  // 删除项目
  del(record){
    const { dispatch } = this.props
    const actionType =`${pageName}/del`
    const callback = response => {
      if (response.code === 1) {
        message.success('操作成功')
        this.initData()
      } else {
        message.error(response.msg)
      }
    }
    confirm({
      title: '确定要删除该项目吗',
      onOk: () => {
        dispatch({
          type: actionType,
          payload: {
            batchNo: record.batchNo
          },
          callback
        })
      }
    })
  }

  // 模态框配置
  modalFromColumns = () => {
    const {
      modalData: {
        modalFormData: {
          name
        }
      }
    } = this.state
    return [
      {
        title: '类别名称',
        dataIndex: 'name',
        componentType: 'Input',
        initialValue: name,
        requiredMessage: '请输入类别名称',
        required: true,
        placeholder: '请输入类别名称'
      }
    ]
  }

  // 显示模态框
  handleModalVisible = (title, record) => {
    const formData = record || {}
    this.setState({
      modalData: {
        modalTitle: title,
        modalVisible: true,
        modalFormData: formData
      }
    })
  }

  // 设置状态
  setStatus(record){
    const { dispatch } = this.props
    const actionType =`${pageName}/setStatus`
    const callback = response => {
      if (response.code === 1) {
        message.success('操作成功')
        this.handleModalCancel()
        this.initData()
      } else {
        message.error(response.msg)
      }
      this.setState({
        confirmLoading: false
      })
    }
    confirm({
      title: `确定要${record.status === 1 ? '禁用' : '启用'}该类别吗`,
      onOk: () => {
        dispatch({
          type: actionType,
          payload: {
            id: record.id,
            status: record.status === 1 ? 2 : 1
          },
          callback
        })
      }
    })
  }

  // 隐藏模态框
  handleModalCancel = () => {
    this.setState({
      modalData: {
        modalTitle: '',
        modalVisible: false,
        modalFormData: {}
      }
    })
  }

  // 提交模态框数据
  submitModal = fields => {
    const params = fields
    const { dispatch } = this.props
    const {
      modalData,
      modalData: { modalFormData }
    } = this.state
    this.setState({
      confirmLoading: true,
      modalData: {
        ...modalData,
        modalFormData: params
      }
    })
    const actionType = modalFormData.id ? `${pageName}/update` : `${pageName}/add`
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
        this.handleModalCancel()
        this.initData()
      } else {
        message.error(response.msg)
      }
      this.setState({
        confirmLoading: false
      })
    }
    dispatch({
      type: actionType,
      payload: {
        id: modalFormData.id,
        ...params
      },
      callback
    })
  }

  // 列表查询
  initData(payload) {
    const { dispatch } = this.props
    const { pageInfo, searchParams } = this.state
    const params = {
      ...payload,
      ...searchParams
    }
    if (payload) {
      this.setState({
        pageInfo: {
          pageNum: payload.pageNum,
          pageSize: payload.pageSize
        }
      })
    }
    dispatch({
      type: `${pageName}/fetch`,
      payload: Object.keys(params).length > 0 ? params : pageInfo
    })
  }

  // 提交查询
  handleSearch = (e) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return

      const params = {
        ...fieldsValue
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }
      let searchParams = params
      this.setState(
        {
          searchParams,
          pageInfo: defaultPage
        },
        () => {
          this.initData({ ...searchParams, ...defaultPage })
        }
      )
    })


  }

  // 重置搜索表单
  handleFormReset = () => {
    const { form } = this.props
    form.resetFields()
    this.setState(
      {
        searchParams: {},
        pageInfo: defaultPage
      },
      () => this.initData()
    )
  }

  render() {
    const { pointCheckTable:{data}, loading, form: {
        getFieldDecorator
      }} = this.props
    const {
      confirmLoading,
      carList,
      systemList,
      modalData: {
        modalVisible,
        modalTitle
      }
    } = this.state
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      }
    }
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <Row>
          <Col {...searchLayout.searchCol}>
              <Form {...formItemLayout}
                  layout="inline"
                  onSubmit={this.handleSearch}
              >
                <ul className={styles.searchForm}>
                  <li>
                      <Form.Item label="车型">
                      {getFieldDecorator('vehicleModelId')(
                          <Select style={{width: 200 }}>
                            <Option value="">全部</Option>
                            {carList.map(item => (
                              <Option key={item.id}
                                  value={item.id}
                              >{item.name}</Option>
                            ))}
                          </Select>
                      )}
                      </Form.Item>
                  </li>
                  <li>
                  <Form.Item label="系统名称">
                  {getFieldDecorator('checkSystemId')(
                      <Select style={{width: 200 }}>
                      <Option value="">全部</Option>
                      {systemList.map(item => (
                        <Option key={item.id}
                            value={item.id}
                        >{item.name}</Option>
                      ))}
                      </Select>
                  )}
                  </Form.Item>
                  </li>
                  <li>
                  <Form.Item label="状态">
                  {getFieldDecorator('state')(
                      <Select style={{width: 200 }}>
                        <Option value="">全部</Option>
                        <Option value="1">待审核</Option>
                        <Option value="2">已审核</Option>
                        <Option value="3">未通过</Option>
                      </Select>
                  )}
                  </Form.Item>
                  </li>
                  <li>
                    <Button htmlType="submit"
                        type="primary"
                    >
                        查询
                      </Button>
                      <Button
                          onClick={this.handleFormReset}
                          style={{ marginLeft: 10 }}
                      >
                        重置
                    </Button>
                  </li>
                </ul>
              </Form>
            </Col>
            <Col
                {...searchLayout.buttonCol}
                className={styles.searchButton}
            >
              {getButtonAuth(130)
                ? <Fragment>
                <Button onClick={() => this.addTable()}
                    type="primary"
                >新建</Button>
                <AddExecl />
              </Fragment>
                : null}

            </Col>
          </Row>
          <div>
          <StandardTable
              columns={this.columns}
              data={data || []}
              loading={loading}
              onChangeCombine={params => this.initData(params)}
              onSelectRow={this.handleSelectRows}
              rowKey="batchNo"
          />
          </div>
        </Card>
        <ModalFrom
            cancelText="取消"
            columns={this.modalFromColumns()}
            confirmLoading={confirmLoading}
            onCancel={this.handleModalCancel}
            onOk={this.submitModal}
            title={modalTitle}
            visible={modalVisible}
        />
      </Fragment>
          )
  }
}
export default CheckPointTableList
