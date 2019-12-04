import React from 'react'
import {Form, Icon, Input, Button} from 'antd';

const FormItem = Form.Item;
const inputIcon = {
  color: 'rgba(0,0,0,.25)'
}

/**
 * 通用登陆组件
 */
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { form: {validateFields}} = this.props
    validateFields((err, values) => {
        if (!err) {
          this.props.validSucc(values);
        }
      });
  }

  render() {
    const {form: { getFieldDecorator }, loading} = this.props;
    return (
      <Form className="login-form"
          onSubmit={this.handleSubmit}
      >
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名称!'
              }
            ]
          })(
            <Input
                placeholder="请输入用户名称"
                prefix={< Icon style={inputIcon}
                    type="user"
                        />}
                style={{
              height: '50px'
            }}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入用户密码!'
              }
            ]
          })(
            <Input
                placeholder="请输入用户密码"
                prefix={< Icon style={inputIcon}
                    type="lock"
                        />}
                style={{
              height: '50px'
            }}
                type="password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
              block
              className={this.props.buttonStyle}
              htmlType="submit"
              loading={loading}
              size="large"
              type="primary"
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default NormalLoginForm
