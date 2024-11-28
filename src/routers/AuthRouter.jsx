import ForgotPassword from "../customer/auth/ForgotPassword";
import Login from "../customer/auth/Login";
import Register from "../customer/auth/Register";

const AuthRouters = {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
};

export default AuthRouters;