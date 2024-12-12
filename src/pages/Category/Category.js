import { Breadcrumb } from "antd";
import CategoryTabs from "./CategoryTabs/CategoryTabs";

function Category() {
  return (
    <div className="max-w-[1240px] mx-auto mt-8">
      <Breadcrumb
        separator=">"
        items={[
          {
            title: 'Trang chủ',
            href: '/home'
          },
          {
            title: 'Danh mục',
          },
        ]}
      />
      <div className="max-w-[1240px] mx-auto mt-8">
        <CategoryTabs />
      </div>
    </div>
  );
}

export default Category;
