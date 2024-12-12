import axios from "axios";

const GetAllCategory = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const CreateCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/category",
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

const UpdateCategory = async (categoryId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/category/${categoryId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

const DeleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/category/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

const searchCategory = async (query) => {
  try {
    const response = await axios.get("http://localhost:3001/api/category/search", {
      params: { query },
    });
    return response.data; // Kết quả danh mục
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error.message);
  }
};

export { GetAllCategory, CreateCategory, UpdateCategory, DeleteCategory, searchCategory };
