import React, {Component, Fragment} from 'react'
import { Divider,Card,Input,Button,Form,Row,Col,message,Modal} from 'antd'
import CurrentTitle from '@/common/CurrentTitle/Index'
import StandardTable from '@/common/StandardTable'
import ModalFrom from '@/common/ModalForm'
import styles from '../../layouts/global.less'
import { defaultPage, validator, getButtonAuth } from '@/utils/utils'
import { connect } from '@/common/Plugins'
import {searchLayout} from '../../../public/config'

const {confirm} = Modal
const pageName = 'userManager'

@Form.create()
@connect(({userManager, departmentManager, characterManager, loading}) => ({userManager, departmentManager, characterManager, loading: loading.models.userManager}))

class UserManager extends Component {
  state = {
    confirmLoading: false, // 提交按钮loading状态
    searchParams: {},
    pageInfo: defaultPage, // 当前分页信息
    characterManager: [],
    departmentManager: [],
    modalData: {
      modalTitle: '', // 模态框标题
      modalVisible: false, // 显示模态框
      modalFormData: {} // 用于模态框表单数据: 添加的时候为空, 修改或删除的时候对应该条数据信息
    }
  }

  componentDidMount() {
    this.initData()
    this.getDepartment()
    this.getCharacter()
  }

  // 获取部门
  getDepartment(){
    const { dispatch } = this.props
    const callback = response => {
      if(response.code === 1){
        this.setState({
          departmentManager: response.data.list
        })
      }
    }
    dispatch({
      type: 'departmentManager/fetch',
      payload: {
        pageNum: 0,
        pageSize: 0
      },
      callback
    })
  }

  // 获取角色
  getCharacter(){
    const { dispatch } = this.props
    const callback = response => {
      if(response.code === 1){
        this.setState({
          characterManager: response.data.list
        })
      }
    }
    dispatch({
      type: 'characterManager/fetch',
      payload: {
        pageNum: 0,
        pageSize: 0
      },
      callback
    })
  }

  // 表格配置
  columns = [
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100,
      name: 'realName'
    },    {
      title: '域名',
      dataIndex: 'userName',
      width: 100,
      name: 'userName'
    }, {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      name: 'sex',
      render: sex => sex === 1
        ? '男'
        : sex === 2
          ? '女'
          : '未知'
    }, {
      title: '邮箱',
      dataIndex: 'email',
      name: 'email'
    }, {
      title: '身份证号码',
      dataIndex: 'idCard',
      name: 'idCard'
    }, {
      title: '联系方式',
      dataIndex: 'phone',
      name: 'phone'
    }, {
      title: '所在部门',
      dataIndex: 'departName',
      name: 'departName',
      width: 100
    }, {
      title: '角色',
      width: 100,
      dataIndex: 'roleName',
      name: 'roleName'
    }, {
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
          {getButtonAuth(99) ? <a onClick={() => this.handleModalVisible('修改用户', record)}>修改</a> : null}
          {getButtonAuth(100) ? <Fragment>
            <Divider type="vertical"/>
            <a onClick={() => this.disableUser(record)}>{record.locks ? '启用' : '禁用'}</a>
          </Fragment> : null}
          {getButtonAuth(109) ? <Fragment>
            <Divider type="vertical"/>
            <a onClick={() => this.resetPwd(record)}>重置密码</a>
          </Fragment> : null}
        </Fragment>
        )
      }
    }
  ]

  // 禁用
  disableUser(record){
    const {dispatch} = this.props
    const actionType = `${pageName}/disableUser`
    const locks = record.locks ? 0 : 1
    const callback = response => {
      if (response.code === 1) {
        message.success('操作成功')
        this.initData()
      } else {
        message.error(response.msg)
      }
      this.setState({confirmLoading: false})
    }
    confirm({
      title: `确定要${locks === 0 ? '启用' : '禁用'}该用户吗?`,
      onOk: () => {
        dispatch({
          type: actionType,
          payload: {
            id: record.id,
            locks
          },
          callback
        })
      }
    })
  }

  // 重置密码
  resetPwd(record){
    const {dispatch} = this.props
    const actionType = `${pageName}/resetPassword`
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
      } else {
        message.error(response.msg)
      }
      this.setState({confirmLoading: false})
    }
    confirm({
      title: '确定要重置该用户密码吗?',
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

  // 模态框配置
  modalFromColumns = () => {
    let {
      characterManager,
      departmentManager,
      modalData: {
        modalFormData: { userName, realName, sex, email, idCard, phone, departId, roleId  }
      }
    } = this.state
    sex = sex || ''
    return [
      {
        title: '姓名',
        dataIndex: 'realName',
        componentType: 'Input',
        initialValue: realName,
        requiredMessage: '请输入用户姓名',
        required: true,
        placeholder: '请输入用户姓名'
      },
      {
        title: '域名',
        dataIndex: 'userName',
        componentType: 'Input',
        initialValue: userName,
        requiredMessage: '请输入域名',
        required: true,
        placeholder: '请输入域名'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        componentType: 'Select',
        initialValue: sex.toString(),
        requiredMessage: '请选择性别',
        placeholder: '请选择性别',
        required: true,
        dataSource: [
          {
            value: '1',
            name: '男'
          }, {
            value: '2',
            name: '女'
          }
        ]
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        componentType: 'Select',
        initialValue: roleId,
        requiredMessage: '请选择角色',
        dataSource: characterManager,
        selectName: 'roleName',
        required: true
      },
      {
        title: '所在部门',
        dataIndex: 'departId',
        componentType: 'Select',
        initialValue: departId,
        selectName: 'departName',
        dataSource: departmentManager,
        placeholder: '请选择部门',
        requiredMessage: '请选择部门'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        componentType: 'Input',
        initialValue: email,
        placeholder: '请输入登录邮箱',
        validator: validator.checkEmail
      },
      {
        title: '身份证号码',
        dataIndex: 'idCard',
        componentType: 'Input',
        initialValue: idCard,
        placeholder: '请输入身份证号码',
        validator: validator.checkIdcard
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        componentType: 'Input',
        initialValue: phone,
        placeholder: '请输入联系电话',
        validator: validator.checkPhone
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
    const {dispatch} = this.props
    const {modalData, modalData: {
        modalFormData
      }} = this.state
    this.setState({
      confirmLoading: true,
      modalData: {
        ...modalData,
        modalFormData: params
      }
    })
    const actionType = modalFormData.id >= 0
      ? `${pageName}/update`
      : `${pageName}/add`
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
        this.handleModalCancel()
        this.initData()
      } else {
        message.error(response.msg)
      }
      this.setState({confirmLoading: false})
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
    const {dispatch} = this.props
    const {pageInfo, searchParams} = this.state
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
      payload: Object
        .keys(params)
        .length > 0
        ? params
        : pageInfo
    })
  }

  // 提交查询
  handleSearch = (e) => {
    e.preventDefault()
    const {form} = this.props
    form.validateFields((err, fieldsValue) => {
      if (err)
        return

      const params = {
        ...fieldsValue
      }
      let searchParams = params
      this.setState({
        searchParams,
        pageInfo: defaultPage
      }, () => {
        this.initData({
          ...searchParams,
          ...defaultPage
        })
      })
    })
  }

  // 重置搜索表单
  handleFormReset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      searchParams: {},
      pageInfo: defaultPage
    }, () => this.initData())
  }

  render() {
    const {userManager: {
        data
      }, loading, form: {
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
                    <Form.Item label="用户名称">
                      {getFieldDecorator('realName')(<Input/>)}
                    </Form.Item>
                  </li>
                  <li>
                    <Form.Item label="手机号码">
                      {getFieldDecorator('phone')(<Input/>)}
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
                        style={{
                      marginLeft: 10
                    }}
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
              {getButtonAuth(98) ? <Button onClick={() => this.handleModalVisible('新增用户')}
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
export default UserManager
