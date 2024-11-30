
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRouters from "./routers/AdminRouters";
import CustomerRouters from "./routers/CustomerRouters";
import AuthRouters from "./routers/AuthRouter";

const router = createBrowserRouter([AdminRouters, CustomerRouters,AuthRouters]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
