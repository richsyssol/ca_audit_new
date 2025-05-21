import { useState } from "react";
import { Form, Input, Button, Select, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";

const { Option } = Select;
const { Title, Link } = Typography;

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await signup(formData);
    setLoading(false);
    if (response.success) navigate("/dashboard");
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
          Sign Up
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input onChange={(e) => handleChange("username", e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input onChange={(e) => handleChange("email", e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select onChange={(value) => handleChange("role", value)}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="superadmin">Superadmin</Option>
              <Option value="peer">Peer</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link href="/login">Already Have an Account?</Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Signup;
