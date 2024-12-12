import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Select, Pagination, Breadcrumb } from 'antd';
import { fetchSearchResults } from "../../api/ApiProduct";
import ProductCard from "../../components/ProductCard/ProductCard";

const { Option } = Select;

function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchKey = searchParams.get("key"); // Get value from query
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setSortOrder] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [paginatedProducts, setPaginatedProducts] = useState([]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (!searchKey) return;

      setLoading(true);
      try {
        const data = await fetchSearchResults(searchKey);
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [searchKey]);

  useEffect(() => {
    // Lấy sản phẩm theo trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage, pageSize]);

  const sortProducts = (order) => {
    const sortedProducts = [...products].sort((a, b) => {
      if (order === "asc") {
        return a?.currentPrice - b?.currentPrice;
      } else if (order === "desc") {
        return b?.currentPrice - a?.currentPrice;
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="max-w-[1240px] mx-auto mt-8">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: 'Trang chủ',
            href: '/home'
          },
          {
            title: 'Tìm kiếm',
          },
        ]}
      />
      <div className="xl:max-w-[1240px] mx-auto mt-8 bg-white p-3">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg">Search Results for {`"${searchKey}"`}</p>
          <Select
            placeholder="Sắp xếp theo "
            style={{ width: 200 }}
            onChange={(value) => {
              setSortOrder(value);
              sortProducts(value);
            }}
          >
            <Option value="asc">Giá: tăng dần</Option>
            <Option value="desc">Giá: giảm dần</Option>
          </Select>
        </div>
        {loading && <Spin indicator={<LoadingOutlined spin />} size="large" />}
        {error && <p>{error}</p>}
        <div className="flex flex-wrap gap-3 items-center">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div key={product?._id} className="w-[220px]">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
        <div className="w-full flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={handlePageChange}
            // showSizeChanger
            // pageSizeOptions={["5", "10", "20"]}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
