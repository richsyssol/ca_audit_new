// import React, { useState } from "react";
// import { Form, Input, DatePicker, Button, Table, message } from "antd";
// import axiosInstance from "@/services/api";

// const Form6Application = () => {
//   const [form] = Form.useForm();
//   const [questions, setQuestions] = useState([]);

//   const [formData, setFormData] = useState({});
//   console.log(formData);

//   const columns = [
//     {
//       title: "Reference No.",
//       dataIndex: "referenceNo",
//       key: "referenceNo",
//       render: (_, record, index) => (
//         <Input
//           value={record.referenceNo}
//           onChange={(e) =>
//             handleQuestionChange(index, "referenceNo", e.target.value)
//           }
//         />
//       ),
//     },
//     {
//       title: "Information Required",
//       dataIndex: "informationRequired",
//       key: "informationRequired",
//       render: (_, record, index) => (
//         <Input
//           value={record.informationRequired}
//           onChange={(e) =>
//             handleQuestionChange(index, "informationRequired", e.target.value)
//           }
//         />
//       ),
//     },
//     {
//       title: "Reason",
//       dataIndex: "reason",
//       key: "reason",
//       render: (_, record, index) => (
//         <Input
//           value={record.reason}
//           onChange={(e) =>
//             handleQuestionChange(index, "reason", e.target.value)
//           }
//         />
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, __, index) => (
//         <Button type="link" danger onClick={() => handleRemoveQuestion(index)}>
//           Remove
//         </Button>
//       ),
//     },
//   ];

//   const handleQuestionChange = (index, key, value) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index][key] = value;
//     setQuestions(updatedQuestions);
//   };

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       { referenceNo: "", informationRequired: "", reason: "" },
//     ]);
//   };

//   const handleRemoveQuestion = (index) => {
//     setQuestions(questions.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axiosInstance.post("/formSix", formattedData);

//       const values = await form.validateFields();
//       const formattedData = {
//         ...values,
//         informationDueDate: values.informationDueDate.format("YYYY-MM-DD"),
//         declarationDate: values.declarationDate.format("YYYY-MM-DD"),
//         questions,
//       };

//       await axiosInstance.post("/formSix", formattedData);
//       message.success("Form submitted successfully!");
//       form.resetFields();
//       setQuestions([]);
//     } catch (error) {
//       message.error("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={handleSubmit}>
//       <Form.Item
//         name="partnerName"
//         label="Partner Name"
//         rules={[{ required: true, message: "Partner Name is required!" }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="firmName"
//         label="Firm Name"
//         rules={[{ required: true, message: "Firm Name is required!" }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         name="reviewPeriod"
//         label="Review Period"
//         rules={[{ required: true }]}
//       >
//         <Input placeholder="Enter Review Period (e.g., 2023-24)" />
//       </Form.Item>
//       <Form.Item
//         name="informationDueDate"
//         label="Information Due Date"
//         rules={[{ required: true }]}
//       >
//         <DatePicker style={{ width: "100%" }} />
//       </Form.Item>
//       <Form.Item
//         name="reviewerName"
//         label="Reviewer Name"
//         rules={[{ required: true }]}
//       >
//         <Input placeholder="Enter Reviewer Name" />
//       </Form.Item>
//       <Form.Item
//         name="declarationDate"
//         label="Declaration Date"
//         rules={[{ required: true }]}
//       >
//         <DatePicker style={{ width: "100%" }} />
//       </Form.Item>

//       {/* Dynamic Questions Table */}
//       <Table
//         columns={columns}
//         dataSource={questions}
//         rowKey="referenceNo"
//         pagination={false}
//       />
//       <Button
//         type="dashed"
//         onClick={handleAddQuestion}
//         style={{ marginTop: 10 }}
//       >
//         Add Question
//       </Button>

//       <Form.Item style={{ marginTop: 20 }}>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default Form6Application;

import React, { useState } from "react";
import { Form, Input, DatePicker, Button, Table, message } from "antd";
import axiosInstance from "@/services/api";

const Form6Application = () => {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});

  const handleQuestionChange = (index, key, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
      return updatedQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { key: Date.now(), referenceNo: "", informationRequired: "", reason: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,
        informationDueDate: values.informationDueDate.format("YYYY-MM-DD"),
        declarationDate: values.declarationDate.format("YYYY-MM-DD"),
        questions,
      };

      await axiosInstance.post("/formSix", formattedData);
      message.success("Form submitted successfully!");
      form.resetFields();
      setQuestions([]);
    } catch (error) {
      message.error("Error submitting form. Please try again.");
    }
  };

  const columns = [
    {
      title: "Reference No.",
      dataIndex: "referenceNo",
      render: (_, record, index) => (
        <Input
          value={record.referenceNo}
          onChange={(e) =>
            handleQuestionChange(index, "referenceNo", e.target.value)
          }
        />
      ),
    },
    {
      title: "Information Required",
      dataIndex: "informationRequired",
      render: (_, record, index) => (
        <Input
          value={record.informationRequired}
          onChange={(e) =>
            handleQuestionChange(index, "informationRequired", e.target.value)
          }
        />
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (_, record, index) => (
        <Input
          value={record.reason}
          onChange={(e) =>
            handleQuestionChange(index, "reason", e.target.value)
          }
        />
      ),
    },
    {
      title: "Action",
      render: (_, __, index) => (
        <Button type="link" danger onClick={() => handleRemoveQuestion(index)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="partnerName"
        label="Partner Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="firmName" label="Firm Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="reviewPeriod"
        label="Review Period"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter Review Period (e.g., 2023-24)" />
      </Form.Item>
      <Form.Item
        name="informationDueDate"
        label="Information Due Date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="reviewerName"
        label="Reviewer Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter Reviewer Name" />
      </Form.Item>
      <Form.Item
        name="declarationDate"
        label="Declaration Date"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="key"
        pagination={false}
      />
      <Button
        type="dashed"
        onClick={handleAddQuestion}
        style={{ marginTop: 10 }}
      >
        Add Question
      </Button>

      <Form.Item style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form6Application;
