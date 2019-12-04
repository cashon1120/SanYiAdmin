import React, {Component, Fragment} from 'react';
import { Button, Select, Divider, Card, Input, Row, Col, Form, message, Modal } from 'antd';
import StandardTable from '@/common/StandardTable'
import {connect} from 'dva';
import CurrentTitle from '@/common/CurrentTitle/Index'
import AddExecl from '@/common/AddExecl/Index'
import { router } from '../../common/Plugins'
import { defaultPage, getButtonAuth } from '@/utils/utils'
import styles from '../../layouts/global.less'
import {searchLayout} from '../../../public/config'

const Option = Select.Option;
const pageName = 'chassisSystem'
const { confirm } = Modal
let searchForm = null
@Form.create()
@connect(({chassisSystem, assemblyParts, importantParts, loading}) => ({chassisSystem, assemblyParts, importantParts, loading: loading.models.chassisSystem}))

class ChassisSystemList extends Component {
  state = {
    coreComponentList: [], //核心零部件
    typeId: this.props.match.params.typeId, //类型
    pageInfo: defaultPage, // 当前分页信息
    title: '',
    assemblyComponentList: []
  }

  componentDidMount() {
    this.getAssemblyParts()
    this.getImportantParts()
    this.initData()
    searchForm = this.refs.searchForm
    this.setSearchFormWidth()
    window.addEventListener('resize', this.setSearchFormWidth)
  }


  componentWillReceiveProps(props) {
    const { typeId } = props.match.params;
    if (typeId !== this.state.typeId) {
      this.setState({
        typeId
      }, () => {
        this.handleFormReset()
        this.getAssemblyParts()
      });
    }
  }

  setSearchFormWidth = () => {
    searchForm.style.width = Math.max(330, window.innerWidth - 450) + 'px'
  }

  // 获取总成部件数据
  getAssemblyParts() {
    const {dispatch} = this.props
    const {typeId} = this.state
    const callback = res => {
      if (res.code === 1) {
        this.setState({assemblyComponentList: res.data.list})
      }
    }
    const actionType = 'assemblyParts/fetch'
    dispatch({
      type: actionType,
      payload: {
        componentId: typeId,
        ...defaultPage
      },
      callback
    })

  }

  // 获取核心部件数据
  getImportantParts(){
    const {dispatch, importantParts: {
      data
    }} = this.props
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'importantParts/fetch'
      dispatch({type: actionType, payload: defaultPage})
    }
  }

  columns = [ {
      title: '总成部件',
      dataIndex: 'assemblyComponentName',
      name: 'assemblyComponentName',
      width: 120,
      render: assemblyComponentName => assemblyComponentName ? assemblyComponentName : '无'
    }, {
      title: '核心零部件',
      dataIndex: 'coreComponentName',
      width: 100,
      name: 'coreComponentName',
      render: coreComponentName => coreComponentName ? coreComponentName : '无'
    },{
      title: '故障模式',
      dataIndex: 'failureMode',
      name: 'failureMode',
      width: 400
    }, {
      title: '版本号',
      width: 100,
      dataIndex: 'version',
      name: 'version'
    }, {
      title: '状态',
      width: 100,
      dataIndex: 'approvalState',
      name: 'approvalState',
      render: approvalState => {
        let status = ''
        if (approvalState == '1') {
          status = '待审核'
        } else if (approvalState == '2') {
          status = '已审核'
        } else if (approvalState == '3') {
          status = '驳回修改'
        }
        return <span>{status}</span>
      }
    }, {
      title: '操作',
      name: 'operation',
      width: 180,
      render: (record) => {
        let operation = '更新'
        if (record.approvalState == '2') {
          if(record.showState === 2){
            operation = ''
          }else{
            operation = '更新'
          }

        } else if (record.approvalState == '3' || record.approvalState == '1') {
          operation = '修改'
        }
        return (
          <Fragment>
            {getButtonAuth(66) ? <a onClick={() => this.detail(record)}>查看</a> : null}
            {getButtonAuth(107) && record.approvalState === 1 ? <Fragment>
              <Divider type="vertical"/>
            <a onClick={() => this.detail(record, 1)}>审核</a>
            </Fragment> : null}
            {getButtonAuth(65) ? <Fragment>
            {record.showState === 2 && record.approvalState == '2' ? null : <Divider type="vertical"/>}
            <a onClick={() => this.update(record)}>{operation}</a >
            </Fragment> : null}
            {getButtonAuth(105) ? <Fragment>
            <Divider type="vertical"/>
            <a onClick={() => this.del(record)}>删除</a>
            </Fragment> : null}
          </Fragment>
        )
      }
    }
  ]

  // 列表查询
  initData(payload) {
    const { dispatch } = this.props
    const { pageInfo, searchParams, typeId } = this.state
    if(typeId === 0) return
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
      payload: Object.keys(params).length > 0 ? {...params, secondaryComponentId: typeId} : {...pageInfo, secondaryComponentId: typeId}
    })
  }


  // 查看详情
  detail(record, type){
    if(type){
      router.push(`/chassisSystem/detail/${record.id}/${type}`)
    }else{
      router.push(`/chassisSystem/detail/${record.id}`)
    }
  }


  // 修改
  update(record){
    const { typeId } = this.state
    router.push(`/chassisSystem/update/${typeId}/${record.id}`)
  }

  // 添加
  addNew(){
    const {typeId} = this.state
    router.push(`/chassisSystem/add/${typeId}`)
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
            id: record.id
          },
          callback
        })
      }
    })
  }

  // 过虑核心零部件列表(联动)
  filterCoreComponent = (text, e, form) => {
    form.setFieldsValue({
      coreComponentId: ''
    },()=>{
      const { importantParts:{ data } } = this.props
      const list = data.list || data.data.list
      const coreComponentList = list.filter(item => item.assemblyComponentId === Number.parseInt(text))
      if(text){
        this.setState({
          coreComponentList
        })
      }else{
        this.setState({
          coreComponentList: list
        })
      }
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
      };
      let searchParams = params
      this.setState(
        {
          searchParams,
          pageInfo: defaultPage
        },
        () => {
          this.initData({ ...searchParams, ...defaultPage })
        }
      );
    });
  };

  render() {
    const { chassisSystem:{data}, form, form: {getFieldDecorator}, loading} = this.props
    const {coreComponentList, assemblyComponentList} = this.state
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
          span: 10
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
                <ul className={styles.searchForm}
                    ref="searchForm"
                >
                  <li>
                    <Form.Item label="总成部件">
                      {getFieldDecorator('assemblyComponentId',{
                        initialValue: ''
                      })(
                        <Select onChange={(text, e) => {
                          this.filterCoreComponent(text, e, form)
                        }}
                            style={{width: 150 }}
                        >
                         <Option value="">请选择</Option>
                         {assemblyComponentList.map(item => (
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
                      {getFieldDecorator('coreComponentId',{
                        initialValue: ''
                      })(
                        <Select style={{width: 150 }}>
                          <Option value="">请选择</Option>
                         {coreComponentList.map(item => (
                          <Option key={item.id}
                              value={item.id}
                          >{item.coreComponentName}</Option>
                        ))}
                        </Select>
                      )}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="故障模式">
                      {getFieldDecorator('failureMode')(
                        <Input />)}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="状态">
                      {getFieldDecorator('approvalState', {
                        initialValue: ''
                      })(
                        <Select
                            style={{
                      width: 150
                    }}
                        >
                      <Option value="">全部</Option>
                      <Option value="1">待审核</Option>
                      <Option value="2">已审核</Option>
                      <Option value="3">驳回修改</Option>
                    </Select>)}
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
              {getButtonAuth(64) ? <Fragment>
              <Button onClick={() => this.addNew()}
                  type="primary"
              >新建</Button>
              <AddExecl />
            </Fragment> : null}
{/*
            {getButtonAuth(106) ? <Button type="primary">导出</Button> : null} */}
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
      </Fragment>
    )
  }
}
export default ChassisSystemList
