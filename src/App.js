import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./components/Layout/layout";
import AdminLayout from "./pages/Admin/AdminLayout";
import ScrollToTopButton from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="bg-[#f5f5f5]">
        <Routes>
          {routes.map((route, index) => {
            const DefaultLayout = route.layout === null ? AdminLayout : Layout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <DefaultLayout>
                    <Page />
                  </DefaultLayout>
                }
              />
            );
          })}
        </Routes>
      </div>
      <div>
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;
