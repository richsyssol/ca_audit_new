import { useState } from "react";
import { Form, Input, Button, Modal, Radio, message, DatePicker } from "antd";
import axiosInstance from "@/services/api";
import dayjs from "dayjs";

const Form8Application = () => {
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
        applicationDate: values.applicationDate
          ? values.applicationDate.format("YYYY-MM-DD")
          : "",
        reviewerAppointedDate: values.reviewerAppointedDate
          ? values.reviewerAppointedDate.format("YYYY-MM-DD")
          : "",
        lastIssuedCertificateDate: values.lastIssuedCertificateDate
          ? values.lastIssuedCertificateDate.format("YYYY-MM-DD")
          : "",
        extensionFromDate: values.extensionFromDate
          ? values.extensionFromDate.format("YYYY-MM-DD")
          : "",
        extensionToDate: values.extensionToDate
          ? values.extensionToDate.format("YYYY-MM-DD")
          : "",
      };

      const response = await axiosInstance.post(
        "/formEight/preview",
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
      const response = await axiosInstance.post("/formEight/approve", {
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
      <h2 className="text-xl font-bold mb-4">Form 8 Submission</h2>
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
          label="Application No."
          name="applicationNo"
          rules={[{ required: true, message: "Please enter Application No." }]}
        >
          <Input placeholder="Enter Application No." />
        </Form.Item>

        <Form.Item
          label="Application Date"
          name="applicationDate"
          rules={[
            { required: true, message: "Please select Application Date" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Reviewer Appointed Date"
          name="reviewerAppointedDate"
          rules={[
            {
              required: true,
              message: "Please select Reviewer Appointed Date",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Last Issued Certificate Date"
          name="lastIssuedCertificateDate"
          rules={[
            {
              required: true,
              message: "Please select Last Issued Certificate Date",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Extension From Date"
          name="extensionFromDate"
          rules={[
            { required: true, message: "Please select Extension From Date" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Extension To Date"
          name="extensionToDate"
          rules={[
            { required: true, message: "Please select Extension To Date" },
          ]}
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
          name="membershipNo"
          rules={[{ required: true, message: "Please enter Membership No." }]}
        >
          <Input placeholder="Enter Membership No." />
        </Form.Item>

        <Form.Item label="Pandemic Delay" name="pandemic">
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Serious Illness Delay" name="seriousIllness">
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Generate Preview
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Form 8 Preview"
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

export default Form8Application;
