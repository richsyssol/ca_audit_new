import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card } from "antd";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";

const { Title, Link } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const success = await login(values);
    setLoading(false);
    if (success) navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <Card className="w-96 shadow-lg rounded-2xl p-6">
        <Title level={3} className="text-center">
          Login
        </Title>
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link href="/signup">Create New Account</Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
