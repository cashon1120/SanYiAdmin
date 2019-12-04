import React, {Component, Fragment} from 'react'
import {
  Button,
  Form,
  Select,
  Steps,
  Card,
  Row,
  Col,
  message
} from 'antd'
import {connect} from 'dva'
import CurrentTitle from '@/common/CurrentTitle/Index'
import PotinCheckTableItem from '@/common/PotinCheckTableItem/Index'
import router from 'umi/router';
import styles from '../../layouts/global.less'
const {Option} = Select
const {Step} = Steps
const defaultPage = {
  pageNum: 0,
  pageSize: 0
}
let itemNum = 0 // 点检项数, 至少有一项

@Form.create()
@connect(({
  pointCheckTable,
  pointCheckType,
  pointCheckCar,
  pointCheckProject,
  pointCheckSystem,
  loading
}) => ({
  pointCheckTable,
  pointCheckType,
  pointCheckCar,
  pointCheckProject,
  pointCheckSystem,
  loading: loading.models.pointCheckTable
}))

class PointCheckTableCreate extends Component {
  state = {
    confirmLoading: false,
    step: 0,
    pointCheckType: [],
    carList: [],
    systemList: [],
    projectList: [],
    mainValue: {}, // 车型和点检系统名称
    batchNo: this.props.match.params.id
  }

  componentDidMount = () => {
    itemNum = 0
    this.getCarList()
    this.getSystemList()
    this.getProjectList()
  }

  // 获取详情
  getInfo() {
    const {batchNo} = this.state
    if (batchNo) {
      const {dispatch} = this.props
      const callback = response => {
        const pointCheckType = response.data.checkInfos
        // 设置车型名称和点检系统名称默认值
        this.setState({
          mainValue: {
            vehicleModelId: response.data.vehicleModelId,
            checkSystemId: response.data.checkSystemId
          }
        })
        // 初始化各项目长度 itemsLength, 用于新增 ID
        pointCheckType.forEach(item => {
          item.itemsLength = item.infoList.length
        })
        this.setState({
          pointCheckType
        }, () => {this.showItems()})
      }
      dispatch({type: 'pointCheckTable/getInfo', payload: {
          batchNo
        }, callback})
    } else {
      this.getPointCheckType()
    }
  }

  // 获取车型库
  getCarList() {
    const {dispatch} = this.props
    const callback = response => {
      const carList = response.data.list
      this.setState({carList})
    }
    const actionType = 'pointCheckCar/fetch'
    dispatch({type: actionType, payload: defaultPage, callback})
  }

  // 获取系统库
  getSystemList() {
    const {dispatch, pointCheckSystem: {
        data
      }} = this.props
    const callback = response => {
      const systemList = response.data.list || response.list
      this.setState({systemList})
    }
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'pointCheckSystem/fetch'
      dispatch({type: actionType, payload: defaultPage, callback})
    } else {
      callback(data)
    }
  }

  // 获取项目库
  getProjectList() {
    const {dispatch} = this.props
    const {batchNo} = this.state
    const callback = response => {
      const projectList = response.data.list || response.list
      this.setState({projectList})
      if(batchNo){
        this.getInfo()
      }else{
        this.getPointCheckType()
      }
    }
    const actionType = 'pointCheckProject/fetch'
      dispatch({type: actionType, payload: {...defaultPage, state: 1}, callback})
  }

  // 获取点检类别
  getPointCheckType() {
    const {dispatch, pointCheckType: {
        data
      }} = this.props
    const callback = response => {
      const pointCheckType = response.data || response.list
      pointCheckType.forEach(element => {
        element.infoList = []
        element.itemsLength = 0
      })
      pointCheckType.sort((a, b) => {
        return a.configSort - b.configSort
      })
      this.setState({
        pointCheckType
      }, () => {
        this.addItems()
      })
    }
    if (data.list.length === 0) {
      const actionType = 'pointCheckType/fetch'
      dispatch({type: actionType, payload: {}, callback})
    } else {
      callback(data)
    }
  }

  // 显示项目
  showItems() {
    const {step, pointCheckType, projectList} = this.state
    pointCheckType[step]
      .infoList
      .forEach((item, index) => {
        item.hide = false
        item.index = index + 1
        item.dom = <PotinCheckTableItem
            delItems={this.delItems}
            index={index + 1}
            parentId={pointCheckType[step].id}
            projectList={projectList}
            setValue={this.setValue}
            values={{
          checkProjectId: item.checkProjectId,
          reference: item.reference,
          designValue: item.designValue
        }}
                   />

      })
    this.setState({pointCheckType})
  }

  // 添加项目
  addItems() {
    const {step, pointCheckType, projectList} = this.state
    if(pointCheckType[step].itemsLength ){
      pointCheckType[step].itemsLength += 1
    }else{
      pointCheckType[step].itemsLength = 1
    }
    pointCheckType[step].itemsLength += 1
    pointCheckType[step]
      .infoList
      .push({
        hide: false,
        index: pointCheckType[step].itemsLength,
        checkProjectId: '',
        reference: '',
        designValue: '',
        dom: <PotinCheckTableItem
            delItems={this.delItems}
            index={pointCheckType[step].itemsLength}
            parentId={pointCheckType[step].id}
            projectList={projectList}
            setValue={this.setValue}
            values={{
            checkProjectId: '',
            reference: '',
            designValue: ''
          }}
             />
      })
    this.setState(pointCheckType)
  }

  // 同步输入值
  setValue = (index, key, value) => {
    const {step, pointCheckType} = this.state
    pointCheckType[step]
      .infoList
      .forEach(item => {
        if (item.index === index) {
          item[key] = value
        }
      })
    this.setState({pointCheckType})
  }

  // 删除项目
  delItems = index => {
    const {step, pointCheckType} = this.state
    // if (pointCheckType[step].infoList.length === 1) {
    //   message.error('请至少保留一项')
    //   return
    // }
    pointCheckType[step].infoList.forEach(item => {
        if (item.index === index) {
          item.hide = true
        }
      })
    this.setState({pointCheckType})
  }

  //提交验证
  handleSubmit = (e) => {
    const {pointCheckType, step, batchNo} = this.state
    const {form} = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        let isError = false
        pointCheckType[step]
          .infoList
          .map(item => {
            // 遍历是否有没填的选项
            if (!item.hide) {
              if(item.checkProjectId){
                if(item.reference === '' || item.designValue === ''){
                  if (!isError) {
                    message.error('信息填写不完整, 请核对!');
                    isError = true
                  }
                }else{
                  itemNum++
                }
              }
            }
          })
        if (!isError) {
          if (step === 0) {
            this.setState({mainValue: values})
          }
          if (step === pointCheckType.length - 1) {
            this.submitForm()
          } else {
            const _step = Math.min(step + 1, pointCheckType.length - 1)
            this.setState({
              pointCheckType,
              step: _step
            }, () => {
              if (batchNo) {
                this.showItems()
              } else {
                this.addItems()
              }
            })
          }
        }
      }
    })
  }

  submitForm() {
    const {pointCheckType, mainValue, projectList, batchNo} = this.state
    if(itemNum < 1){
      message.error('请至少填写一项点检项目!');
      return
    }
    const {dispatch} = this.props
    let result = []
    this.setState({confirmLoading: true})
    pointCheckType.map(items => {
      const checkItemId = items.id
      items.infoList.map(item => {
          let checkProjectName = ''
          const project = projectList.filter(project => project.id === item.checkProjectId)
          if(project.length > 0){
            checkProjectName = project[0].name
          }
          if(!item.hide && checkProjectName){
            result.push({
              id: item.id || null,
              ...mainValue,
              checkItemId,
              reference: item.reference,
              designValue: item.designValue,
              checkProjectId: item.checkProjectId,
              checkProjectName
            })
          }
        })
    })
    const actionType = batchNo ? 'pointCheckTable/update' : 'pointCheckTable/add'
    if(batchNo){
      result = {
        batchNo,
        checkInfoList: result
      }
    }
    const callback = response => {
      if (response.code === 1) {
        message.success('操作成功')
        router.push('/pointCheckTable/list')
      } else {
        message.error(response.msg)
      }
      this.setState({confirmLoading: false})
    }
    dispatch({type: actionType, payload: result, callback})
  }

  render() {
    const {
      step,
      pointCheckType,
      carList,
      systemList,
      confirmLoading,
      mainValue
    } = this.state
    const {form: {
        getFieldDecorator
      }} = this.props
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 4
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 4
        },
        sm: {
          span: 10,
          offset: 4
        }
      }
    }

    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <Steps current={step}>
            {pointCheckType.map(item => (<Step key={item.id}
                title={item.name}
                                         />))}
          </Steps>
          <div style={{
            marginBottom: 50
          }}
          ></div>
          <Form {...formItemLayout}
              onSubmit={this.handleSubmit}
          >
            {step === 0
              ? (
                <Fragment>
                  <Form.Item label="车型名称">
                    {getFieldDecorator('vehicleModelId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择车型名称'
                        }
                      ],
                      initialValue: mainValue.vehicleModelId
                    })(
                      <Select style={{
                        width: 300
                      }}
                      >
                        {carList.map(item => (
                          <Option key={item.id}
                              value={item.id}
                          >{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="点检系统名称">
                    {getFieldDecorator('checkSystemId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择点检系统名称'
                        }
                      ],
                      initialValue: mainValue.checkSystemId
                    })(
                      <Select style={{
                        width: 300
                      }}
                      >
                        {systemList.map(item => (
                          <Option key={item.id}
                              value={item.id}
                          >{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Fragment>
              )
              : null}

            {pointCheckType[step] && pointCheckType[step]
              .infoList
              .map(item => {
                if (!item.hide) {
                  return (
                    <Fragment key={item.id || item.index}>{item.dom}</Fragment>
                  )
                }
              })}
            <Row style={{
              marginBottom: 30
            }}
            >
              <Col sm={4}
                  xs={24}
              ></Col>
              <Col sm={10}
                  xs={24}
              >
                <a onClick={() => {
                  this.addItems()
                }}
                >添加点检项目</a>
              </Col>
            </Row>
            <Form.Item {...tailFormItemLayout}>
              <Button htmlType="submit"
                  loading={confirmLoading}
                  type="primary"
              >
                {step < pointCheckType.length - 1
                  ? '下一步'
                  : '提交'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Fragment>
    )
  }
}
export default PointCheckTableCreate