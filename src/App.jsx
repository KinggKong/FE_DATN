import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRouters from "./routers/AdminRouters";

import CustomerRouters from "./routers/CustomerRouters";

const router = createBrowserRouter([AdminRouters, CustomerRouters]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
