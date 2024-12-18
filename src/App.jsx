
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRouters from "./routers/AdminRouters";
import CustomerRouters from "./routers/CustomerRouters";
import AuthRouters from "./routers/AuthRouter";
import ForbiddenPage from "./routers/ForbiddenPage";

const router = createBrowserRouter([AdminRouters, CustomerRouters,AuthRouters,  {
  path: "/forbidden",
  element: <ForbiddenPage />,
},]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
