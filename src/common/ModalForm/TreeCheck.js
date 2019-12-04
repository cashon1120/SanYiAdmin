import React, {PureComponent} from 'react';
import {Tree} from 'antd';

const {TreeNode} = Tree;

class TreeCheck extends PureComponent {
  state = {
    selectedKeys: [],
    checkStrictly: true
  };

  onCheck = checkedKeys => {
    const {onClickChange} = this.props;
    let result = [];
    if (checkedKeys && checkedKeys.checked) {
      const keyArr = checkedKeys
        .checked
        .concat();
      checkedKeys
        .checked
        .map(item => {
          if (item) {
            const temArr = item.split('-');
            if (temArr.length === 2) {
              // keyArr.splice(0, 0, ...temArr);
              keyArr.push(temArr[0]);
            }
            if (temArr.length === 3) {
              // keyArr.splice(0, 0, ...temArr);
              keyArr.push(temArr[0]);
              keyArr.push(`${temArr[0]}-${temArr[1]}`);
            }
          }
          return null;
        });
      result = keyArr.filter((element, index, arr) => arr.indexOf(element) === index);
    }
    onClickChange(result);
    // this.setState({ checkedKeys: result });
  };

  onSelect = selectedKeys => {
    this.setState({selectedKeys});
  };

  renderTreeNodes = (data, nextNodeName, parentId, parentLocale) => data.map(item => {
    const pId = parentId
      ? `${parentId}-${item.id}`
      : item.id;
    let locale = item.name || '';
    const regExp = new RegExp('[A-Za-z]+');

    if (item.name && regExp.test(item.name)) {

      locale = `${parentLocale || 'menu'}.${item.name}`;
    }
    if (item[nextNodeName]) {
      return (
        <TreeNode
            dataRef={item}
            key={pId}
        >
          {this.renderTreeNodes(item[nextNodeName], nextNodeName, pId, locale)}
        </TreeNode>
      );
    }
    return (<TreeNode
        {...item}
        key={pId}
            />);
  });

  render() {
    const {treeData, nextNodeName, defaultExpandAll, checkedKeys} = this.props;
    const {selectedKeys, checkStrictly} = this.state;
    return (
      <Tree
          checkable
          checkedKeys={checkedKeys}
          checkStrictly={checkStrictly}
          defaultExpandAll={defaultExpandAll}
          onCheck={this.onCheck}
          onLoad={this.handlerLoad}
          onSelect={this.onSelect}
          selectedKeys={selectedKeys}
      >
        {this.renderTreeNodes(treeData, nextNodeName)}
      </Tree>
    );
  }
}

export default TreeCheck;
