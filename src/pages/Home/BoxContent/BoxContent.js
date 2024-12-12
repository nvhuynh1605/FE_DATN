import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GetAllProduct, GetProductById } from "../../../api/ApiProduct"
import { getBestSelling, getTopWeeek } from "../../../api/ApiOrder";

function BoxContent() {
  const [newProduct, setNewProduct] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [topWeek, setTopWeek] = useState([]);

  //newest
  useEffect(() => {
    fetchProducts();
    fetchBestSelling();
    fetchTopWeek();
  }, []);

  const fetchProducts = async () => {
    const data = await GetAllProduct();
    setNewProduct(data.reverse()?.[0]);
  };

  const fetchBestSelling = async () => {
    const data = await getBestSelling();
    const best = await GetProductById(data?.[0]._id)
    setBestSelling(best)
  };

  const fetchTopWeek = async () => {
    const data = await getTopWeeek();
    const best = await GetProductById(data?.[0]._id)
    setTopWeek(best)
  };

  const data = [
    {
      title: "Sản phẩm mới nhất",
      name: newProduct?.name,
      img: newProduct?.image_url,
      id: newProduct?._id,
    },
    {
      title: "Gợi ý cho bạn",
      name: bestSelling?.name,
      img: bestSelling?.image_url,
      id: bestSelling?._id,
    },
    {
      title: "Bán chạy nhất",
      name: topWeek?.name,
      img: topWeek?.image_url,
      id: topWeek?._id,
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 w-[1240px] mx-auto mt-10">
      {data.map((item, index) => (
        <Link
          key={index}
          role="presentation"
          to={`/product-detail?id=${item?.id}`}
          className="bg-white rounded-lg overflow-hidden justify-between items-center drop-shadow-sm flex cursor-pointer p-4"
        >
          <div className="flex flex-col gap-3 p-2 md:p-0 text-center md:text-left">
            <div className="text-base font-medium !text-black md:!text-blue-500 line-clamp-2">
              {item.title}
            </div>
            <div className="text-sm hidden font-bold !text-black md:!line-clamp-2">
              {item.name}
            </div>
          </div>
          <div className="">
            <img
              src={item.img}
              width={1000}
              height={1000}
              alt="Banner"
              className="md:rounded-lg w-[150px] h-[150px] !object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default BoxContent;
