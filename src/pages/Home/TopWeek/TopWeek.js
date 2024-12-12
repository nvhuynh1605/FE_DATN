import React, { useState, useEffect } from "react";
import { Tabs, List, Spin } from "antd";
import axios from "axios";
import { GetProductById } from "../../../api/ApiProduct";
import { formatVND } from "../../../utils/common";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const TopWeek = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Fetch danh sách sản phẩm bán chạy
  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:3001/api/top-week");
        const productsWithDetails = await Promise.all(
          data.map(async (item) => {
            const productDetails = await GetProductById(item?._id);
            return { ...item, ...productDetails }; // Gộp thông tin từ orders và product
          })
        );

        setTopProducts(productsWithDetails);

        // Set mặc định sản phẩm đầu tiên vào hoveredProduct
        if (productsWithDetails.length > 0) {
          setHoveredProduct(productsWithDetails[0]);
        }
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  return (
    <div className="flex w-[1240px] min-h-[600px] mx-auto gap-2 bg-white p-3 mt-10 rounded-lg">
      {/* Tabs bên trái */}
      <div className="flex w-[40%] border-none">
        <Tabs defaultActiveKey="1" className="w-full">
          <TabPane tab="Top Tuần" key="1">
            {loading ? (
              <Spin tip="Loading..." />
            ) : (
              <List
                bordered
                className="border-none"
                dataSource={topProducts}
                renderItem={(item, index) => (
                  <List.Item
                    onMouseEnter={() => setHoveredProduct(item)} // Hiển thị chi tiết khi hover
                    onMouseLeave={() => {}} // Giữ chi tiết khi không hover
                    style={{ borderBlockEnd: 0 }}
                    className="py-3 hover:border-r-2 hover:border-orange-500"
                  >
                    <Link
                      to={`/product-detail?id=${item?._id}`}
                      className="flex flex-row gap-2 justify-center"
                    >
                      <div className="flex items-center font-semibold px-2">
                        {`0${(index += 1)}`}
                      </div>
                      <div>
                        <img
                          src={item?.image_url}
                          alt="book"
                          className="!w-[95px] !h-[95px] object-cover max-w-[95px]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <p>{item?.productName}</p>
                        <p>{item?.author}</p>
                      </div>
                    </Link>
                  </List.Item>
                )}
              />
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* Khu vực chi tiết bên phải */}
      <div className="flex-1 mt-[60px] border-l px-4">
        {hoveredProduct ? (
          <div
            title={hoveredProduct.productName}
            className="border-none flex flex-row gap-3"
          >
            <div className="w-[240px]">
              <img
                src={hoveredProduct?.image_url}
                alt=""
                className="!w-[240px] h-[240px] object-cover max-w-none"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold">{hoveredProduct.productName}</p>
              <p>Tác giả: {hoveredProduct?.author}</p>
              <p className="mt-3 font-semibold text-xl">
                {formatVND(hoveredProduct?.currentPrice)}
              </p>
              <p className="mb-3 line-through text-gray-500">
                {formatVND(hoveredProduct?.price)}
              </p>
              <p className="font-semibold">{hoveredProduct.productName}</p>
              <div
                className="line-clamp-[9]"
                dangerouslySetInnerHTML={{
                  __html: hoveredProduct?.des || "Chưa cập nhật",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default TopWeek;
