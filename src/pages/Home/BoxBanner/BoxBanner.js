import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/scrollbar';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from 'swiper/modules';
import banner1 from "../../../assets/images/banner3.png"
import banner2 from "../../../assets/images/banner4.png"

function BoxBanner() {
    const banners = [
        {
            src: banner1
        },
        {
            src: banner2
        }
    ]
    return (
        <div>
            <Swiper
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              spaceBetween={10}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
              {banners.map((val, index) => (
                <SwiperSlide hidden key={index}>
                  <div className="w-[1240px] aspect-[5/2] justify-center mx-auto items-center flex mt-10">
                    <img
                        src={val.src}
                        width={1000}
                        height={200}
                        alt="Banner"
                        className="!w-full object-cover !h-full rounded-md sm:rounded-none"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
        </div>
      );
}

export default BoxBanner;
