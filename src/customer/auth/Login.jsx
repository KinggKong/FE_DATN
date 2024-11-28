import React, { useState } from "react";
import { Form, Input, Button, Divider, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8085/v1/api/auth/signin",
        {
          username: values.username,
          password: values.password,
        }
      );

      const data = response.data;
      if(data.code === 1000){
        message.success("Login successful!");
        localStorage.setItem("accountToken", data.data.accountToken);
        localStorage.setItem("refreshToken",  data.data.refreshToken);
        navigate("/");
      }       
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        message.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        message.error(
          "Login failed. Please check your network connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
              {
                min: 3,
                message: "Username must be at least 3 characters long",
              },
              { max: 50, message: "Username cannot exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username or Email"
              className="rounded-md"
              disabled={loading}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="rounded-md"
              disabled={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-md h-10 font-semibold text-lg"
              disabled={loading}
            >
              {loading ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                "Log in"
              )}
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-3">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Link>
        </div>
        <Divider plain className="text-gray-400">
          or
        </Divider>
        <Button
          className="w-full h-10 flex items-center mb-3 justify-center space-x-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
          disabled={loading}
        >
          <Link to="/auth/register">Register Account</Link>
        </Button>
        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          className="w-full h-10 flex items-center justify-center space-x-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-300"
          disabled={loading}
        >
          <Link to="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8085/v1/api/auth/oauth/google&response_type=code&client_id=97706771741-gjlt594f1j58kcn9sn7vu9lcq4v0cfk2.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline">
            <span>Continue with Google</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Login;