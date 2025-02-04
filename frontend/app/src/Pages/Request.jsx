import React, { useState } from "react";
import DataInfo from "../components/OnRequestPage/DataInfo";
import MultiLayerPerceptron from "../components/OnRequestPage/MultiLayerPerceptron";
import CNN from "../components/OnRequestPage/CNN";
import { useGlobalData } from "../GlobalContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import CustomSVM from "../components/OnRequestPage/CustomSVM";
import LandMarkSVM from "../components/OnRequestPage/LandMarkSVM";
import LinearRegression from "../components/OnRequestPage/LinearRegression";
import { createSession } from "../services/federatedService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { api } = useAuth()
  const navigate = useNavigate()

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

          navigate(`/TrainingStatus/details/${res.data.session_id}`)
        })
        .catch(console.error)
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
    <>
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
              <option key={model_value} value={model_value}>
                {availableModels[model_value].label}
              </option>
            ))}
          </select>
        </div>

        {selectedModel ? availableModels[selectedModel].component : <></>}

        <div>
          <button type="submit" className="btn btn-success me-5">
            Request
          </button>
        </div>
      </form>
    </>
  );
}
