import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { GetAllProduct, GetProductByCategoryId } from "../../api/ApiProduct"; // Ensure the API function path is correct
import ProductCard from "../ProductCard/ProductCard";

const SlideProduct = ({ dataCategory, suggest }) => {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on suggest value
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading while fetching
      if (suggest) {
        try {
          const data = await GetAllProduct();
          setProducts(data.reverse().slice(0, 8));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [suggest]);

  // Fetch products based on category when suggest is false
  useEffect(() => {
    const loadProducts = async () => {
      if (!suggest && dataCategory?._id) {
        setLoading(true); // Start loading while fetching
        try {
          const data = await GetProductByCategoryId(dataCategory._id);
          setProducts(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [dataCategory?._id, suggest]);

  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handlePrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div className="relative p-3 bg-white mb-2 rounded-lg">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={true}
        spaceBetween={8}
        slidesPerView={2.5}
        modules={[Navigation]}
        navigation={{
          nextEl: `.swiper-button-next-${dataCategory?._id}`,
          prevEl: `.swiper-button-prev-${dataCategory?._id}`,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 12,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product?._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className={`swiper-button-prev swiper-button-prev-${dataCategory?._id}`}
        onClick={handlePrevSlide}
      />
      <button
        className={`swiper-button-next swiper-button-next-${dataCategory?._id}`}
        onClick={handleNextSlide}
      />
    </div>
  );
};

export { SlideProduct };
