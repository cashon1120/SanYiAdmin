import { Component } from 'react';
import DetailLayout from '@/common/DetailLayout';
import { Button, Form, message, Upload, Icon } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
};

const props = {
    name: 'file',
    // action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
      authorization: 'authorization-text',
    },

    beforeUpload(file) {
        if(file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.type !== 'application/pdf'){
            message.error("系统只支持.doc,.docx,.pdf格式文件");
            return false
        } else {
            return true
        }
    },

    // onChange({file,fileList,event}) {
    //     if(file.status){
    //         that.setState({
    //             fileList_DFMEA:fileList,
    //             fileList_designCode:fileList,
    //             fileList_designCode:fileList,
    //             fileList_Regulation:fileList,
    //             fileList_qualityAnalysis:fileList,
    //         })
    //     }   
    //     if (file.status !== 'uploading') {
    //     console.log(file, fileList);
    //     }
    //     if (file.status === 'done') {
    //     message.success(`${file.name} 上传成功`);
    //     } else if (file.status === 'error') {
    //     message.error(`${file.name} 上传失败`);
    //     }
    // },
  };
  
// let that = null;


@Form.create()
@connect(({BodyworkSystem, loading}) => ({
    BodyworkSystemState: BodyworkSystem,
}), (dispatch) => ({
        dispatch,
    }))
export default class BodyworkSystemAccessory extends Component {
    // constructor(props){
    //     super(props);
    //     that = this
    // }
    state={
        fileList_DFMEA:[],
        fileList_designCode:[],
        fileList_designCode:[],
        fileList_Regulation:[],
        fileList_qualityAnalysis:[],
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('==faultInfoExVO==>',this.props.BodyworkSystemState.faultInfoExVO)
        return;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = values;
                // console.log('----->',params)
                this.props.dispatch({
                    type: 'BodyworkSystem/create',
                    payload: {...params},
                });
            }
        });
    }

    
    onChange(typeName,{file,fileList,event}) {
        if(file.status){
            this.setState({
                [`${typeName}`]:fileList,
            })
        }   
        if (file.status !== 'uploading') {
        console.log(file, fileList);
        }
        if (file.status === 'done') {
        message.success(`${file.name} 上传成功`);
        } else if (file.status === 'error') {
        message.error(`${file.name} 上传失败`);
        }
    }

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props;

        return (
            <DetailLayout titletext='故障模式附件'  isDetail={false}>
                <div name='车身系统'>
                <Form onSubmit={this.handleSubmit}>
                    <span style={{marginLeft:150, fontWeight:'bold', fontSize:18}}>附件上传</span>
                    <br /><br />
                    <span style={{marginLeft:205, fontWeight:'bold' }}>DFMEA报告</span>
                    <FormItem {...formItemLayout} label='上传附件'>
                        {getFieldDecorator('DFMEA', {
                        })(
                            <Upload {...props} fileList={this.state.fileList_DFMEA} accept=".doc,.docx,.pdf" onChange={this.onChange.bind(this,'fileList_DFMEA')} >
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        )}
                        <span style={{ color:'RGB(143,143,143)' }}>支持扩展名：doc .docx .pdf</span>
                    </FormItem>
                    
                    <span style={{marginLeft:205, fontWeight:'bold' }}>设计规范报告</span>
                    <FormItem {...formItemLayout} label='上传附件'>
                        {getFieldDecorator('designCode', {
                        })(
                            <Upload {...props} fileList={this.state.fileList_designCode} accept=".doc,.docx,.pdf" onChange={this.onChange.bind(this,'fileList_designCode')}>
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        )}
                        <span style={{ color:'RGB(143,143,143)' }}>支持扩展名：doc .docx .pdf</span>
                    </FormItem>

                    <span style={{marginLeft:205, fontWeight:'bold' }}>行业趋势报告</span>
                    <FormItem {...formItemLayout} label='上传附件'>
                        {getFieldDecorator('IndustryTrends', {
                        })(
                            <Upload {...props} fileList={this.state.fileList_IndustryTrends} accept=".doc,.docx,.pdf" onChange={this.onChange.bind(this,'fileList_IndustryTrends')}>
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        )}
                        <span style={{ color:'RGB(143,143,143)' }}>支持扩展名：doc .docx .pdf</span>
                    </FormItem>

                    <span style={{marginLeft:205, fontWeight:'bold' }}>法规标准报告</span>
                    <FormItem {...formItemLayout} label='上传附件'>
                        {getFieldDecorator('Regulation', {
                        })(
                            <Upload {...props} fileList={this.state.fileList_Regulation} accept=".doc,.docx,.pdf" onChange={this.onChange.bind(this,'fileList_Regulation')}>
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        )}
                        <span style={{ color:'RGB(143,143,143)' }}>支持扩展名：doc .docx .pdf</span>
                    </FormItem>

                    <span style={{marginLeft:205, fontWeight:'bold' }}>质量分析报告</span>
                    <FormItem {...formItemLayout} label='上传附件'>
                        {getFieldDecorator('qualityAnalysis', {
                        })(
                            <Upload {...props} fileList={this.state.fileList_qualityAnalysis} accept=".doc,.docx,.pdf" onChange={this.onChange.bind(this,'fileList_qualityAnalysis')}>
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        )}
                        <span style={{ color:'RGB(143,143,143)' }}>支持扩展名：doc .docx .pdf</span>
                    </FormItem>


                    <FormItem style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" type='primary' style={{ marginRight: 20 }}>提交</Button>
                        <Link to='/chassis/bodyworkSystem'><Button type='default'>取消</Button></Link>
                    </FormItem>
                </Form>
                </div>
            </DetailLayout>
        )
    }
}
