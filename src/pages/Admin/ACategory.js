import React, { useState, useEffect } from "react";
import { Tag, Table, Button, Modal, Form, Input, Select, message } from "antd";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  GetAllCategory,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  searchCategory,
} from "../../api/ApiCategory";

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
    title: "ID",
    dataIndex: "_id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
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

const ACategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại
    pageSize: 10, // Số bản ghi trên mỗi trang
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await GetAllCategory();
      setCategories(data.reverse());
    };
    fetchCategories();
  }, []);

  const handleFetchProducts = async (query = "") => {
    try {
      if (!query) {
        const fetchCategories = async () => {
          const data = await GetAllCategory();
          setCategories(data.reverse());
        };
        fetchCategories();
      }
      const data = await searchCategory(query); // Gọi hàm từ file API
      setCategories(data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchProducts(query);
  };

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({ name: record.name, status: record.status });
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
            await UpdateCategory(currentRecord._id, values);
            message.success("Category updated successfully");
          } else {
            await CreateCategory(values);
            message.success("Category created successfully");
          }

          const updatedCategories = await GetAllCategory();
          setCategories(updatedCategories.reverse());
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          message.error("Failed to save the category");
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
      await DeleteCategory(currentRecord._id);
      message.success("Category deleted successfully");
      const updatedCategories = await GetAllCategory();
      setCategories(updatedCategories);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    console.log("Pagination changed:", pagination);
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">List categories</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search category"
              value={searchQuery}
              onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
          {/* <div>
            <div>Created At</div>
            <RangePicker onChange={handleDateChange} />
          </div> */}
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
        columns={columns(showModal, showDeleteConfirm)}
        dataSource={categories}
        rowKey="_id"
        scroll={{ y: 400 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          pageSizeOptions: ["5", "10", "20", "50"],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
          showTotal: (total) => `Total items: ${total}`,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={isEdit ? "Update Category" : "Add New Category"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input />
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
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </>
  );
};

export default ACategory;
