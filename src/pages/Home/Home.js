import { useState, useEffect } from "react";
import "./index.css";
import bg from "../../assets/images/home_bg.png";
import BoxBanner from "./BoxBanner/BoxBanner";
import BoxContent from "./BoxContent/BoxContent";
import BoxProduct from "./BoxProduct/BoxProduct";
import { GetAllCategory } from "../../api/ApiCategory";
import TopWeek from "./TopWeek/TopWeek";

function Home() {
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

  return (
    <div className="relative">
      <div className="w-full overflow-hidden top-0 left-0 z-0 max-h-[700px] absolute">
        <img
          className="!w-screen aspect-[2/1] overflow-hidden object-cover !h-1/2"
          src={bg}
          alt="Background Home"
          width={1920}
          height={1000}
        />
      </div>
      <div className="flex flex-col justify-center">
        <BoxBanner />
        <BoxContent />

        {/* Render BoxProduct for each category */}
        {listCategory.map((category, index) => (
          <BoxProduct key={index} dataCategory={category} />
        ))}
        <TopWeek />
      </div>
    </div>
  );
}

export default Home;
