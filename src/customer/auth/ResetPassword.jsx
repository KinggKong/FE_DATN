import {useEffect} from 'react';
import { Form, Input, Button, message } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token || token === "") {
      navigate("/auth/login"); 
    }
  }, [navigate, searchParams]);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/forgot-password",
        {
          token: token,
          newPasswrod: values.password.trim()
        }
      );
      console.log("Change password: Success:", response.data);
      message.success("Password changed successfully!");
      // navigate("/auth/login");
    } catch (error) {
      console.error("Error during change password:", error);
      if (error.response && error.response.data) {
        const { code, message: errorMessage } = error.response.data;
        if (code !== 1000) {
          message.error(errorMessage || "Failed to change password. Please try again.");
        } else {
          message.error("An unexpected error occurred. Please try again.");
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters long!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="repassword"
            label="Confirm New Password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-md font-semibold text-lg"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;