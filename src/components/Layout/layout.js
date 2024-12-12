import FeedbackForm from "../FeedBackForm/FeedBackForm";
import Footer from "./Footer/Footer";
import Header from "./Header/header";

function Layout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <div className="pt-[60px] pb-8 flex-grow">
        {/* <div>abc</div> */}
        <div className="">{children}</div>
      </div>
      <Footer />
      <FeedbackForm />
    </div>
  );
}

export default Layout;
