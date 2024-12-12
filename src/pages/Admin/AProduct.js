import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Upload,
  message,
  Tag,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  GetAllProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  fetchSearchProducts,
} from "../../api/ApiProduct";
import { GetAllCategory } from "../../api/ApiCategory";

const { Option } = Select;
const { RangePicker } = DatePicker;

const columns = (onEdit, onDelete) => [
  {
    title: "Action",
    width: 120,
    fixed: "left",
    render: (_, record) => (
      <div>
        <Button
          type="link"
          className="text-lg p-2"
          onClick={() => onEdit(record)}
        >
          <CiEdit />
        </Button>
        <Button
          type="link"
          className="text-lg p-2"
          danger
          onClick={() => onDelete(record)}
        >
          <CiTrash />
        </Button>
      </div>
    ),
  },
  {
    title: "Image",
    dataIndex: "image_url",
    width: 100,
    render: (image_url) => (
      <img
        src={image_url}
        alt="product"
        style={{ width: 45, height: 45, objectFit: "cover" }}
      />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
    render: (name) => <p className="line-clamp-2">{name}</p>,
  },
  {
    title: "Category Name",
    dataIndex: ["category_id", "name"],
    width: 150,
    key: "category_id",
  },
  {
    title: "Author",
    dataIndex: "author",
    width: 200,
    key: "author",
  },
  {
    title: "NXB",
    dataIndex: "publishingHouse",
    width: 150,
    key: "publishingHouse",
  },
  {
    title: "Price",
    dataIndex: "price",
    width: 120,
    key: "price",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    width: 120,
    key: "quantity",
  },
  {
    title: "Discount",
    dataIndex: "sale",
    width: 120,
    key: "sale",
  },
  {
    title: "Current price",
    dataIndex: "currentPrice",
    width: 120,
    key: "currentPrice",
    render: (currentPrice) => (
      <p className="line-clamp-2">{parseInt(currentPrice)}</p>
    ),
  },
  {
    title: "sold",
    dataIndex: "sold",
    width: 120,
    key: "sold",
  },
  {
    title: "Description",
    dataIndex: "des",
    width: 250,
    render: (des) => <p className="line-clamp-2">{des}</p>,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 200,
    key: "createdAt",
    render: (text) => (text ? new Date(text).toLocaleString() : null),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    width: 200,
    key: "updatedAt",
    render: (text) => (text ? new Date(text).toLocaleString() : null),
  },
  {
    title: "Status",
    key: "status",
    width: 100,
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

const AProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại
    pageSize: 10, // Số bản ghi trên mỗi trang
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (dateStrings) => {
    const startDate = dateStrings ? dateStrings[0].toISOString() : "";
    const endDate = dateStrings ? dateStrings[1].toISOString() : "";

    try {
      const response = await axios.post(
        "http://localhost:3001/api/products/filterCreatedDate",
        {
          startDate,
          endDate,
        }
      );

      setProducts(response.data); // Set the entire list of filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const data = await GetAllProduct();
    setProducts(data.reverse());
  };

  const fetchCategories = async () => {
    const data = await GetAllCategory();
    setCategories(data);
  };

  const handleAdd = () => {
    setIsEdit(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      category_id: record.category_id?._id || null,
    });
    setIsModalOpen(true);
  };

  const showDeleteConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await DeleteProduct(currentRecord._id);
      message.success("Product deleted successfully");
      setIsDeleteConfirmVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("author", values.author);
        formData.append("category_id", values.category_id);
        formData.append("des", values.des);
        formData.append("price", values.price);
        formData.append("sale", values.sale);
        formData.append("quantity", values.quantity);
        formData.append("sold", values.sold || 0);
        formData.append("publishingHouse", values.publishingHouse);
        formData.append("status", values.status);

        if (imageFile instanceof File || imageFile instanceof Blob) {
          formData.append("image", imageFile); // Attach the image as binary data
        }

        try {
          if (isEdit && currentRecord) {
            await UpdateProduct(currentRecord?._id, formData);
            message.success("Product updated successfully");
          } else {
            await CreateProduct(formData);
            message.success("Product added successfully");
          }
          fetchProducts();
          setIsModalOpen(false);
          setImageFile(null);
          form.resetFields();
        } catch (error) {
          message.error("Failed to save the product");
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

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    console.log("Pagination changed:", pagination);
  };

  const handleFetchProducts = async (query = "") => {
    try {
      const data = await fetchSearchProducts(query); // Gọi hàm từ file API
      setProducts(data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    handleFetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchProducts(query);
  };

  const handleDateChange = (dateStrings) => {
    if (!dateStrings || dateStrings.length === 0) {
      const fetchPoducts = async () => {
        const data = await GetAllProduct();
        setProducts(data.reverse());
      };
      fetchPoducts();
    }
    fetchData(dateStrings);
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">List Products</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search products"
              value={searchQuery}
              onChange={handleSearch}
              style={{ marginBottom: 16, width: 300 }}
            />
          </div>
          <div>
            <div>Created At</div>
            <RangePicker onChange={handleDateChange} />
          </div>
        </div>
        <Button type="primary" onClick={handleAdd}>
          Add New Product
        </Button>
      </div>
      <Table
        columns={columns(handleEdit, showDeleteConfirm)}
        dataSource={products}
        rowKey="_id"
        scroll={{ x: 2000, y: 500 }}
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
        title={isEdit ? "Edit Product" : "Add New Product"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div className="flex flex-row gap-2">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: "Please enter the product name" },
              ]}
              className="w-3/5"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category_id"
              label="Category ID"
              rules={[{ required: true, message: "Please select a category" }]}
              className="flex-1"
            >
              <Select
                placeholder="Select a category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="flex flex-row gap-2">
            <Form.Item
              name="author"
              label="Author"
              rules={[{ required: true, message: "Please enter the author" }]}
              className="w-1/2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="publishingHouse"
              label="NXB"
              rules={[{ required: true, message: "Please enter the nxb" }]}
              className="flex-1"
            >
              <Input />
            </Form.Item>
          </div>
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
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select placeholder="Select a status">
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Draft</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex flex-row gap-2">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="sale"
              label="Discount"
              rules={[{ required: true, message: "Please enter the discount" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter the quantity" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="sold" label="Sold">
              <Input type="number" />
            </Form.Item>
          </div>
          <Form.Item name="des" label="Description">
            <Input.TextArea rows={5} />
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

export default AProduct;
