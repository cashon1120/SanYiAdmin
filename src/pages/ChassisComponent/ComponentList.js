import React, {Component, Fragment} from 'react'
import {
  Divider,
  Card,
  Input,
  Button,
  Form,
  Row,
  Col,
  Select,
  message,
  Modal
} from 'antd'
const Option = Select.Option
import CurrentTitle from '@/common/CurrentTitle/Index'
import DownloadFile from '@/common/DownloadFile/Index'
import StandardTable from '@/common/StandardTable'
import ItemView from '@/common/itemView/Index'
import { router } from '@/common/Plugins'
import styles from '@/layouts/global.less'
import { defaultPage, getButtonAuth } from '@/utils/utils'
import { connect } from '@/common/Plugins'
import {searchLayout} from '../../../public/config'


const pageName = 'importantParts'
const { confirm } = Modal
@connect(({chassisComponent, importantParts, assemblyParts, loading}) => ({chassisComponent, importantParts, assemblyParts, loading: loading.models.assemblyParts}))
@Form.create()

class CheckCar extends Component {
  state = {
    componentId: null, // 当前选中系统id
    allAssmblyList: [],
    assemblyList: [], // 筛选总成部件数据(系统联动)
    confirmLoading: false, // 提交按钮loading状态
    searchParams: {},
    systemList: [],
    filterSystemList: [],
    pageInfo: defaultPage, // 当前分页信息
    downloadVisible: false,
    downloadFiles: []
  }

  componentDidMount() {
    this.initData()
    this.getSystem()
    this.getAssemblyParts()
    this.getVehicleSystem() // 整车系统
  }

  // 获取整车系统数据
  getVehicleSystem() {
    const {dispatch, chassisComponent: {
        vehicleSystem
      }} = this.props
    if (vehicleSystem.length === 0) {
      const actionType = 'chassisComponent/fetchVehicleSystem'
      dispatch({type: actionType, payload: {        pageSize: 0,
        pageNum: 0}})
    }
  }

// 获取系统数据
getSystem() {
  const {dispatch} = this.props
  const callback = res => {
    if (res.code === 1) {
      this.setState({systemList: res.data.list})
    }
  }
  const actionType = 'chassisComponent/fetchSystem'
  dispatch({
    type: actionType,
    payload: {
      pageSize: 0,
      pageNum: 0
    },
    callback
  })
}

  // 表格配置
  columns = [{
    title: '系统名称',
    dataIndex: 'componentName',
    name: 'componentName'
  },{
    title: '部件总成',
    dataIndex: 'assemblyComponentName',
    name: 'assemblyComponentName'
  },{
    title: '核心零部件',
    dataIndex: 'coreComponentName',
    name: 'coreComponentName'
  }, {
    title: '图片展示',
    dataIndex: 'picture',
    name: 'picture',
    render: picture => <ItemView files={picture} />
  }, {
    title: '描述',
    dataIndex: 'partDescription',
    name: 'partDescription'
  }, {
    title: '附件',
    width: 80,
    dataIndex: 'failureModeAttachment',
    name: 'failureModeAttachment',
    render: failureModeAttachment => {
      let button = <a onClick={() => this.showDownFileModal(failureModeAttachment)}>下载</a>
      if(!getButtonAuth(128)){
        button = '无权下载'
      }
      return button
    }
  }, {
    title: '操作',
    name: 'operation',
    width: 200,
    render: (record) => {
      return (
        <Fragment>
          {getButtonAuth(122) ? <a onClick={() => this.detail(record)}>查看</a> : null}
          {getButtonAuth(124) ? <Fragment>
          <Divider type="vertical"/>
          <a onClick={() => this.update(record)}>修改</a >
          </Fragment> : null}
          {getButtonAuth(125) ? <Fragment>
          <Divider type="vertical"/>
          <a onClick={() => this.del(record)}>删除</a>
          </Fragment> : null}
        </Fragment>
      )
    }
  }
  ]

  // 查看详情
  detail(record){
    router.push(`/chassisComponent/detail/3/${record.id}`)
  }

  // 修改
  update(record){
    router.push(`/chassisComponent/update/3/${record.id}`)
  }

  // 添加
  addNew(){
    router.push('/chassisComponent/add/3')
  }

   // 下载附件
  showDownFileModal = (data) => {
    const { downloadVisible } = this.state
    let downloadFiles = data || []
    this.setState({
      downloadVisible: !downloadVisible,
      downloadFiles
    })
  }

  // 删除项目
  del(record){
    const { dispatch } = this.props
    const actionType ='chassisComponent/del'
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
            id: record.id
          },
          callback
        })
      }
    })
  }

  filterAssemblyList = (text, e, form) => {
    form.setFieldsValue({
      assemblyComponentId: ''
    })
    const { allAssmblyList} = this.state
    const assemblyList = allAssmblyList.filter(item => item.componentId === text)
    if(text > 0){
      this.setState({
        assemblyList
      })
    }else{
      this.setState({
        assemblyList: allAssmblyList
      })
    }
  }

  // 获取类型数据
  getAssemblyParts(){
    const { dispatch } = this.props
    const callback = res => {
      if (res.code === 1) {
        this.setState({allAssmblyList: res.data.list})
      }
    }
    dispatch({
      type: 'assemblyParts/fetch',
      payload: {
        pageSize: 0,
        pageNum: 0
      },
      callback
    })
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

  handleSetSystemList = (text, form) => {
    form.setFieldsValue({systemId: ''})
    const {systemList} = this.state
    const filterSystemList = systemList.filter(item => item.parentId === Number.parseInt(text))
    this.setState({filterSystemList})
  }

  render() {
    const { chassisComponent: {vehicleSystem}, importantParts, loading, form, form: {
        getFieldDecorator
      }} = this.props
    const {
      assemblyList, downloadVisible, downloadFiles, filterSystemList
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
          <Row>
            <Col {...searchLayout.searchCol}>
              <Form {...formItemLayout}
                  layout="inline"
                  onSubmit={this.handleSearch}
              >
                <ul className={styles.searchForm}>
                <li>
                    <Form.Item label="整车系统">
                      {getFieldDecorator('vehicleSystemId', {initialValue: ''})(
                        <Select
                            onChange={(text) => {
                          this.handleSetSystemList(text, form)
                        }}
                            style={{
                          width: 200
                        }}
                        >
                          <Option value="">请选择</Option>
                          {vehicleSystem.map(item => (
                            <Option key={item.id}
                                value={item.id}
                            >{item.componentName}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="系统名称">
                      {getFieldDecorator('systemId',{
                        initialValue: ''
                      })(
                        <Select onChange={(text, e) => {
                          this.filterAssemblyList(text, e, form)
                        }}
                            style={{width: 200 }}
                        >
                         <Option value="">请选择</Option>
                         {filterSystemList.map(item => (
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
                      {getFieldDecorator('assemblyComponentId', {initialValue: ''})(
                        <Select style={{width: 200 }}>
                        <Option value="">请选择</Option>
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
                    <Form.Item label="有无附件">
                      {getFieldDecorator('existAnnex', {initialValue: ''})(
                        <Select
                            style={{
                          width: 150
                        }}
                        >
                          <Option value="">全部</Option>
                          <Option value="1">有</Option>
                          <Option value="0">无</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="核心零部件">
                      {getFieldDecorator('coreComponentName', {})(
                        <Input/>)}
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
              {getButtonAuth(123) ?
              <Fragment>
              <Button onClick={() => this.addNew()}
                  type="primary"
              >新建</Button>
            </Fragment>
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
        <DownloadFile data={downloadFiles}
            onCancel={this.showDownFileModal}
            onOk={this.showDownFileModal}
            visible={downloadVisible}
        />
      </Fragment>
    )
  }
}
export default CheckCar