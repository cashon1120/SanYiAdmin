import React, { Component } from 'react';
import ListLayout from '@/common/ListLayout';
import { Input, Button, Table, Select, Divider, Form, Row, Col, Popconfirm, Icon, message } from 'antd';
import PaginationEx from '@/common/PaginationEx';
import { connect } from 'dva';
import { Link } from 'react-router-dom';

const Option = Select.Option;

// const mapStateToProps = (state) => {
//     return {
//         BodyworkSystemState: state.BodyworkSystem,
//     };
// }
const FormItem = Form.Item;

@Form.create()
@connect( ({BodyworkSystem,loading}) => ({
    BodyworkSystemState: BodyworkSystem,
}),(dispatch) => ({
    dispatch,
    corePartsInfo(){
        dispatch({
            type: 'BodyworkSystem/corePartsInfo',
            payload: {},
        })
    },
    assemblyPartsInfo(){
        dispatch({
            type: 'BodyworkSystem/assemblyPartsInfo',
            payload: {},
        })
    },
}))
export default class BodyworkSystemList extends Component {
    state = {
        page:1,
        size:10,
        dataSource:[],
        dataTotal:0
    }
    columns=[
    {
        title: '编号',
        dataIndex: 'id',
        name: 'id',
    },{
        title: '总成部件',
        dataIndex: 'apName',
        name: 'apName',
    },{
        title: '核心零部件',
        dataIndex: 'cpName',
        name: 'cpName',
    },{
        title: '部件',
        dataIndex: 'unit',
        name: 'unit',
    },{
        title: '故障模式',
        dataIndex: 'faultPattern',
        name: 'faultPattern',
    },{
        title: '版本号',
        dataIndex: 'updateNo',
        name: 'updateNo',
    },{
        title: '附件',
        dataIndex: 'isHaveAcc',
        name: 'isHaveAcc',
        render: (text, record) => {
            if(text == "1"){
                <Link to="/chassis/bodyworkSystem">下载查看</Link>
            }
        },
    },{
        title: '状态',
        dataIndex: 'status',
        name: 'status',
        render: (text, record) => {
            let status = "未审核"
            if(text == "1"){ status = "已审核" }
            else if(text == "2"){ status = "未审核" }
            else if(text == "3"){ status = "驳回修改" }
            return <span>{ status }</span>
        },
    },{
        title: '操作',
        name: 'operation',
        render: (text, record) => {
            let operation = "更新"
            let link = "/chassis/bodyworkSystem"
            if(text.status == "1"){ operation="更新", link="/chassis/bodyworkSystem/update" }
            else if(text.status == "2"){ operation="审核", link="/chassis/bodyworkSystem/audit" }
            else if(text.status == "3"){ operation="修改", link="/chassis/bodyworkSystem/update"  }
            return(
            <span>
                <Link to={{pathname:"/chassis/bodyworkSystem/detail", search:JSON.stringify(text.id)}} >查看</Link>
                <Divider type="vertical" />
                <Link to={{pathname: link, search:JSON.stringify(text.id)}}>{ operation }</Link>
                <Divider type="vertical" />
                <Popconfirm title="是否删除" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={this.onDelete.bind(this,text.id)}>
                    <Link to="/chassis/bodyworkSystem">删除</Link>
                </Popconfirm>
            </span>
            )
        },
    }]

    componentDidMount = () =>{
        this.props.corePartsInfo();
        this.props.assemblyPartsInfo();

        this.onQuery();
    }

    onChangeEx = (page, pageSize) => {
        this.setState({
            page:page,
            size:pageSize,
        },()=>{
            this.onQuery()
        })
    }

    onQuery = () => {
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let params = values;
                params.userId = 1;
                params.page = this.state.page;
                params.size = this.state.size;
                params.chassisId = 6;
                // console.log(params);
                this.props.dispatch({
                    type: 'BodyworkSystem/dataInfo',
                    payload: {...params},
                    callback:(res) => {
                        this.setState({
                            dataSource: res.data.list,
                            dataTotal: res.data.total
                        })
                    }
                });
            }
        })
    }

    onDelete = (id) =>{
        let params = [];
        params.userId = 1;
        params.id = id;
        params.status = 4;   //4 删除
        params.stateTime = new Date();

        this.props.dispatch({
            type: 'BodyworkSystem/update',
            payload: {...params},
            callback:(res) => {
                if(res.code == 200){
                    message.success('删除成功');
                    this.onQuery();
                }else{
                    message.error('删除失败');
                    this.onQuery();
                }
            }
        });
    }

    render() {
        const {form:{getFieldDecorator},BodyworkSystemState:{assemblyPartsData,corePartsData}} = this.props;
        return (
            <ListLayout titletext="底盘系统>车身系统">
                <div>
                    <Form layout='inline'>
                        <Row>
                            <Col>
                            <FormItem label="总成部件">
                                {getFieldDecorator('assemblyPartsId',{
                                    initialValue:'-1'
                                })(
                                    <Select style={{width:200, marginRight:20}}>
                                        <Option value="-1">全部</Option>
                                        {assemblyPartsData && assemblyPartsData.map((item,index) => {
                                            return <Option key={item.id}>{item.name}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="核心零部件">
                                {getFieldDecorator('corePartsId',{
                                    initialValue:'-1'
                                })(
                                    <Select style={{width:200, marginRight:20}} >
                                        <Option value="-1">全部</Option>
                                        {corePartsData && corePartsData.map((item,index) => {
                                            return  <Option key={item.id}>{item.name}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="有无附件">
                                {getFieldDecorator('isHaveAcc',{
                                    initialValue:'-1'
                                })(
                                    <Select style={{width:200, marginRight:20}}>
                                        <Option value="-1">全部</Option>
                                        <Option value="1">有</Option>
                                        <Option value="0">无</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <br />
                            <FormItem label="故障模式">
                                {getFieldDecorator('faultPattern',{
                                    initialValue:''
                                })(
                                    <Input style={{width:200, marginRight:62}} />
                                )}
                            </FormItem>
                            <FormItem label="状态">
                                {getFieldDecorator('status',{
                                    initialValue:'-1'
                                })(
                                    <Select style={{width:200, marginRight:20}}>
                                    <Option value="-1">全部</Option>
                                    <Option value="1">已审核</Option>
                                    <Option value="2">未审核</Option>
                                    <Option value="3">驳回修改</Option>
                                </Select>
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={this.onQuery.bind(this)}>查询</Button>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    
                </div>
                <div>
                    <div style={{marginBottom:20}}>
                    <Link to="/chassis/bodyworkSystem/create"><Button type="primary" style={{marginRight:20}}>新建</Button></Link>
                    <Button type="primary">导出</Button>
                    </div>
                    
                    <Table rowKey={record => record.id} bordered columns={this.columns} dataSource={this.state.dataSource} pagination={false} />
                    <PaginationEx total={this.state.dataTotal && this.state.dataTotal} onChangeEx={this.onChangeEx} />
                </div>
            </ListLayout>
        )
    }
}