import React, {Component} from 'react'
import {
  Button,
  Form,
  Row,
  Col
} from 'antd'
import PicturesWall from '@/common/PicturesWall'
import { getUploadedPic } from '@/utils/utils'
import { formItemLayout2 } from '../../../public/config'

const FormItem = Form.Item
const acceptType = '.doc, .docx, .docm, .xls, .xlsx, .xlsm, .pdf .ppt, .pptx'
@Form.create()

class BodyworkSystemAccessory extends Component {
  state = {
    isFirst: true,
    pictures: {
      fileList_DFMEA: [],
      fileList_DesignCode: [],
      fileList_Trade: [],
      fileList_Regulation: []
    }
  }


// 同步更新父组件图片值
componentWillReceiveProps(nextProps) {
  const { dataSource } = nextProps;
  const { isFirst } = this.state;

  if (isFirst && dataSource && dataSource.length > 0) {
    let pictures = {
      fileList_DFMEA: [],
      fileList_DesignCode: [],
      fileList_Trade: [],
      fileList_Regulation: []
    }
    dataSource.map(item => {
      switch(item.businessType){
        case 1:
          pictures.fileList_DFMEA.push(item)
          break
        case 2:
          pictures.fileList_DesignCode.push(item)
          break
        case 3:
          pictures.fileList_Trade.push(item)
          break
        case 4:
          pictures.fileList_Regulation.push(item)
          break;
      }
    })
    this.setState({
      pictures,
      isFirst: false
    });
  }
}

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { handleSubmit } = this.props
    const { pictures } = this.state
    let result = []
    let index = 1 // 业务ID[1DFMEA报告、2设计规范报告、3行业趋势报告、4法规标准报告、5质量分析报告、6型谱]
    for (let key in pictures){
      getUploadedPic(pictures[key],index).map(item => {
        result.push(item)
      })
      index++
    }
    handleSubmit(result)
  }

  // 上传图片回调
  handlePicChange = (type, fileList) => {
    const { pictures } = this.state
    this.setState({
      pictures: {
        ...pictures,
        [type]: fileList
      }
    })
  }

  goBack(){
    history.go(-1)
  }

  render() {
    const {form, type, form: {
        getFieldDecorator
      }, loading } = this.props;
    const { pictures: {fileList_DFMEA, fileList_DesignCode, fileList_Trade, fileList_Regulation} } = this.state

    return (
      <div name="车身系统">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout2}
              label="DFMEA报告"
          >
            {getFieldDecorator('fileList_DFMEA', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={fileList_DFMEA}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="fileList_DFMEA"
                  onChange={this.handlePicChange}
                  type={1}
              />
            )}
            <span style={{
              color: 'RGB(143,143,143)',
              whiteSpace:'nowrap'
            }}
            >支持扩展名：.doc .docx .docm .xls .xlsx .xlsm .pdf .ppt .pptx</span>
          </FormItem>
          <FormItem {...formItemLayout2}
              label="设计规范报告"
          >
            {getFieldDecorator('fileList_DesignCode', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={fileList_DesignCode}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="fileList_DesignCode"
                  onChange={this.handlePicChange}
                  type={2}
              />
            )}
            <span style={{
              color: 'RGB(143,143,143)',
              whiteSpace:'nowrap'
            }}
            >支持扩展名：.doc .docx .docm .xls .xlsx .xlsm .pdf .ppt .pptx</span>
          </FormItem>
          <FormItem {...formItemLayout2}
              label={type === 1 ? '行业趋势报告' : '型谱'}
          >
            {getFieldDecorator('fileList_Trade', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={fileList_Trade}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="fileList_Trade"
                  onChange={this.handlePicChange}
                  type={3}
              />
            )}
            <span style={{
              color: 'RGB(143,143,143)',
              whiteSpace:'nowrap'
            }}
            >支持扩展名：.doc .docx .docm .xls .xlsx .xlsm .pdf .ppt .pptx</span>
          </FormItem>
          <FormItem {...formItemLayout2}
              label="法规标准报告"
          >
            {getFieldDecorator('fileList_Regulation', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={fileList_Regulation}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="fileList_Regulation"
                  onChange={this.handlePicChange}
                  type={4}
              />
            )}
           <span style={{
              color: 'RGB(143,143,143)',
              whiteSpace:'nowrap'
            }}
           >支持扩展名：.doc .docx .docm .xls .xlsx .xlsm .pdf .ppt .pptx</span>
          </FormItem>

            <Row>
              <Col {...formItemLayout2.labelCol}></Col>
              <Col {...formItemLayout2.wrapperCol}>
                    <Button
                        htmlType="submit"
                        loading={loading}
                        style={{
                      marginRight: 20
                    }}
                        type="primary"
                    >提交</Button>
                    <Button
                        onClick={() => history.go(-1)}
                        type="default"
                    >取消</Button>
                  </Col>
                </Row>
        </Form>
      </div>
    )
  }
}
export default BodyworkSystemAccessory
