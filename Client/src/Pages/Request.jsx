import React, { useState } from "react";
import DataInfo from "../components/OnRequestPage/DataInfo";
import MultiLayerPerceptron from "../components/OnRequestPage/MultiLayerPerceptron";
import { useGlobalData } from "../GlobalContext";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function App() {
  // React States
  const [selectedModel, setSelectedModel] = useState("");
  const { GlobalData, setGlobalData } = useGlobalData();

  const { register, control, handleSubmit } = useForm();
  const postURL = "http://localhost:8000/request-federated-learning";

  // Models
  const availableModels = {
    multiLayerPerceptron: {
      label: "Multi Layer Perceptron",
      component: <MultiLayerPerceptron control={control} register={register} />,
    },
  };

  const onSubmit = async (formData) => {
    // if (!GlobalData.ConnectionObject) {
    //   alert("Please register first!");
    //   return;
    // }

    console.log("Form data:", formData);
    try {
      const res = await axios.post(postURL, formData);
      const newRequestData = {
        RequestId: `${GlobalData.Client.ClientID}${Date.now()}`,
        OrgName: formData.organisation_name,
        Status: "Requested",
        Model: { MLP: formData.model_info },
        Data: formData.dataset_info,
      };

      if (res.status === 200) {
        setGlobalData((prevGlobalData) => ({
          ...prevGlobalData,
          CurrentModels: [...prevGlobalData.CurrentModels, newRequestData],
        }));
      } else {
        console.error("Failed to submit the request:", res);
      }
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  return (
    <form
      id="Request-form"
      className="row g-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="container mt-3">
        <h4>Org Name:</h4>
        <input
          type="text"
          id="organisationName"
          className="form-control"
          placeholder="e.g. XYZ"
          {...register("organisation_name")}
        />
      </div>
      <h4>Data:</h4>
      <DataInfo control={control} register={register} />

      <h4>Model:</h4>
      {/* Dropdown for selecting the model */}
      <div className="select-model">
        <select
          className="form-select"
          {...register("model_name")}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="selectModel">Select your model</option>
          {Object.keys(availableModels).map((model_value) => (
            <option key="model_value" value={model_value}>
              {availableModels[model_value].label}
            </option>
          ))}
        </select>
      </div>

      {selectedModel ? availableModels[selectedModel].component : <></>}
      <div>
        <button type="submit" className="btn btn-primary me-5">
          Request
        </button>
      </div>
    </form>
  );
}
