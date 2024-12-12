import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const SimpleLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API lấy dữ liệu thống kê
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/orders/statistics"); // Đường dẫn API backend
        setData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};