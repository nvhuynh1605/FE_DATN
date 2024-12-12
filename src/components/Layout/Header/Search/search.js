import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "antd";
import { ICSearch } from "../../../../assets/icons/ICSearch";

function Search() {
  const [searchKey, setSearchKey] = useState(""); // Lưu giá trị input
  const [options, setOptions] = useState([]); // Gợi ý từ khóa
  const navigate = useNavigate(); // Hook để điều hướng

  const handleSearch = () => {
    if (searchKey.trim() !== "") {
      navigate(`/search?key=${encodeURIComponent(searchKey.trim())}`);
      setSearchKey(""); // Clear input field after search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = async (value) => {
    setSearchKey(value); // Cập nhật giá trị input
    if (value.trim() === "") {
      setOptions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/products/search?query=${encodeURIComponent(value)}`);
      const data = await response.json();

      // Chuyển đổi dữ liệu thành định dạng phù hợp cho AutoComplete
      const suggestions = data.map((item) => ({
        value: item.name, // Gợi ý hiển thị tên
        label: item.name,
        id: item._id, // Lưu id sản phẩm
      }));
      setOptions(suggestions);
    } catch (error) {
      setOptions([]);
    }
  };

  const handleSelect = (value, option) => {
    // Khi chọn, điền vào input và điều hướng
    setSearchKey(""); // Clear input field after selection
    navigate(`/product-detail?id=${option.id}`); // Điều hướng đến trang chi tiết
  };

  return (
    <div className="flex w-1/2 relative">
      <AutoComplete
        className="w-full"
        options={options}
        value={searchKey}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect} // Điền giá trị và điều hướng
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <ICSearch />
          </div>
          <input
            className="w-full h-8 outline-none rounded-md pl-8"
            placeholder="Nhập để tìm kiếm"
          />
        </div>
      </AutoComplete>
      <button
        className="flex items-center absolute h-6 p-1 top-1 right-1 bg-gradient-to-b from-[#003FA4] to-[#002868] text-white text-sm px-2"
        onClick={handleSearch}
      >
        Tìm kiếm
      </button>
    </div>
  );
}

export default Search;
