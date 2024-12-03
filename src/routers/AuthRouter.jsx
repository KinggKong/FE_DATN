import ForgotPassword from "../customer/auth/ForgotPassword";
import Login from "../customer/auth/Login";
import LoginSuccess from "../customer/auth/LoginSuccess";
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
      {
        path: "login-success",
        element: <LoginSuccess />,
      },

    ],
};

export default AuthRouters;