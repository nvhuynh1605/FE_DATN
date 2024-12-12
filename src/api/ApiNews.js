import axios from "axios";

const GetAllNews = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/news");
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

const CreateNews = async (newsData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/news",
      newsData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

const UpdateNews = async (newsId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/news/${newsId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

const DeleteNews = async (newsId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/news/${newsId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

const searchNews = async (query) => {
  try {
    const response = await axios.get("http://localhost:3001/api/news/search", {
      params: { query },
    });
    return response.data; // Kết quả danh mục
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error.message);
  }
};

export { GetAllNews, CreateNews, UpdateNews, DeleteNews, searchNews};
