import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, message, } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { GetUserById } from "../../api/ApiUser";
import { AiFillMessage } from "react-icons/ai";
import { feedbackApi } from "../../api/ApiFeedback";

const FeedbackForm = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Điều khiển Drawer
    const [form] = Form.useForm();
    const userId = localStorage.getItem("userId");
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const data = await GetUserById(userId);
                    setUserData(data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        } else {
            console.log("No user ID found in localStorage.");
        }
    }, [userId]);

    // Tự động điền thông tin từ localStorage
    useEffect(() => {
        if (userId) {
            form.setFieldsValue({
                email: userData.email || "",
                phoneNum: userData.phoneNum || "",
            });
        }
    }, [userId, userData, form]);

    // Xử lý gửi form
    const handleSubmit = async (values) => {
        try {
          const feedbackData = {
            userId: userId,
            content: values.content,
            email: values.email,
            phoneNum: values.phoneNum,
          };
      
          await feedbackApi.createFeedback(feedbackData);
      
          message.success("Gửi feedback thành công!");
          form.resetFields();
          setIsDrawerOpen(false);
        } catch (error) {
          message.error(error.message || "Có lỗi xảy ra khi gửi feedback.");
        }
      };

    return (
        <div>
            {/* Nút mở Drawer */}
            <Button
                type="primary"
                style={{
                    position: "fixed",
                    bottom: "80px",
                    right: "25px",
                    fontSize: "20px",
                    padding: "25px 15px",
                    borderRadius: "50%",
                    zIndex: 1000,
                }}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
                <AiFillMessage />
            </Button>

            {isDrawerOpen && (

                <Card
                    style={{
                        position: "fixed",
                        bottom: "140px", // Hiển thị form ngay trên nút bấm
                        right: "30px",
                        width: 300,
                        zIndex: 1001,
                    }}
                    title="Gửi Feedback"
                    extra={
                        <CloseOutlined
                            onClick={() => setIsDrawerOpen(false)}
                            style={{ cursor: "pointer" }}
                        />
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            email: "",
                            phoneNum: "",
                            content: "",
                        }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNum"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại!" },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại của bạn" />
                        </Form.Item>
                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập nội dung feedback" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default FeedbackForm;
