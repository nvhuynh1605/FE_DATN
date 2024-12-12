import axios from "axios";
import { message } from "antd";

async function GetUserById(userId) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const GetAllUser = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const UpdateUser = async (id, userData) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/user/update/${id}`, userData);
    return response.data; // Trả về dữ liệu nếu thành công
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      message.error(errorMessage); // Hiển thị thông báo lỗi từ backend
      throw new Error(errorMessage); // Ném lỗi để xử lý ở nơi gọi API
    } else {
      const errorMessage = "Something went wrong, please try again.";
      message.error(errorMessage); // Hiển thị lỗi chung
      throw new Error(errorMessage); // Ném lỗi chung
    }
  }
};

// Xóa người dùng
export const DeleteUser = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/user/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const AddUser = async (newUser) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/user/register`, newUser);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

const searchUser = async (query) => {
  try {
    const response = await axios.get("http://localhost:3001/api/user/search", {
      params: { query },
    });
    return response.data; // Kết quả danh mục
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error.message);
  }
};


export { GetUserById, GetAllUser, searchUser };
