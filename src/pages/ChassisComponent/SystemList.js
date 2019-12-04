import React, {Component, Fragment} from 'react';
import {
  Input,
  Button,
  Select,
  Divider,
  Card,
  Row,
  Col,
  Form,
  message,
  Modal
} from 'antd';
import StandardTable from '@/common/StandardTable'
import {connect} from 'dva';
import CurrentTitle from '@/common/CurrentTitle/Index'
import DownloadFile from '@/common/DownloadFile/Index'
import AddExecl from '@/common/AddExecl/Index'
import ItemView from '@/common/itemView/Index'
import {router} from '@/common/Plugins'
import {defaultPage, getButtonAuth} from '@/utils/utils'
import styles from '@/layouts/global.less'
import {searchLayout} from '../../../public/config'

const Option = Select.Option;
const pageName = 'chassisComponent'
const {confirm} = Modal

@Form.create()
@connect(({chassisComponent, assemblyParts, importantParts, loading}) => ({chassisComponent, assemblyParts, importantParts, loading: loading.models.chassisComponent}))

class ChassisPartList extends Component {
  state = {
    coreComponentList: [], //核心零部件
    pageInfo: defaultPage, // 当前分页信息
    downloadVisible: false,
    downloadFiles: []
  }

  componentDidMount() {
    this.initData()
    this.getVehicleSystem() // 整车系统
  }

  // 获取整车系统数据
  getVehicleSystem() {
    const {dispatch, chassisComponent: {
        vehicleSystem
      }} = this.props
    if (vehicleSystem.length === 0) {
      const actionType = 'chassisComponent/fetchVehicleSystem'
      dispatch({type: actionType, payload: defaultPage})
    }
  }

  columns = [
    {
      title: '整车系统',
      dataIndex: 'primarySystemName',
      name: 'primarySystemName'
    }, {
      title: '系统名称',
      dataIndex: 'componentName',
      name: 'componentName'
    }, {
      title: '图片展示',
      dataIndex: 'picture',
      name: 'picture',
      render: picture => <ItemView files={picture}/>
    }, {
      title: '描述',
      width: 300,
      dataIndex: 'partDescription',
      name: 'partDescription'
    }, {
      title: '附件',
      width: 80,
      dataIndex: 'failureModeAttachment',
      name: 'failureModeAttachment',
      render: failureModeAttachment => {
        let button = <a onClick={() => this.showDownFileModal(failureModeAttachment)}>下载</a>
        if (!getButtonAuth(126)) {
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
            {getButtonAuth(117)
              ? <a onClick={() => this.detail(record)}>查看</a>
              : null}
            {getButtonAuth(115)
              ? <Fragment>
                  <Divider type="vertical"/>
                  <a onClick={() => this.update(record)}>修改</a >
                </Fragment>
              : null}
            {getButtonAuth(116)
              ? <Fragment>
                  <Divider type="vertical"/>
                  <a onClick={() => this.del(record)}>删除</a>
                </Fragment>
              : null}
          </Fragment>
        )
      }
    }
  ]

  // 列表查询
  initData(payload) {
    const {dispatch} = this.props
    const {pageInfo, searchParams, typeId} = this.state
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
      type: `${pageName}/fetchSystem`,
      payload: Object
        .keys(params)
        .length > 0
        ? {
          ...params,
          secondaryComponentId: typeId
        }
        : {
          ...pageInfo,
          secondaryComponentId: typeId
        }
    })
  }

  // 查看详情
  detail(record) {
    router.push(`/chassisComponent/detail/1/${record.id}`)
  }

  // 修改
  update(record) {
    router.push(`/chassisComponent/update/1/${record.id}`)
  }

  // 添加
  addNew() {
    router.push('/chassisComponent/add/1')
  }

  // 下载附件
  showDownFileModal = (data) => {
    const {downloadVisible} = this.state
    let downloadFiles = data || []
    this.setState({
      downloadVisible: !downloadVisible,
      downloadFiles
    })
  }

  // 删除项目
  del(record) {
    const {dispatch} = this.props
    const actionType = 'chassisComponent/del'
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

  // 重置搜索表单
  handleFormReset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      searchParams: {},
      pageInfo: defaultPage
    }, () => this.initData())
  }

  // 过虑核心零部件列表(联动)
  filterCoreComponent = (text, e, form) => {
    form.setFieldsValue({
      coreComponentId: ''
    }, () => {
      const {importantParts: {
          data
        }} = this.props
      const list = data.list || data.data.list
      const coreComponentList = list.filter(item => item.assemblyComponentId === Number.parseInt(text))
      if (text) {
        this.setState({coreComponentList})
      } else {
        this.setState({coreComponentList: list})
      }
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
      };
      let searchParams = params
      this.setState({
        searchParams,
        pageInfo: defaultPage
      }, () => {
        this.initData({
          ...searchParams,
          ...defaultPage
        })
      });
    });
  };

  render() {
    const {
      chassisComponent: {
        data,
        vehicleSystem
      },
      form,
      form: {
        getFieldDecorator
      },
      loading
    } = this.props
    const {downloadVisible, downloadFiles} = this.state
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
                <ul className={styles.searchForm}>
                  <li>
                    <Form.Item label="整车系统">
                      {getFieldDecorator('parentId', {initialValue: ''})(
                        <Select
                            onChange={(text, e) => {
                          this.filterCoreComponent(text, e, form)
                        }}
                            style={{
                          width: 150
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
                      {getFieldDecorator('componentName')(<Input/>)}
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
              {getButtonAuth(114)
                ? <Fragment>
                <Button onClick={() => this.addNew()}
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
                rowKey="id"
            />
          </div>
        </Card>
        <DownloadFile
            data={downloadFiles}
            onCancel={this.showDownFileModal}
            onOk={this.showDownFileModal}
            visible={downloadVisible}
        />
      </Fragment>
    )
  }
}
export default ChassisPartList
