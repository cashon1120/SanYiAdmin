import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Button, Divider, Form, Modal, message } from 'antd';
import StandardTable from '@/common/StandardTable'
import CurrentTitle from '@/common/CurrentTitle/Index'
import styles from '../../layouts/global.less'
import ModalFrom from '@/common/ModalForm';

const { confirm } = Modal;
const MODAL_OPEAR_ADD = 1;
const MODAL_OPEAR_UPDATE = 2;
const pageParams = {
  pageNum: '1',
  pageSize: '1000'
};

const pageName = 'resourceManager'

@connect(({ resourceManager, loading }) => ({resourceManager, loading: loading.models.resourceManager
}))
@Form.create()
class ResourcesManager extends PureComponent {
  state = {
    selectedRows: [],
    modalVisible: false,
    modalTitle: '添加资源',
    initModalData: {},
    modalParentId: 0,
    modalId: 0,
    modalType: 0,
    modalOpera: MODAL_OPEAR_ADD
  };

  componentDidMount() {
    this.fetchData();
  }

  columns = [
    {
      title: '页面ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '页面名称',
      dataIndex: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      render: type => {
        const typeNameArr = {
          0: '目录',
          1: '菜单',
          2: '按钮'
        };
        return typeNameArr[type] || '未知';
      }
    },
    {
      title: '图标',
      dataIndex: 'icon'
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 70
    },
    {
      title: '路由',
      dataIndex: 'code'
    },
    {
      title: '是否删除',
      dataIndex: 'deleted',
      showStatu: 'hide',
      width: 90,
      render: type => {
        const nameArr = {
          0: '否',
          1: '是'
        };
        return nameArr[type] || '未知';
      }
    },
    {
      title: '操作',
      dataIndex: 'opt',
      width: 180,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handEditResource(record)}> 编辑 </a> <Divider type="vertical" />
          <a onClick={() => this.handDeleteResource(record)}> 删除 </a>
          {record.type === 2 ? (
            ''
          ) : (
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handAddResource(record)}> 添加下级 </a>
            </Fragment>
          )}
        </Fragment>
      )
    }
  ];



  getModalColumns = () => {
    const {
      modalType,
      initModalData: { name, icon, orderNum, code, componentName, redirect, hideinmenu }
    } = this.state;

    const modalClomuns = [
      {
        title: '页面名称',
        dataIndex: 'name',
        componentType: 'Input',
        required: true,
        initialValue: name,
        requiredMessage: '请输入页面名称',
        noPattern: true
      },
      {
        title: '排序',
        dataIndex: 'orderNum',
        componentType: 'Input',
        initialValue: orderNum && orderNum.toString()
      },
      {
        title: '路由',
        dataIndex: 'code',
        componentType: 'Input',
        initialValue: code,
        noPattern: true
      },
      {
        title: '组件名称',
        dataIndex: 'componentName',
        componentType: 'Input',
        initialValue: componentName,
        noPattern: true
      },
      {
        title: '隐藏',
        dataIndex: 'hideinmenu',
        componentType: 'Radio',
        initialValue: (hideinmenu && hideinmenu.toString()) || '0',
        dataSource: [
          {
            name: '是',
            value: '1'
          },
          {
            name: '否',
            value: '0'
          }
        ]
      },
      {
        title: '指向',
        dataIndex: 'redirect',
        componentType: 'Input',
        initialValue: redirect,
        noPattern: true
      }
    ];
    if (modalType === 0) {
      modalClomuns.splice(1, 0, {
        title: '图标',
        dataIndex: 'icon',
        componentType: 'Input',
        initialValue: icon
      });
    }
    return modalClomuns;
  };

  fetchData = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: `${pageName}/fetch`,
      payload: {
        ...payload,
        ...pageParams
      }
    });
  };

  handEditResource = item => {
    const { type, id, parentId } = item;
    const typeNameArr = {
      0: '目录',
      1: '菜单',
      2: '按钮'
    };
    this.setState({
      modalOpera: MODAL_OPEAR_UPDATE,
      modalParentId: parentId,
      modalTitle: typeNameArr[item.type],
      modalType: type,
      modalVisible: true,
      modalId: id,
      initModalData: {
        name: item.name,
        icon: item.icon,
        orderNum: item.orderNum,
        code: item.code,
        componentName: item.componentName,
        redirect: item.redirect,
        hideinmenu: item.hideinmenu
      }
    });
  };

  handDeleteResource = item => {
    const { dispatch } = this.props;
    const callback = () => {
      message.success('操作成功');
      this.fetchData();
    };
    confirm({
      title: '确定删除?',
      content: '您是否确认要删除这项内容',
      onOk: () => {
        dispatch({
          type: `${pageName}/del`,
          payload: {
            id: item.id
          },
          callback
        });
      }
    });
  };

  handAddResource = item => {
    const { type, id } = item;
    const addType = parseInt(type, 10) + 1;
    this.setState({
      modalOpera: MODAL_OPEAR_ADD,
      modalParentId: id || null,
      modalTitle: item.type === 2 ? '菜单' : '按钮',
      modalType: addType,
      modalVisible: true,
      modalId: 0
    });
  };

  handleModalAdd = params => {
    const { modalParentId, modalId, modalType, modalOpera } = this.state;
    const payload = {
      ...params,
      id: modalId,
      type: modalType,
      parentId: modalParentId || null
    };
    this.handModalEdit(payload, modalOpera);
  };

  handModalEdit = (payload, type) => {
    const { dispatch } = this.props;

    const callback = response => {
      if (response.code === 1) {
        this.handleModalCancel();
        message.success(response.msg);
        this.fetchData();
      } else {
        message.error(response.msg);
      }
    };
    dispatch({
      type: type === MODAL_OPEAR_ADD ? `${pageName}/add` : `${pageName}/update`,
      payload,
      callback
    });
  };

  handleModalVisible = (flag, title) => {
    this.setState({
      modalVisible: !!flag,
      modalTitle: title,
      modalType: 0,
      modalOpera: MODAL_OPEAR_ADD,
      modalParentId: 0
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      initModalData: []
    });
  };

  render() {
    const {
      resourceManager: { data },
      loading
    } = this.props;

    const { selectedRows, modalVisible, modalTitle } = this.state;

    return (
      <div>
        <CurrentTitle props={this.props}/>
        <Card bordered={false}
            className={styles.main}
        >
          <div className={styles.tableList}>
            <Row>
              <Button
                  icon="plus"
                  onClick={() => this.handleModalVisible(true, '添加目录')}
                  type="primary"
              >
                添加目录
              </Button>
            </Row>
            <StandardTable
                columns={this.columns}
                data={data || []}
                ispagination={false}
                loading={loading}
                onChange={this.onPaging}
                onSelectRow={this.handleSelectRows}
                selectedRows={selectedRows}
            />
          </div>
        </Card>
        <ModalFrom
            columns={this.getModalColumns()}
            onCancel={this.handleModalCancel}
            onOk={this.handleModalAdd}
            title={modalTitle}
            visible={modalVisible}
        />
      </div>
    );
  }
}

export default ResourcesManager;
