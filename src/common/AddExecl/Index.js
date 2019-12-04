import React, {Component, Fragment} from 'react';
import {Button, message, Modal, Table, Tabs} from 'antd';
import {connect} from 'dva'
const {TabPane} = Tabs

@connect(({publicModel}) => ({publicModel}))
class AddExecl extends Component {

  state = {
    accept: '.xls, .xlsx, .xlsm',
    loading: false,
    visible: false,
    successData: [],
    failureData: [],
    id: 0
  }

  uploadIfle() {
    if(this.refs.fileInput){
    this
      .refs
      .fileInput
      .click()
    }
  }

  columns = [
    {
      title: '表名',
      dataIndex: 'businessName',
      key: 'businessName'
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '备注',
      dataIndex: 'message',
      key: 'message'
    }
  ]

  handleChange(e) {
    const {files} = e.target
    if(files.length <=0) return
    let { id } = this.state
    this.setState({loading: true, id: id+1})
    let {accept} = this.state
    const {dispatch} = this.props
    const file = files[0]
    const temp = file
      .name
      .split('.')
    const fileType = temp[temp.length - 1]
    if (!accept.includes(fileType)) {
      message.error(`请选择正确的文件格式${accept}`)
      return
    }
    const actionType = 'publicModel/importForExcel'
    const callback = res => {
      let { id } = this.state
      this.setState({loading: false})
      let [successData, failureData] = [[], []]
      if (res.code && res.code === 1) {
        res.data.forEach(item => {
          if(item.status === 0){
            failureData.push(item)
          }else{
            successData.push(item)
          }
        })
      }
      this.setState({visible: true, id: id+1, failureData, successData})
    }
    const formFile = new FormData();
    formFile.append('file', file);
    dispatch({type: actionType, payload: formFile, callback})
  }

  handleCancel = () => {
    this.setState({visible: false})
  }
  addInput = () => {
    const { id } = this.state
    if(id % 2 === 0){
      return (
        <input
            accept=".xls, .xlsx, .xlsm"
            id={id}
            onChange={(e) => this.handleChange(e)}
            ref="fileInput"
            style={{
            display: 'none'
          }}
            type="file"
        />
      )
    }

  }
  render() {
    const {loading, visible, successData, failureData, id} = this.state
    return (
      <Fragment>
        {this.addInput(id)}
        <Button
            loading={loading}
            onClick={() => this.uploadIfle()}
            style={{
          marginLeft: 15
        }}
        >
          导入
        </Button>
        <Modal
            centered
            footer={null}
            onCancel={this.handleCancel}
            visible={visible}
            width={800}
        >
          <Tabs defaultActiveKey="1">
            <TabPane key="1"
                tab={`导入成功 (${successData.length})`}
            >
                       <Table columns={this.columns}
                           dataSource={successData}
                           size="small"
                       />
            </TabPane>
            <TabPane key="2"
                tab={`导入失败 (${failureData.length})`}
            >
                        <Table columns={this.columns}
                            dataSource={failureData}
                            size="small"
                        />
            </TabPane>
          </Tabs>
        </Modal>
      </Fragment>
    )
  }
}

export default AddExecl;
