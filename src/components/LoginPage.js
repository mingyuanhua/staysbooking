import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";

class LoginPage extends React.Component {
  formRef = React.createRef();
  state = {
    asHost: false,
    loading: false,
  }

  onFinish = () => {
    console.log("finish form");
  }

  // 在用户点击登录按钮时，先验证表单字段的值，如果验证通过则发送登录请求
  // 将返回的登录凭据token传递给父组件的handleLoginSuccess方法处理
  handleLogin = async () => { // 异步函数用来处理登录
    const formInstance = this.formRef.current; // 引用表单实例

    try {
      await formInstance.validateFields(); // 验证表单实例的字段值
    } catch (error) {
      return
    }

    // 这个状态用于控制是否显示加载状态
    this.setState({
      loading: true,
    })

    try {
      const { asHost } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      // 调用父组件传递的handleLoginSuccess方法
      this.props.handleLoginSuccess(resp.token, asHost);
    } catch (error) {
      message.error(error.message);
    } finally {
      // 无论是否发生错误，最终都会将组件的状态中的loading设为false，表示加载状态结束
      this.setState({
        loading: false,
      })
    }
  }

  handleRegister = async () => {
    const formInstance = this.formRef.current;

    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }

    this.setState({
      loading: true,
    })

    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    }
    )
  }

  render() {
    return (
      <div style={{ width: 500, margin: "20px auto"}}>
        <Form ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input 
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon"/>}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asHost}
            onChange={this.handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button
            onClick={this.handleLogin}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Log in
          </Button>
          <Button
            onClick={this.handleRegister}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>
      </div>
    )
  }
}


export default LoginPage;