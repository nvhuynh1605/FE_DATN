import React, { useState, useEffect } from "react";
import { Button, Input, Modal, notification, Table, Tag } from "antd";
import { fetchOrdersByUserId, SearchOrder, updateOrder } from "../../api/ApiOrder";
import { formatVND } from "../../utils/common";
import { CiTrash } from "react-icons/ci";

const { Search } = Input;

const columns = (showDeleteConfirm) => [
  {
    title: "Action",
    width: 100,
    render: (_, record) => (
      <>
        {record?.status === 1 && (
          <Button type="link" danger onClick={() => showDeleteConfirm(record)}>
            <CiTrash className="text-lg" />
          </Button>
        )}
      </>
    ),
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
    title: "Name",
    dataIndex: "products",
    key: "name",
    render: (products) =>
      products?.map((product, index) => (
        <div key={index} className="line-clamp-1">
          {product?.name}
        </div>
      )),
  },
  {
    title: "Total",
    dataIndex: "amount",
    key: "total",
    width: 150,
    render: (total) => formatVND(total),
  },
  {
    title: "Receiver",
    dataIndex: "fullName",
    key: "fullName",
    width: 200,
    render: (fullName) => <div className="line-clamp-2">{fullName}</div>
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
    key: "address",
    width: 250,
    render: (address) => <div className="line-clamp-2">{address}</div>
  },
  {
    title: "Order date",
    dataIndex: "orderDate",
    key: "orderDate",
    render: (text) => new Date(text).toLocaleString(),
  },
];
const TableOrder = () => {
  const [data, setData] = useState([]);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const userId = localStorage.getItem("userId");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrdersByUserId(userId);
        setData(data.reverse());
      } catch (err) {
        console.log(err.response?.data?.message || "Failed to fetch orders");
      }
    };

    getOrders();
  }, [userId]);

  const handleFetchOrder = async (query = "") => {
    try {
      
      let data;
      if (!query) {
        data = await fetchOrdersByUserId(userId);
      } else {
        data = await SearchOrder(query, String(userId));
      }
      setData(data.reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleFetchOrder(query);
  };

  const showDeleteConfirm = (record) => {
    setCurrentRecord(record);
    setIsDeleteConfirmVisible(true);
  };

  const handleCancel = async () => {
    try {
      // Call the API to update the order status to canceled (status = 0)
      await updateOrder(currentRecord._id, { status: 0 });
      notification.success({ message: "Order canceled successfully" });
      
      // Refresh the data after updating
      const data = await fetchOrdersByUserId(userId);
      setData(data.reverse());
    } catch (error) {
      notification.error({ message: "Failed to cancel order" });
    }
    setIsDeleteConfirmVisible(false);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    console.log("Pagination changed:", pagination);
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <Search
        placeholder="Search orders"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />

      {/* Bảng dữ liệu */}
      <Table
        columns={columns(showDeleteConfirm)}
        dataSource={data}
        scroll={{ x: 1500, y: 500 }}
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
        title="Confirm Cancellation"
        open={isDeleteConfirmVisible}
        onOk={handleCancel} // Call handleCancel instead of handleDelete
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Cancel Order"
        okButtonProps={{ danger: true }}
        cancelText="Back"
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
    </div>
  );
};

export default TableOrder;
