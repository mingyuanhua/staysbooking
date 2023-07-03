import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadStay } from "../utils";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

// 放一个提交按钮来自动
// Button 有一个特别的属性 htmlType，起到提交作用，和Form的onFinish联动
// 点击Button提交的时候，Class里的handleSubmit函数会被调用

// Form包裹住Form.Item包裹住Input/...
class UploadStay extends React.Component {
    state = {
      loading: false,
    };
  
  
    fileInputRef = React.createRef();
  
  
    handleSubmit = async (values) => {
      const formData = new FormData();
      const { files } = this.fileInputRef.current;
  
  
      if (files.length > 5) {
        message.error("You can at most upload 5 pictures.");
        return;
      }
  
  
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      // 组装的过程中，这里都是ref，直到发送的时候，浏览器才会根据reference把具体的内容挖出来放到请求上
      
  
      // 除了文件外，其他数据都在value上
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("description", values.description);
      formData.append("guest_number", values.guest_number);
  
  
      // loading变成true 发送api api成功 api失败 不管成功失败loading变回false
      this.setState({
        loading: true,
      });
      try {
        await uploadStay(formData);
        message.success("upload successfully");
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
        <Form
            {...layout}
            name="nest-messages"
            onFinish={this.handleSubmit}
            style={{ maxWidth: 1000, margin: "auto" }}
        >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
            >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
            </Form.Item>
            <Form.Item
            name="guest_number"
            label="Guest Number"
            rules={[{ required: true, type: "number", min: 1 }]}
            >
            <InputNumber />
            </Form.Item>
            <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
            <input
                type="file"
                accept="image/png, image/jpeg"
                ref={this.fileInputRef}
                multiple={true}
            />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit" loading={this.state.loading}>
                Submit
            </Button>
            </Form.Item>
        </Form>
        );
    }
}
  
  
export default UploadStay;