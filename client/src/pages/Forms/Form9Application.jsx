import { useState } from "react";
import { Form, Input, Button, Modal, Radio, message, DatePicker } from "antd";
import axiosInstance from "@/services/api";
import dayjs from "dayjs";

const Form9Application = () => {
  const [form] = Form.useForm();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle Form Submission for Preview
  const handlePreview = async (values) => {
    setLoading(true);
    try {
      // Convert date to YYYY-MM-DD format
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : "",
        declarationDate: values.declarationDate
          ? values.declarationDate.format("YYYY-MM-DD")
          : "",
      };

      const response = await axiosInstance.post(
        "/formNine/preview",
        formattedValues
      );

      if (response.data.success) {
        setPdfUrl(response.data.pdfUrl);
        setPreviewData({
          pdfPath: response.data.pdfPath,
          formData: response.data.formData,
        });
        setIsModalOpen(true);
      } else {
        message.error("Failed to generate preview");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      message.error("Error generating PDF preview");
    } finally {
      setLoading(false);
    }
  };

  // Handle Approval or Rejection
  const handleApproval = async (status) => {
    if (!previewData) return;

    try {
      const response = await axiosInstance.post("/formNine/approve", {
        pdfPath: previewData.pdfPath,
        formData: previewData.formData,
        status,
      });

      if (response.data.success) {
        message.success(`Form ${status} successfully`);
        setIsModalOpen(false);
      } else {
        message.error("Failed to process approval");
      }
    } catch (error) {
      console.error("Error approving form:", error);
      message.error("Error processing form approval");
    }
  };

  return (
    <div
      className="shadow-2xl rounded-2xl p-5 mx-auto my-10 py-10 bg-white"
      style={{ maxWidth: 600 }}
    >
      <h2 className="text-xl font-bold mb-4">Form 9 Submission</h2>
      <Form form={form} layout="vertical" onFinish={handlePreview}>
        <Form.Item
          label="Firm Name"
          name="firmName"
          rules={[{ required: true, message: "Please enter Firm Name" }]}
        >
          <Input placeholder="Enter firm name" />
        </Form.Item>

        <Form.Item
          label="FRN (Firm Registration Number)"
          name="frn"
          rules={[{ required: true, message: "Please enter FRN" }]}
        >
          <Input placeholder="Enter FRN" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select Date" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Partner Name"
          name="partnerName"
          rules={[{ required: true, message: "Please enter Partner Name" }]}
        >
          <Input placeholder="Enter Partner Name" />
        </Form.Item>

        <Form.Item
          label="Membership No."
          name="memberShipNo"
          rules={[{ required: true, message: "Please enter Membership No." }]}
        >
          <Input placeholder="Enter Membership No." />
        </Form.Item>

        <Form.Item
          label="Declaration Type"
          name="declarationType"
          rules={[{ required: true, message: "Select Declaration Type" }]}
        >
          <Radio.Group>
            <Radio value="individual">Received by Individual</Radio>
            <Radio value="firm">Received by Firm</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Declaration Date"
          name="declarationDate"
          rules={[
            { required: true, message: "Please select Declaration Date" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Generate Preview
          </Button>
        </Form.Item>
      </Form>

      {/* Modal for Previewing the PDF */}
      <Modal
        title="Form 9 Preview"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="reject"
            danger
            onClick={() => handleApproval("Rejected")}
          >
            Reject
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => handleApproval("Approved")}
          >
            Approve
          </Button>,
        ]}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
            style={{ border: "none" }}
          />
        ) : (
          <p>No preview available</p>
        )}
      </Modal>
    </div>
  );
};

export default Form9Application;
