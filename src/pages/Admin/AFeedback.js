import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Select, message } from "antd";
import {
  GetAllFeedback,
  CreateFeedback,
  UpdateFeedback,
  DeleteFeedback,
  searchFeedback,
//   searchFeedback,
} from "../../api/ApiFeedback";

const columns = (showEditModal, showDeleteConfirm) => [
  {
    title: "ID",
    dataIndex: "_id",
    key: "id",
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "User",
    dataIndex: ["user", "username"],
    key: "user",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 200,
    key: "createdAt",
    render: (text) => (text ? new Date(text).toLocaleString() : ""),
  },
];

const AFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const data = await GetAllFeedback();
      setFeedbacks(data.reverse());
    };
    fetchFeedbacks();
  }, []);

  const handleFetchFeedbacks = async (query = "") => {
    try {
      if (!query) {
        const fetchFeedbacks = async () => {
          const data = await GetAllFeedback();
          setFeedbacks(data.reverse());
        };
        fetchFeedbacks();
      }
      const data = await searchFeedback(query); // Gọi hàm từ file API
      setFeedbacks(data.reverse());
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchFeedbacks(query);
  };

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({ message: record.message, status: record.status });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          if (isEdit && currentRecord) {
            await UpdateFeedback(currentRecord._id, values);
            message.success("Feedback updated successfully");
          } else {
            await CreateFeedback(values);
            message.success("Feedback created successfully");
          }

          const updatedFeedbacks = await GetAllFeedback();
          setFeedbacks(updatedFeedbacks.reverse());
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          message.error("Failed to save the feedback");
        }
      })
      .catch(() => {
        message.error("Please provide all required fields");
      });
  };

  const showDeleteConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await DeleteFeedback(currentRecord._id);
      message.success("Feedback deleted successfully");
      const updatedFeedbacks = await GetAllFeedback();
      setFeedbacks(updatedFeedbacks);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">Feedback Management</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search feedback"
              value={searchQuery}
              onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
        </div>
      </div>
      <Table
        columns={columns(showModal, showDeleteConfirm)}
        dataSource={feedbacks}
        rowKey="_id"
        scroll={{ y: 400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <Modal
        title={isEdit ? "Update Feedback" : "Add New Feedback"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex justify-center items-center mt-5">
          <Form form={form} layout="vertical">
            <Form.Item
              name="message"
              label="Feedback Message"
              rules={[
                { required: true, message: "Please enter the feedback message" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Select placeholder="Select a status">
                <Select.Option value={1}>Resolved</Select.Option>
                <Select.Option value={0}>Pending</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={isDeleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this feedback?</p>
      </Modal>
    </>
  );
};

export default AFeedback;
