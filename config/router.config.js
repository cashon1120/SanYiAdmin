export default [{
		path: '/',
		component: './Login/Login'
	},
	{
		path: '/login',
		component: './Login/Login'
	},
	{
		path: '/',
		component: '../layouts/index',
		routes: [{
				name: '首页',
				icon: 'home',
				path: '/index',
				component: './Index/Index'
			},
			// 底盘系统
			{
				path: 'chassisSystem',
				name: '底盘系统123',
				icon: 'car',
				routes: [{
						name: '动力系统',
						path: '/chassisSystem/:typeId',
						component: './ChassisSystem/List'
					},
					{
						name: '添加模式',
						hideInMenu: true,
						path: '/chassisSystem/add/:typeId',
						component: './ChassisSystem/Add'
					},
					{
						name: '修改模式',
						hideInMenu: true,
						path: '/chassisSystem/update/:typeId/:id',
						component: './ChassisSystem/Add'
					},
					{
						name: '详情',
						hideInMenu: true,
						path: '/chassisSystem/detail/:id/:type?',
						component: './chassisSystem/Detail'
					}
				]
			},
			// 点检表
			{
				path: 'pointCheckTable',
				name: '点检表',
				icon: 'appstore',
				routes: [{
						name: '点检表列表',
						icon: 'tablet',
						path: '/pointCheckTable/List',
						component: './PointCheckTable/List'
					},
					{
						name: '添加点检表',
						path: '/pointCheckTable/Add',
						component: './PointCheckTable/Add'
					},
					{
						name: '修改点检表',
						path: '/pointCheckTable/Update/:id',
						component: './PointCheckTable/Add',
						hideInMenu: true
					},
					{
						name: '点检表详情',
						path: '/pointCheckTable/detail/:id?/:type?',
						component: './PointCheckTable/Detail',
						hideInMenu: true
					}
				]
			},
			// 码表管理
			{
				path: 'nameStore',
				name: '码表管理',
				icon: 'database',
				routes: [{
						name: '车型名称库',
						path: '/nameStore/pointCheckCar',
						component: './NameStore/PointCheckCar'
					},
					{
						name: '点检系统名称库',
						path: '/nameStore/pointCheckSystem',
						component: './NameStore/PointCheckSystem'
					},
					{
						name: '点检类别名称库',
						path: '/nameStore/pointCheckType',
						component: './NameStore/PointCheckType'
					},
					{
						name: '点检项目名称库',
						path: '/nameStore/pointCheckProject',
						component: './NameStore/PointCheckProject'
					}
				]
			},
			// 底盘部件管理
			{
				path: 'ChassisComponent',
				name: '底盘部件管理',
				icon: 'apartment',
				routes: [{
						name: '系统管理',
						path: '/chassisComponent/system',
						component: './ChassisComponent/SystemList'
					},
					{
						name: '添加',
						hideInMenu: true,
						path: '/chassisComponent/add/:typeId/:id?',
						component: './ChassisComponent/Add'
					},
					{
						name: '详情',
						hideInMenu: true,
						path: '/chassisComponent/detail/:typeId/:id',
						component: './ChassisComponent/Detail'
					},
					{
						name: '修改',
						hideInMenu: true,
						path: '/chassisComponent/update/:typeId/:id',
						component: './ChassisComponent/Add'
					},
					{
						key: 'ChassisComponent',
						name: '总成管理',
						path: '/chassisComponent/assembly',
						component: './ChassisComponent/AssemblyList'
					},
					{
						key: 'importantParts',
						name: '核心零部件管理',
						path: '/chassisComponent/important',
						component: './ChassisComponent/ComponentList'
					}
				]
			},
			// 用户管理
			{
				path: 'userManager',
				name: '用户管理',
				icon: 'user',
				routes: [{
						name: '部门管理',
						path: '/userManager/departmentManager',
						component: './UserManager/DepartmentManager'
					},
					{
						name: '用户管理',
						path: '/userManager/userManager',
						component: './UserManager/UserManager'
					}
				]
			},
			// 系统管理
			{
				path: 'systemManager',
				name: '系统管理',
				icon: 'setting',
				routes: [{
						name: '角色管理',
						path: '/systemManager/characterManager',
						component: './SystemManager/CharacterManager'
					},
					{
						name: '权限管理',
						path: '/systemManager/powerManager',
						component: './SystemManager/PowerManager'
					},
					// {
					// 	name: '资源管理',
					// 	path: '/systemManager/ResourcesManager',
					// 	component: './SystemManager/ResourcesManager'
					// },
					{
						name: '帮助中心',
						path: '/systemManager/HelpCenter',
						component: './SystemManager/HelpCenter'
					}
				]
			},
			{
				component: '404'
			}
		]
	}
]