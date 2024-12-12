import axios from "axios";

export const feedbackApi = {
  createFeedback: async (feedbackData) => {
    try {
      const response = await axios.post("http://localhost:3001/api/feedback", feedbackData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create feedback");
    }
  },
};

export const getFeedbacksByUserId = async (userId) => {
  try {
      const response = await axios.get(`http://localhost:3001/api/feedback/user/${userId}`);
      return response.data; // Trả về dữ liệu feedbacks
  } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
  }
};

const GetAllFeedback = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/feedback");
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
};

const CreateFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/feedback",
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

const UpdateFeedback = async (feedbackId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/feedback/${feedbackId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

const DeleteFeedback = async (feedbackId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/api/feedback/${feedbackId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

export { GetAllFeedback, CreateFeedback, UpdateFeedback, DeleteFeedback};
