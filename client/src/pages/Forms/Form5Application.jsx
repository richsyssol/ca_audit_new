// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   DatePicker,
//   Checkbox,
//   Button,
//   Table,
//   message,
// } from "antd";
// import axiosInstance from "@/services/api";

// const Form5Application = () => {
//   const [form] = Form.useForm();

//   const [formData, setFormData] = useState({});
//   console.log(formData);
//   const handleSubmit = async ({ values }) => {
//     try {
//       const values = await form.validateFields();
//       const finalData = { ...formData, ...values };
//       console.log(values);
//       console.log(finalData);

//       const formattedData = {
//         ...values,
//         date: values.date?.format("YYYY-MM-DD"),
//         declarationDate: values.declarationDate?.format("YYYY-MM-DD") || null,
//       };

//       const response = await axiosInstance.post("/formFive", formattedData);
//       message.success("Form submitted successfully!");
//       // form.resetFields();
//       //setFormData({ clients: [] });
//     } catch (error) {
//       message.error("Error submitting form. Please try again.");
//     }
//   };

//   const columns = [
//     {
//       title: "S. No.",
//       dataIndex: "serialNumber",
//       key: "serialNumber",
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Name of Client",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Financial Year (F.Y.)",
//       dataIndex: "financialYear",
//       key: "financialYear",
//     },
//   ];

//   return (
//     <Form form={form} layout="vertical" initialValues={formData}>
//       <Form.Item
//         label="Firm Name"
//         name="firmName"
//         rules={[{ required: true, message: "Firm Name is required" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="Partner Name"
//         name="partnerName"
//         rules={[{ required: true, message: "Partner Name is required" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="Review Period"
//         name="reviewPeriod"
//         rules={[{ required: true, message: "Review Period is required" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="Proposed Visit Date"
//         name="proposedVisitDate"
//         rules={[{ required: true, message: "Proposed Visit Date is required" }]}
//       >
//         <DatePicker format="YYYY-MM-DD" />
//       </Form.Item>

//       <Form.Item
//         label="Reviewer Name"
//         name="reviewerName"
//         rules={[{ required: true, message: "Reviewer Name is required" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item label="Declaration Date" name="declarationDate">
//         <DatePicker format="YYYY-MM-DD" />
//       </Form.Item>

//       {/* Table for Clients */}
//       <Table
//         dataSource={formData.clients}
//         columns={columns}
//         rowKey="name"
//         pagination={false}
//       />

//       <Form.Item>
//         <Button type="primary" onClick={handleSubmit} htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default Form5Application;

import React, { useState } from "react";
import { Form, Input, DatePicker, Button, Table, message } from "antd";
import axiosInstance from "@/services/api";

const Form5Application = () => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({});
  //console.log(formData);

  const handleSubmit = async ({ values }) => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,

        proposedVisitDate: values.proposedVisitDate.format("YYYY-MM-DD"),
        declarationDate: values.declarationDate?.format("YYYY-MM-DD") || null,
        clients,
      };
      await axiosInstance.post("/formFive", formattedData);
      message.success("Form submitted successfully!");
      form.resetFields();
      setClients([]);
    } catch (error) {
      message.error("Error submitting form. Please try again.");
    }
  };

  const addClient = () => {
    setClients([
      ...clients,
      { key: clients.length + 1, name: "", financialYear: "" },
    ]);
  };

  const handleClientChange = (index, field, value) => {
    const updatedClients = [...clients];
    updatedClients[index][field] = value;
    setClients(updatedClients);
  };

  const columns = [
    { title: "S. No.", dataIndex: "key", key: "key" },
    {
      title: "Name of Client",
      dataIndex: "name",
      key: "name",
      render: (_, record, index) => (
        <Input
          value={record.name}
          onChange={(e) => handleClientChange(index, "name", e.target.value)}
        />
      ),
    },
    {
      title: "Financial Year",
      dataIndex: "financialYear",
      key: "financialYear",
      render: (_, record, index) => (
        <Input
          value={record.financialYear}
          onChange={(e) =>
            handleClientChange(index, "financialYear", e.target.value)
          }
        />
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Firm Name"
        name="firmName"
        rules={[{ required: true, message: "Firm Name is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Partner Name"
        name="partnerName"
        rules={[{ required: true, message: "Partner Name is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Review Period"
        name="reviewPeriod"
        rules={[{ required: true, message: "Review Period is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Proposed Visit Date"
        name="proposedVisitDate"
        rules={[{ required: true, message: "Proposed Visit Date is required" }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        label="Reviewer Name"
        name="reviewerName"
        rules={[{ required: true, message: "Reviewer Name is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Declaration Date" name="declarationDate">
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Button
        type="dashed"
        onClick={addClient}
        style={{ marginBottom: "10px" }}
      >
        Add Client
      </Button>
      <Table dataSource={clients} columns={columns} pagination={false} />
      <Form.Item>
        <Button type="primary" onClick={handleSubmit} htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form5Application;
