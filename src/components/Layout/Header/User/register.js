import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const RegisterForm = ({ onSwitchToLogin }) => {
  const onFinish = async (values) => {
    try {
      // Send registration data to the backend
      const response = await axios.post(
        "http://localhost:3001/api/user/register",
        values
      );
      console.log(response);

      // Handle successful registration
      message.success("Registration successful! You can now log in.");
      onSwitchToLogin(); // Redirect to the login form
    } catch (error) {
      // Handle errors
      message.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Form
        name="register_form"
        onFinish={onFinish}
        layout="vertical"
        className="w-3/5"
      >
        <div className="text-center text-xl mb-6 font-bold">Đăng ký</div>
        <Form.Item
          label="Tài khoản"
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
            { min: 4, message: "Username must be at least 4 characters long!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNum"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="mb-2">
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
        <div className="text-right">
          Đã có tài khoản?{" "}
          <span
            onClick={onSwitchToLogin}
            className="text-blue-500 cursor-pointer"
          >
            Đăng nhập
          </span>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
