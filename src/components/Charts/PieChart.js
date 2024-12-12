import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Color mapping for each status
const STATUS_COLORS = {
  "Đã hủy": "#FF8042", // Light red for "Đã hủy"
  "Đang xử lý": "#FFBB28", // Blue for "Đang xử lý"
  "Đã thanh toán": "#0088FE", // Dark blue for "Đã thanh toán"
  "Đã giao hàng": "#00C49F", // Green for "Đã giá hàng"
};

export const OrderPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/orders/status-statistics");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count" // Value for the size
          nameKey="status" // Value for the name
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label // Display labels
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status] || "#CCCCCC"} />
          ))}
        </Pie>
        <Tooltip /> {/* Tooltip on hover */}
        <Legend /> {/* Display legend */}
      </PieChart>
    </ResponsiveContainer>
  );
};
