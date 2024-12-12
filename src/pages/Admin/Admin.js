import React, { useEffect, useState } from "react";
import axios from "axios";
import { OrderPieChart } from "../../components/Charts/PieChart";
import { SimpleBarChart } from "../../components/Charts/SimpleBarChart";
import { SimpleLineChart } from "../../components/Charts/SimpleLineChart";
import { formatVND } from "../../utils/common";

function Admin() {
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalAmount: 0,
    currentMonthTotalAmount: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/statistics"
        ); // Assuming API endpoint for statistics
        setStatistics(response.data); // Assuming response contains the necessary data
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="text-2xl font-bold">Thống kê</div>
      {/* Section 1: Total Products and Orders */}
      <div className="w-full flex flex-row gap-4">
        <div className="w-1/4 bg-white p-4 rounded-xl min-h-[120px]">
          <div className="text-xl font-semibold">Tổng Sản Phẩm</div>
          <div className="text-lg mt-2">{statistics?.totalProducts}</div>
        </div>
        <div className="w-1/4 bg-white p-4 rounded-xl">
          <div className="text-xl font-semibold">Tổng Đơn Hàng</div>
          <div className="text-lg mt-2">{statistics?.totalOrders}</div>
        </div>
        <div className="w-1/4 bg-white p-4 rounded-xl">
          <div className="text-xl font-semibold">Tổng Số Tiền </div>
          <div className="text-lg mt-2">
            {formatVND(statistics?.totalAmount)} VNĐ
          </div>
        </div>
        <div className="w-1/4 bg-white p-4 rounded-xl">
          <div className="text-xl font-semibold">Số Tiền Tháng</div>
          <div className="text-lg mt-2">
            {formatVND(statistics?.currentMonthTotalAmount)} VNĐ
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-row gap-4 w-full">
        <div className="w-8/12 bg-white p-4 rounded-xl">
          <div className="mb-4 underline">Thống kê đơn hàng</div>
          <SimpleLineChart />
        </div>
        <div className="w-4/12 bg-white p-4 rounded-xl">
          <OrderPieChart />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="w-8/12 bg-white p-4 rounded-xl">
          <div className="mb-4 underline">Thống kê doanh thu tháng</div>
          <SimpleBarChart />
        </div>
        {/* <div className="w-4/12 bg-white p-4 rounded-xl">
          <OrderPieChart />
        </div> */}
      </div>
    </div>
  );
}

export default Admin;
