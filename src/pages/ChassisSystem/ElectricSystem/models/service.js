export default {
    namespace: 'ElectricSystem',
    state: {
        faultData: [{
            key: '1', //唯一标识
            number: '1', //故障编码
            assemblyParts: '直拉杆总成', //总成部件
            coreParts: '杆身', //核心零部件
            unit: '杆身上方', //部件
            faultMode: '直拉杆与轮胎干涉导致直拉杆磨损', //故障模式
            versionNumber: '1.0', //版本号
            accessory: '1', //附件
            status: '3', //状态
        },{
            key: '2', //唯一标识
            number: '2', //故障编码
            assemblyParts: '直拉杆总成', //总成部件
            coreParts: '杆身', //核心零部件
            unit: '杆身上方', //部件
            faultMode: '直拉杆与轮胎干涉导致直拉杆磨损', //故障模式
            versionNumber: '2.0', //版本号
            accessory: '1', //附件
            status: '2', //状态
        },],
        logData: [{
            key: '1',
            time: '2019-10-01 12:00',
            pwoer: '修改',
            result: '1',
            userName: '张三',
            explain: '信息不对',
        }]
    },
};