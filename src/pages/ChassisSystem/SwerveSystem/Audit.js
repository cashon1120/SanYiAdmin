import { Component } from 'react';
import DetailLayout from '@/common/DetailLayout';
import { List, Input, Button } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

const mapStateToProps = (state) =>{
    return{
        SwerveSystemState: state.SwerveSystem,
    };
}

const dataInfo = [
    { name: '总成部件', value: '散热器' },
    { name: '核心零部件', value: '散热器' },
    { name: '部件', value: '部件' },
    { name: '零部件描述', value: '1、实现冷却介质与外部空气的热量交换，使冷却介质的温度维持在合适的范围，从而保证发动机各部件（如气缸、气缸盖内壁等）' },
    { name: '核心零部件图片', value: '' },
    { name: '故障模式', value: '芯体根部开裂' },
    { name: '故障现象', value: '' },
    { name: '原因分析', value: '原因分析' },
    { name: '故障对策', value: '采用塑料水室散热器，主片与水室中间夹橡胶密封圈' },
    { name: '原因及对策照片', value: '' },
    { name: '标准、原理、基于标准的具体化数据参数', value: '1.拉杆杆身材料为冷拔无缝钢管；2.球头销材料为40Cr；3.球头与杆身为铆死结构；' },
    { name: '标准原理及照片', value: '' },
    { name: '设计雷区，要点', value: '1、必须满足发动机散热量要求，以适应不同工况（选型步骤如下）；a.计算发动机冷却水散热量（或试验测量）b.计算发动机冷却水流量（水泵选型）c.计算冷却空气流量（风扇选型）d.根据散热量计算水箱散热面积' },
    { name: '影响因素说明', value: '' },
    { name: '设计雷区，要点及影响因素图片', value: '' },
    { name: '故障参考信息（类型、平均里程、地域等）', value: '' },
    { name: <span style={{fontWeight:'bold', fontSize:16, color:'black'}}>审核发布结果</span>,
      value: <div>
                <Button type='primary' style={{ marginRight: 20, width: 100, height:50 }}>通过</Button>
                <Button type='primary' style={{ width: 100, height:50 }}>不通过</Button>
             </div>
    },
    { name: <span style={{fontWeight:'bold', fontSize:16}}>备注</span>, value: <TextArea rows={4} /> },
];

@connect(mapStateToProps)
export default class SwerveSystemDetail extends Component {

    render() {
        return (
            <DetailLayout titletext='故障模式审核'>
                <div name='转向系统'>
                    <List
                        grid={{ gutter: 0, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        dataSource={dataInfo}
                        renderItem={item => (
                            <List.Item style={{height:30, marginTop:10}}>
                                <div style={{width:130, fontWeight:'bold', textAlign:'right', float:'left', marginRight:20 }} >{item.name}：</div>
                                <div style={{width:700, textAlign:'left', float:'left' }} >{item.value}</div>
                            </List.Item>
                        )}
                    />
                </div>
            </DetailLayout>
        )
    }
}
