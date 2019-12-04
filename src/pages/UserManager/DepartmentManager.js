import React, {Component, Fragment} from 'react'
import { Divider, Card, Input,Button, Form, Row, Col, message, Modal } from 'antd'
import CurrentTitle from '@/common/CurrentTitle/Index'
import StandardTable from '@/common/StandardTable'
import ModalFrom from '@/common/ModalForm'
import styles from '../../layouts/global.less'
import { defaultPage, getButtonAuth } from '@/utils/utils'
import { connect } from '@/common/Plugins'
import {searchLayout} from '../../../public/config'

const { confirm } = Modal
const pageName = 'departmentManager'

@Form.create()
@connect(({departmentManager, loading}) => ({departmentManager, loading: loading.models.departmentManager}))

class DepartmentManager extends Component {
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
  }

  // 表格配置
  columns = [{
    title: '部门名称',
    dataIndex: 'departName',
    name: 'departName'
  },{
    title: '说明',
    dataIndex: 'remark',
    name: 'remakr'
  },{
    title: '添加时间',
    dataIndex: 'crtAt',
    name: 'crtAt'
  }, {
      title: '操作',
      name: 'operation',
      width: 200,
      render: (record) => {
        return (
          <Fragment>
            {getButtonAuth(95) ? <a onClick={() => this.handleModalVisible('修改部门名称', record)}>修改</a> : null}
            {getButtonAuth(96) ? <Fragment>
              <Divider type="vertical"/>
              <a onClick={() => this.del(record)}>删除</a>
            </Fragment> : null}
          </Fragment>
        )
      }
    }
  ]

  // 模态框配置
  modalFromColumns = () => {
    const {
      modalData: {
        modalFormData: {
          departName,
          remark
        }
      }
    } = this.state
    return [
      {
        title: '部门名称',
        dataIndex: 'departName',
        componentType: 'Input',
        initialValue: departName,
        requiredMessage: '请输入部门名称',
        required: true,
        placeholder: '请输入部门名称'
      },
      {
        title: '说明',
        dataIndex: 'remark',
        componentType: 'TextArea',
        initialValue: remark
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
      this.setState({
        confirmLoading: false
      })
    }
    confirm({
      title: '确定要删除该部门吗',
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
    const {departmentManager:{data}, loading, form: {
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
          <Row>
            <Col {...searchLayout.searchCol}>
              <Form {...formItemLayout}
                  layout="inline"
                  onSubmit={this.handleSearch}
              >
                <ul className={styles.searchForm}>
                  <li>
                    <Form.Item label="部门名称">
                      {getFieldDecorator('departName', {})(
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
                {...searchLayout.buttonCol}
                className={styles.searchButton}
            >
              {getButtonAuth(94) ? <Button onClick={() => this.handleModalVisible('新增部门')}
                  type="primary"
                                   >新建</Button> : null}

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
export default DepartmentManager
