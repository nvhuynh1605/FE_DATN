import React, { useEffect, useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Breadcrumb,
  message,
  Upload,
  Table,
} from "antd";
import { GetUserById, UpdateUser } from "../../api/ApiUser";
import { getFeedbacksByUserId } from "../../api/ApiFeedback";
import { UploadOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Feedback",
    children: [
      {
        title: "Content",
        dataIndex: "feedbackContent",
        key: "feedbackContent",
      },
      {
        title: "Date",
        dataIndex: "feedbackDate",
        key: "feedbackDate",
      },
    ],
  },
  {
    title: "Comment",
    children: [
      {
        title: "Content",
        dataIndex: "commentContent",
        key: "commentContent",
      },
      {
        title: "Date",
        dataIndex: "commentDate",
        key: "commentDate",
      },
    ],
  },
];

const ActiveHistory = ({ userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getFeedbacksByUserId(userId);
        setFeedbacks(data);
      } catch (err) {
        // setError("Hiện chưa có phản hồi nào");
      }
    };

    if (userId) fetchFeedbacks();
  }, [userId]);

  if (!feedbacks.length) return <p>Hiện chưa có dữ liệu</p>;

  const tableData = feedbacks.map((item, index) => ({
    key: index,
    feedbackContent: item.content,
    feedbackDate: new Date(item.createdAt).toLocaleString(),
    commentContent: item.comment?.content || "No comment",
    commentDate: item.comment?.createdAt
      ? new Date(item.comment.createdAt).toLocaleString()
      : "",
  }));

  return <Table columns={columns} dataSource={tableData} pagination={false} />;
};

const PersonalInfomation = ({ userData }) => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [avatar, setAvatar] = useState(null); // State for avatar upload

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        username: userData?.username,
        email: userData?.email,
        phoneNum: userData?.phoneNum,
      });
      setAvatar(userData?.avatar); // Set initial avatar
    }
  }, [userData, form]);

  const handleAvatarChange = (info) => {
    const file = info.fileList[0]?.originFileObj;
    setAvatar(file);
    form.setFieldsValue({ image: file || undefined }); // Đồng bộ với form
  };

  const handleFinish = async (values) => {
    const { currentPassword, newPassword, ...otherValues } = values;

    // Prepare form data
    const formData = new FormData();
    formData.append("username", otherValues.username);
    formData.append("email", otherValues.email);
    formData.append("phoneNum", otherValues.phoneNum);
    if (avatar instanceof File || avatar instanceof Blob) {
      formData.append("avatar", avatar);
    }
    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    try {
      await UpdateUser(userData?._id, formData); // Call the API
      message.success("Profile updated successfully!");
      setIsEdit(false);
    } catch (error) {
      message.error(error.message || "Update failed. Please try again.");
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        name="avatar"
        label="Avartar"
        // rules={!isEdit ? [{ required: true, message: "Please upload an image" }] : []}
      >
        <Upload
          listType="picture"
          beforeUpload={() => false}
          maxCount={1}
          onChange={handleAvatarChange}
        >
          <Button icon={<UploadOutlined />} disabled={!isEdit}>
            Upload Image
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input disabled={!isEdit} />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input disabled={!isEdit} />
      </Form.Item>
      <Form.Item
        label="Phone number"
        name="phoneNum"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input disabled={!isEdit} />
      </Form.Item>
      {isEdit && (
        <>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password to update!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: false,
                message: "Please input your new password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <div className="float-right">
          {isEdit ? (
            <div className="flex flex-row gap-2">
              <Button onClick={() => setIsEdit(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => setIsEdit(true)}>
              Edit
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

const ProfileTabs = ({ userData, userId }) => {
  const items = [
    {
      key: "1",
      label: "Personal Information",
      children: <PersonalInfomation userData={userData} />,
    },
    {
      key: "2",
      label: "Active History",
      children: <ActiveHistory userId={userId} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

function Profile() {
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

  return (
    <div className="max-w-[1240px] mx-auto mt-8">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Trang chủ",
            href: "/home",
          },
          {
            title: "Thông tin cá nhân",
          },
        ]}
      />
      <div className="flex flex-row max-w-[1240px] mx-auto mt-8 bg-white">
        <div className="w-3/12 p-4 flex justify-center">
          <img
            src={
              userData?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSILPqTXqLj8vJ9ePsxBrkRz4k0w7IPzOCiPA&s"
            }
            alt="avatar"
            className="w-[160px] h-[160px] object-cover rounded-full"
          />
        </div>
        <div className="flex-1">
          <ProfileTabs userData={userData} userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
