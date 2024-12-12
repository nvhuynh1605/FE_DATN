import React, { useState, useEffect } from "react";
import { Checkbox, Input, Button, Breadcrumb } from "antd";
import { GetProductById } from "../../api/ApiProduct";
import { CiTrash } from "react-icons/ci";
import { formatVND } from "../../utils/common";
import ModalCheckout from "../../components/ModalCheckout/ModalCheckout";

const Cart = () => {
  // State để lưu các sản phẩm đã chọn và số lượng của từng sản phẩm
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getProducts = async () => {
      const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
      const fetchedProducts = [];
      for (const id of productIds) {
        const product = await GetProductById(id);
        fetchedProducts.push(product);
      }
      setProducts(fetchedProducts);
    };

    getProducts();
  }, []);

  const totalAmount = selectedProducts.reduce((total, product) => {
    return total + product?.currentPrice * product?.buyQuantity;
  }, 0);

  // Hàm để xử lý thay đổi khi chọn checkbox
  const handleCheckboxChange = (e, productId) => {
    if (e.target.checked) {
      // Thêm sản phẩm vào danh sách đã chọn
      setSelectedProducts((prev) => [
        ...prev,
        { ...products.find((p) => p?._id === productId), buyQuantity: 1 },
      ]);
    } else {
      // Loại bỏ sản phẩm khỏi danh sách đã chọn
      setSelectedProducts((prev) =>
        prev.filter((product) => product?._id !== productId)
      );
    }
  };

  // Hàm để xử lý thay đổi số lượng
  const handleQuantityChange = (e, productId) => {
    const newQuantity = e.target.value;
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product?._id === productId
          ? { ...product, buyQuantity: newQuantity }
          : product
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    // Remove productId from localStorage
    const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
    const updatedProductIds = productIds.filter((id) => id !== productId);
    localStorage.setItem("productIds", JSON.stringify(updatedProductIds));

    // Remove product from products and selectedProducts state
    setProducts((prev) => prev.filter((product) => product?._id !== productId));
    setSelectedProducts((prev) =>
      prev.filter((product) => product?._id !== productId)
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto mt-8">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Trang chủ",
            href: "/home",
          },
          {
            title: "Giỏ hàng",
          },
        ]}
      />
      <div className="max-w-[1240px] mx-auto mt-8 bg-white py-4">
        <h3 className="mb-3 pl-3 text-lg font-medium">
          Giỏ hàng ({products?.length} sản phẩm)
        </h3>
        <div className="flex flex-row gap-4 px-4">
          <div className="flex flex-col w-3/4">
            {products.map((product) => (
              <div
                className="flex flex-row justify-between items-center py-4"
                span={8}
                key={product?._id}
              >
                <Checkbox
                  onChange={(e) => handleCheckboxChange(e, product?._id)}
                ></Checkbox>
                <div className="flex w-3/5 flex-row">
                  <img
                    src={product?.image_url}
                    alt="product"
                    className="w-[120px] h-[120px] object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <div className="max-w-[400px]">{product?.name}</div>
                    <div>{product?.currentPrice}</div>
                  </div>
                </div>
                <Input
                  className="max-w-[80px] max-h-[30px]"
                  type="number"
                  value={
                    selectedProducts.find((p) => p?._id === product?._id)
                      ?.buyQuantity || 1
                  }
                  min={1}
                  onChange={(e) => handleQuantityChange(e, product?._id)}
                  disabled={
                    !selectedProducts.some((p) => p?._id === product?._id)
                  }
                />
                <div className="min-w-[80px] text-center">
                  {Number(product?.currentPrice) *
                    (parseInt(
                      selectedProducts.find((p) => p?._id === product?._id)
                        ?.buyQuantity,
                      10
                    ) || 1)}
                </div>
                <Button
                  danger
                  type="link"
                  onClick={() => handleDeleteProduct(product?._id)}
                >
                  <CiTrash className="text-xl" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2 p-3 w-full">
            <div className="flex flex-row justify-between mb-6 items-center">
              <p className="text-lg font-semibold">Tổng tiền:</p>
              <p className="text-2xl font-bold text-red-500">
                {formatVND(totalAmount)}
              </p>
            </div>
            <Button
              type="primary"
              onClick={showModal}
              disabled={selectedProducts.length === 0}
              className="w-full !p-5"
            >
              <p className="text-xl font-semibold">Thanh toán</p>
            </Button>
            <ModalCheckout
              isVisible={isModalVisible}
              onClose={closeModal}
              defaultMethod="cod"
              productData={selectedProducts}
              type="cart"
            />
            {selectedProducts.length === 0 && (
              <div className="text-sm text-red-500 text-center">
                (Vui lòng chọn sản phẩm để thanh toán)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
