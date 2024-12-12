import Home from "../pages/Home/Home";
import About from "../pages/AboutUs/AboutUs";
import Category from "../pages/Category/Category";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import OrderHistory from "../pages/OrderHistory/OrderHistory";
import PaymentDetail from "../pages/PaymentDetail/PaymentDetail";
import Admin from "../pages/Admin/Admin";
import AProduct from "../pages/Admin/AProduct";
import ACategory from "../pages/Admin/ACategory";
import SearchPage from "../pages/SearchPage/SearchPage";
import Profile from "../pages/Profile/Profile";
import AUser from "../pages/Admin/AUser";
import Cart from "../pages/Cart/Cart";
import News from "../pages/News/News";
import AOrder from "../pages/Admin/AOrder";
import NewsDetail from "../pages/NewsDetail/NewsDetail";
import AComment from "../pages/Admin/AComment";
import AFeedback from "../pages/Admin/AFeedback";
import ANews from "../pages/Admin/ANews";

const routes = [
    {path: "/", component: Home},
    {path: "/home", component: Home},
    {path: "/about", component: About},
    {path: "/category", component: Category},
    {path: "/product-detail", component: ProductDetail},
    {path: "/order-history", component: OrderHistory},
    {path: "/payment-detail", component: PaymentDetail},
    {path: "/search", component: SearchPage},
    {path: "/profile", component: Profile},
    {path: "/cart", component: Cart},
    {path: "/news", component: News},
    {path: "/news-detail", component: NewsDetail},

    {path: "/admin", component: Admin, layout: null},
    {path: "/admin/product", component: AProduct, layout: null},
    {path: "/admin/category", component: ACategory, layout: null},
    {path: "/admin/user", component: AUser, layout: null},
    {path: "/admin/order", component: AOrder, layout: null},
    {path: "/admin/comment", component: AComment, layout: null},
    {path: "/admin/feedback", component: AFeedback, layout: null},
    {path: "/admin/news", component: ANews, layout: null},

    // {path: "/category", component: Category, layout: null},
]   

export {routes};