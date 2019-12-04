import React, {Component, Fragment} from 'react';
import {Row, Col, Card} from 'antd';
import i1 from '@/assets/imgs/images/u144.png';
import {connect} from '@/common/Plugins';
import styles from '../../layouts/global.less'

@connect(({index, publicModel, assemblyParts, loading}) => ({index, publicModel, assemblyParts, loading: loading.models.index}))

class Index extends Component {

  state = {
    projectTitle: '底盘系统',
    items: null,
    totalBrowseCount: {},
    systemList: []
  }

  changeItems = () => {
    //TODO 调用接口查询item和浏览次数

    let browseCount = {
      powerSystem: 120
    }
    let totalBrowseCount = {
      day: 50,
      week: 800,
      month: 2223
    }

    let items = null;
    items = <Row gutter={1}
        style={{
      marginTop: 5
    }}
            >
      <Col span={8}>
        <div
            style={{
          height: 180,
          backgroundColor: '#fff',
          padding: 20
        }}
        >
          <div>
            <img
                src={i1}
                style={{
              width: 40,
              height: 40
            }}
            />
            <span
                style={{
              fontSize: 16,
              marginLeft: 10
            }}
            >动力系统</span>
          </div>
          <div style={{
            height: 80,
            marginTop: 10
          }}
          >
            <a onClick={() => {}}
                textDecoration="none"
            >动力系统</a>
          </div>
          <Row>
            <Col span={14}></Col>
            <Col span={10}>
              <span style={{
                color: '#999'
              }}
              >
                浏览次数：{browseCount.powerSystem}
              </span>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>

    this.setState({items, totalBrowseCount});
  }

  render() {
    const { loading, publicModel:{systemList} } = this.props
    return (
      <Fragment>
        <Card className={styles.main}>
          <Row>
            <ul className={styles.viewCount}>
              <li>
                每天访问
                <span>100</span>
              </li>
              <li>
                每周访问
                <span>2345</span>
              </li>
              <li>
                每月访问
                <span>16450</span>
              </li>
            </ul>
          </Row>
        </Card>
        <Card className={styles.main}
            extra={< a href="#" > 全部项目 </a>}
            loading={loading}
            title="底盘系统"
        >
          <ul className={styles.systemList}>
            {systemList.map(item => (
              <li key={item.id}>
                <h2>{item.componentName}</h2>
                {/* <Link to="/chassisSystem/detail/2">暂无数据</Link> */}
                暂无数据
                <div>浏览次数: 暂无数据</div>
              </li>
            ))}
          </ul>
        </Card>
      </Fragment>
    )
  }
}
export default Index
