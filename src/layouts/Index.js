import React, {Component} from 'react'
import { Layout, Menu, Icon, LocaleProvider, message, Dropdown } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import {router, Link} from '../common/Plugins'
import {connect} from 'dva'
import styles from './Index.less'
import ModalFrom from '../common/ModalForm'
import logo from '../assets/imgs/logo.png'
import { formatTreeNode } from '../utils/utils'

const { Header, Sider, Content } = Layout

@connect(({login, publicModel, chassisComponent, loading}) => ({login, publicModel, chassisComponent, loading: loading.models.artile}))

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openKeys: [''],
      selectKeys: [''],
      collapsed: false,
      menuList: [],
      userName: '',
      routes: [], // 路由数据
      confirmLoading: false, // 提交按钮loading状态
      modalData: {
        modalTitle: '', // 模态框标题
        modalVisible: false // 显示模态框
      }
    }
    message.config({duration: 1})
  }

  componentDidMount() {
    const {dispatch} = this.props
    const callback = () => {
      this.fetchUser()
    }
    dispatch({
      type: 'publicModel/fetchSystem',
      payload: {
        pageSize: 100,
        pageNum: 1
      },
      callback
    })
    // 监听浏览器前进后退事件
    window.addEventListener('popstate', this.handlePop.bind(this))
    // 显示激活路由
    this.setActiveMenu()
    const dom = document.getElementsByClassName('ant-layout-sider-trigger')
    dom[0].style.display = 'none'
  }

  rootSubmenuKeys = []
  prevOpenKeys = []

  fetchUser(){
    const {dispatch} = this.props
    const callback = response => {
      if(response.auth){
        localStorage.setItem('userAuth', JSON.stringify(response.auth))
        this.setState({userName: response.user.userName})
        this.setMenu()
      }else{
        this.logout()
      }
    }

    dispatch({type: 'login/fetchCurrent', payload: {}, callback})
  }

  // 模态框配置
  modalFromColumns = () => {
    return [
      {
        title: '新密码',
        dataIndex: 'password',
        componentType: 'PassWorld',
        requiredMessage: '请输入新密码',
        required: true,
        placeholder: '请输入新密码'
      },
      {
        title: '确认密码',
        dataIndex: 'confirmPassword',
        componentType: 'PassWorld',
        requiredMessage: '请再次输入密码',
        required: true,
        placeholder: '请输再次输入密码'
      }
    ]
  }

   // 显示模态框
   handleModalVisible = title => {
    this.setState({
      modalData: {
        modalTitle: title,
        modalVisible: true
      }
    })
  }


  // 隐藏模态框
  handleModalCancel = () => {
    this.setState({
      modalData: {
        modalTitle: '',
        modalVisible: false
      }
    })
  }

  // 提交模态框数据
  submitModal = (fields, form) => {
    const { dispatch } = this.props
    if(fields.confirmPassword !== fields.password){
      form.setFields({
        confirmPassword: {
          value: fields.confirmPassword,
          errors: [new Error('两次密码输入不一致')]
        }
      })
      return
    }
    this.setState({
      confirmLoading: true
    })
    const actionType = 'login/editPassword'
    const callback = response => {
      if (response.code === 1) {
        message.success(response.msg)
        this.handleModalCancel()
      } else {
        message.error(response.msg)
      }
      this.setState({
        confirmLoading: false
      })
    }
    dispatch({
      type: actionType,
      payload: {
        ...fields
      },
      callback
    })
  }

  // 设置选中状态
  setActiveMenu(){
    const path = this.props.location.pathname
    this.setState({
      openKeys: [`/${path.split('/')[1]}`],
      selectKeys: [path]
    })
  }

  // 根据权限设置路由
  setMenu(){
    const { login: {userInfo}, publicModel: {systemList}} = this.props
    let routes = formatTreeNode(userInfo.auth, 1)
    this.setState({
      routes
    })
    const systemRoute = systemList.map(item => ({name: item.componentName,
    code: `/chassisSystem/${item.id}`,
    id: item.id, parentId: item.parentId}))
    // 判断是是否有操作故障模式的权限, 有的话加入系统列表(写死的)
    for(let i = 0; i < routes.length; i += 1){
      if(routes[i].name === '底盘系统' && routes[i].id === 47){
        routes[i].name = '故障模式'
        routes[i].children = systemRoute.filter(item => item.parentId === 1)
        break;
      }
    }

    let menuList = []

    routes.map((item) => {
      if (!item.children) {
        menuList.push(
          <Menu.Item key={item.code}
              style={{marginTop: 0}}
          >
            <Link to={item.code}><Icon type={item.icon}/>
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        let childs = []
        item.children.map((child) => {
          childs.push(
            <Menu.Item key={child.code}>
              <Link to={child.code}>{child.name}</Link>
            </Menu.Item>
          )
        })
        menuList.push(
            <Menu.SubMenu
                key={item.code}
                title={< span > <Icon type={item.icon}/> < span > {
              item.name
            } </span></span >}
            >{childs}</Menu.SubMenu>
          )
      }
      this.rootSubmenuKeys.push(item.code)
    })


    this.setState({
      menuList
    })
  }

  // 获取激活的菜单
  getSelectedKeys = () => {
    const path = this.props.location.pathname
    const { routes } = this.state
    for (let i = 0; i < routes.length; i += 1) {
      const superMenu = routes[i]
      if (superMenu.children) {
        for (let j = 0; j < superMenu.children.length; j += 1) {
          if (superMenu.children[j].code === `${path}`) {
            return [superMenu.children[j].code]
          }
        }
      }
    }
  }

  // 获取展开的子菜单数组
  getOpenKeys = () => {
    const { routes } = this.state
    const {location: { pathname }} = this.props
    if (pathname === '/')
      return
    for (let i = 0; i < routes.length; i += 1) {
      if (routes[i].code === `/${pathname.split('/')[1]}`) {
        return [routes[i].code]
      }
    }
  }

  // 前进后退事件
  handlePop() {
    this.setState({
      selectKeys: this.getSelectedKeys(),
      openKeys: this.getOpenKeys()
    })
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) { // 收起
      this.setState({openKeys})
    } else { // 展开
      this.setState({
        openKeys: latestOpenKey
          ? [latestOpenKey]
          : []
      })
    }
  }

  onCollapse = collapsed => {
    if (this.state.openKeys.length > 0)
      this.prevOpenKeys = this.state.openKeys
    this.setState({
      collapsed,
      openKeys: collapsed
        ? []
        : this.prevOpenKeys
    })
  }

  setSelectKey(e){
    this.setState({
      selectKeys: [e.key]
    })
  }

  //region 登出
  logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  render() {
    const {userName, menuList, confirmLoading, modalData: { modalVisible, modalTitle }} = this.state
    const menu = <Menu>
      <Menu.Item onClick={() => this.handleModalVisible('修改密码')}>
        修改密码
      </Menu.Item>
      <Menu.Item onClick={this
        .logout
        .bind(this)}
      >
        退出登录
      </Menu.Item>

    </Menu>
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout style={{
          height: '100vh'
        }}
        >
          <Header className={styles.mainHea}
              style={{position: 'relative', zIndex: 1}}
          >
              <div
                  className={styles.logo}
              ><img src={logo} />三一车辆设计经验数据平台</div>
            <div className={styles.mainHeaRight}>
              <Link style={{color:'#fff', marginRight:30}}
                  to="/systemManager/HelpCenter"
              ><span>帮助手册</span></Link>
              <Dropdown overlay={menu}>
                <span style={{
                  cursor: 'pointer'
                }}
                >
                  <span>{userName}</span>
                  <Icon type="caret-down"/>
                </span>
              </Dropdown>
            </div>
          </Header>
          <Layout>
            <div className={styles.leftBg}></div>
            <Sider
                breakpoint="xl"
                collapsed={this.state.collapsed}
                collapsible
                onCollapse={this.onCollapse}
                ref="sider"
                style={{background: '#001529'}}
            >
              <Menu
                  mode="inline"
                  onOpenChange={this.onOpenChange}
                  onSelect={(e) => this.setSelectKey(e)}
                  openKeys={this.state.openKeys}
                  selectedKeys={this.state.selectKeys}
                  theme="dark"
              >
                {menuList}
              </Menu>
            </Sider>
            <Content breakpoint="xl"
                collapsible="600"
                style={{paddingBottom: 50, overflowX: 'auto', height: 'max-content', flex: 1}}
            >
              {this.props.children}
            </Content>
            <ModalFrom
                cancelText="取消"
                columns={this.modalFromColumns()}
                confirmLoading={confirmLoading}
                onCancel={this.handleModalCancel}
                onOk={this.submitModal}
                title={modalTitle}
                visible={modalVisible}
            />
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}
export default BasicLayout
