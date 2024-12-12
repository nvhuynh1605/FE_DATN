import axios from "axios";

async function GetAllOrder() {
  try {
    const response = await axios.get("http://localhost:3001/api/order");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const createOrderCOD = async (orderData) => {
  try {
    const response = await axios.post("http://localhost:3001/api/order", {
      products: orderData.products,
      amount: orderData.amount,
      status: 1, // Set status to 'COD' for Cash on Delivery
      fullName: orderData.fullName,
      address: orderData.address,
      note: orderData.note,
      phoneNum: orderData.phoneNum,
      orderDate: orderData.orderDate || Date.now(),
      userId: orderData.userId,
      product_id: orderData._id,
    });

    return response.data; // Return the created order response
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchOrdersByUserId = async (userId) => {
  try {
      const response = await axios.get(`http://localhost:3001/api/order/user/${userId}`);
      return response.data; // Trả về danh sách đơn hàng
  } catch (error) {
      console.error('Error fetching orders:', error);
      throw error; // Throw lỗi để xử lý ở component
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post("http://localhost:3001/api/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
};

// Update an order
export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/order/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error.message);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};

export const getBestSelling = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/top-selling-products");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const getTopWeeek = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/top-week");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const SearchOrder = async (query = "", userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/order/search`, {
      params: { query, userId },
    });
    return response.data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};

export { GetAllOrder, createOrderCOD };