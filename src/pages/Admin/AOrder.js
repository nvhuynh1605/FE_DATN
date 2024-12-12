import React, { useState, useEffect } from "react";
import {
  Tag,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { CiEdit, CiTrash } from "react-icons/ci";
import {
  GetAllOrder,
  updateOrder,
  createOrder,
  deleteOrder,
  SearchOrder,
} from "../../api/ApiOrder";
import { GetAllProduct } from "../../api/ApiProduct";

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
    title: "Products",
    dataIndex: "products",
    width: 200,
    key: "products",
    render: (products) =>
      products?.map((product, index) => (
        <div key={index} className="line-clamp-1">
          {product?.name}
        </div>
      )),
  },
  {
    title: "Quantity",
    dataIndex: "products",
    key: "products",
    width: 100,
    render: (products) =>
      products?.map((product, index) => (
        <div key={index}>{product?.buyQuantity || product?.quantity}</div>
      )),
  },
  {
    title: "Payment ID",
    dataIndex: "paymentId",
    width: 250,
    key: "paymentId",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 100,
    render: (amount) => <div>{parseInt(amount || 0)}</div>,
  },
  {
    title: "User",
    dataIndex: ["userId", "username"],
    key: "username",
    width: 100,
  },
  {
    title: "Receiver",
    dataIndex: "fullName",
    key: "fullName",
    width: 200,
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNum",
    key: "phoneNum",
    width: 150,
  },
  {
    title: "Address",
    dataIndex: "address",
    width: 250,
    key: "address",
  },
  {
    title: "Note",
    dataIndex: "note",
    width: 200,
    key: "note",
    render: (note) => <div className="line-clamp-2">{note}</div>,
  },
  {
    title: "Status",
    key: "status",
    width: 200,
    render: (_, record) => {
      let color;
      let statusText;
      switch (record.status) {
        case 0:
          color = "volcano";
          statusText = "Đã hủy";
          break;
        case 1:
          color = "orange";
          statusText = "Đang xử lý";
          break;
        case 2:
          color = "blue";
          statusText = "Đã thanh toán";
          break;
        case 3:
          color = "green";
          statusText = "Giao hàng thành công";
          break;
        default:
          color = "grey";
          statusText = "Không xác định";
      }

      return (
        <Tag color={color} key={record.id}>
          {statusText}
        </Tag>
      );
    },
  },
  {
    title: "Order date",
    dataIndex: "orderDate",
    width: 200,
    key: "orderDate",
    render: (text) => (text ? new Date(text).toLocaleString() : null),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    width: 200,
    key: "updatedAt",
    render: (text) => (text ? new Date(text).toLocaleString() : null),
  },
];

const AOrder = () => {
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await GetAllOrder();
      setOrder(data.reverse());
    };
    fetchOrders();
    const fetchProducts = async () => {
      const data = await GetAllProduct();
      setProducts(data.reverse());
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateOrder(currentRecord._id, values);
        notification.success({ message: "Order updated successfully" });
      } else {
        await createOrder(values);
        notification.success({ message: "Order created successfully" });
      }
      setIsModalOpen(false);
      form.resetFields();
      const data = await GetAllOrder();
      setOrder(data.reverse());
    } catch (error) {
      notification.error({ message: "Failed to save order" });
    }
  };

  const showModal = (record = null) => {
    setIsEdit(!!record);
    setCurrentRecord(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(currentRecord._id);
      notification.success({ message: "Order deleted successfully" });
      const data = await GetAllOrder();
      setOrder(data.reverse());
    } catch (error) {
      notification.error({ message: "Failed to delete order" });
    }
    setIsDeleteConfirmVisible(false);
  };

  const showDeleteConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    console.log("Pagination changed:", pagination);
  };

  const handleFetchOrder = async (query = "") => {
    try {
      if (!query) {
        const fetchOrder = async () => {
          const data = await GetAllOrder();
          setOrder(data.reverse());
        };
        fetchOrder();
      }
      const data = await SearchOrder(query); // Gọi hàm từ file API
      setOrder(data.reverse());
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchOrder(query);
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold">List orders</div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2">
          <div>
            <div>Search</div>
            <Input
              placeholder="Search orders"
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
        dataSource={order}
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
        title={isEdit ? "Update Order" : "Add New Order"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className="flex gap-4 items-center mb-4">
                    <Form.Item
                      {...restField}
                      name={[name, "product"]}
                      fieldKey={[fieldKey, "product"]}
                      label="Product Name"
                      rules={[
                        { required: true, message: "Please select a product" },
                      ]}
                      className="w-4/5"
                    >
                      <Select
                        placeholder="Select a product"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(value, option) => {
                          form.setFieldsValue({
                            products: form
                              .getFieldValue("products")
                              .map((item, idx) =>
                                idx === name
                                  ? {
                                      ...item,
                                      product_id: value,
                                      name: option.children,
                                      currentPrice: option.currentPrice,
                                    }
                                  : item
                              ),
                          });
                        }}
                      >
                        {products.map((product) => (
                          <Select.Option
                            key={product._id}
                            value={product._id}
                            currentPrice={product.currentPrice}
                          >
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "buyQuantity"]}
                      fieldKey={[fieldKey, "buyQuantity"]}
                      label="Quantity"
                      rules={[
                        { required: true, message: "Please enter quantity" },
                      ]}
                    >
                      <Input type="number" placeholder="Enter quantity" />
                    </Form.Item>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      style={{ marginTop: 10 }}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Add Product
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item
            name="fullName"
            label="Receiver's Name"
            rules={[
              { required: true, message: "Please enter the receiver's name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select placeholder="Select a status">
              <Select.Option value={1}>Đang xử lý</Select.Option>
              <Select.Option value={0}>Hủy</Select.Option>
              <Select.Option value={2}>Đã thanh toán</Select.Option>
              <Select.Option value={3}>Giao hàng thành công</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {isEdit ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this order?</p>
      </Modal>
    </>
  );
};

export default AOrder;
