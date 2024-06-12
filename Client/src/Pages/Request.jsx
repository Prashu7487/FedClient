import React, { useState } from "react";
import DataInfo from "../components/OnRequestPage/DataInfo";
import ModelInfo from "../components/OnRequestPage/ModelInfo";
import MultiLayerPerceptron from "../components/OnRequestPage/MultiLayerPerceptron";
import { useGlobalData } from "../GlobalContext";

export default function App() {
  const [formData, setFormData] = useState({
    orgName: "",
    dataInfo: {},
    modelName:"",
    modelInfo: {},
  });

  // Models
  const availableModels = {
    'multiLayerPerceptron': {
      label: 'Multi Layer Perceptron',
      component: <MultiLayerPerceptron formData={formData} setFormData={setFormData}/>,
    },
  };

  // React States
  const [selectedModel,setSelectedModel] = useState("")
  const { globalData, setGlobalData } = useGlobalData();


  
  // Handlers

  const handleSelectModel = (e)=>{
    setSelectedModel(e.target.value)
  }

  const handleOrgNameChange = (event) => {
    setFormData({ ...formData, orgName: event.target.value });
  };

  const handleDataInfoChange = (dataInfo) => {
    setFormData({ ...formData, dataInfo });
  };

  const handleModelInfoChange = (modelInfo) => {
    setFormData({ ...formData, modelInfo });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Check if the orgName is provided
    if (!formData.orgName.trim()) {
      alert("Org Name is required");
      return;
    }

    const newRequestData = {
      RequestId: Date.now(), // Ideally, use a UUID for better uniqueness
      OrgName: formData.orgName,
      Status: "Requested",
      Model: formData.modelInfo,
      Data: formData.dataInfo,
    };

    const postData = async (url, data) => {
      console.log("Data in Request", JSON.stringify(data));
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();
        console.log("Response from server:", result);
      } catch (err) {
        console.log("Error in sending Client Reg Data:", err);
      }
    };

    postData("http://localhost:8000/request_training", newRequestData);

    setGlobalData((prevGlobalData) => ({
      ...prevGlobalData,
      CurrentModels: [...prevGlobalData.CurrentModels, newRequestData],
    }));

    // Rresetting the form data (Optional)
    setFormData({
      orgName: "",
      dataInfo: {},
      modelInfo: {},
    });

    // Log the form data (for debugging purposes)
    console.log("Form Data:", formData);
  };

  return (
    <form id="Request-form" className="row g-3" onSubmit={handleSubmit}>
      <div className="container mt-3">
        <h4>Org Name:</h4>
        <input
          type="text"
          id="orgName"
          className="form-control"
          placeholder="e.g. XYZ"
          value={formData.orgName}
          onChange={handleOrgNameChange}
        />
      </div>
      <DataInfo onDataInfoChange={handleDataInfoChange} />
      {/* <ModelInfo onModelInfoChange={handleModelInfoChange} /> */}
      
      
      <h4>Model Info:</h4>
      {/* Dropdown for selecting the model */}
      <div className="select-model">
        <select className="form-select" value={selectedModel} onChange={handleSelectModel}>
          <option value="selectModel">Select your model</option>
          {Object.keys(availableModels).map((model_value)=>(
            <option key="model_value" value={model_value}>{availableModels[model_value].label}</option>
          ))}
        </select>
      </div>


      {selectedModel?availableModels[selectedModel].component:<></>}
      <div>
        <button type="submit" className="btn btn-primary me-5">
          Request
        </button>
      </div>


    </form>
  );
}
