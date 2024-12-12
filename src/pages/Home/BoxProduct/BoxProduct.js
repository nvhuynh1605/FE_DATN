import React, {useState, useEffect, useCallback} from "react";
import { SlideProduct } from "../../../components/SlideProduct/SlideProduct";
import TitleSection from "../../../components/TitleSection/TitleSection";
import { GetProductByCategoryId } from "../../../api/ApiProduct";

function BoxProduct({ dataCategory }) {
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetProductByCategoryId(dataCategory?._id);
      setListProduct(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [dataCategory?._id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    listProduct.length !== 0 && (
      <div className="w-[1240px] mt-10 mx-auto">
        <TitleSection title={dataCategory?.name} dataCategory={dataCategory} />
        <SlideProduct dataCategory={dataCategory} />
      </div>
    )
  );
}

export default BoxProduct;
