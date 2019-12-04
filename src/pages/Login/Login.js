import React, {Fragment} from 'react';
import {Card, Row, Col, Form, message} from 'antd';
import NormalLoginForm from '@/common/NormalLoginForm';
import styles from './login.less';
import {connect} from 'dva';
import {router} from '../../common/Plugins'
import logoImg from '@/assets/imgs/logo_login.png';
import loginFirst from '@/assets/imgs/login_first.jpg';
// import {Redirect} from '@/common/Plugins';

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

@connect(({login, loading}) => ({login, loading: loading.models.login}))

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    if (this.refs.loginContain == void 0)
      return

    this.refs.loginContain.style.backgroundImage = '';
    this.refs.loginContain.style.backgroundSize = '';
    this.refs.loginVideo.play();

    let old = (16 / 9).toFixed(2);
    let bl = (document.body.clientWidth / document.body.clientHeight).toFixed(2);
    let x = old <= bl
      ? Math.ceil(bl / old * 100) / 100
      : 1;
    let y = old >= bl
      ? Math.ceil(old / bl * 100) / 100
      : 1;
    this.refs.loginVideo.style.transform = `scale(${x}, ${y})`;
  }

  onChangeUserName = (e) => {
    this.setState({userName: e.target.value});
  }
  validSucc = (values) => {
    const {dispatch} = this.props;
    this.setState({
      loading: true
    })
    const callback = response => {
      if (response.code !== 1) {
        message.error(response.msg);
        this.setState({
          loading: false
        })
      } else {
        this.setState({
          loading: false
        },() => {
          router.push('/chassisSystem/2')
        })
      }
    };
    dispatch({type: 'login/login', payload: values, callback});
  }
  render() {
    const { loading } = this.state
    return (
      <Fragment>
        <div
            className={styles.login}
            ref="loginContain"
            style={{
          height: '100vh',
          backgroundImage: `url(${loginFirst})`,
          backgroundSize: '100%'
        }}
        >
          <Row
              align="middle"
              justify="center"
              type="flex"
          >
            <Col span={6}>
              <Card className={styles.loginContainer}>
                <div className={styles.title}>三一车辆设计经验数据平台</div>
                <div style={{
                  marginTop: '20px'
                }}
                >
                  <WrappedNormalLoginForm
                      buttonStyle={styles.loginBtn}
                      loading={loading}
                      validSucc={this.validSucc}
                  ></WrappedNormalLoginForm>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <video
            className={styles.loginVideo}
            loop="loop"
            muted
            poster={loginFirst}
            ref="loginVideo"
        >
          {/* <source src={loginBgVideo} type='video/mp4'/> */}
        </video>
      </Fragment>
    )
  }
}

export default Login
