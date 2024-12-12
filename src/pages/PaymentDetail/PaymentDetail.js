import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SuccessImage from "../../assets/images/success-img";
import FailureImage from "../../assets/images/failure-img";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center w-[1240px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-0 w-full xl:w-10/12 pt-5 sm:pt-20 sm:pt-18 sm:pb-40">
        <div className="flex flex-col gap-8 w-full sm:w-2/5 order-2 sm:order-1 text-center sm:text-left">
          <div className="flex flex-col gap-3">
            <p className="text-3xl font-bold text-blue-900">
              Thanh toán thành công
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <Link
              to={"/"}
              className="text-center py-2.5 px-4 !bg-gradient-to-b from-[#003FA4] to-[#002868] !text-white text-base font-semibold rounded-lg"
            >
              Trang chủ
            </Link>
            <Link
              to={"/order-history"}
              className="text-center py-2.5 px-4 !bg-gradient-to-b from-[#E00D25] to-[#950A19] !text-white text-base font-semibold rounded-lg"
            >
              Lịch sử mua hàng
            </Link>
          </div>
        </div>
        <div className="relative order-1">
          <SuccessImage />
        </div>
      </div>
    </div>
  );
}

function PaymentFailure() {
  return (
    <div className="flex flex-col items-center w-[1240px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-0 w-full xl:w-10/12 pt-5 sm:pt-20 sm:pt-18 sm:pb-40">
        <div className="flex flex-col gap-8 w-full sm:w-2/5 order-2 sm:order-1 text-center sm:text-left">
          <div className="flex flex-col gap-3">
            <p className="text-3xl font-bold text-blue-900">Thanh toán thất bại</p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <Link
              to={"/"}
              className="text-center py-2.5 px-4 !bg-gradient-to-b from-[#003FA4] to-[#002868] !text-white text-base font-semibold rounded-lg"
            >
              Trang chủ
            </Link>
            <Link
              href="/"
              className="text-center py-2.5 px-4 !bg-gradient-to-b from-[#E00D25] to-[#950A19] !text-white text-base font-semibold rounded-lg"
            >
              Trở lại
            </Link>
          </div>
        </div>
        <div className="relative order-1">
          <FailureImage />
        </div>
      </div>
    </div>
  );
}

function PaymentDetail() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const type = query.get("type");
  const paymentId = query.get("paymentId");
  const PayerID = query.get("PayerID");

  useEffect(() => {
    const executePayment = async () => {

      if (paymentId && PayerID) {
        try {
          const userId = localStorage.getItem("userId");
          const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));

          const payload = {
            paymentId,
            PayerID,
            userId,
            fullName: paymentInfo.fullName,
            address: paymentInfo.address,
            note: paymentInfo.note,
          };

          const response = await axios.get(
            "http://localhost:3001/api/execute-payment",
            {
              params: { ...payload },
            }
          );

          localStorage.removeItem("paymentInfo");

          console.log("Payment Successful:", response.data);
          message.success("Thanh toán thành công!");
        } catch (error) {
          console.error("Error executing payment:", error);
        }
      }
    };

    executePayment();
  }, [paymentId, PayerID]);

  return (
    <div>{type === "success" ? <PaymentSuccess /> : <PaymentFailure />}</div>
  );
}

export default PaymentDetail;
