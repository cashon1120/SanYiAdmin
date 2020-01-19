import React, {Component, Fragment} from 'react'
import {
  Form,
  Select,
  Input,
  message,
  Card,
  Row,
  Col
} from 'antd'
import {connect} from 'dva'
import PicturesWall from '@/common/PicturesWall'
import CurrentTitle from '@/common/CurrentTitle/Index'
import Accessory from './Accessory'

import styles from '@/layouts/global.less'
import {getUploadedPic, setPictureParams, formartPicture} from '@/utils/utils'
import {formItemLayout} from '../../../public/config'

const {TextArea} = Input
const {Option} = Select
const defaultPage = {
  pageNum: 0,
  pageSize: 0
}

@Form.create()
@connect(({chassisComponent, chassisSystem, assemblyParts, importantParts, loading}) => ({chassisComponent, chassisSystem, assemblyParts, importantParts, loading: loading.models.chassisComponent}))
class ChassisSystemAdd extends Component {
  state = {
    typeId: Number.parseInt(this.props.match.params.typeId), // 1: 系统   2: 总成   3: 核心零部件
    id: this.props.match.params.id,
    confirmLoading: false,
    coreComponentList: [], //核心零部件
    systemList: [],
    filterSystemList: [],
    picture: [], // 核心零部件图片
    reasonsCountermeasuresPhotos: [], // 原因及对策照片
    standardPrinciplesPhotos: [], // 标准原理及照片
    influenceFactorPicture: [
      {
        remark: '',
        remark2: '',
        pictures: []
      }
    ], // 影响因素图片
    params: {}, //第一步表单数据
    dataSource: {}
  }

  componentDidMount() {
    this.getSystem()
    this.getAssemblyParts()
    this.getImportantParts()
    this.getVehicleSystem()
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

  // 获取系统数据
  getSystem() {
    const {dispatch} = this.props
    const callback = res => {
      if (res.code === 1) {
        this.setState({
          systemList: res.data.list
        }, () => {
          const {id} = this.state
          if (id) {
            this.getInfo()
          }
        })
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

  // 获取详细信息
  getInfo() {
    const {id, typeId, systemList} = this.state
    const {dispatch, form} = this.props
    const callback = response => {
      if (response.code === 1) {
        if (typeId === 3) {
          this.filterCoreComponent(response.data.componentId, form, response.data.assemblyComponentId)
        }
        let filterSystemList = []
        if (typeId !== 1) {
          const system = systemList.filter(item => item.id === response.data.componentId)[0]
          filterSystemList = systemList.filter(item => item.parentId === Number.parseInt(system.parentId))
        }

        if(response.data.influenceFactorPicture.length > 0){
          this.setState({
            influenceFactorPicture: formartPicture(response.data.influenceFactorPicture, 2)
          })
        }
        this.setState({
          filterSystemList,
          dataSource: response.data,
          picture: response.data.picture,
          reasonsCountermeasuresPhotos: response.data.reasonsCountermeasuresPhotos,
          standardPrinciplesPhotos: response.data.standardPrinciplesPhotos
        })
      }
    }
    let actionType = ''
    switch (typeId) {
      case 1:
        actionType = 'chassisComponent/info'
        break
      case 2:
        actionType = 'assemblyParts/info'
        break
      default:
        actionType = 'importantParts/info'
    }
    dispatch({type: actionType, payload: {
        id
      }, callback})
  }

  // 获取总成部件数据
  getAssemblyParts() {
    const {dispatch, assemblyParts: {
        data
      }} = this.props
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'assemblyParts/fetch'
      dispatch({type: actionType, payload: defaultPage})
    }
  }

  // 获取核心部件数据
  getImportantParts() {
    const {dispatch, importantParts: {
        data
      }} = this.props
    const list = data.list || data.data.list
    const callback = response => {
      if (response.code === 1) {
        this.setState({coreComponentList: response.data.list})
      }
    }
    if (list.length === 0) {
      const actionType = 'importantParts/fetch'
      dispatch({type: actionType, payload: defaultPage, callback})
    }
  }

  // 图片验证
  pictureValidator = (rule, value, callback) => {
    const {picture} = this.state
    if (picture.length === 0) {
      callback('(至少一张)')
    } else {
      callback()
    }
  }

  // 原因及对策图片验证
  reasonsCountermeasuresPhotosValidator = (rule, value, callback) => {
    const {reasonsCountermeasuresPhotos} = this.state
    if (reasonsCountermeasuresPhotos.length === 0) {
      callback('(至少一张)')
    } else {
      callback()
    }
  }

  // 验证附件以上部分表单
  handleSubmit = () => {
    const {typeId} = this.state
    const {form, form: {
        validateFields
      }} = this.props
    let params = ''
    validateFields((err, values) => {
      const {picture, reasonsCountermeasuresPhotos, standardPrinciplesPhotos, influenceFactorPicture} = this.state
      if (picture.length === 0) {
        message.error('输入信息有误, 请核对')
        form.setFields({
          picture: {
            value: '',
            errors: [new Error('请上传图片/视频')]
          }
        });
        return
      }

      if (!err) {
        params = {
          ...values
        }
        switch (typeId) {
          case 1:
            params.componentId = params.vehicleSystemId
            break;
          case 2:
            params.componentId = params.systemId
            break;
          default:
            break;
        }
        params.picture = getUploadedPic(picture)
        params.reasonsCountermeasuresPhotos = getUploadedPic(reasonsCountermeasuresPhotos)
        params.standardPrinciplesPhotos = getUploadedPic(standardPrinciplesPhotos)
        params.influenceFactorPicture = setPictureParams(influenceFactorPicture, 2)
      } else {
        message.error('输入信息有误, 请核对')
      }
    })
    return params
  }

  // 提交最终数据, files 为第二步回传附件列表
  handleSubmitAll = files => {
    const params = this.handleSubmit()
    if (!params) {
      return
    }
    this.setState({confirmLoading: true})
    const {dispatch} = this.props
    let {typeId, id} = this.state
    // 获取第二步返回来的附件列表
    const allParams = {
      ...params,
      failureModeAttachment: files
    }
    let actionType = ''
    // id 不存在为添加模式
    if (!id) {
      switch (typeId) {
        case 1:
          actionType = 'chassisComponent/add'
          break
        case 2:
          actionType = 'assemblyParts/add'
          break
        default:
          actionType = 'importantParts/add'
      }
    } else {
      actionType = 'chassisComponent/update'
      allParams.id = id
    }
    const callback = response => {
      if (response.code === 1) {
        history.go(-1)
        message.success(response.msg)
      } else {
        message.error(response.msg)
      }
      this.setState({confirmLoading: false})
    }
    dispatch({type: actionType, payload: allParams, callback})
  }

  // 上传图片回调, 设置对应图片数据列表
  handlePicChange = (name, fileList) => {
    // 设置雷区图片特殊处理
    if (name.indexOf('desginItem') >= 0) {
      const {influenceFactorPicture} = this.state
      const index = parseInt(name.replace('desginItem', ''), 10)
      influenceFactorPicture[index].pictures = fileList
    } else {
      this.setState({[name]: fileList})
    }
  }

  // 过滤核心零部件数据
  filterCoreComponent = (text, form, assemblyComponentId) => {
    form.setFieldsValue({componentId: ''})
    if (assemblyComponentId) {
      form.setFieldsValue({
        componentId: assemblyComponentId.toString()
      })
    }
    const {assemblyParts: {
        data
      }} = this.props
    const list = data.list || data.data.list
    const assemblyPartsList = list.filter(item => item.componentId === Number.parseInt(text))
    if (text) {
      this.setState({assemblyPartsList})
    } else {
      this.setState({assemblyPartsList: list})
    }
  }

  handleSetSystemList = (text, form) => {
    form.setFieldsValue({systemId: ''})
    form.setFieldsValue({componentId: ''})
    const {systemList} = this.state
    const filterSystemList = systemList.filter(item => item.parentId === Number.parseInt(text))
    this.setState({filterSystemList})
  }

  getVehicleSystemId = id => {
    const {chassisComponent: {
        vehicleSystem
      }} = this.props
    const {systemList} = this.state
    const system = systemList.filter(item => item.id === id)
    let vehicleSystemArr = []
    if (system.length > 0) {
      vehicleSystemArr = vehicleSystem.filter(item => item.id === system[0].parentId)
    }
    return vehicleSystemArr.length > 0 && vehicleSystemArr[0]
      .id
      .toString()
  }

  addDesignItem() {
    const {influenceFactorPicture} = this.state
    influenceFactorPicture.push({remark: '', pictures: []})
    this.setState({influenceFactorPicture})
  }

  deleteDesignItem(index) {
    const {influenceFactorPicture} = this.state
    influenceFactorPicture.splice(index, 1)
    this.setState({influenceFactorPicture})
  }

  changeRemark(e, index, type) {
    const {influenceFactorPicture} = this.state
    const value = e.target.value
    if(type === 1){
      influenceFactorPicture[index].remark = value
    }else{
      influenceFactorPicture[index].remark2 = value
    }
    this.setState({influenceFactorPicture})
  }

  render() {
    const {chassisComponent: {
        vehicleSystem
      }, form, form: {
        getFieldDecorator
      }} = this.props
    let {
      id,
      typeId,
      confirmLoading,
      dataSource,
      picture,
      standardPrinciplesPhotos,
      influenceFactorPicture,
      assemblyPartsList,
      filterSystemList
    } = this.state
    let name = ''
    let vehicleSystemId = ''
    const disableSelection = id > 0
      ? true
      : false
    switch (typeId) {
      case 1:
        name = '系统名称'
        vehicleSystemId = dataSource.parentId && dataSource
          .parentId
          .toString() || ''
        break
      case 2:
        name = '部件总成'
        vehicleSystemId = dataSource.componentId && this.getVehicleSystemId(dataSource.componentId) || ''
        break
      default:
        name = '核心零部件'
        vehicleSystemId = dataSource.componentId && this.getVehicleSystemId(dataSource.componentId) || ''
    }
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item {...formItemLayout}
                label="整车系统"
            >
              {getFieldDecorator('vehicleSystemId', {
                initialValue: vehicleSystemId,
                rules: [
                  {
                    required: true,
                    message: '请选择整车系统'
                  }
                ]
              })(
                <Select
                    disabled={disableSelection}
                    onChange={(text) => {
                  this.handleSetSystemList(text, form)
                }}
                >
                  <Option value="">请选择</Option>
                  {vehicleSystem && vehicleSystem.map((item) => {
                    return <Option key={item.id}>{item.componentName}</Option>
                  })}
                </Select>
              )}
            </Form.Item>
            {typeId === 2 || typeId === 3
              ? <Form.Item {...formItemLayout}
                  label="选择系统"
                >
                  {getFieldDecorator('systemId', {
                    initialValue: dataSource.componentId && dataSource
                      .componentId
                      .toString() || '',
                    rules: [
                      {
                        required: true,
                        message: '请选择系统'
                      }
                    ]
                  })(
                    <Select
                        disabled={disableSelection}
                        onChange={(text) => {
                      this.filterCoreComponent(text, form)
                    }}
                    >
                      <Option value="">请选择</Option>
                      {filterSystemList.map((item) => {
                        return <Option key={item.id}>{item.componentName}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item >
              : null}

            {typeId === 3
              ? <Fragment>
                  <Form.Item {...formItemLayout}
                      label="选择部件总成"
                  >
                    {getFieldDecorator('componentId', {
                      initialValue: dataSource.assemblyComponentId && dataSource
                        .assemblyComponentId
                        .toString() || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择部件总成'
                        }
                      ]
                    })(
                      <Select disabled={disableSelection}>
                        <Option value="">请选择</Option>
                        {assemblyPartsList && assemblyPartsList.map((item) => {
                          return <Option key={item.id}>{item.assemblyComponentName}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item >
                </Fragment>
              : null}

            <Form.Item {...formItemLayout}
                label={`${name}`}
            >
              {getFieldDecorator('assemblyComponentName', {
                initialValue: typeId === 1
                  ? dataSource.componentName
                  : typeId === 2
                    ? dataSource.assemblyComponentName
                    : dataSource.coreComponentName,
                rules: [
                  {
                    required: true,
                    message: `请输入${name}`
                  }
                ]
              })(<Input/>)}
            </Form.Item >

            <Form.Item {...formItemLayout}
                label={`${name}图片/视频`}
            >
              {getFieldDecorator('picture', {
                rules: [
                  {
                    required: true,
                    message: `请上传${name}图片或视频`
                  }
                ]
              })(<PicturesWall
                  canDrag={typeId === 3 ? 0 : 1}
                  dataSource={picture}
                  form={form}
                  maxImgLen={12}
                  name="picture"
                  onChange={this.handlePicChange}
                 />)}
            </Form.Item >
            <Form.Item
                {...formItemLayout}
                label={name === '系统名称'
              ? '系统描述'
              : `${name}描述`}
            >
              {getFieldDecorator('partDescription', {initialValue: dataSource.partDescription})(<TextArea rows={4}/>)}
            </Form.Item >
            {typeId === 3 ? null :
              <Fragment>
                  <Form.Item
                      {...formItemLayout}
                      label="排序"
                  >
                {getFieldDecorator('sort', {initialValue: dataSource.sort})(<Input style={{width: 100}} />)}
                </Form.Item>
              </Fragment>
            }

            <Form.Item {...formItemLayout}
                label="标准、原理、基于标准的具体化数据参数"
            >
              {getFieldDecorator('preciseData', {
                initialValue: dataSource.preciseData,
                rules: [
                  {
                    message: '请输入具体化数据参数'
                  }
                ]
              })(<TextArea rows={4}/>)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="标准原理及照片"
            >
              {getFieldDecorator('standardPrinciplesPhotos', {})(<PicturesWall
                  dataSource={standardPrinciplesPhotos}
                  form={form}
                  maxImgLen={12}
                  name="standardPrinciplesPhotos"
                  onChange={this.handlePicChange}
                                                                 />)}
            </Form.Item >

            {influenceFactorPicture.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Form.Item {...formItemLayout}
                      label="设计雷区，要点"
                  >
                    <Row>
                      <Col span={20}><TextArea
                          onChange={(e) => this.changeRemark(e, index, 1)}
                          rows={4}
                          value={item.remark}
                                     /></Col>
                      <Col span={4}>
                        <a
                            onClick={() => this.deleteDesignItem(index)}
                            style={{
                          marginLeft: 20
                        }}
                        >删除</a>
                      </Col>
                    </Row>

                  </Form.Item >
                  <Form.Item {...formItemLayout}
                      label="设计雷区，要点影响因素说明"
                  >
                    <Row>
                      <Col span={20}><TextArea
                          onChange={(e) => this.changeRemark(e, index, 2)}
                          rows={4}
                          value={item.remark2}
                                     /></Col>
                    </Row>
                  </Form.Item >
                  <Form.Item {...formItemLayout}
                      label="设计雷区，要点及影响因素图片"
                  >
                    <PicturesWall
                        dataSource={item.pictures}
                        form={form}
                        maxImgLen={12}
                        name={`desginItem${index}`}
                        onChange={this.handlePicChange}
                        type={5}
                    />
                  </Form.Item >
                </Fragment>
              )
            })}
            <Row style={{
              paddingBottom: 30
            }}
            >
              <Col {...formItemLayout.labelCol}></Col>
              <Col {...formItemLayout.wrapperCol}>
                <a onClick={() => this.addDesignItem()}>继续添加设计雷区要点</a>
              </Col>
            </Row>
          </Form>
          <Accessory
              dataSource={dataSource.failureModeAttachment}
              handleSubmit={this.handleSubmitAll}
              loading={confirmLoading}
              type={typeId}
          />
        </Card>
      </Fragment>
    )
  }
}
export default ChassisSystemAdd