import React, { useState, useEffect } from "react";
import {
  Tag,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Upload,
  notification,
} from "antd";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  GetAllNews,
  CreateNews,
  UpdateNews,
  DeleteNews,
  searchNews,
  //   searchNews,
} from "../../api/ApiNews";
import { UploadOutlined } from "@ant-design/icons";

const columns = (showEditModal, showDeleteConfirm) => [
  {
    title: "Action",
    width: 200,
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => showEditModal(record)}>
          <CiEdit className="text-lg" />
        </Button>
        <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
          <CiTrash className="text-lg" />
        </Button>
      </>
    ),
  },
  {
    title: "Created by",
    dataIndex: ["user", "username"],
    key: "user",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (title) => <div className="line-clamp-2">{title}</div>,
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
    render: (content) => <div className="line-clamp-2">{content}</div>,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 200,
    key: "createdAt",
    render: (text) => (text ? new Date(text).toLocaleString() : ""),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    width: 200,
    key: "updatedAt",
    render: (text) => (text ? new Date(text).toLocaleString() : ""),
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

const ANews = () => {
  const [newsList, setNewsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      const data = await GetAllNews();
      setNewsList(data.reverse());
    };
    fetchNews();
  }, []);

  const handleFetchNews = async (query = "") => {
    try {
      if (!query) {
        const data = await GetAllNews();
        setNewsList(data.reverse());
      } else {
        const data = await searchNews(query); // Gọi hàm tìm kiếm
        setNewsList(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchNews(query);
  };

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({
        title: record.title,
        content: record.content,
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

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const userId = localStorage.getItem("userId");
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("user", userId);
          formData.append("content", values.content);
          formData.append("status", values.status);

          if (imageFile instanceof File || imageFile instanceof Blob) {
            formData.append("image", imageFile); // Attach the image as binary data
          }

          if (isEdit && currentRecord) {
            await UpdateNews(currentRecord._id, formData);
            notification.success({ message: "News updated successfully" });
          } else {
            await CreateNews(formData);
            notification.success({ message: "News created successfully" });
          }

          const updatedNewsList = await GetAllNews();
          setNewsList(updatedNewsList.reverse());
          setIsModalOpen(false);
          setImageFile(null);
          form.resetFields();
        } catch (error) {
          message.error("Failed to save the news");
        }
      })
      .catch(() => {
        message.error("Please provide all required fields");
      });
  };

  const handleImageChange = (info) => {
    const file = info.fileList[0]?.originFileObj;
    setImageFile(file);
    form.setFieldsValue({ image: file || undefined }); // Đồng bộ với form
  };

  const showDeleteConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await DeleteNews(currentRecord._id);
      message.success("News deleted successfully");
      const updatedNewsList = await GetAllNews();
      setNewsList(updatedNewsList);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">News Management</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search news"
              value={searchQuery}
              onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
        </div>
        <Button
          type="primary"
          className="mb-5 float-right"
          onClick={() => showModal()}
        >
          Add News
        </Button>
      </div>
      <Table
        columns={columns(showModal, showDeleteConfirm)}
        dataSource={newsList}
        rowKey="_id"
        scroll={{ y: 400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <Modal
        title={isEdit ? "Update News" : "Add New News"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            rules={
              !isEdit
                ? [{ required: true, message: "Please upload an image" }]
                : []
            }
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
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
        onOk={handleDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this news?</p>
      </Modal>
    </>
  );
};

export default ANews;
