import { Button, Dropdown, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import LoginPage from './components/LoginPage';
import HostHomePage from './components/HostHomePage';

const { Header, Content } = Layout;

class App extends React.Component {
  // 状态在某些条件下是会变化的，这个量的变化一定会trigger rerender(某个生命周期再来一遍)，两个条件都达成就是state
  state = {
    authed: false, // 代表用户是否已经登录了
    asHost: false, // 当前用户是否是Host
  }

  // 调用时机是第一个render之后，通常会做和render解耦的东西，一般是一次性的初始化
  // localStorage是一个什么结构? key-value 结构
  componentDidMount() { // 初始化让state进入正确的state的一段逻辑
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true";
    // 更新state，如果authToken不为空就代表登录过了
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }

  // 这里是把state给放进去，在登录成功了，在代码里就是发http请求，请求成功了
  // 未来调用login成功后，再调用handleLoginSuccess，以后要在Login Page Component里做
  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };

  // 登出的时候更新authed状态，已经登出了，asHost状态无关紧要了
  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };

  renderContent = () => {
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />
    }
    if (this.state.asHost) {
      return <HostHomePage />
    }
    return <div>guest home page</div>
  }

  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );


  // render负责返回一堆JSX，JSX浏览器不认识，需要通过Bible翻译，变成DOM的更新，JSX被转译成 
  // JSX -> React.createElement() -> 再返回一个蓝图 virtual DOM -> virtual dom送到React的嘴里，知道怎么修改真正的DOM Tree
  
  // content 里面用花括号括起来表示这里不是JSX，这里是JS表达式，花括号表示停止转译
  // 页面主题内容为什么要写成一个函数呢？抽出来比较清晰
  render() {
    return (
      <Layout style={{ heigh: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stay Booking
          </div>
          {this.state.authed && (
            <Dropdown trigger="click" overlay={this.userMenu}>
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          )}
        </Header>
        <Content style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}>
          { this.renderContent() } 
        </Content>
      </Layout>
    )
  }
}

export default App;
