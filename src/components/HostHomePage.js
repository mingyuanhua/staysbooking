import { message, Tabs, List, Card, Image, Carousel, Button, Tooltip, Space, Modal, } from "antd";
import { LeftCircleFilled, RightCircleFilled, InfoCircleOutlined, } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { deleteStay, getReservationsByStay, getStaysByHost } from "../utils";
import UploadStay from './UploadStay';

const { TabPane } = Tabs;
// const TabPane = Tabs.TabPane;


// component要拉reservation的数据 所以单独写出来
class ReservationList extends React.Component {
  // 这个api返回的数据是需要的，所以state里要有个array
  state = {
    loading: false,
    reservations: [],
  };

  // 这里不是用户点按钮调用，什么时候调用？出来了是哪个life cycle？componentDidMount
  // 不断地unmount mount
  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({
      loading: true,
    });


    try {
      const resp = await getReservationsByStay(this.props.stayId);
      this.setState({
        reservations: resp,
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
    const { loading, reservations } = this.state;


    return (
      <List
        loading={loading}
        dataSource={reservations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>Guest Name: {item.guest.username}</Text>}
              description={
                <>
                  <Text>Checkin Date: {item.checkin_date}</Text>
                  <br />
                  <Text>Checkout Date: {item.checkout_date}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}



class ViewReservationButton extends React.Component {
  state = {
    modalVisible: false,
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { stay } = this.props;
    const { modalVisible } = this.state;

    const modalTitle = `Reservations of ${stay.name}`;

    return (
      <>
        <Button onClick={this.openModal} shape="round">
          View Reservations
        </Button>
        {(
          <Modal
            title={modalTitle}
            centered={true}
            open={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList stayId={stay.id} />
          </Modal>
        )}
      </>
    );
  }
}


// RemoveStayButton放到Card的Extra 删除的时候需要调API 这个API需要参数 所以要传props

// 当函数被怎么的时候就叫回调函数？把函数作为props传给别人的时候
export class RemoveStayButton extends React.Component {
  state = {
    loading: false,
  };

  // 调API是什么套路？async array + try catch finally + loading
  // 因为有loading所以需要先定义一个loading的state
  handleRemoveStay = async () => {
    const { stay, onRemoveSuccess } = this.props;
    this.setState({
      loading: true,
    })

    try {
      await deleteStay(stay.id);
      // 成功删除后reload data
      onRemoveSuccess();
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
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveStay}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Stay
      </Button>
    );
  }
}

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
    const { stay } = this.props;
    const { name, description, address, guest_number } = stay;
    const { modalVisible } = this.state;
    return (
      <>
        <Tooltip title="View Stay Details">
          <Button
            onClick={this.openModal}
            style={{ border: "none" }}
            size="large"
            icon={<InfoCircleOutlined />}
          />
        </Tooltip>
        {(
          <Modal
            title={name}
            centered={true}
            open={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
          >
            <Space direction="vertical">
              <Text strong={true}>Description</Text>
              <Text type="secondary">{description}</Text>
              <Text strong={true}>Address</Text>
              <Text type="secondary">{address}</Text>
              <Text strong={true}>Guest Number</Text>
              <Text type="secondary">{guest_number}</Text>
            </Space>
          </Modal>
        )}
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
              actions={[<ViewReservationButton stay={item} />]}
              extra={ <RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />}
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