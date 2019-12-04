import React, {Component} from 'react'
import {
  Button,
  Form
} from 'antd'
import PicturesWall from '@/common/PicturesWall'
import { getUploadedPic } from '@/utils/utils'

const FormItem = Form.Item
const acceptType = '.doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
@Form.create()

class BodyworkSystemAccessory extends Component {
  state = {
    isFirst: true,
    pictures: {
      fileList_DFMEA: [],
      fileList_DesignCode: [],
      fileList_Trade: [],
      fileList_Regulation: [],
      fileList_QualityAnalysis: []
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
      fileList_Regulation: [],
      fileList_QualityAnalysis: []
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
          break
        default:
          pictures.fileList_QualityAnalysis.push(item)

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
    const { handleSubmit} = this.props
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

  render() {
    const {form, form: {
        getFieldDecorator
      }, loading, stepBack } = this.props;
    const { pictures: {fileList_DFMEA, fileList_DesignCode, fileList_Trade, fileList_Regulation, fileList_QualityAnalysis} } = this.state
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
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

    return (
      <div name="车身系统">
        <Form onSubmit={this.handleSubmit}>
          <h1>附件上传</h1>
          <br/><br/>
          <FormItem {...formItemLayout}
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
              color: 'RGB(143,143,143)'
            }}
            >支持扩展名：doc .docx .pdf</span>
          </FormItem>
          <FormItem {...formItemLayout}
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
              color: 'RGB(143,143,143)'
            }}
            >支持扩展名：doc .docx .pdf</span>
          </FormItem>
          <FormItem {...formItemLayout}
              label="行业趋势报告"
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
              color: 'RGB(143,143,143)'
            }}
            >支持扩展名：doc .docx .pdf</span>
          </FormItem>
          <FormItem {...formItemLayout}
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
              color: 'RGB(143,143,143)'
            }}
            >支持扩展名：doc .docx .pdf</span>
          </FormItem>
          <FormItem {...formItemLayout}
              label="质量分析报告"
          >
            {getFieldDecorator('fileList_QualityAnalysis', {})(
              <PicturesWall
                  acceptType={acceptType}
                  dataSource={fileList_QualityAnalysis}
                  form={form}
                  listType="text"
                  maxImgLen={12}
                  name="fileList_QualityAnalysis"
                  onChange={this.handlePicChange}
                  type={5}
              />
            )}
            <span style={{
              color: 'RGB(143,143,143)'
            }}
            >支持扩展名：doc .docx .pdf</span>
          </FormItem>

          <FormItem style={{
            textAlign: 'center'
          }}
          >
            <Button
                onClick={stepBack}
                style={{
              marginRight: 20
            }}
                type="primary"
            >上一步</Button>
            <Button
                htmlType="submit"
                loading={loading}
                style={{
              marginRight: 20
            }}
                type="primary"
            >提交</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default BodyworkSystemAccessory
