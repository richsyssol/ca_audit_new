// import React, { useState } from "react";
// import { Form, Input, DatePicker, Button, message } from "antd";
// import axiosInstance from "@/services/api";

// const Form7Application = () => {
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
//         date: values.date.format("YYYY-MM-DD"),
//         applicationDate: values.applicationDate.format("YYYY-MM-DD"),
//         reviewerAppointedDate:
//           values.reviewerAppointedDate.format("YYYY-MM-DD"),
//         peerReviewCompletionDate:
//           values.peerReviewCompletionDate.format("YYYY-MM-DD"),
//         reportSubmissionDate: values.reportSubmissionDate.format("YYYY-MM-DD"),
//       };

//       const response = await axiosInstance.post("/formSeven", formattedData);
//       message.success("Form submitted successfully!");
//       form.resetFields();
//     } catch (error) {
//       message.error("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Form.Item name="date" label="Date" rules={[{ required: true }]}>
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="firmName"
//           label="Firm Name"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item name="frn" label="FRN" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="applicationNo"
//           label="Application No"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="applicationDate"
//           label="Application Date"
//           rules={[{ required: true }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="reviewerAppointedDate"
//           label="Reviewer Appointed Date"
//           rules={[{ required: true }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="reasonsForDelay"
//           label="Reasons for Delay"
//           rules={[{ required: true }]}
//         >
//           <Input.TextArea rows={3} placeholder="Enter reasons for delay" />
//         </Form.Item>
//         <Form.Item
//           name="additionalDaysRequested"
//           label="Additional Days Requested"
//           rules={[{ required: true }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           name="peerReviewCompletionDate"
//           label="Peer Review Completion Date"
//           rules={[{ required: true }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="reportSubmissionDate"
//           label="Report Submission Date"
//           rules={[{ required: true }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="partnerName"
//           label="Partner Name"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="partnerMembershipNo"
//           label="Partner Membership No"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="reviewerName"
//           label="Peer Reviewer Name"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="reviewerMembershipNo"
//           label="Peer Reviewer Membership No"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Form7Application;

import React, { useState } from "react";
import { Form, Input, DatePicker, Button, message, Modal } from "antd";
import axiosInstance from "@/services/api";

const Form7Application = () => {
  const [form] = Form.useForm();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        applicationDate: values.applicationDate.format("YYYY-MM-DD"),
        reviewerAppointedDate:
          values.reviewerAppointedDate.format("YYYY-MM-DD"),
        peerReviewCompletionDate:
          values.peerReviewCompletionDate.format("YYYY-MM-DD"),
        reportSubmissionDate: values.reportSubmissionDate.format("YYYY-MM-DD"),
      };

      const response = await axiosInstance.post(
        "/formSeven/preview",
        formattedData
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

  const handleSubmit = async () => {
    if (!previewData) return;

    try {
      const response = await axiosInstance.post("/formSeven/submit", {
        pdfPath: previewData.pdfPath,
        formData: previewData.formData,
      });

      if (response.data.success) {
        message.success("Form submitted successfully!");
        setIsModalOpen(false);
      } else {
        message.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error submitting form");
    }
  };

  return (
    <div
      className="shadow-2xl rounded-2xl p-5 mx-auto my-10 py-10 bg-white"
      style={{ maxWidth: 800 }}
    >
      <h2 className="text-xl font-bold mb-6">Form 7 Submission</h2>
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="firmName"
            label="Firm Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="frn" label="FRN" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="applicationNo"
            label="Application No"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="applicationDate"
            label="Application Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reviewerAppointedDate"
            label="Reviewer Appointed Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="peerReviewCompletionDate"
            label="Peer Review Completion Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reportSubmissionDate"
            label="Report Submission Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="partnerName"
            label="Partner Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="partnerMembershipNo"
            label="Partner Membership No"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="reviewerName"
            label="Peer Reviewer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="reviewerMembershipNo"
            label="Peer Reviewer Membership No"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item
          name="reasonsForDelay"
          label="Reasons for Delay"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter detailed reasons for delay"
          />
        </Form.Item>

        <Form.Item
          name="additionalDaysRequested"
          label="Additional Days Requested"
          rules={[{ required: true }]}
        >
          <Input type="number" style={{ width: "100%" }} />
        </Form.Item>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="default" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="primary" onClick={handlePreview} loading={loading}>
            Generate Preview
          </Button>
        </div>
      </Form>

      {/* PDF Preview Modal */}
      <Modal
        title="Form 7 Preview"
        open={isModalOpen}
        width={800}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit Form
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

export default Form7Application;
