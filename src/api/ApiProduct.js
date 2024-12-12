import axios from "axios";

const GetAllProduct = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const GetProductByCategoryId = async (category_id) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/products/category/${category_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Let the caller handle the error
  }
}

const GetProductById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

const CreateProduct = async (productData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/products",
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const UpdateProduct = async (productId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/products/${productId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const DeleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const fetchSearchResults = async (searchKey) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/products/search?query=${searchKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error occurred while fetching products: " + error.message);
  }
};

export const fetchSearchProducts = async (query = "") => {
  try {
    const response = await axios.get(`http://localhost:3001/api/products/admin/search`, {
      params: { query },
    });
    return response.data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};

export {
  GetAllProduct,
  GetProductByCategoryId,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  fetchSearchResults,
};
