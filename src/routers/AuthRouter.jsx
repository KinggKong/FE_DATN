import ForgotPassword from "../customer/auth/ForgotPassword";
import ForgotPasswordAdmin from "../customer/auth/ForgotPasswordAdmin";
import Login from "../customer/auth/Login";
import LoginAdmin from "../customer/auth/LoginAdmin";
import LoginSuccess from "../customer/auth/LoginSuccess";
import Register from "../customer/auth/Register";
import ResetPassword from "../customer/auth/ResetPassword";

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
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "login-admin",
        element: <LoginAdmin />,
      },
      {
        path: "forgot-password-admin",
        element: <ForgotPasswordAdmin />,
      },
    ],
};

export default AuthRouters;