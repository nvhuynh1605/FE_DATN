import React, { useState, useEffect } from "react";
import { Tag, Table, Button, Modal, Form, Input, Select, notification } from "antd";
import { CiEdit } from "react-icons/ci";
import { IoLockClosedSharp, IoKeySharp  } from "react-icons/io5";
import { GetAllUser, UpdateUser, AddUser } from "../../api/ApiUser"; // Assuming these API calls are defined

const columns = (showEditModal, showLockConfirm, handleUnlock) => [
  {
    title: "Action",
    width: 200,
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => showEditModal(record)}>
          <CiEdit className="text-lg" />
        </Button>
        {record?.status === 1 ? (
          <Button type="link" danger onClick={() => showLockConfirm(record)}>
            <IoLockClosedSharp className="text-lg" />
          </Button>
        ) : (
          <Button type="link" onClick={() => handleUnlock(record)}>
            <IoKeySharp className="text-lg" />
          </Button>
        )}
      </>
    ),
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNum",
    key: "phoneNum",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Status",
    key: "status",
    render: (_, record) => {
      const color = record.status === 1 ? "green" : "volcano";
      const statusText = record.status === 1 ? "Active" : "Draft";

      return (
        <Tag color={color} key={record.id}>
          {statusText.toUpperCase()}
        </Tag>
      );
    },
  },
];

const AUser = () => {
  const [user, setUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await GetAllUser();
        setUser(data.reverse());
      } catch (error) {
        notification.error("Failed to fetch users.");
      }
    };
    fetchUser();
  }, []);

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({
        username: record.username,
        email: record.email,
        phoneNum: record.phoneNum,
        status: record.status,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && currentRecord) {
        await UpdateUser(currentRecord._id, values);
        notification.success({ message: "User updated successfully"});
      } else {
        await AddUser(values); // Nếu thêm mới
        notification.success({ message: "User added successfully"});
      }
      const updatedUsers = await GetAllUser();
      setUser(updatedUsers.reverse());
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      notification.error({ message: "Failed to save user."});
    }
  };

  const showLockConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleLock = async () => {
    try {
      await UpdateUser(currentRecord._id, { status: 0 });
      notification.success({ message: "User locked successfully"});
      const updatedUsers = await GetAllUser();
      setUser(updatedUsers.reverse());
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      notification.error({ message: "Failed to lock user."});
    }
  };

  const handleUnlock = async (record) => {
    try {
      await UpdateUser(record._id, { status: 1 });
      notification.success({ message: "User unlocked successfully" });
      const updatedUsers = await GetAllUser();
      setUser(updatedUsers.reverse());
    } catch (error) {
      notification.error({ message: "Failed to unlock user." });
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">List users</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search user"
              // value={searchQuery}
              // onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
        </div>
        <Button
          type="primary"
          className="mb-5 float-right"
          onClick={() => showModal()}
        >
          Add New
        </Button>
      </div>
      <Table
        columns={columns(showModal, showLockConfirm, handleUnlock)}
        dataSource={user}
        rowKey="_id"
        scroll={{ y: 400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <Modal
        title={isEdit ? "Update User" : "Add New User"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[!isEdit && { required: true, message: "Please enter the username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[!isEdit && { required: true, message: "Please enter the password" }]}
          >
            <Input type="password"/>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[!isEdit && { required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNum"
            label="Phone Number"
            rules={[!isEdit && { required: true, message: "Enter the phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
          >
            <Select placeholder="Select a status">
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Draft</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={isDeleteConfirmVisible}
        onOk={handleLock}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Lock"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to lock this user? This will change their status to "Draft".</p>
      </Modal>
    </>
  );
};

export default AUser;
