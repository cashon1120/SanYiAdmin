import React, {Component, Fragment} from 'react'
import {
  Button,
  Card,
  Input,
  Row,
  Col,
  Icon
} from 'antd'
import {connect} from 'dva'
import CurrentTitle from '@/common/CurrentTitle/Index'
import ItemList from '@/common/ItemList/Index'
import {defaultPage} from '@/utils/utils'
import StandardTable from '@/common/StandardTable'
import styles from '@/layouts/global.less'
import {formItemLayout} from '../../../public/config'
import { replaceHtml, formartPicture } from '../../utils/utils'

const {TextArea} = Input

@connect(({chassisComponent, chassisSystem, assemblyParts, importantParts, loading}) => ({chassisComponent, chassisSystem, assemblyParts, importantParts, loading: loading.models.chassisComponent}))

class ChassisSystemDetail extends Component {
  state = {
    dataSource: [],
    operateData: [],
    systemList: [],
    loading: false,
    pageInfo: defaultPage, // 当前分页信息
    typeId: Number.parseInt(this.props.match.params.typeId), // 1: 系统   2: 总成   3: 核心零部件
    id: this.props.match.params.id,
    influenceFactorPicture: []
  }
  componentDidMount = () => {
    this.getSystem()
    this.getVehicleSystem()
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
          this.getInfo()
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

  getFiles = (files, type) => {
    let result = []
    files.map(item => {
      if (item.businessType === type) {
        result.push({name: item.oldFileName, url: item.url})
      }
    })
    return result
  }

  getPrimarySystemName = id => {
    const { systemList } = this.state
    const {chassisComponent: { vehicleSystem }} = this.props
    const system = systemList.filter(item => item.id === id)[0]
    return vehicleSystem.filter(item => item.id === system.parentId)[0].componentName
  }

  getInfo() {
    const {id, typeId} = this.state
    const {dispatch} = this.props
    let actionType = ''
    const callback = response => {
      const item = response.data
      let name = ''
      let componentItem = []
      let primarySystemName = ''
      switch (typeId) {
        case 1:
          actionType = 'chassisComponent/info'
          primarySystemName = item.primarySystemName
          name = '系统名称'
          break
        case 2:
          actionType = 'assemblyParts/info'
          name = '部件总成'
          primarySystemName = this.getPrimarySystemName(item.componentId)
          componentItem = [
            {
              name: '系统名称',
              value: item.componentName
            }
          ]
          break
        default:
          actionType = 'importantParts/info'
          name = '核心零部件'
          primarySystemName = this.getPrimarySystemName(item.componentId)
          componentItem = [
            {
              name: '系统名称',
              value: item.componentName
            }, {
              name: '部件总成',
              value: item.assemblyComponentName
            }
          ]

      }
      let dataSource = [
        {
          name: '整车系统',
          value: primarySystemName
        },
        ...componentItem, {
          name: `${name}`,
          value: typeId === 1
            ? item.componentName
            : typeId === 2
              ? item.assemblyComponentName
              : item.coreComponentName
        }, {
          name: `${name}图片/视频`,
          images: item.picture
        }, {
          name: name === '系统名称' ? '系统描述' : `${name}描述`,
          value: replaceHtml(item.partDescription)
        }, {
          name: '标准、原理、基于标准的具体化数据参数',
          value: replaceHtml(item.preciseData)
        }, {
          name: '标准原理及照片',
          images: item.standardPrinciplesPhotos
        }
      ];
      const influenceFactorPicture = formartPicture(item.influenceFactorPicture, 2)
        influenceFactorPicture.forEach(item => {
          dataSource.push({
            name: '设计雷区，要点',
            value: replaceHtml(item.remark)
          }, {
            name: '设计雷区，要点影响因素说明',
            value: replaceHtml(item.remark2)
          },{
            name: '设计雷区，要点及影响因素图片',
            images: item.pictures
          })
        })
        dataSource.push( {
          name: 'DFMEA报告',
          files: this.getFiles(item.failureModeAttachment, 1)
        }, {
          name: '设计规范报告',
          files: this.getFiles(item.failureModeAttachment, 2)
        }, {
          name: typeId === 1 ? '行业趋势报告' : '型谱',
          files: this.getFiles(item.failureModeAttachment, 3)
        }, {
          name: '法规标准报告',
          files: this.getFiles(item.failureModeAttachment, 4)
        }, {
          name: '质量分析报告',
          files: this.getFiles(item.failureModeAttachment, 5)
        })
      this.setState({dataSource})
    }
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
      type: 'chassisComponent/fetchLogs',
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

  render() {
    const {dataSource, isReview, loading, operateData} = this.state
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <a className={styles.closeBtn}
              onClick={() => history.go(-1)}
              title="关闭"
          >
            <Icon type="close-circle"/>
          </a>
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
          {isReview === '1'
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
            : null
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