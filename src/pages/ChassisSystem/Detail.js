import React, {Component, Fragment} from 'react'
import {
  Button,
  Card,
  message,
  Input,
  Row,
  Col
} from 'antd'
import {connect} from 'dva'
import CurrentTitle from '@/common/CurrentTitle/Index'
import StandardTable from '@/common/StandardTable'
import ItemList from '@/common/ItemList/Index'
import {defaultPage} from '@/utils/utils'
import styles from '../../layouts/global.less'
import {formItemLayout} from '../../../public/config'
import {replaceHtml, formartPicture} from '../../utils/utils'

const {TextArea} = Input

@connect(({chassisSystem, assemblyParts, importantParts, loading}) => ({chassisSystem, assemblyParts, importantParts, loading: loading.models.chassisSystem}))

class ChassisSystemDetail extends Component {
  state = {
    dataSource: [],
    pageInfo: defaultPage, // 当前分页信息
    id: this.props.match.params.id,
    type: this.props.match.params.type, // 是否审核
    influenceFactorPicture: [],
    operateData: [], // 操作记录
    remark: '' // 审核备注
  }
  componentDidMount = () => {
    this.getInfo()
    this.getOperateLog()
  }

  columns = [
    {
      title: '时间',
      dataIndex: 'crtAt',
      name: 'crtAt'
    }, {
      title: '操作功能',
      dataIndex: 'businessName',
      name: 'businessName'
    }, {
      title: '操作结果',
      dataIndex: 'statusName',
      name: 'statusName'
    }, {
      title: '操作人',
      dataIndex: 'operatorName',
      name: 'operatorName'
    }, {
      title: '备注',
      dataIndex: 'remark',
      name: 'remark'
    }
  ]

  getInfo() {
    const {id} = this.state
    const {dispatch} = this.props
    const callback = response => {
      if (response.code === 1) {
        const item = response.data
        let dataSource = [
          {
            name: '总成部件',
            value: item.assemblyComponentName
          }, {
            name: '核心零部件',
            value: item.coreComponentName
          }, {
            name: '故障模式',
            value: item.failureMode
          }, {
            name: '故障现象',
            images: item.faultPicture
          }, {
            name: '故障描述',
            value: replaceHtml(item.partDescription)
          }, {
            name: '原因分析',
            value: replaceHtml(item.causeAnalysis)
          }, {
            name: '故障对策',
            value: item.troubleshooting
          }, {
            name: '原因及对策照片',
            images: item.reasonsCountermeasuresPhotos
          }, {
            name: '标准、原理、基于标准的具体化数据参数',
            value: replaceHtml(item.preciseData)
          }, {
            name: '标准原理及照片',
            images: item.standardPrinciplesPhotos
          }
        ];
        const influenceFactorPicture = formartPicture(item.influenceFactorPicture)
        influenceFactorPicture.forEach(item => {
          dataSource.push({
            name: '设计雷区，要点',
            value: replaceHtml(item.remark)
          }, {
            name: '设计雷区，要点及影响因素图片',
            images: item.pictures
          })
        })
        dataSource.push({
          name: '故障参考信息（类型、平均里程、地域等）',
          value: replaceHtml(item.faultReference)
        })
        dataSource.push({
          name: '故障分析报告',
          files: this.getFiles(item.failureModeAttachment, 1)
        })
        this.setState({dataSource})
      } else {
        message.error(response.msg)
      }
    }
    dispatch({type: 'chassisSystem/info', payload: {
        id
      }, callback})
  }

  getFiles = (files) => {
    let result = []
    files.map(item => {
        result.push({name: item.oldFileName, url: item.url})
    })
    return result
  }

  // 日志查询
  getOperateLog(payload) {
    const {dispatch} = this.props
    const {pageInfo, id} = this.state
    const params = {
      ...payload
    }
    const callback = response => {
      this.setState({operateData: response})
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
      type: 'chassisSystem/operateLog',
      payload: Object
        .keys(params)
        .length > 0
        ? {
          ...params,
          failureModeId: id
        }
        : {
          ...pageInfo,
          failureModeId: id
        },
      callback
    })
  }

  review(approvalState) {
    const {dispatch} = this.props
    const {id, remark} = this.state
    const callback = response => {
      if (response.code === 1) {
        message.success('操作成功')
        history.go(-1)
      } else {
        message.error(response.msg)
      }
    }
    dispatch({
      type: 'chassisSystem/review',
      payload: {
        id,
        approvalState,
        remark
      },
      callback
    })
  }

  // 返回
  goback() {
    history.go(-1)
  }

  // 输入备注信息
  handleRemarkChange = e => {
    this.setState({remark: e.target.value})
  }

  render() {
    const {dataSource, operateData, type} = this.state
    const {loading} = this.props
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          {dataSource.map((item, index) => < ItemList files={
            item.files
          }
              images={
            item.images
          }
              key={
            index
          }
              label={
            item.name
          }
              text={
            item.value
          }
                                           />)}
          {type === '1'
            ? (
              <Fragment>
                <Row className={styles.itemList}>
                  <Col className={styles.itemListLabel}
                      {...formItemLayout.labelCol}
                  >审核备注:
                  </Col>
                  <Col className={styles.itemListContent}
                      {...formItemLayout.wrapperCol}
                  >
                    <TextArea onChange={this.handleRemarkChange}
                        rows={4}
                    />
                  </Col>
                </Row>
                <Row className={styles.itemList}>
                  <Col className={styles.itemListLabel}
                      {...formItemLayout.labelCol}
                  >审核结果:
                  </Col>
                  <Col className={styles.itemListContent}
                      {...formItemLayout.wrapperCol}
                  >
                    <Button
                        onClick={() => this.review(2)}
                        style={{
                      marginRight: 20
                    }}
                        type="primary"
                    >通过</Button>
                    <Button
                        onClick={() => this.review(3)}
                        style={{
                      marginRight: 20
                    }}
                        type="primary"
                    >不通过</Button>
                  </Col>
                </Row>
              </Fragment>
            )
            : <Row>
              <Col {...formItemLayout.labelCol}></Col>
              <Col className={styles.itemListContent}
                  {...formItemLayout.wrapperCol}
              >
                <Button htmlType="submit"
                    onClick={() => this.goback()}
                    type="primary"
                >
                  确定
                </Button >
              </Col>
            </Row>
}

        </Card>
        <Card className={styles.main}
            title="操作日志"
        >
          <StandardTable
              columns={this.columns}
              data={operateData || []}
              loading={loading}
              onChangeCombine={params => this.getOperateLog(params)}
              onSelectRow={this.handleSelectRows}
              rowKey="id"
          />
        </Card>
      </Fragment>
    )
  }
}
export default ChassisSystemDetail