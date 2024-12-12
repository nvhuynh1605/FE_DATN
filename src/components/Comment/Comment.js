import { Button, Input, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import LoginForm from "../Layout/Header/User/login";
import RegisterForm from "../Layout/Header/User/register";
import { CreateComment, GetCommnentByProductID } from "../../api/ApiComment";

function Comment({ productId }) {
  const userId = localStorage.getItem("userId");
  const [comments, setComments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState("login");
  const [commentText, setCommentText] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
  };

  const switchToRegister = () => {
    setCurrentForm("register");
  };

  const switchToLogin = () => {
    setCurrentForm("login");
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const data = await GetCommnentByProductID(productId);
        setComments(data.reverse());
      } catch (err) {
        console.log("Hiện chưa có bình luận nào cho sản phẩm này");
      }
    };
    fetchComment();
  }, [productId]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return; // Prevent empty comments
    const commentData = {product: productId, userId: userId, content: commentText}
    try {
      await CreateComment(commentData); // Assuming PostComment is the API call to post a comment
      const updatedComment = await GetCommnentByProductID(productId);
      setComments(updatedComment.reverse())
      setCommentText(""); // Clear the comment input after submission
    } catch (err) {
      message.error("Không thể gửi bình luận, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex bg-white min-h-[300px] p-3 flex-col">
      {userId ? (
        <div className="w-full flex flex-col">
          {comments.length > 0 ? (
            <div className="flex h-[220px] w-full overflow-auto flex-col flex-grow">
              {comments.map((comment, index) => (
                <div key={index} className="p-4 flex flex-row justify-between">
                  <div className="flex flex-row gap-2">
                    <img
                      src={comment?.user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSILPqTXqLj8vJ9ePsxBrkRz4k0w7IPzOCiPA&s"}
                      alt="ava"
                      className="w-[40px] h-[40px] object-cover rounded-full"
                    />
                    <div className="font-semibold">
                      {comment?.user?.username}:
                    </div>
                    <div className="max-w-[400px]">{comment?.content}</div>
                  </div>
                  <div>{new Date(comment?.createdAt).toLocaleString("vi-VN")}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[220px] flex justify-center">Hiện chưa có bình luận nào cho sản phẩm</div>
          )}
          {/* Comment input field */}
          <div className="mt-auto flex flex-row gap-2">
            <Input
              value={commentText}
              onChange={handleCommentChange}
              placeholder="Viết bình luận của bạn..."
            />
            <Button
              type="primary"
              className="mt-2"
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              Gửi Bình Luận
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-center w-full h-full">
          Vui lòng&nbsp;
          <p onClick={showModal} className="text-blue-600 cursor-pointer">
            đăng nhập
          </p>
          &nbsp;để xem và gửi bình luận
          <Modal
            open={isModalVisible}
            onCancel={handleCancel}
            width={550}
            footer={null}
            maskClosable={true}
            getContainer={false}
            bodyStyle={{ overflow: "auto" }}
          >
            {currentForm === "login" ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={switchToRegister}
              />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Comment;
