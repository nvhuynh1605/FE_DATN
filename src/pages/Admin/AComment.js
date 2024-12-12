import React, { useState, useEffect } from "react";
import { Tag, Table, Button, Modal, Form, Input, message, Select } from "antd";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  GetAllComment,
  CreateComment,
  UpdateComment,
  DeleteComment,
//   searchComment,
} from "../../api/ApiComment";

// const {Option} = Select 

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
    title: "Product",
    dataIndex: ["product", "name"],
    key: "product",
  },
  {
    title: "Author",
    dataIndex: ["user", "username"],
    key: "user",
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 200,
    key: "createdAt",
    render: (text) => (text ? new Date(text).toLocaleString() : ""),
  },
  // {
  //   title: "Status",
  //   key: "isApproved",
  //   render: (_, record) => {
  //     const color = record.isApproved ? "green" : "volcano";
  //     const statusText = record.isApproved ? "Approved" : "Pending";

  //     return (
  //       <Tag color={color} key={record.id}>
  //         {statusText.toUpperCase()}
  //       </Tag>
  //     );
  //   },
  // },
];

const AComment = () => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const data = await GetAllComment();
      setComments(data.reverse());
    };
    fetchComments();
  }, []);

//   const handleFetchComments = async (query = "") => {
//     try {
//       if (!query) {
//         const data = await GetAllComment();
//         setComments(data.reverse());
//       } else {
//         const data = await searchComment(query);
//         setComments(data.reverse());
//       }
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     handleFetchComments(query);
//   };

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue({ text: record.text, isApproved: record.isApproved });
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
            await UpdateComment(currentRecord._id, values);
            message.success("Comment updated successfully");
          } else {
            await CreateComment(values);
            message.success("Comment created successfully");
          }

          const updatedComments = await GetAllComment();
          setComments(updatedComments.reverse());
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          message.error("Failed to save the comment");
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
      await DeleteComment(currentRecord._id);
      message.success("Comment deleted successfully");
      const updatedComments = await GetAllComment();
      setComments(updatedComments);
      setIsDeleteConfirmVisible(false);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">List Comments</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          {/* <div>
            <div>Search</div>
            <Input
              placeholder="Search comments"
            //   value={searchQuery}
            //   onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div> */}
        </div>
      </div>
      <Table
        columns={columns(showModal, showDeleteConfirm)}
        dataSource={comments}
        rowKey="_id"
        scroll={{ y: 400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <Modal
        title={isEdit ? "Update Comment" : "Add New Comment"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex justify-center items-center mt-5">
          <Form form={form} layout="vertical">
            <Form.Item
              name="text"
              label="Comment Text"
              rules={[{ required: true, message: "Please enter the comment" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="isApproved"
              label="Approval Status"
              rules={[
                { required: true, message: "Please select the approval status" },
              ]}
            >
              <Select placeholder="Select approval status">
                <Select.Option value={true}>Approved</Select.Option>
                <Select.Option value={false}>Pending</Select.Option>
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
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </>
  );
};

export default AComment;
