import axiosInstance from "@/services/api";
import { message } from "antd";
import React from "react";
import { useForm } from "react-hook-form";

const Form1Application = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/formOne", data, {
        responseType: "blob", // Required for downloading PDF
      });

      // Create a Blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open PDF in new tab
      window.open(pdfUrl, "_blank");

      // Optionally, allow user to download
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "Form1_Application.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      message.success("Form 1 submitted successfully, preview generated!");
    } catch (error) {
      console.error("API Error:", error);
      message.error("An error occurred while generating the PDF.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        FORM 1 - APPLICATION CUM QUESTIONNAIRE
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block font-medium">Firm Name</label>
          <input
            {...register("firmName", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.firmName && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">
            Firm Registration Number (FRN) / Membership Number
          </label>
          <input
            {...register("frn", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.frn && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">Peer Review Period</label>
          <input
            {...register("reviewStartDate", { required: true })}
            type="date"
            className="w-full p-2 border rounded"
          />
          <input
            {...register("reviewEndDate", { required: true })}
            type="date"
            className="w-full p-2 border rounded mt-2"
          />
          {errors.reviewStartDate && (
            <span className="text-red-500">Start date is required</span>
          )}
          {errors.reviewEndDate && (
            <span className="text-red-500">End date is required</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">Reason for Peer Review</label>
          <div>
            <label>
              <input type="checkbox" {...register("mandatoryICAI")} /> Mandatory
              by ICAI
            </label>
            <label>
              <input type="checkbox" {...register("mandatoryOther")} /> Any
              other Regulator
            </label>
            <label>
              <input type="checkbox" {...register("voluntary")} /> Voluntarily
            </label>
            <label>
              <input type="checkbox" {...register("specialCase")} /> Special
              Case Review
            </label>
            <label>
              <input type="checkbox" {...register("newUnit")} /> New Unit
            </label>
            <label>
              <input type="checkbox" {...register("boardDecision")} /> As per
              Board Decision
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Assurance Services</label>
          <input
            {...register("centralStatutoryAudit")}
            className="w-full p-2 border rounded"
            placeholder="Central Statutory Audit"
          />
          <input
            {...register("statutoryAudit")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Statutory Audit"
          />
          <input
            {...register("internalAudit")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Internal Audit"
          />
          <input
            {...register("taxAudit")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Tax Audit"
          />
          <input
            {...register("concurrentAudit")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Concurrent Audit"
          />
          <input
            {...register("certificationWork")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Certification Work"
          />
          <input
            {...register("otherAssurance")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Any other, please specify"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">
            Statutory Audit of Listed Enterprises
          </label>
          <label>
            <input type="checkbox" {...register("conductedAudit")} /> Conducted
          </label>
          <label>
            <input type="checkbox" {...register("notConductedAudit")} /> Not
            Conducted
          </label>
        </div>

        <div className="mb-4">
          <label className="block font-medium">
            Option for Appointment of Reviewer
          </label>
          <label>
            <input type="checkbox" {...register("sameCity")} /> Same City
          </label>
          <label>
            <input type="checkbox" {...register("outsideCity")} /> From Outside
            City
          </label>
          <label>
            <input type="checkbox" {...register("eitherOption")} /> Either
            option
          </label>
          <input
            {...register("preferredCity")}
            className="w-full p-2 border rounded mt-2"
            placeholder="Preferred City if applicable"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">
            Email ID for Communication
          </label>
          <input
            {...register("email", { required: true })}
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium">
            Address for Sending Peer Review Certificate
          </label>
          <textarea
            {...register("address", { required: true })}
            className="w-full p-2 border rounded"
          ></textarea>
          {errors.address && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

          {/* From PDF Page NO 13 */}

          

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form1Application;
