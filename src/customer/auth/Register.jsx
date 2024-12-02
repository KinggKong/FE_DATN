import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { motion } from 'framer-motion';

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [emailVerified, setEmailVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const signupRequest = {
        username: values.username,
        name: values.name,
        email: values.email,
        code: values.code,
        password: values.password,  
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/sign-up",
        signupRequest
      );
      console.log("Signup Success:", response.data);
      message.success("Signup successful!");
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response && error.response.data) {
        const { code, message: errorMessage } = error.response.data;
        if (code !== 1000) {
          message.error(errorMessage || "Signup failed. Please try again.");
        } else {
          message.error("An unexpected error occurred. Please try again.");
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = useCallback(async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.error("Please enter your email first");
        return;
      }
  
      setIsEmailSending(true);
      const response = await axios.post("http://localhost:8080/api/v1/auth/via-email", {"email":email}, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to send verification code");
      }
  
      console.log("Sending verification code to:", email);
      setEmailVerified(true);
      setCountdown(180);
      message.success("Verification code sent. Please check your email.");
    } catch (error) {
      console.error("Error sending verification code:", error);
      message.error("Failed to send verification code");
    } finally {
      setIsEmailSending(false);
    }
  }, [form]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Full Name" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" className="rounded-md" />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={handleEmailVerification}
              disabled={emailVerified || countdown > 0 || isEmailSending}
              className="w-full mb-2 bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-md h-10 font-semibold text-white"
            >
              {isEmailSending ? <Spin size="small" /> : countdown > 0 ? `Resend in ${countdown}s` : "Verify Email"}
            </Button>
          </Form.Item>

          {emailVerified && (
            <Form.Item
              name="code"
              rules={[{ required: true, message: 'Please input the verification code!' }]}
            >
              <Input placeholder="Verification Code" className="rounded-md" />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
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
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" className="rounded-md" />
          </Form.Item>      
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-md h-10 font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? <Spin size="small" /> : "Sign up"}
            </Button>
          </Form.Item>
          <div className="text-center">
            <Link to="/auth/login" className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300">
              Back to Login
            </Link>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default Register;

