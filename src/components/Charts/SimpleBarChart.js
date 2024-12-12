// import "./styles.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Rectangle,
  ResponsiveContainer,
} from "recharts";


export function SimpleBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/income-stats');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching income stats:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalIncome" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}