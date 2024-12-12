import { Link } from "react-router-dom";
import { formatVND } from "../../utils/common";

function ProductCard({ product }) {
  return (
    <Link to={`/product-detail?id=${product?._id}`} className="max-w-[235px]">
      <div className="flex flex-col items-center max-w-[235px] p-3 border border-gray-200 rounded-lg group">
        <div className="overflow-hidden">
          <img
            src={product?.image_url}
            alt={product?.name}
            className="w-[200px] h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col !items-start w-full pt-3 pb-4">
          <div className="max-w-[200px] line-clamp-2 min-h-[48px] !text-base font-normal !text-black">
            {product?.name}
          </div>
          <div className="flex flex-row font-semibold text-red-600 text-lg">
            {formatVND(product?.currentPrice)}
            <div className="ml-2 bg-red-600 text-white px-1 text-base rounded-lg">
              -{product?.sale}%
            </div>
          </div>
          <div className="text-gray-400 line-through">{formatVND(product?.price)}</div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
