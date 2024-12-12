import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb, message } from "antd";
import { formatVND } from "../../utils/common";
import { GetProductById } from "../../api/ApiProduct";
import { BsCart3 } from "react-icons/bs";
import ModalCheckout from "../../components/ModalCheckout/ModalCheckout";
import { SlideProduct } from "../../components/SlideProduct/SlideProduct";
import Comment from "../../components/Comment/Comment";

function ProductDetail() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productData, setProductData] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    const loadProduct = async () => {
      const data = await GetProductById(id);
      setProductData(data);
    };

    if (id) {
      loadProduct();
    }
  }, [id]);


  const addProductIdToCart = (newProductId) => {
    // Get productIds array from localStorage
    const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
    
    // Check if the product is already in the array
    if (!productIds.includes(newProductId)) {
      // If not, add the product to the array
      productIds.push(newProductId);
      
      // Update the array in localStorage
      localStorage.setItem("productIds", JSON.stringify(productIds));
      message.success(`Product has been added to cart.`);
    } else {
      message.warning(`Product already exists.`);
    }
  };

  const refreshProductData = async () => {
    if (id) {
      const updatedData = await GetProductById(id);
      setProductData(updatedData);
    }
  };
  
  return (
    <div className="max-w-[1240px] mx-auto my-8">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: 'Home',
            href: '/home'
          },
          {
            title: productData?.category_id?.name,
            href: `/category?tab=${productData?.category_id?._id}`,
          },
          {
            title: <p className="max-w-[240px] line-clamp-1">{productData?.name}</p>,
          },
        ]}
      />
      <div className="flex flex-row max-w-[1240px] mx-auto my-8 bg-white p-4 rounded-xl">
        <div className="flex flex-col max-h-[400px] justify-start items-center w-2/5">
          <div className="w-2/3">
            <img
              src={productData?.image_url}
              alt="pr1"
              className="w-[320px] h-[320px]"
            />
          </div>
          <div className="w-full flex gap-2 justify-between mt-4 px-8 font-semibold">
            <button
              className="w-1/2 bg-blue-500 p-2 text-white rounded-lg"
              onClick={showModal}
              disabled={productData?.quantity === 0}
            >
              Mua ngay
            </button>
            <ModalCheckout
              isVisible={isModalVisible}
              onClose={closeModal}
              defaultMethod="cod"
              productData={productData}
              onOrderSuccess={refreshProductData}
            />
            <button
              disabled={productData?.quantity === 0}
              className="flex gap-2 justify-center items-center w-1/2 border-2 border-blue-500 text-blue-500 rounded-lg"
              onClick={() => addProductIdToCart(productData?._id)}
            >
              <BsCart3 />
              <div>Thêm vào giỏ hàng</div>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-3/5">
          <div className="text-2xl font-semibold">{productData?.name}</div>
          <div>Tác giả: {productData?.author}</div>
          {productData?.publishingHouse && <div>Nhà xuất bản: {productData?.publishingHouse}</div>}
          <div>Thể loại: {productData?.category_id?.name}</div>
          <div className="flex flex-row">
            <div className="pr-3">Số lượng: {productData?.quantity}</div>
            <div>Đã bán: {productData?.sold}</div>
          </div>
          <div className="flex flex-row gap-3 items-center my-4">
            <div className="text-3xl font-semibold text-red-600">
              {formatVND(productData?.currentPrice)}
            </div>
            <div className="text-xl font-semibold text-gray-400 line-through">
              {formatVND(productData?.price)}
            </div>
            <div>-{productData?.sale}%</div>
          </div>
          <div className="text-xl font-semibold">Mô tả sản phẩm</div>
          <div dangerouslySetInnerHTML={{ __html: productData?.des }} />
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto">
        <h1 className="font-semibold text-xl mb-2">Gợi ý cho bạn</h1>
        <SlideProduct suggest={true}/>
      </div>
      <div className="max-w-[1240px] mx-auto mt-8">
        <h1 className="font-semibold text-xl mb-2">Bình luận</h1>
        <Comment productId={productData?._id} />
      </div>
    </div>
  );
}

export default ProductDetail;
