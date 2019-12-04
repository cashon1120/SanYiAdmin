import React, {Component, Fragment} from 'react'
import {Card, Icon} from 'antd'
import {connect} from 'dva';

let isFailureModel = false // 是否在故障模式页面
let isChassisComponent = false // 是否在底盘部件管理页面
let isPointCheckTable = false
const getName = function (path, url, router, type, level, systemRoute) { // 获取名称   type 菜单级别0: 一级, 1: 二级
  let name = ''
  if (type === 0) {
    if (url === 'chassisSystem' || url === 'chassisComponent' || url === 'pointCheckTable') {
      if (url === 'chassisSystem') {
        isFailureModel = true
        isChassisComponent = isPointCheckTable = false
      }

      if (url === 'chassisComponent') {
        isChassisComponent = true
        isFailureModel = isPointCheckTable = false
      }

      if (url === 'pointCheckTable') {
        isPointCheckTable = true
        isFailureModel = isChassisComponent = false
      }
    } else {
      isPointCheckTable = isFailureModel = isChassisComponent = false
    }
  }
  (router || []).map(item => {
    if (url && !Number.isNaN(url) && item.code && item.code.indexOf(url) >= 0 && (level
      ? item.type === type
      : item.type === 1 || item.type === 2)) {
      name = type === 0
        ? item.name
        : <Fragment><Icon
            style={{
          marginLeft: 10,
          marginRight: 10,
          fontSize: 15
        }}
            type="right"
                    />{item.name}</Fragment>
    }

    if (type === 1 && isPointCheckTable) {
      let title = ''
      switch (path[2]) {
        case 'add':
          title = '添加点检表'
          break;
        case 'update':
          title = '修改点检表'
          break;
        case 'detail':
          title = '点检表详情'
          break;
        default:
          title = '点检表列表'
          break;
      }

      name = <Fragment><Icon
          style={{
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15
      }}
          type="right"
                       />{title}</Fragment>
    }

    if (type === 1 && isFailureModel) {
      let title = ''
      if (path[2] === 'add') {
        title = '添加'
      } else if (path[2] === 'update') {
        title = '修改'
      } else if (path[2] === 'detail') {
        title = '详情'
      } else {
        systemRoute.map(route => {
          if (route.code.split('/')[2] === url) {
            title = route.name
          }
        })
      }
      name = <Fragment><Icon
          style={{
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15
      }}
          type="right"
                       />{title}</Fragment>
    }

    if (type === 1 && isChassisComponent && path[3]) {
      let level = ''
      switch (path[3]) {
        case '1':
          level = '系统管理'
          break
        case '2':
          level = '总成管理'
          break
        default:
          level = '核心零部件管理'
          break
      }
      const levelComponent = <Fragment><Icon
          style={{
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15
      }}
          type="right"
                                       />{level}</Fragment>
      let text = ''
      if (url === 'detail') {
        text = '详情'
      } else {
        if (path[4]) {
          text = '修改'
        } else {
          text = '添加'
        }
      }
      name = <Fragment>{levelComponent}<Icon
          style={{
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15
      }}
          type="right"
                                       />{text}</Fragment>
    }

  })
  return name
}

@connect(({publicModel}) => ({publicModel}))

class CurrentTitle extends Component {
  render() {
    const {
      props: {
        location: {
          pathname
        }
      }
    } = this.props
    const router = JSON.parse(localStorage.getItem('userAuth'))
    const {publicModel: {
        systemList
      }} = this.props
    const path = pathname.split('/')
    const systemRoute = systemList.map(item => ({name: item.componentName, code: `/chassisSystem/${item.id}`, id: item.id}))
    const firstName = getName(path, path[1], router, 0, 1, systemRoute)
    const secondName = getName(path, path[2], router, 1, 0, systemRoute)

    return (
      <Card style={{
        fontSize: 16
      }}
      >
        <Icon style={{
          marginRight: 15
        }}
            type="menu"
        />{firstName}{secondName}</Card>
    )
  }
}
export default CurrentTitle
