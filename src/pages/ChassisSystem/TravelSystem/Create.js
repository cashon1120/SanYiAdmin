import { Component } from 'react';
import DetailLayout from '@/common/DetailLayout';
import { Button, Form, Select, Input } from 'antd';
import { connect } from 'dva';
import PicturesWall from '@/common/PicturesWall';
import { Link } from 'react-router-dom';
import router from 'umi/router';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
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

const mapDis2Prop = (dispatch) => {
    return {
        addDevice: () => {
            dispatch({
                type: 'TravelSystem/Create'
            })
        }
    }
};

@Form.create()
@connect(null, mapDis2Prop)
export default class TravelSystemCreate extends Component {
    state={
        fileList:[]
    }
    //提交验证
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.addDevice();
                router.push('/chassis/travelSystem/accessory');
            }
        });
    }

    // //文件上传验证
    // handleUploadValidator = (rule, value, callback) => {
    //     if (this.state.fileList.length == 0){
    //         callback("请上传图片")
    //     }else{
    //         callback()
    //     }
    // }

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props;

        return (
            <DetailLayout titletext='新建故障模式' isDetail={false}>
                <div name='行驶系统'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label='总成部件'>
                        {getFieldDecorator('assemblyParts', {
                            initialValue: '1'
                        })(
                            <Select>
                                <Option value='1'>散热器总成</Option>
                                <Option value='2'>直拉杆总成</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='核心零部件'>
                        {getFieldDecorator('coreParts', {
                            initialValue: '1'
                        })(
                            <Select>
                                <Option value='1'>散热器</Option>
                                <Option value='2'>直拉杆</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='部件'>
                        {getFieldDecorator('unit', {
                            initialValue: '1'
                        })(
                            <Select>
                                <Option value='1'>芯体根部</Option>
                                <Option value='2'>杆身上方</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='零部件描述'>
                        {getFieldDecorator('corePartsDescription', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入零部件描述'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='核心零部件图片' required>
                        {getFieldDecorator('corePartsImg', {
                            rules: [
                                {
                                    //  validator: this.handleUploadValidator
                                    required: true,
                                    message: '请上传核心零部件图片'
                                }
                            ]
                        })(
                            <PicturesWall total={12} /> //onChange={fileList => {this.setState({fileList})}}
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='故障模式'>
                        {getFieldDecorator('faultMode', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入故障模式'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='故障现象'>
                        {getFieldDecorator('faultImg', {
                            rules: [
                                {
                                    required: true,
                                    message: '请上传故障现象图片'
                                }
                            ]
                        })(
                            <PicturesWall total={12} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='原因分析'>
                        {getFieldDecorator('reasonAnalysis', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入原因分析'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='故障对策'>
                        {getFieldDecorator('countermeasure', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入故障对策'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='原因及对策照片'>
                        {getFieldDecorator('reasonImg', {
                            rules: [
                                {
                                    required: true,
                                    message: '请上传原因及对策照片'
                                }
                            ]
                        })(
                            <PicturesWall total={12} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='标准、原理、基于标准的具体化数据参数'>
                        {getFieldDecorator('measured', {
                            rules: [
                                {
                                    message: '请输入具体化数据参数'
                                }
                            ]
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='标准原理及照片'>
                        {getFieldDecorator('measuredImg', {
                        })(
                            <PicturesWall total={12} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='设计雷区，要点'>
                        {getFieldDecorator('mineField', {
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='影响因素说明'>
                        {getFieldDecorator('effectsThat', {
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='设计雷区，要点及影响因素图片'>
                        {getFieldDecorator('mineFieldImg', {
                        })(
                            <PicturesWall total={12} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='故障参考信息(类型、平均里程、地域等)'>
                        {getFieldDecorator('faultReference', {
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                    <FormItem style={{ textAlign: 'center' }}>
                        {/* <Button htmlType="submit" type='primary' style={{ marginRight: 20 }}>提交</Button> */}
                        <Button htmlType="submit" type='primary' style={{ marginRight: 20 }}>下一步</Button>
                        <Link to='/chassis/travelSystem'><Button type='default'>取消</Button></Link>
                    </FormItem>
                </Form>
                </div>
            </DetailLayout>
        )
    }
}
