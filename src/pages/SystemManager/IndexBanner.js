import React, {Component, Fragment} from 'react'
import {
  Form,
  message,
  Card,
  Row,
  Col,
  Button
} from 'antd'
import {connect} from 'dva'
import PicturesWall from '@/common/PicturesWall'
import CurrentTitle from '@/common/CurrentTitle/Index'
import styles from '@/layouts/global.less'
import {formItemLayout} from '../../../public/config'

@Form.create()
@connect(({indexBanner, loading}) => ({indexBanner, loading: loading.models.indexBanner}))
class IndexBanner extends Component {
  state = {
    id: '',
    picture: ''
  }

  componentDidMount() {
    this.getPicture()
  }

  // 获取系统数据
  getPicture() {
    const {dispatch} = this.props
    const callback = res => {
      if (res.code === 1) {
        this.setState({
          id: res.data.id,
          picture: {url: res.data.value}
        })
      }
    }
    const actionType = 'indexBanner/getBanner'
    dispatch({
      type: actionType,
      callback
    })
  }

  handleSubmit = () => {
    const {dispatch} = this.props
    const {id, picture} = this.state
    const callback = res => {
      if (res.code === 1) {
        message.success('上传成功')
      }else{
        message.success('上传失败, 请重试!')
      }
    }
    const actionType = 'indexBanner/uploadBanner'
    if(picture.length === 0){
      message.success('请选择图片')
      return
    }
    dispatch({
      type: actionType,
      payload: {
        id,
        value:picture[0].response.data
      },
      callback
    })
  }


  // 上传图片回调, 设置对应图片数据列表
  handlePicChange = (name, fileList) => {
    this.setState({picture: fileList})
  }


  render() {
    const { form, loading, form: {
        getFieldDecorator
      }} = this.props
    let {
      picture
    } = this.state
    return (
      <Fragment>
        <CurrentTitle props={this.props}/>
        <Card className={styles.main}>
          <Form>


            <Form.Item {...formItemLayout}
                label={'上传图片'}
            >
              {getFieldDecorator('picture', {
                rules: [
                  {
                    required: true,
                    message: `请上传${name}图片或视频`
                  }
                ]
              })(<PicturesWall
                  canDrag={0}
                  dataSource={picture}
                  form={form}
                  isBanner
                  maxImgLen={1}
                  name="picture"
                  onChange={this.handlePicChange}
                 />)}
                 <div>上传图片宽高: 1920*780 像素</div>
            </Form.Item >
            <Row>
              <Col {...formItemLayout.labelCol}></Col>
              <Col {...formItemLayout.wrapperCol}>
                    <Button
                        htmlType="submit"
                        loading={loading}
                        onClick={this.handleSubmit}
                        style={{
                      marginRight: 20
                    }}
                        type="primary"
                    >提交</Button>
                  </Col>
                </Row>
          </Form>

        </Card>
      </Fragment>
    )
  }
}
export default IndexBanner