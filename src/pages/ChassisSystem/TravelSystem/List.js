import React, { Component } from 'react';
import ListLayout from '@/common/ListLayout';
import { Input, Button, Table, Select, Divider } from 'antd';
import PaginationEx from '@/common/PaginationEx';
import { connect } from 'dva';
import { Link } from 'react-router-dom';

const Option = Select.Option;

const mapStateToProps = (state) => {
    return {
        TravelSystemState: state.TravelSystem,
    };
}

@connect(mapStateToProps)
export default class TravelSystemList extends Component {
    columns=[{
        title: '编号',
        dataIndex: 'number',
        name: 'number',
    },{
        title: '总成部件',
        dataIndex: 'assemblyParts',
        name: 'assemblyParts',
    },{
        title: '核心零部件',
        dataIndex: 'coreParts',
        name: 'coreParts',
    },{
        title: '部件',
        dataIndex: 'unit',
        name: 'unit',
    },{
        title: '故障模式',
        dataIndex: 'faultMode',
        name: 'faultMode',
    },{
        title: '版本号',
        dataIndex: 'versionNumber',
        name: 'versionNumber',
    },{
        title: '附件',
        dataIndex: 'accessory',
        name: 'accessory',
        render: (text, record) => (
            <Link to="/chassis/travelSystem">下载查看</Link>
        ),
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
            let link = "/chassis/travelSystem"
            if(text.status == "1"){ operation="更新", link="/chassis/travelSystem" }
            else if(text.status == "2"){ operation="审核", link="/chassis/travelSystem/audit" }
            else if(text.status == "3"){ operation="修改", link="/chassis/travelSystem/update"  }
            return(
            <span>
                <Link to="/chassis/travelSystem/detail">查看</Link>
                <Divider type="vertical" />
                <Link to={link}>{ operation }</Link>
                <Divider type="vertical" />
                <Link to="/chassis/travelSystem">删除</Link>
            </span>
            )
        },
    }]

    onChangeEx = (page, pageSize) => {
    }

    render() {
        return (
            <ListLayout titletext="底盘系统>行驶系统">
                <div>
                    <span>总成部件：</span>
                    <Select style={{width:200, marginRight:20}} defaultValue="0">
                        <Option value="0">全部</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                    </Select>
                    <span>核心零部件：</span>
                    <Select style={{width:200, marginRight:20}} defaultValue="0">
                        <Option value="0">全部</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                    </Select>
                    <span>有无附件：</span>
                    <Select style={{width:200, marginRight:20}} defaultValue="0">
                        <Option value="0">全部</Option>
                        <Option value="1">有</Option>
                        <Option value="2">无</Option>
                    </Select>
                    <p />
                    <span>故障模式：</span>
                    <Input style={{width:200, marginRight:62}} />
                    <span>状态：</span>
                    <Select style={{width:200, marginRight:20}} defaultValue="0">
                        <Option value="0">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="2">禁用</Option>
                    </Select>
                    <Button type="primary">查询</Button>
                    
                </div>
                <div>
                    <div style={{marginBottom:20}}>
                    <Link to="/chassis/travelSystem/create"><Button type="primary" style={{marginRight:20}}>新建</Button></Link>
                    <Button type="primary">导出</Button>
                    </div>
                    
                    <Table bordered columns={this.columns} dataSource={this.props.TravelSystemState.faultData} pagination={false} />
                    <PaginationEx total={this.props.TravelSystemState.faultData.length} onChangeEx={this.onChangeEx} />
                </div>
            </ListLayout>
        )
    }
}