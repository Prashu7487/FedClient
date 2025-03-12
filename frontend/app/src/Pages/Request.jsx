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
import {
  AcademicCapIcon,
  DocumentTextIcon,
  CubeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Required URLs
const federatedSessionRequestURL =
  process.env.REACT_APP_REQUEST_FEDERATED_SESSION_URL;

/*
==================================================
Form schema:
 {fed_info: {obj}, client_token: string}
==================================================

==================================================
fed_info schema:
{
  dataset_info : 
  {
    about_dataset : string,
    feature_list: 
    {
      0: {feature_name: 'col1', type_Of_feature: 'int'}
      1: {feature_name: 'col2', type_Of_feature: 'array of shape (256,256)'}
    }
  }
  model_info : { obj, structure depends on individual model itself}
  model_name: "string"
  organisation_name: "string"
}
==================================================

*/
export default function Request() {
  // React States
  const [selectedModel, setSelectedModel] = useState("");
  const { GlobalData, setGlobalData } = useGlobalData();
  const { register, control, handleSubmit } = useForm();
  const { api } = useAuth();
  const navigate = useNavigate();

  // Avail Models (keys not labels will be used in model_name)
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
    const requestData = {
      fed_info: formData,
      // client_token: clientToken,
    };
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

          // const session_token = res.data.session_token;
          // setSessions((prevList) => [...prevList, session_token]);
          // alert("Federated Learning Request is accepted!");
          setGlobalData((prevGlobalData) => ({
            ...prevGlobalData,
            CurrentModels: [...prevGlobalData.CurrentModels, newRequestData],
          }));

          navigate(`/TrainingStatus/details/${res.data.session_id}`);
        })
        .catch(console.error);
      // const res = await axios.post(federatedSessionRequestURL, requestData);
      // // We dont need to store this here this can be fetch from server side
      // const newRequestData = {
      //   RequestId: `${GlobalData.Client.ClientID}${Date.now()}`,
      //   OrgName: formData.organisation_name,
      //   Status: "Requested",
      //   Model: formData.model_info,
      //   Data: formData.dataset_info,
      // };

      // if (res.status === 200) {
      //   // Client Background Task --> Save the session token in the use State have to implement logic in backend

      //   const session_token = res.data.session_token;
      //   setSessions((prevList) => [...prevList, session_token]);
      //   alert("Federated Learning Request is accepted!");
      //   setGlobalData((prevGlobalData) => ({
      //     ...prevGlobalData,
      //     CurrentModels: [...prevGlobalData.CurrentModels, newRequestData],
      //   }));
      // } else {
      //   console.error("Failed to submit the request:", res);
      // }
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center p-6 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
          <h4 className="text-lg font-semibold">Organization Name</h4>
        </div>
        <input
          type="text"
          placeholder="e.g. XYZ"
          {...register("organisation_name")}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dataset info */}
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-6 w-6 text-green-600" />
          <h4 className="text-lg font-semibold">Dataset Information</h4>
        </div>
        <DataInfo control={control} register={register} />

        {/* Statistical Information */}
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6 text-yellow-600" />
          <h4 className="text-lg font-semibold">Statistical Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Expected Standard Mean
            </label>
            <input
              type="number"
              id="standardMean"
              step="0.00001"
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
              id="standardDeviation"
              step="0.00001"
              className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 0.1"
              {...register("std_deviation")}
            />
          </div>
        </div>

        {/* model selection */}
        <div className="flex items-center space-x-2">
          <CubeIcon className="h-6 w-6 text-purple-600" />
          <h4 className="text-lg font-semibold">Select Model</h4>
        </div>
        <select
          {...register("model_name")}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select your model</option>
          {Object.keys(availableModels).map((model_value) => (
            <option key={model_value} value={model_value}>
              {availableModels[model_value].label}
            </option>
          ))}
        </select>

        {selectedModel && (
          <div className="p-4 border rounded-md bg-gray-50">
            {availableModels[selectedModel].component}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Request
        </button>
      </form>
    </div>
  );
}
