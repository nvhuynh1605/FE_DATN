import axios from "axios";

const GetAllComment = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/comment");
    return response.data;
  } catch (error) {
    console.error("Error fetching comment:", error);
    return [];
  }
};

const CreateComment = async (commentData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/comment",
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const UpdateComment = async (commentId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/comment/${commentId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

const DeleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/comment/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// const searchComment = async (query) => {
//   try {
//     const response = await axios.get("http://localhost:3001/api/category/search", {
//       params: { query },
//     });
//     return response.data; // Kết quả danh mục
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm:", error.message);
//   }
// };

const GetCommnentByProductID = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/comment/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Let the caller handle the error
  }
}

export { GetAllComment, CreateComment, UpdateComment, DeleteComment, GetCommnentByProductID};
