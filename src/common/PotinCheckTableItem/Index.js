import React, {Fragment, Component} from 'react'
import {Form, Select, Input} from 'antd'
import {connect} from 'dva'
const {Option} = Select
@Form.create()
@connect(({ publicModel, loading}) => ({publicModel, loading: loading.models.pointCheckTable}))
class PointCheckTableItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: props.index,
      parentId: props.parentId,
      projectList: []
    }
  }
  componentDidMount = () => {
    this.setSelectProjectList()
  }

  setSelectProjectList(){
    const { projectList } = this.props
    const { parentId } = this.state
    this.setState({
      projectList: projectList.filter(item => item.checkTypeId === parentId)
    })
  }

  del(){
    const { index } = this.state
    const { delItems } = this.props
    delItems(index)
  }

  onChange(key, value){
    const { index } = this.state
    const { setValue } = this.props
    setValue(index, key, value)
  }

  render() {
    const { values, form: {
        getFieldDecorator
      }} = this.props
    const { projectList } = this.state
    return (
      <Fragment>
        <Form.Item label="点检项目">
          {getFieldDecorator('checkProjectId', {
            initialValue: values.checkProjectId
          })(
            <Select onChange={value => this.onChange('checkProjectId', value)}
                style={{
              width: 300
            }}
            >
             {projectList.map(item => (<Option key={item.id}
                 value={item.id}
                                       >{item.name}</Option>))}
            </Select>
          )}
          <a onClick={()=> this.del()}
              style={{
            marginLeft: 20
          }}
          >删除</a>
        </Form.Item>
        <Form.Item label="要求/参考阈值">
          {getFieldDecorator('reference', {initialValue: values.reference})(<Input onChange={e => this.onChange('reference', e.target.value)}
              style={{
            width: 300
          }}
                                                                            />)}
        </Form.Item>
        <Form.Item label="设置值">
          {getFieldDecorator('designValue', {initialValue: values.designValue})(<Input onChange={e => this.onChange('designValue', e.target.value)}
              style={{
            width: 300
          }}
                                                                                />)}
        </Form.Item>
      </Fragment>
    )
  }
}

export default PointCheckTableItem
