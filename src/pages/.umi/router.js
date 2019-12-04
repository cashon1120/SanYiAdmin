import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import _dvaDynamic from 'dva/dynamic'

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Login__Login" */'../Login/Login'),
      
    })
    : require('../Login/Login').default,
    "exact": true
  },
  {
    "path": "/login",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Login__Login" */'../Login/Login'),
      
    })
    : require('../Login/Login').default,
    "exact": true
  },
  {
    "path": "/",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "layouts__index" */'../../layouts/index'),
      
    })
    : require('../../layouts/index').default,
    "routes": [
      {
        "name": "首页",
        "icon": "home",
        "path": "/index",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__Index__Index" */'../Index/Index'),
      
    })
    : require('../Index/Index').default,
        "exact": true
      },
      {
        "path": "/chassisSystem",
        "name": "底盘系统123",
        "icon": "car",
        "routes": [
          {
            "name": "动力系统",
            "path": "/chassisSystem/:typeId",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisSystem__List" */'../ChassisSystem/List'),
      
    })
    : require('../ChassisSystem/List').default,
            "exact": true
          },
          {
            "name": "添加模式",
            "hideInMenu": true,
            "path": "/chassisSystem/add/:typeId",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisSystem__Add" */'../ChassisSystem/Add'),
      
    })
    : require('../ChassisSystem/Add').default,
            "exact": true
          },
          {
            "name": "修改模式",
            "hideInMenu": true,
            "path": "/chassisSystem/update/:typeId/:id",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisSystem__Add" */'../ChassisSystem/Add'),
      
    })
    : require('../ChassisSystem/Add').default,
            "exact": true
          },
          {
            "name": "详情",
            "hideInMenu": true,
            "path": "/chassisSystem/detail/:id/:type?",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__chassisSystem__Detail" */'../chassisSystem/Detail'),
      
    })
    : require('../chassisSystem/Detail').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/pointCheckTable",
        "name": "点检表",
        "icon": "appstore",
        "routes": [
          {
            "name": "点检表列表",
            "icon": "tablet",
            "path": "/pointCheckTable/List",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__PointCheckTable__List" */'../PointCheckTable/List'),
      
    })
    : require('../PointCheckTable/List').default,
            "exact": true
          },
          {
            "name": "添加点检表",
            "path": "/pointCheckTable/Add",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__PointCheckTable__Add" */'../PointCheckTable/Add'),
      
    })
    : require('../PointCheckTable/Add').default,
            "exact": true
          },
          {
            "name": "修改点检表",
            "path": "/pointCheckTable/Update/:id",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__PointCheckTable__Add" */'../PointCheckTable/Add'),
      
    })
    : require('../PointCheckTable/Add').default,
            "hideInMenu": true,
            "exact": true
          },
          {
            "name": "点检表详情",
            "path": "/pointCheckTable/detail/:id?/:type?",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__PointCheckTable__Detail" */'../PointCheckTable/Detail'),
      
    })
    : require('../PointCheckTable/Detail').default,
            "hideInMenu": true,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/nameStore",
        "name": "码表管理",
        "icon": "database",
        "routes": [
          {
            "name": "车型名称库",
            "path": "/nameStore/pointCheckCar",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__NameStore__PointCheckCar" */'../NameStore/PointCheckCar'),
      
    })
    : require('../NameStore/PointCheckCar').default,
            "exact": true
          },
          {
            "name": "点检系统名称库",
            "path": "/nameStore/pointCheckSystem",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__NameStore__PointCheckSystem" */'../NameStore/PointCheckSystem'),
      
    })
    : require('../NameStore/PointCheckSystem').default,
            "exact": true
          },
          {
            "name": "点检类别名称库",
            "path": "/nameStore/pointCheckType",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__NameStore__PointCheckType" */'../NameStore/PointCheckType'),
      
    })
    : require('../NameStore/PointCheckType').default,
            "exact": true
          },
          {
            "name": "点检项目名称库",
            "path": "/nameStore/pointCheckProject",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__NameStore__PointCheckProject" */'../NameStore/PointCheckProject'),
      
    })
    : require('../NameStore/PointCheckProject').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/ChassisComponent",
        "name": "底盘部件管理",
        "icon": "apartment",
        "routes": [
          {
            "name": "系统管理",
            "path": "/chassisComponent/system",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__SystemList" */'../ChassisComponent/SystemList'),
      
    })
    : require('../ChassisComponent/SystemList').default,
            "exact": true
          },
          {
            "name": "添加",
            "hideInMenu": true,
            "path": "/chassisComponent/add/:typeId/:id?",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__Add" */'../ChassisComponent/Add'),
      
    })
    : require('../ChassisComponent/Add').default,
            "exact": true
          },
          {
            "name": "详情",
            "hideInMenu": true,
            "path": "/chassisComponent/detail/:typeId/:id",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__Detail" */'../ChassisComponent/Detail'),
      
    })
    : require('../ChassisComponent/Detail').default,
            "exact": true
          },
          {
            "name": "修改",
            "hideInMenu": true,
            "path": "/chassisComponent/update/:typeId/:id",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__Add" */'../ChassisComponent/Add'),
      
    })
    : require('../ChassisComponent/Add').default,
            "exact": true
          },
          {
            "key": "ChassisComponent",
            "name": "总成管理",
            "path": "/chassisComponent/assembly",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__AssemblyList" */'../ChassisComponent/AssemblyList'),
      
    })
    : require('../ChassisComponent/AssemblyList').default,
            "exact": true
          },
          {
            "key": "importantParts",
            "name": "核心零部件管理",
            "path": "/chassisComponent/important",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__ChassisComponent__ComponentList" */'../ChassisComponent/ComponentList'),
      
    })
    : require('../ChassisComponent/ComponentList').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/userManager",
        "name": "用户管理",
        "icon": "user",
        "routes": [
          {
            "name": "部门管理",
            "path": "/userManager/departmentManager",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__UserManager__DepartmentManager" */'../UserManager/DepartmentManager'),
      
    })
    : require('../UserManager/DepartmentManager').default,
            "exact": true
          },
          {
            "name": "用户管理",
            "path": "/userManager/userManager",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__UserManager__UserManager" */'../UserManager/UserManager'),
      
    })
    : require('../UserManager/UserManager').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/systemManager",
        "name": "系统管理",
        "icon": "setting",
        "routes": [
          {
            "name": "角色管理",
            "path": "/systemManager/characterManager",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__SystemManager__CharacterManager" */'../SystemManager/CharacterManager'),
      
    })
    : require('../SystemManager/CharacterManager').default,
            "exact": true
          },
          {
            "name": "权限管理",
            "path": "/systemManager/powerManager",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__SystemManager__PowerManager" */'../SystemManager/PowerManager'),
      
    })
    : require('../SystemManager/PowerManager').default,
            "exact": true
          },
          {
            "name": "帮助中心",
            "path": "/systemManager/HelpCenter",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__SystemManager__HelpCenter" */'../SystemManager/HelpCenter'),
      
    })
    : require('../SystemManager/HelpCenter').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import(/* webpackChunkName: "p__404" */'../404'),
      
    })
    : require('../404').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/cashon/Documents/work/sany_knowledge_solution/sany_knowledge_solution/front/node_modules/_umi-build-dev@1.10.7@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper(props = {}) {
  return (
<Router history={history}>
      { renderRoutes(routes, props) }
    </Router>
  );
}
