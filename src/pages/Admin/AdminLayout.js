// AdminLayout.js
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  ShopOutlined,
  UserOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { TbCategory } from "react-icons/tb";
import { ICAdminLogo } from "../../assets/icons/ICAdminLogo";
import { MdLogout } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdOutlineFeedback, MdOutlineCommentBank  } from "react-icons/md";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sider collapsible>
      <div className="flex justify-center text-center"><ICAdminLogo width="100" height="80" /></div>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="product" icon={<ShopOutlined />}>
          <Link to="/admin/product">Product</Link>
        </Menu.Item>
        <Menu.Item key="category" icon={<TbCategory />}>
          <Link to="/admin/category">Category</Link>
        </Menu.Item>
        <Menu.Item key="user" icon={<UserOutlined />}>
          <Link to="/admin/user">User</Link>
        </Menu.Item>
        <Menu.Item key="order" icon={<OrderedListOutlined />}>
          <Link to="/admin/order">Order</Link>
        </Menu.Item>
        <Menu.Item key="news" icon={<IoNewspaperOutline />}>
          <Link to="/admin/news">News</Link>
        </Menu.Item>
        <Menu.Item key="feedback" icon={<MdOutlineFeedback />}>
          <Link to="/admin/feedback">Feedback</Link>
        </Menu.Item>
        <Menu.Item key="comment" icon={<MdOutlineCommentBank />}>
          <Link to="/admin/comment">Comment</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header style={{ background: "#fff", padding: 0 }} >
        <div className="flex gap-4 justify-end items-center h-full mr-10">
          <div>
            <IoMdNotificationsOutline className="text-2xl"/>
          </div>
          <div>
            <MdLogout className="text-2xl"/>
          </div>
        </div>
      </Header>
      <Content style={{ margin: "24px 16px 0" }}>
        <div style={{ padding: 24, minHeight: 360 }}>
          <div>{children}</div>
        </div>
      </Content>
    </Layout>
  </Layout>
);

export default AdminLayout;
