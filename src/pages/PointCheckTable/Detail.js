import React, {Component, Fragment} from 'react'
import {Button, Card, message} from 'antd'
import {connect} from 'dva'
import CurrentTitle from '@/common/CurrentTitle/Index'
import ItemList from '@/common/ItemList/Index'
import styles from '../../layouts/global.less'

const defaultPage = {
  pageNum: 0,
  pageSize: 0
}

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
    carName: '',
    systemName: '',
    projectList: [],
    mainValue: {
      vehicleModelId: '',
      checkSystemId: ''
    }, // 车型和点检系统名称
    type: this.props.match.params.type,
    batchNo: this.props.match.params.id
  }

  componentDidMount = () => {
    this.getInfo()
    this.getCarList()
    this.getSystemList()
    this.getProjectList()
  }

  // 获取详情
  getInfo() {
    const {batchNo} = this.state
    const {dispatch} = this.props
    const callback = response => {
      // 设置车型名称和点检系统名称默认值
      this.setState({
        carName: response.data.vehicleModelName,
        systemName:response.data.checkSystemName
      })
      // 初始化各项目长度 itemsLength, 用于新增 ID
      const pointCheckType = response.data.checkInfos
      pointCheckType.forEach(item => {
        item.itemsLength = item.infoList.length
      })
      this.setState({pointCheckType})
    }
    dispatch({type: 'pointCheckTable/getInfo', payload: {
        batchNo
      }, callback})
  }

  // 获取车型库
  getCarList() {
    const {dispatch, pointCheckCar: {
        data
      }} = this.props
    const callback = response => {
      const carList = response.data.list || response.list
      this.setState({carList})
    }
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'pointCheckCar/fetch'
      dispatch({type: actionType, payload: defaultPage, callback})
    } else {
      callback(data)
    }
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
    const {dispatch, pointCheckProject: {
        data
      }} = this.props
    const callback = response => {
      const projectList = response.data.list || response.list
      this.setState({projectList})
    }
    const list = data.list || data.data.list
    if (list.length === 0) {
      const actionType = 'pointCheckProject/fetch'
      dispatch({type: actionType, payload: defaultPage, callback})
    } else {
      callback(data)
    }
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

  // 审核
  review(state) {
    const {batchNo} = this.state
    const {dispatch} = this.props
    this.setState({confirmLoading: true})
    const callback = response => {
      if (response.code === 1) {
        this.setState({confirmLoading: false})
        message.success('操作成功')
        setTimeout(() => {
          this.goback()
        }, 1000);
      } else {
        message.error(response.msg)
      }

    }
    dispatch({
      type: 'pointCheckTable/review',
      payload: {
        batchNo,
        state
      },
      callback
    })
  }

  // 返回
  goback() {
    history.go(-1)
  }

  render() {
    const {type, pointCheckType, confirmLoading, carName, systemName} = this.state
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}
            title="车型/系统"
        >
          <ItemList label="车型名称"
              text={carName}
          />
          <ItemList label="点检系统名称"
              text={systemName}
          />
        </Card>
        {pointCheckType.map(items => {
          return (
            <Card className={styles.main}
                key={items.id}
                title={items.name}
            >
              {items
                .infoList
                .map(item => {
                  return (
                    <div className={styles.pointList}
                        key={item.id}
                    >
                      <ItemList label="点检项目"
                          text={item.checkProjectName}
                      />
                      <ItemList label="要求/参考阈值"
                          text={item.reference}
                      />
                      <ItemList label="设计值"
                          text={item.designValue}
                      />
                    </div>
                  )
                })
}
            </Card>
          )
        })}

        <div className={styles.btnWrapper}>
          {type === '1'
            ? (
              <Fragment>
                <Button
                    htmlType="submit"
                    loading={confirmLoading}
                    onClick={() => this.review(2)}
                    type="primary"
                >
                  通过
                </Button>
                <Button
                    Button
                    htmlType="submit"
                    loading={confirmLoading}
                    onClick={() => this.review(3)}
                    type="primary"
                >
                  不通过
                </Button>
              </Fragment>
            )
            : (
              <Button htmlType="submit"
                  onClick={() => this.goback()}
                  type="primary"
              >
                确定
              </Button >
            )}
        </div>
      </Fragment>
      )
    }
  }
  export default PointCheckTableCreate