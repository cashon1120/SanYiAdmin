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
const pageName = 'importantParts'
@connect(({importantParts, assemblyParts, loading}) => ({importantParts, assemblyParts, loading: loading.models.assemblyParts}))
@Form.create()

class CheckCar extends Component {
  state = {
    componentId: null, // 当前选中系统id
    assemblyList: [], // 筛选总成部件数据(系统联动)
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
    this.getAssemblyParts()
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
  },{
    title: '核心零部件',
    dataIndex: 'coreComponentName',
    name: 'coreComponentName'
  }, {
      title: '操作',
      name: 'operation',
      width: 200,
      render: (record) => {
        return (
          <Fragment>
            {getButtonAuth(92) ? <a onClick={() => this.handleModalVisible('修改核心零部件名称', record)}>修改</a>: null}
            {getButtonAuth(91) ?
              <Fragment><Divider type="vertical"/>
              <a onClick={() => this.setStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</a></Fragment>
            : null}
          </Fragment>
        )
      }
    }
  ]

  filterAssemblyList = (text, e, form) => {
    form.setFieldsValue({
      assemblyComponentId: ''
    })
    const { assemblyParts:{ data } } = this.props
    const list = data.list || data.data.list
    const assemblyList = list.filter(item => item.componentId === text)
    if(text > 0){
      this.setState({
        assemblyList
      })
    }else{
      this.setState({
        assemblyList: list
      })
    }
  }

  // 获取类型数据
  getSystemComponent(){
    const { dispatch, assemblyParts:{ systemList } } = this.props
    if(systemList.length <= 0){
      dispatch({
        type: 'assemblyParts/fetchSystem',
        payload: defaultPage
      })
    }
  }

  // 获取类型数据
  getAssemblyParts(){
    const { dispatch, assemblyParts:{ data } } = this.props
    const list = data.list || data.data.list
    if(list.length <= 0){
      dispatch({
        type: 'assemblyParts/fetch',
        payload: defaultPage
      })
    }
  }

  // 模态框配置
  modalFromColumns = () => {
    const {
      assemblyList,
      modalData: {
        modalFormData: {
          coreComponentName,
          componentId,
          assemblyComponentId
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
        requiredMessage: '请选择系统',
        required: true,
        handleChange: this.filterAssemblyList,
        placeholder: '请选择系统',
        dataSource: systemList
      },
      {
        title: '总成部件',
        dataIndex: 'assemblyComponentId',
        componentType: 'Select',
        initialValue: assemblyComponentId,
        requiredMessage: '请选择总成部件',
        required: true,
        placeholder: '请选择总成部件',
        dataSource: assemblyList
      },
      {
        title: '核心零部件',
        dataIndex: 'assemblyComponentName',
        componentType: 'Input',
        initialValue: coreComponentName,
        requiredMessage: '请输入核心部件名称',
        required: true,
        placeholder: '请输入核心部件名称'
      }
    ]
  }

  // 获取类型数据
  getPointCheckType(){
    const { dispatch, pointCheckType:{ data } } = this.props
    if(data.list.length <= 0){
      dispatch({
        type: 'pointCheckType/fetch',
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
    if(record){
      const { assemblyParts:{ data } } = this.props
      const list = data.list || data.data.list
      this.setState({
        assemblyList: list
      })
    }
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
    let params = fields
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
    params = {
      componentId: fields.assemblyComponentId,
      assemblyComponentName: fields.assemblyComponentName
    }
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
    const { importantParts, assemblyParts:{ systemList }, loading, form, form: {
        getFieldDecorator
      }} = this.props
    const {
      confirmLoading,
      assemblyList,
      modalData: {
        modalVisible,
        modalTitle
      }
    } = this.state
    const _data = importantParts.data
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
                      {getFieldDecorator('componentId',{
                        initialValue: ''
                      })(
                        <Select onChange={(text, e) => {
                          this.filterAssemblyList(text, e, form)
                        }}
                            style={{width: 200 }}
                        >
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
                    <Form.Item label="部件总成">
                      {getFieldDecorator('assemblyComponentId')(
                        <Select style={{width: 200 }}>
                         {assemblyList.map(item => (
                          <Option key={item.id}
                              value={item.id}
                          >{item.assemblyComponentName}</Option>
                        ))}
                        </Select>
                      )}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="核心零部件">
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
              {getButtonAuth(90) ?
              <Button onClick={() => this.handleModalVisible('新增核心零部件')}
                  type="primary"
              >新建</Button>
              : null}
            </Col>
          </Row>
          <div>
          <StandardTable
              columns={this.columns}
              data={_data || []}
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
      export default CheckCar