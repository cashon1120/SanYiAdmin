import { Component } from 'react';
import DetailLayout from '@/common/DetailLayout';
import { List, Divider, Table, Badge, Button, Input, message } from 'antd';
import PaginationEx from '@/common/PaginationEx';
import { connect } from 'dva';
import router from 'umi/router';

const { TextArea } = Input;

@connect( ({BodyworkSystem, loading}) => ({
    BodyworkSystemState: BodyworkSystem,
}), (dispatch) => ({
    dispatch
}))
export default class BodyworkSystemDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            dataSource: [],
            id: -1,
        }
    }

    columns=[{
        title: '时间',
        dataIndex: 'time',
        name: 'time',
    },{
        title: '操作功能',
        dataIndex: 'pwoer',
        name: 'pwoer',
    },{
        title: '操作结果',
        dataIndex: 'result',
        name: 'result',
        render:(text,react) => {
            let result = "成功"
            let resultA = "success"
            let colorA = "green"
            if(text == "1"){ result="成功",resultA="success",colorA="green" }
            else{ result="未通过",resultA="error",colorA="red" }
            return <span><Badge status={resultA} text={<span style={{color:colorA}}>{result}</span>} /></span>
        },
    },{
        title: '操作人',
        dataIndex: 'userName',
        name: 'userName',
    },{
        title: '备注',
        dataIndex: 'explain',
        name: 'explain',
    },]

    componentDidMount = () =>{
        //获取上级页面传递的参数
        let search = this.props.history.location.search;
        search = search.substr(1, search.length);
        this.setState({
            id: search
        })
        let params = [];
        params.id = search;
        params.userId = 1;
        params.page = 1;
        params.size = 100000;
        params.chassisId = 6;
        // console.log('----params--->',params)
        this.props.dispatch({
            type: 'BodyworkSystem/dataInfo',
            payload: {...params},
            callback:(res) => {
                let dataList = res.data.list;
                let dataSource = [];
                dataList.map((item, index) => {
                    dataSource = [
                        { name: '总成部件', value: item.apName },
                        { name: '核心零部件', value: item.cpName },
                        { name: '部件', value: item.unit },
                        { name: '零部件描述', value: item.corePartsDescription },
                        { name: '核心零部件图片', value: '' },
                        { name: '故障模式', value: item.faultPattern },
                        { name: '故障现象', value: '' },
                        { name: '原因分析', value: item.reasonAnalysis },
                        { name: '故障对策', value: item.countermeasure },
                        { name: '原因及对策照片', value: '' },
                        { name: '标准、原理、基于标准的具体化数据参数', value: item.measured },
                        { name: '标准原理及照片', value: '' },
                        { name: '设计雷区，要点', value: item.mineField },
                        { name: '影响因素说明', value: item.effectsThat },
                        { name: '设计雷区，要点及影响因素图片', value: '' },
                        { name: '故障参考信息（类型、平均里程、地域等）', value: item.faultReference },
                    ];
                })

                this.setState({
                    dataSource
                });
            }
        });
    }

    onClick = (isOk) =>{
        let params = [];
        params.userId = 1;
        params.id = this.state.id;
        params.status = isOk == 1 ? 1 : 3;   //1通过，3驳回修改
        params.stateTime = new Date();

        console.log('---click--->',params)
        this.props.dispatch({
            type: 'BodyworkSystem/update',
            payload: {...params},
            callback:(res) => {
                if(res.code == 200){
                    message.success(['已'] + [isOk == 1 ? '审核通过' : '驳回修改']);
                    router.push('/chassis/bodyworkSystem');
                }else{
                    message.error('未审核成功，请稍后重试');
                    router.push('/chassis/bodyworkSystem');
                }
            }
        });
    }

    render() {
        return (
            <DetailLayout titletext='故障模式审核'>
                <div name='车身系统'>
                    <List
                        grid={{ gutter: 0, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        dataSource={this.state.dataSource}
                        renderItem={item => (
                            <List.Item style={{height:30, marginTop:10}}>
                                <div style={{width:130, fontWeight:'bold', textAlign:'right', float:'left', marginRight:20 }} >{item.name}：</div>
                                <div style={{width:700, textAlign:'left', float:'left' }} >{item.value}</div>
                            </List.Item>
                        )}
                    >
                    
                    <List.Item style={{height:30, marginTop:10}}>
                            
                    <div style={{width:130, fontWeight:'bold', textAlign:'right', float:'left', marginRight:20 }} >
                        <span style={{fontWeight:'bold', fontSize:16, color:'black'}}>审核发布结果：</span>
                    </div>
                    <div style={{width:700, textAlign:'left', float:'left' }} >
                        <div>
                        <Button type='primary' onClick={this.onClick.bind(this,1)} style={{ marginRight: 20, width: 100, height:50 }}>通过</Button>
                        <Button type='primary' onClick={this.onClick.bind(this,2)} style={{ width: 100, height:50 }}>不通过</Button>
                        </div>
                    </div>
                    </List.Item>
                    <List.Item style={{height:30, marginTop:10}}>
                            
                    <div style={{width:130, fontWeight:'bold', textAlign:'right', float:'left', marginRight:20 }} >
                        <span style={{fontWeight:'bold', fontSize:16}}>备注：</span>
                    </div>
                    <div style={{width:700, textAlign:'left', float:'left' }} >
                        <TextArea rows={4} />
                    </div>
                    </List.Item>

                    </List>
                    
                </div>
            </DetailLayout>
        )
    }
}
