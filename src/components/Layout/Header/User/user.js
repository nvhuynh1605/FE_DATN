import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { GoListUnordered } from "react-icons/go";
import ICDown from "../../../../assets/icons/ICDown";
import LoginForm from "./login";
import { GetUserById } from "../../../../api/ApiUser";
import RegisterForm from "./register";
import { BsCart3 } from "react-icons/bs";

const renderDropdown = (onLogoutClick) => (
  <Menu>
    <Menu.Item key={"1"}>
      <Link to={"/profile"} className="w-[200px] flex flex-row items-center text-lg gap-2">
        <IoPersonOutline />
        Thông tin cá nhân
      </Link>
    </Menu.Item>
    <Menu.Item key={"2"}>
      <Link to={"/order-history"} className="w-[200px] flex flex-row items-center text-lg gap-2">
      <GoListUnordered />
        Lịch sử mua hàng
      </Link>
    </Menu.Item>
    <Menu.Item key={"3"} onClick={onLogoutClick}>
      <div className="w-[200px] flex flex-row items-center text-lg gap-2">
        <CiLogout />
        Đăng xuất
      </div>
    </Menu.Item>
  </Menu>
);

const Login = ({ onLoginSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState("login");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  const switchToRegister = () => {
    setCurrentForm("register");
  };

  const switchToLogin = () => {
    setCurrentForm("login");
  };
  
  return (
    <div>
      <div className="text-lg font-semibold text-white cursor-pointer">
        <p onClick={showModal}>Đăng nhập</p>
      </div>
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
  );
};

const UserInfo = ({ onLogoutClick }) => {
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const data = await GetUserById(userId);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      console.log("No user ID found in localStorage.");
    }
  }, [userId]);

  return (
    <div className="flex flex-row gap-4">
      <Dropdown
        overlay={() => renderDropdown(onLogoutClick)}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <div className="flex flex-row gap-1 items-center text-base font-semibold text-white cursor-pointer">
          <div>Xin chào,{userData?.username}</div>
          <ICDown />
        </div>
      </Dropdown>
    </div>
  );
};

function User() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLogin(!!userId);
  }, []);

  const handleLoginSuccess = () => {
    setIsLogin(true);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalVisible(true); // Show confirmation modal
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLogin(false);
    setIsLogoutModalVisible(false); // Hide confirmation modal
    navigate("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false); // Hide confirmation modal without logging out
  };

  return (
    <>
      <div className="flex flex-row gap-4 items-center">
        {isLogin ? (
          <UserInfo onLogoutClick={handleLogoutClick} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
        <Link to={"/cart"} className="text-white cursor-pointer relative">
          <div className="absolute bottom-3 -right-2 bg-red-500 px-[5px] text-[10px] rounded-full">{productIds?.length}</div>
          <BsCart3 className="text-lg"/>
        </Link>
      </div>

      <Modal
        open={isLogoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        title="Confirm Logout"
        okText="Yes, log me out"
        cancelText="Cancel"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
}

export default User;
