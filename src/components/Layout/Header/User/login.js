import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const LoginForm = ({ onLoginSuccess, onSwitchToRegister  }) => {
  const onFinish = async (values) => {
    try {
      // Send login data to the backend
      const response = await axios.post(
        "http://localhost:3001/api/user/login",
        values
      );

      // Extract token and userId from the response
      const { token, userId } = response.data;

      // Store token and userId in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      if (response.data.role === 'admin') {
        window.location.href = '/admin';
      }

      message.success("Login successful!");

      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="w-3/5"
      >
        <div className="text-center text-xl mb-6 font-bold">Đăng nhập</div>
        <Form.Item
          label="Tài khoản"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="mb-2">
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
        <div className="text-right">
        Chưa có tài khoản?{" "}
        <span
          onClick={onSwitchToRegister}
          className="text-blue-500 cursor-pointer"
        >
          Đăng ký
        </span>
      </div>
      </Form>
    </div>
  );
};

export default LoginForm;
