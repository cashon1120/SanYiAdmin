import React, {Component, Fragment} from 'react'
import {
  Button,
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
import router from 'umi/router'
import styles from '../../layouts/global.less'
import {getUploadedPic, setPictureParams, formartPicture} from '@/utils/utils'
import {formItemLayout, formItemLayout2} from '../../../public/config'

const acceptType = '.doc, .docx, .docm, .xls, .xlsx, .xlsm, .pdf .ppt, .pptx'
const {TextArea} = Input
const {Option} = Select
const defaultPage = {
  pageNum: 0,
  pageSize: 0
}

const pageName = 'chassisSystem'
@Form.create()
@connect(({chassisSystem, assemblyParts, importantParts, loading}) => ({chassisSystem, assemblyParts, importantParts, loading: loading.models.chassisSystem}))
class ChassisSystemAdd extends Component {
  state = {
    typeId: this.props.match.params.typeId, // 系统ID
    id: this.props.match.params.id,
    confirmLoading: false,
    coreComponentList: [], //核心零部件
    coreComponentPicture: [], // 核心零部件图片
    faultPicture: [], // 故障现象图片
    reasonsCountermeasuresPhotos: [], // 原因及对策照片
    standardPrinciplesPhotos: [], // 标准原理及照片
    failureModeAttachment: [], // 故障分析报告
    influenceFactorPicture: [
      {
        remark: '',
        pictures: []
      }
    ], // 影响因素图片
    params: {}, //第一步表单数据
    assemblyComponentList: [],
    designItemLength: 1,
    dataSource: {}
  }

  componentDidMount() {
    const {typeId, id} = this.state
    this.setState({typeId})
    this.getAssemblyParts()
    this.getImportantParts()
    if (id) {
      this.getInfo()
    }
  }

  // 获取详细信息
  getInfo() {
    const {id} = this.state
    const {dispatch, form} = this.props
    const callback = response => {
      if (response.code === 1) {
        this.filterCoreComponent(response.data.assemblyComponentId, form, response.data.coreComponentId)
        if(response.data.influenceFactorPicture.length > 0){
          this.setState({
            influenceFactorPicture: formartPicture(response.data.influenceFactorPicture)
          })
        }
        this.setState({
          dataSource: response.data,
          coreComponentPicture: response.data.coreComponentPicture,
          faultPicture: response.data.faultPicture,
          reasonsCountermeasuresPhotos: response.data.reasonsCountermeasuresPhotos,
          standardPrinciplesPhotos: response.data.standardPrinciplesPhotos,
          failureModeAttachment: response.data.failureModeAttachment
        })
      }
    }
    dispatch({type: 'chassisSystem/info', payload: {
        id
      }, callback})
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
  getImportantParts() {
    const {dispatch} = this.props
    const callback = response => {
      if (response.code === 1) {
        this.setState({coreComponentList: response.data.list})
      }
    }
    const actionType = 'importantParts/fetch'
    dispatch({type: actionType, payload: defaultPage, callback})
  }

  // 故障现象图片验证
  faultPictureValidator = (rule, value, callback) => {
    const {faultPicture} = this.state
    if (faultPicture.length === 0) {
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

  //提交第一步验证
  handleSubmit = (e) => {
    const {form: {
        validateFields
      }} = this.props
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        const {faultPicture, reasonsCountermeasuresPhotos, standardPrinciplesPhotos, influenceFactorPicture, failureModeAttachment} = this.state
        const params = {
          ...values
        }
        // 第二个参数用来设置 businessType: 1核心零部件图片、2故障现象、3原因及对策照片、4标准原理及照片、5设计雷区，要点
        params.faultPicture = getUploadedPic(faultPicture, 2)
        params.reasonsCountermeasuresPhotos = getUploadedPic(reasonsCountermeasuresPhotos, 3)
        params.standardPrinciplesPhotos = getUploadedPic(standardPrinciplesPhotos, 4)
        params.influenceFactorPicture = setPictureParams(influenceFactorPicture)
        params.failureModeAttachment = getUploadedPic(failureModeAttachment, 1)
        // 验证成功跳转到下一步
        this.setState({
          params
        }, () => {
          this.handleSubmitAll()
        })
      }
    })
  }

  // 提交最终数据, files 为第二步回传附件列表
  handleSubmitAll = () => {
    const {dispatch} = this.props
    let {typeId, params, id} = this.state
    // 获取第二步返回来的附件列表
    const allParams = {
      ...params
    }
    let actionType = ''
    if (!id) {
      actionType = `${pageName}/add`
      allParams.secondaryComponentId = typeId
    } else {
      actionType = `${pageName}/update`
      allParams.id = id
    }
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
        router.push(`/chassisSystem/${typeId}`)
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
  filterCoreComponent = (text, form, coreComponentId) => {
    form.setFieldsValue({coreComponentId: ''})
    if (coreComponentId) {
      form.setFieldsValue({
        coreComponentId: coreComponentId.toString()
      })
    }
    const {importantParts: {
        data
      }} = this.props
    const list = data.list || data.data.list
    const coreComponentList = list.filter(item => item.assemblyComponentId === Number.parseInt(text))
    if (text) {
      this.setState({coreComponentList})
    } else {
      this.setState({coreComponentList: []})
    }
  }

  stepBack = () => {
    this.setState({formStep: 1})
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

  changeRemark(e, index) {
    const {influenceFactorPicture} = this.state
    const value = e.target.value
    influenceFactorPicture[index].remark = value
    this.setState({influenceFactorPicture})
  }

  render() {
    const {form, form: {
        getFieldDecorator
      }} = this.props
    const {
      id,
      coreComponentList,
      assemblyComponentList,
      confirmLoading,
      dataSource,
      reasonsCountermeasuresPhotos,
      faultPicture,
      standardPrinciplesPhotos,
      influenceFactorPicture,
      failureModeAttachment
    } = this.state
    // let disabledSelection = dataSource.version === 1 && dataSource.approvalState
    // === 1
    const disabledSelection = id > 0
      ? dataSource.version === 1 && dataSource.approvalState === 1
      : true
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item {...formItemLayout}
                label="总成部件"
            >
              {getFieldDecorator('assemblyComponentId', {
                initialValue: dataSource.assemblyComponentId && dataSource
                  .assemblyComponentId
                  .toString() || ''
              })(
                <Select
                    disabled={!disabledSelection}
                    onChange={text => {
                  this.filterCoreComponent(text, form)
                }}
                >
                  <Option value="">请选择</Option>
                  {assemblyComponentList.map((item) => {
                    return <Option key={item.id}>{item.assemblyComponentName}</Option>
                  })}
                </Select>
              )}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="核心零部件"
            >
              {getFieldDecorator('coreComponentId', {
                initialValue: dataSource.coreComponentId && dataSource
                  .coreComponentId
                  .toString() || ''
              })(
                <Select disabled={!disabledSelection}>
                  <Option value="">请选择</Option>
                  {coreComponentList && coreComponentList.map((item) => {
                    return <Option key={item.id}>{item.coreComponentName}</Option>
                  })}
                </Select>
              )}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="故障模式"
            >
              {getFieldDecorator('failureMode', {
                initialValue: dataSource.failureMode,
                rules: [
                  {
                    required: true,
                    message: '请输入故障模式'
                  }
                ]
              })(<Input/>)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="故障现象"
            >
              {getFieldDecorator('faultPicture', {
                rules: [
                  {
                    required: true,
                    message: '请上传故障现象图片'
                  }
                ]
              })(<PicturesWall
                  dataSource={faultPicture}
                  form={form}
                  maxImgLen={12}
                  name="faultPicture"
                  onChange={this.handlePicChange}
                  type={2}
                 />)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="故障现象描述"
            >
              {getFieldDecorator('partDescription', {
                initialValue: dataSource.partDescription,
                rules: [
                  {
                    required: true,
                    message: '请输入故障描述'
                  }
                ]
              })(<TextArea rows={4}/>)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="原因分析"
            >
              {getFieldDecorator('causeAnalysis', {
                initialValue: dataSource.causeAnalysis,
                rules: [
                  {
                    required: true,
                    message: '请输入原因分析'
                  }
                ]
              })(<TextArea rows={4}/>)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="故障对策"
            >
              {getFieldDecorator('troubleshooting', {
                initialValue: dataSource.troubleshooting,
                rules: [
                  {
                    required: true,
                    message: '请输入故障对策'
                  }
                ]
              })(<Input/>)}
            </Form.Item >
            <Form.Item {...formItemLayout}
                label="原因及对策照片"
            >
              {getFieldDecorator('reasonsCountermeasuresPhotos', {
                rules: [
                  {
                    required: true,
                    message: '请上传原因及对策照片'
                  }
                ]
              })(<PicturesWall
                  dataSource={reasonsCountermeasuresPhotos}
                  form={form}
                  maxImgLen={12}
                  name="reasonsCountermeasuresPhotos"
                  onChange={this.handlePicChange}
                  type={3}
                 />)}
            </Form.Item >
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
                  type={4}
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
                          onChange={(e) => this.changeRemark(e, index)}
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
            {/* <Form.Item {...formItemLayout}
                label="影响因素说明"
            >
              {getFieldDecorator('influencingFactor', {initialValue: dataSource.influencingFactor})(<TextArea rows={4}/>)}
            </Form.Item > */}

            <Form.Item {...formItemLayout}
                label="故障参考信息(类型、平均里程、地域等)"
            >
              {getFieldDecorator('faultReference', {initialValue: dataSource.faultReference})(<TextArea rows={4}/>)}
            </Form.Item >
            <Form.Item {...formItemLayout2}
                label="故障分析报告"
            >
            {getFieldDecorator('fileList_QualityAnalysis', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={failureModeAttachment}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="failureModeAttachment"
                  onChange={this.handlePicChange}
                  type={5}
              />
            )}
            <span style={{
              color: 'RGB(143,143,143)',
              whiteSpace:'nowrap'
            }}
            >支持扩展名：.doc .docx .docm .xls .xlsx .xlsm .pdf .ppt .pptx</span>
          </Form.Item>
            <Row>
              <Col {...formItemLayout.labelCol}></Col>
              <Col {...formItemLayout.wrapperCol}>
                <Button
                    htmlType="submit"
                    loading={confirmLoading}
                    style={{
                  marginRight: 20
                }}
                    type="primary"
                >提交</Button>
                <Button onClick={() => history.go(-1)}
                    type="default"
                >取消</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Fragment>
    )
  }
}
export default ChassisSystemAdd