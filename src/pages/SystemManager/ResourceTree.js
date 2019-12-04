import React, {Component, Fragment} from 'react'
import { Tree } from 'antd'
const { TreeNode } = Tree

let isCheckedKeys = []
class ResourceTree extends Component {

  state={
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: []
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  getParentId(id){
    const {defaultData} = this.props
    const data = defaultData.find(item => item.id === parseInt(id, 10))
    if(data.parentId){
      isCheckedKeys.push(data.parentId.toString())
      this.getParentId(data.parentId)
    }
  }

  onCheck = checkedKeys => {
    isCheckedKeys = []
    const {onChange} = this.props
    const checked = checkedKeys.checked
    checked.forEach(item => {
      isCheckedKeys.push(item)
      this.getParentId(item)
    })
    isCheckedKeys = Array.from(new Set([...isCheckedKeys]))
    onChange(isCheckedKeys)
  }

  onSelect = (selectedKeys) => {
    this.setState({ selectedKeys })
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode dataRef={item}
              key={item.key}
              title={item.title}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item}
          {...item}
             />
    })

  onOk(){
    const { onOk } = this.props
    const { checkedKeys } = this.state
    onOk(checkedKeys)
  }

  render() {
    const { treeData, checkedKeys} = this.props
    return (
      <Fragment>
          <Tree
              autoExpandParent
              checkable
              checkedKeys={checkedKeys}
              checkStrictly
              defaultExpandAll
              expandedKeys={this.state.expandedKeys}
              onCheck={this.onCheck}
              onExpand={this.onExpand}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
          >
                  {this.renderTreeNodes(treeData)}
          </Tree>

      </Fragment>
    )
  }
}
export default ResourceTree
