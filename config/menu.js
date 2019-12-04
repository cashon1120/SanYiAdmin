export default [
    // {
    //     key: 'home',
    //     name: '首页',
    //     icon: 'home',
    //     url: '/index',
    //     realUrl: './Index/Index'
    // },
    // 底盘系统
    {
        key: 'chassisSystem',
        name: '底盘系统',
        icon: 'car',
        childs: [
            {
                key: 'electricSystem',
                name: '电气系统',
                url: '/chassisSystem/8',
                realUrl: './ChassisSystem/List'
            },
            {
                key: 'addModel',
                name: '添加模式',
                hideInMenu: true,
                url: '/chassisSystem/add/:typeId',
                realUrl: './ChassisSystem/Add'
            },
            {
                key: 'addModel',
                name: '添加模式',
                hideInMenu: true,
                url: '/chassisSystem/update/:id',
                realUrl: './ChassisSystem/Add'
            },
            {
                key: 'modelDetail',
                name: '故障模式详情',
                hideInMenu: true,
                url: '/chassisSystem/detail/:id',
                realUrl: './ChassisSystem/Detail'
            }
        ]
    },
    // 点检表
    {
        key: 'pointCheckTable',
        name: '点检表',
        icon: 'tablet',
        url: '/pointCheckTable/list',
        realUrl: './pointCheckTable/List'
    },
    {
        key: 'pointCheckTableAdd',
        name: '添加点检表',
        url: '/pointCheckTable/add/:id?/',
        realUrl: './pointCheckTable/Add',
        hideInMenu: true
    },
    {
        key: 'pointCheckTableDetail',
        name: '点检表详情',
        url: '/pointCheckTable/detail/:id?/:type?',
        realUrl: './pointCheckTable/Detail',
        hideInMenu: true
    },
    // 码表管理
    {
        key: 'nameStore',
        name: '码表管理',
        icon: 'database',
        childs: [
            {
                key: 'pointCheckCar',
                name: '车型名称库',
                url: '/nameStore/PointCheckCar',
                realUrl: './nameStore/PointCheckCar'
            },
            {
                key: 'pointCheckSystem',
                name: '点检系统名称库',
                url: '/nameStore/pointCheckSystem',
                realUrl: './nameStore/PointCheckSystem'
            },
            {
                key: 'pointCheckType',
                name: '点检类别名称库',
                url: '/nameStore/pointCheckType',
                realUrl: './nameStore/PointCheckType'
            },
            {
                key: 'pointCheckProject',
                name: '点检项目名称库',
                url: '/nameStore/pointCheckProject',
                realUrl: './nameStore/PointCheckProject'
            },
            {
                key: 'assemblyParts',
                name: '总成部件名称库',
                url: '/nameStore/assemblyParts',
                realUrl: './nameStore/AssemblyParts'
            },
            {
                key: 'importantParts',
                name: '核心零部件名称库',
                url: '/nameStore/importantParts',
                realUrl: './nameStore/ImportantParts'
            }
        ]
    },
    // 用户管理
    {
        key: 'userManager',
        name: '用户管理',
        icon: 'user',
        childs: [{
                key: 'departmentManager',
                name: '部门管理',
                url: '/userManager/departmentManager',
                realUrl: './userManager/DepartmentManager'
            },
            {
                key: 'userManager',
                name: '用户管理',
                url: '/userManager/userManager',
                realUrl: './userManager/UserManager'
            }
        ]
    },
    // 系统管理
    {
        key: 'systemManager',
        name: '系统管理',
        icon: 'setting',
        childs: [{
                key: 'characterManager',
                name: '角色管理',
                url: '/systemManager/characterManager',
                realUrl: './systemManager/CharacterManager'
            },
            {
                key: 'powerManager',
                name: '权限管理',
                url: '/systemManager/powerManager',
                realUrl: './systemManager/PowerManager'
            }
        ]
    }
]