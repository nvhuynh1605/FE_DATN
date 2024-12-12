import { Breadcrumb } from "antd";
import TableOrder from "./TableOrder";

function OrderHistory() {
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
            title: "Lịch sử mua hàng",
          },
        ]}
      />
      <div className="max-w-[1240px] mx-auto mt-8">
        <TableOrder />
      </div>
    </div>
  );
}

export default OrderHistory;
