import React, {PureComponent} from 'react'
import {connect} from 'dva'
import { formatTreeNode } from '../../utils/utils'
import CurrentTitle from '@/common/CurrentTitle/Index'
import styles from '../../layouts/global.less'
import ResourceTree from './ResourceTree'
import { Row, Divider, Select, Button, Card, Spin, message } from 'antd'

const {Option} = Select

@connect(({role, characterManager, resourceManager, loading}) => ({role, characterManager, resourceManager, submitting: loading.effects['form/submitRegularForm']}))
class AuthorityManager extends PureComponent {
  state = {
    subLoading: false,
    checkedKeys: [],
    spinning: false,
    roleId: 0,
    defaultExpandAll: true,
    defaultExpandParent: true,
    resourceList: [],
    defaultData: [],
    characterManager: []
  }

  componentDidMount() {
    const {dispatch} = this.props
    const callback = (response) => {
      this.setState({defaultExpandAll: true, defaultExpandParent: true, spinning: false,  characterManager: response.data.list})
    }
    this.getReourceList()
    // 获取角色列表
    dispatch({
      type: 'characterManager/fetch',
      payload: {
        pageSize:0,
        pageNum:0
      },
      callback
    })
  }

  // 获取资源列表
  getReourceList(){
    const { dispatch } = this.props
    const callback = response => {

      if(response.code === 1){
        const defaultData = response.data.list
        const resourceList = formatTreeNode(defaultData)
        this.setState({
          resourceList,
          defaultData
        })
      }
    }
    dispatch({
      type: 'resourceManager/fetch',
      payload: {
        pageSize:0,
        pageNum:0
      },
      callback
    })
  }

  findChecked(resourceList){
    let result = []
    function findKey(data){
      data.map(item => {
        if(item.hold){
          result.push(item.key)
        }
        if(item.children){
          findKey(item.children)
        }
      })
    }
    findKey(resourceList)
    return result
  }

  // 获取角色权限
  handleChange = id => {
    const {dispatch} = this.props
    const callback = response => {
      let checkedKeys = []
      if (response.code === 1) {
        if (response.data) {
          const resourceList = formatTreeNode(response.data)
          checkedKeys = this.findChecked(resourceList)
          this.setState({
            resourceList
          })
        }
      }
      this.setState({spinning: false, checkedKeys})
    }
    this.setState({
      spinning: true,
      roleId: id,
      checkedKeys: []
    }, () => {
      dispatch({
        type: 'role/fetch',
        payload: {
          roleId: id
        },
        callback
      })
    })
  }

  handleSaveRole = () => {
    const {roleId, checkedKeys} = this.state
    if(roleId === 0){
      message.error('请选择角色')
      return
    }
    const {dispatch} = this.props
    const callback = response => {
      if (response) {
        if (response.code === 1) {
          message.success(response.msg)
        } else {
          message.error(response.msg)
        }
      }
      this.setState({subLoading: false})
    }
    let resources = []
    checkedKeys.map(item => {
      resources.push({resourceId: item})
    })
    if(resources.length === 0){
      message.error('请选择权限')
      return
    }
    this.setState({
      subLoading: true
    }, () => {
      dispatch({
        type: 'role/add',
        payload: {
          roleId,
          resources
        },
        callback
      })
    })
  }

  handlerSelectKey = keys => {
    this.setState({checkedKeys: keys})
  }

  render() {
    const {subLoading, spinning, resourceList, checkedKeys, characterManager, defaultData} = this.state
    return (
      <div>
        <CurrentTitle props={this.props}/>
        <Card bordered={false}
            className={styles.main}
        >
          <Row span={16}>
            选择角色：
            <Select
                onChange={this.handleChange}
                placeholder="请选择"
                style={{
              width: '30%'
            }}
            >
              {characterManager.map(selData => (
                <Option key={`selectIndex${selData.id}`}
                    value={selData.id}
                >
                  {selData.roleName}
                </Option>
              ))}
            </Select>
          </Row>

          <Row>
            <Divider/>
            <Spin size="default"
                spinning={spinning}
            />

            <ResourceTree
                checkedKeys={checkedKeys}
                defaultData={defaultData}
                onChange={this.handlerSelectKey}
                treeData={resourceList}
            />
          </Row>
          <Row>
            <Button
                loading={subLoading}
                onClick={this.handleSaveRole}
                style={{
              marginTop: 18
            }}
                type="primary"
            >
              保存
            </Button>
          </Row>
        </Card>
      </div>
    )
  }
}

export default AuthorityManager
