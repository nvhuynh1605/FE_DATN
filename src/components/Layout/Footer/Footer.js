import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdEmail, MdLocalPhone } from "react-icons/md";
import { ICLogo } from "../../../assets/icons/ICLogo";

function Footer() {
  return (
    <div className="flex flex-col w-[1240px] mx-auto bg-white py-4">
      <div className="flex flex-row">
        <div className="flex flex-col gap-2 w-1/3 p-4">
          <Link to={"/"} className="flex justify-center">
            <ICLogo fillColor="red" width="300" height="70" />
          </Link>
          <div className="mt-3">55 Giải Phóng, Hai Bà Trưng, Hà Nội</div>
          <div>
            Nơi hội tụ những cuốn sách hay nhất dành cho bạn. Khám phá thế giới
            tri thức và cảm hứng qua từng trang sách.<br/><br/>
            Hỗ trợ 24/7 qua hotline: <p className="text-blue-400">+84 123 456 789</p>
          </div>
        </div>
        <div className="flex flex-1 flex-row gap-3 p-4">
          <div className="w-1/3">
            <p className="font-medium text-lg mb-2">DỊCH VỤ</p>
            <div className="flex flex-col gap-3">
              <Link>Giới thiệu</Link>
              <Link to={"/news"}>Tin Tức</Link>
              <Link>Điều khoản sử dụng</Link>
              <Link>Chính sách bảo mật thông tin cá nhân</Link>
              <Link>Chính sách bảo mật thanh toán</Link>
            </div>
          </div>
          <div className="w-1/3">
            <p className="font-medium text-lg mb-2">Liên hệ</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-1 items-center">
                <MdLocationOn />
                55 Giải Phóng, Hai Bà Trưng, Hà Nội
              </div>
              <div className="flex flex-row gap-1 items-center">
                <MdEmail />
                cskh@gmail.com.vn
              </div>
              <div className="flex flex-row gap-1 items-center">
                <MdLocalPhone />
                1900636467
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <p className="font-medium text-lg mb-2">Tài khoản của tôi</p>
            <div className="flex flex-col gap-3">
              <Link>Chi tiết tài khoản</Link>
              <Link>Lịch sử mua hàng</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">@2024</div>
    </div>
  );
}

export default Footer;
