import { message, Tabs, List, Card, Image, Carousel, Button, Modal } from "antd";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { getStaysByHost } from "../utils";
import UploadStay from './UploadStay';

const { TabPane } = Tabs;
// const TabPane = Tabs.TabPane;


// Modal 组件 https://4x.ant.design/components/modal/ 点按钮 弹弹窗
// 为什么要先有个Button？因为Modal弹窗不是永远弹出来的，需要有个东西触发trigger，不一定是Button，但Button最为常见
// Modal弹出不弹出是由哪个props控制的？open={isModalOpen} props open和isModalOpen联系在一起 isModalOpen是一个React的state
export class StayDetailInfoButton extends React.Component {
  state = {
    modalVisible: false,
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    })
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
      return (
        <>
          <Button onClick={this.openModal}>Stays Extra</Button>
          <Modal open={this.state.modalVisible} onCancel={this.handleCancel}>

          </Modal>
        </>
      );
  }
}

// 有loading state代表该组件一定会调API
// 既然要掉数据，所以要有个装数据的state
// renderItem接受了一个function 是一个动作
// 对于这个data 这个动作发生3次 输入这个元素 输出是一个JSX
class MyStays extends React.Component {
    state = {
      loading: false,
      data: [],
    };
  
  
    componentDidMount() {
      this.loadData();
    }
  
  
    loadData = async () => {
      this.setState({
        loading: true,
      });
  
  
      try {
        const resp = await getStaysByHost();
        this.setState({
          data: resp,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
  
  
    render() {
      return (
        <List
          loading={this.state.loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                      {item.name}
                    </Text>
                    <StayDetailInfoButton stay={item} />
                  </div>
                }
                actions={[]}
                extra={StayDetailInfoButton}
              >
                  <Carousel
                    dots={false}
                    arrows={true}
                    prevArrow={<LeftCircleFilled />}
                    nextArrow={<RightCircleFilled />}
                  >
                    {item.images.map((image, index) => (
                      <div key={index}>
                        <Image src={image.url} width="100%" />
                      </div>
                    ))}
                  </Carousel>
              </Card>
            </List.Item>
          )}
        />
      );
    }
  }  

// defaultActiveKey指同一时间高亮的tab分页器
class HostHomePage extends React.Component {
    render() {
        return (
            <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
                <TabPane tab="My Stays" key="1">
                    <MyStays />
                </TabPane>
                <TabPane tab="Upload Stay" key="2">
                    <UploadStay />
                </TabPane>
            </Tabs>
        )
    }
}

export default HostHomePage;