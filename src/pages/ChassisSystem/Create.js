import { Component } from 'react';
import DetailLayout from '@/common/DetailLayout';
import { Button, Form, Select, Input, message } from 'antd';
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


@Form.create()
@connect(({ chassisSystem, loading }) => ({
    chassisSystem,
    loading: loading.models.artile,
  }))

export default class BodyworkSystemCreate extends Component {
   
    constructor(props){
        const {
            match: {
              params: { typeId, operate },
            },
          } = props;
        super(props);
        this.state={
            fileList:[],
            typeId,
            operate
        }
    }

    //提交验证
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('---values---->',values);
            if (!err) {
                let params = [];
                //故障信息
                let faultInfos = [{
                    chassisId: 6,
                    assemblyPartsId: values.assemblyPartsId,
                    corePartsId: values.corePartsId,
                    unit: values.unit,
                    corePartsDescription: values.corePartsDescription,
                    faultPattern: values.faultPattern,
                    reasonAnalysis: values.reasonAnalysis,
                    countermeasure: values.countermeasure,
                    measured: values.measured,
                    mineField: values.mineField,
                    effectsThat: values.effectsThat,
                    faultReference: values.faultReference,
                    userId: 1,
                    createTime: new Date(),
                    status: 2,
                }];

                //故障多媒体,附件信息
                let multimediaInfos = [];
                if(values.corePartsImg != null){
                    values.corePartsImg.map((item,index) => {
                        let imgType = 1;
                        let type = item.type.substr(0,5);
                        if(type == 'image'){
                            imgType = 1
                        }else if(type == 'video'){
                            imgType = 2
                        }else{
                            message.warning('只保存图片和视频');
                            return true;
                        }

                        let imgInfo = {
                            name: item.name,
                            path: item.name,
                            type: imgType,
                            sort: 1,
                            userId: 1,
                            createTime: new Date(),
                            status: 1,
                        }
                        multimediaInfos.push(imgInfo);
                    })
                }
                if(values.faultImg != null){
                    values.faultImg.map((item,index) => {
                        let imgType = 1;
                        let type = item.type.substr(0,5);
                        if(type == 'image'){
                            imgType = 1
                        }else if(type == 'video'){
                            imgType = 2
                        }else{
                            message.warning('只保存图片和视频');
                            return true;
                        }

                        let imgInfo = {
                            name: item.name,
                            path: item.name,
                            type: imgType,
                            sort: 2,
                            userId: 1,
                            createTime: new Date(),
                            status: 1,
                        }
                        multimediaInfos.push(imgInfo);
                    })
                }
                if(values.reasonImg != null){
                    values.reasonImg.map((item,index) => {
                        let imgType = 1;
                        let type = item.type.substr(0,5);
                        if(type == 'image'){
                            imgType = 1
                        }else if(type == 'video'){
                            imgType = 2
                        }else{
                            message.warning('只保存图片和视频');
                            return true;
                        }

                        let imgInfo = {
                            name: item.name,
                            path: item.name,
                            type: imgType,
                            sort: 3,
                            userId: 1,
                            createTime: new Date(),
                            status: 1,
                        }
                        multimediaInfos.push(imgInfo);
                    })
                }
                if(values.measuredImg != null){
                    values.measuredImg.map((item,index) => {
                        let imgType = 1;
                        let type = item.type.substr(0,5);
                        if(type == 'image'){
                            imgType = 1
                        }else if(type == 'video'){
                            imgType = 2
                        }else{
                            message.warning('只保存图片和视频');
                            return true;
                        }

                        let imgInfo = {
                            name: item.name,
                            path: item.name,
                            type: imgType,
                            sort: 4,
                            userId: 1,
                            createTime: new Date(),
                            status: 1,
                        }
                        multimediaInfos.push(imgInfo);
                    })
                }
                if(values.mineFieldImg != null){
                    values.mineFieldImg.map((item,index) => {
                        let imgType = 1;
                        let type = item.type.substr(0,5);
                        if(type == 'image'){
                            imgType = 1
                        }else if(type == 'video'){
                            imgType = 2
                        }else{
                            message.warning('只保存图片和视频');
                            return true;
                        }

                        let imgInfo = {
                            name: item.name,
                            path: item.name,
                            type: imgType,
                            sort: 5,
                            userId: 1,
                            createTime: new Date(),
                            status: 1,
                        }
                        multimediaInfos.push(imgInfo);
                    })
                }

                //操作记录
                let operationLogInfos = [{
                    userId: 1,
                    powerId: 333,
                    opTime: new Date(),
                    explain: '新增故障信息',
                    status: 1,
                }];

                params.faultInfos = faultInfos;
                params.multimediaInfos = multimediaInfos;
                params.operationLogInfos = operationLogInfos;

                // console.log('----params---->', params)
                this.props.dispatch({
                    type: 'BodyworkSystem/saveData',
                    payload: {...params},
                });
                router.push('/chassis/bodyworkSystem/accessory');
            }
        });
    }

    componentDidMount = () =>{
        // this.props.corePartsInfo();
        // this.props.assemblyPartsInfo();
    }


    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const assemblyPartsData = [{id:1, name:1}]
        const corePartsData = [{id:1, name:1}]
        // console.log('----fileList---->',this.state.fileList)
        return (
            <DetailLayout titletext='新建故障模式' isDetail={false}>
                <div name='车身系统'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label='总成部件'>
                        {getFieldDecorator('assemblyPartsId', {
                            initialValue: assemblyPartsData[0] && assemblyPartsData[0].id + ''
                        })(
                            <Select>
                                {assemblyPartsData && assemblyPartsData.map((item,index) => {
                                    return <Option key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='核心零部件'>
                        {getFieldDecorator('corePartsId', {
                            initialValue: corePartsData[0] && corePartsData[0].id + ''
                        })(
                            <Select>
                                {corePartsData && corePartsData.map((item,index) => {
                                    return  <Option key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='部件'>
                        {getFieldDecorator('unit', {
                            // initialValue: '1'
                            rules: [
                                {
                                    required: true,
                                    message: '请输入部件'
                                }
                            ]
                        })(
                            <Input />
                            // <Select>
                            //     <Option value='1'>芯体根部</Option>
                            //     <Option value='2'>杆身上方</Option>
                            // </Select>
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
                            <PicturesWall onChange={fileList => {this.setState({fileList})}} total={12} /> //onChange={fileList => {this.setState({fileList})}}
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='故障模式'>
                        {getFieldDecorator('faultPattern', {
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
                        <Link to='/chassis/bodyworkSystem'><Button type='default'>取消</Button></Link>
                    </FormItem>
                </Form>
                </div>
            </DetailLayout>
        )
    }
}
