import React, {Component, Fragment} from 'react'
import {
  Divider,
  Card,
  Input,
  Button,
  Form,
  Row,
  Col,
  message,
  Select,
  Modal
} from 'antd'
const Option = Select.Option
import CurrentTitle from '@/common/CurrentTitle/Index'
import StandardTable from '@/common/StandardTable'
import ModalFrom from '@/common/ModalForm'
import styles from '../../layouts/global.less'
import { defaultPage, getButtonAuth } from '@/utils/utils'
import { connect } from '@/common/Plugins'

const { confirm } = Modal
const pageName = 'assemblyParts'
@connect(({assemblyParts, loading}) => ({assemblyParts, loading: loading.models.assemblyParts}))
@Form.create()

class AssemblyParts extends Component {
  state = {
    confirmLoading: false, // 提交按钮loading状态
    searchParams: {},
    pageInfo: defaultPage, // 当前分页信息
    modalData: {
      modalTitle: '', // 模态框标题
      modalVisible: false, // 显示模态框
      modalFormData: {} // 用于模态框表单数据: 添加的时候为空, 修改或删除的时候对应该条数据信息
    }
  }

  componentDidMount() {
    this.initData()
    this.getSystemComponent()
  }

  // 表格配置
  columns = [{
    title: '系统名称',
    dataIndex: 'componentName',
    name: 'componentName'
  },{
    title: '总成部件分类',
    dataIndex: 'assemblyComponentName',
    name: 'assemblyComponentName'
  }, {
      title: '操作',
      name: 'operation',
      width: 200,
      render: (record) => {
        return (
          <Fragment>
            {getButtonAuth(88) ? <a onClick={() => this.handleModalVisible('修改总成部件名称', record)}>修改</a>: null}
            {getButtonAuth(87) ?
              <Fragment><Divider type="vertical"/>
              <a onClick={() => this.setStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</a></Fragment>
            : null}
          </Fragment>
        )
      }
    }
  ]

  // 渲染类别名
  checkTypeName(id){
    const { pointCheckType:{ systemList } } = this.props
    let typeName = ''
    systemList.list.forEach(item => {
      if(item.id === id){
        typeName = item.name
      }
    })
    return (<span>{typeName}</span>)
  }

  // 模态框配置
  modalFromColumns = () => {
    const {
      modalData: {
        modalFormData: {
          assemblyComponentName,
          componentId
        }
      }
    } = this.state
    const { assemblyParts:{ systemList } } = this.props
    return [
      {
        title: '系统名称',
        dataIndex: 'componentId',
        componentType: 'Select',
        initialValue: componentId,
        requiredMessage: '请选择系统名称',
        required: true,
        placeholder: '请选择系统名称',
        dataSource: systemList
      },
      {
        title: '总成部件名称',
        dataIndex: 'assemblyComponentName',
        componentType: 'Input',
        initialValue: assemblyComponentName,
        requiredMessage: '请输入总成部件名称',
        required: true,
        placeholder: '请输入总成部件名称'
      }
    ]
  }

  // 获取类型数据
  getSystemComponent(){
    const { dispatch, assemblyParts:{ systemList } } = this.props
    if(systemList.length <= 0){
      dispatch({
        type: `${pageName}/fetchSystem`,
        payload: defaultPage
      })
    }
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
      title: `确定要${record.status === 1 ? '禁用' : '启用'}该项目吗`,
      onOk: () => {
        dispatch({
          type: actionType,
          payload: {
            id: record.id,
            state: record.state === 1 ? 2 : 1
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
      modalData: { modalFormData }
    } = this.state
    this.setState({
      confirmLoading: true
    })
    const actionType = modalFormData.id ? `${pageName}/update` : `${pageName}/add`
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
        this.handleModalCancel()
        this.handleFormReset()
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
    const { assemblyParts: { data, systemList }, loading, form: {
        getFieldDecorator
      }} = this.props
    const {
      confirmLoading,
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
          <Row
              gutter={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2
          }}
          >
            <Col lg={21}
                md={17}
                sm={8}
                xs={5}
            >
              <Form {...formItemLayout}
                  layout="inline"
                  onSubmit={this.handleSearch}
              >
                <ul className={styles.searchForm}>
                  <li>
                    <Form.Item label="系统名称">
                      {getFieldDecorator('checkTypeId')(
                        <Select style={{width: 200 }}>
                         <Option value="">全部</Option>
                         {systemList.map(item => (
                          <Option key={item.id}
                              value={item.id}
                          >{item.componentName}</Option>
                        ))}
                        </Select>
                      )}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="总成名称">
                      {getFieldDecorator('name', {})(
                        <Input/>,)}
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
                lg={3}
                md={3}
                sm={8}
                style={{
              textAlign: 'right'
            }}
                xs={3}
            >
              {getButtonAuth(86) ?
              <Button onClick={() => this.handleModalVisible('新增总成')}
                  type="primary"
              >新建</Button>
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
              rowKey="id"
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
export default AssemblyParts
