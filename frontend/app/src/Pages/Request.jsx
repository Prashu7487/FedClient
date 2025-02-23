import React, { useState } from "react";
import DataInfo from "../components/OnRequestPage/DataInfo";
import MultiLayerPerceptron from "../components/OnRequestPage/MultiLayerPerceptron";
import CNN from "../components/OnRequestPage/CNN";
import { useGlobalData } from "../GlobalContext";
import { useForm } from "react-hook-form";
import CustomSVM from "../components/OnRequestPage/CustomSVM";
import LandMarkSVM from "../components/OnRequestPage/LandMarkSVM";
import LinearRegression from "../components/OnRequestPage/LinearRegression";
import { createSession } from "../services/federatedService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Request() {
  const [selectedModel, setSelectedModel] = useState("");
  const { GlobalData, setGlobalData } = useGlobalData();
  const { register, control, handleSubmit } = useForm();
  const { api } = useAuth();
  const navigate = useNavigate();

  const availableModels = {
    LinearRegression: {
      label: "Linear Regression",
      component: <LinearRegression control={control} register={register} />,
    },
    SVM: {
      label: "SVM",
      component: <CustomSVM control={control} register={register} />,
    },
    LandMarkSVM: {
      label: "LandMark SVM",
      component: <LandMarkSVM control={control} register={register} />,
    },
    multiLayerPerceptron: {
      label: "Multi Layer Perceptron",
      component: <MultiLayerPerceptron control={control} register={register} />,
    },
    CNN: {
      label: "CNN",
      component: <CNN control={control} register={register} />,
    },
  };

  const onSubmit = async (formData) => {
    const requestData = { fed_info: formData };
    console.log("sending in request:", requestData);

    try {
      createSession(api, requestData)
        .then((res) => {
          const newRequestData = {
            RequestId: `${GlobalData.Client.ClientID}${Date.now()}`,
            OrgName: formData.organisation_name,
            Status: "Requested",
            Model: formData.model_info,
            Data: formData.dataset_info,
          };

          setGlobalData((prevGlobalData) => ({
            ...prevGlobalData,
            CurrentModels: [...prevGlobalData.CurrentModels, newRequestData],
          }));

          navigate(`/TrainingStatus/details/${res.data.session_id}`);
        })
        .catch(console.error);
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Federated Learning Request Portal
      </h2>

      <form
        id="Request-form"
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Organization Details */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            id="organisationName"
            className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., XYZ Corp"
            {...register("organisation_name")}
          />
        </div>

        {/* Dataset Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Data Information
          </h4>
          <DataInfo control={control} register={register} />
        </div>

        {/* Statistical Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Expected Standard Mean
            </label>
            <input
              type="number"
              id="standardMean"
              step="0.01"
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.5"
              {...register("std_mean")}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Expected Standard Deviation
            </label>
            <input
              type="number"
              id = "standardDeviation"
              step="0.01"
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.1"
              {...register("std_deviation")}
            />
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Select Model
          </label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("model_name")}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="selectModel">Select a model</option>
            {Object.keys(availableModels).map((model_value) => (
              <option key={model_value} value={model_value}>
                {availableModels[model_value].label}
              </option>
            ))}
          </select>

          {selectedModel && (
            <div className="mt-3">{availableModels[selectedModel].component}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Request
        </div>
        {/* Statistical Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Expected Standard Mean
            </label>
            <input
              type="number"
              id="standardMean"
              step="0.01"
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.5"
              {...register("std_mean")}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Expected Standard Deviation
            </label>
            <input
              type="number"
              id = "standardDeviation"
              step="0.01"
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.1"
              {...register("std_deviation")}
            />
          </div>
        </div>

        {selectedModel ? availableModels[selectedModel].component : <></>}
        
        <div>
          <button type="submit" className="btn btn-success me-5">
            Request
          </button>
        </div>
      </form>
    </div>
  );
}
