import React, { useEffect, useState, useCallback   } from "react";
import { Tabs, Select, Pagination } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { GetAllCategory } from "../../../api/ApiCategory";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { GetProductByCategoryId } from "../../../api/ApiProduct";

const { Option } = Select;

const TabContent = ({ dataCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedProducts, setPaginatedProducts] = useState([]);


  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetProductByCategoryId(dataCategory?.id);
      setProducts(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [dataCategory?.id]);

  const sortItems = (order) => {
    const sortedItems = [...products].sort((a, b) => {
      if (order === "asc") return a?.currentPrice - b?.currentPrice;
      if (order === "desc") return b?.currentPrice - a?.currentPrice;
      return 0;
    });
    setProducts(sortedItems);
  };

  useEffect(() => {
    // Lấy sản phẩm theo trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [products, currentPage, pageSize]);

  useEffect(() => {
    if (sortOrder) {
      sortItems(sortOrder);
    }
  });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <Select
        placeholder="Sắp xếp theo "
        style={{ maxWidth: 200, marginBottom: 10 }}
        onChange={(value) => setSortOrder(value)}
      >
        <Option value="asc">Giá: tăng dần</Option>
        <Option value="desc">Giá: giảm dần</Option>
      </Select>
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
  );
};

const CategoryTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [listCategory, setListCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetAllCategory();
        setListCategory(data);
      } catch (err) {
        console.log("Failed to fetch categories", err.message);
      }
    };

    fetchCategories();
  }, []);

  const items = listCategory.map((category) => ({
    key: category?._id,
    label: category?.name,
    children: (
      <TabContent
        dataCategory={{
          title: category?.name,
          description: `Content of ${category?.name}`,
          id: category?._id,
        }}
      />
    ),
  }));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(listCategory[0]?._id)
    }
  }, [location.search, listCategory]);

  const onChange = (key) => {
    setActiveTab(key);
    navigate(`?tab=${key}`, { replace: true });
  };

  return (
    <div className="bg-white p-4">
      <Tabs
        className="font-bold"
        activeKey={activeTab}
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

export default CategoryTabs;
