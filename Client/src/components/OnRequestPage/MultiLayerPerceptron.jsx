import React from "react";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

const MultiLayerPerceptron = ({control,register}) => {

  const lossFunctions = {
    mse: "Mean Squared Error",
    mae: "Mean Absolute Error",
    binaryCrossentropy: "Binary Crossentropy",
    categoricalCrossentropy: "Categorical Crossentropy",
    hinge: "Hinge",
    huber: "Huber",
    klDivergence: "Kullback-Leibler Divergence",
    logCosh: "Log-Cosh",
    poisson: "Poisson",
    sparseCategoricalCrossentropy: "Sparse Categorical Crossentropy",
  };
  const optimizers = {
    sgd: "Stochastic Gradient Descent",
    rmsprop: "RMSprop (Root Mean Square Propagation)",
    adam: "Adam (Adaptive Moment Estimation)",
    adagrad: "Adagrad (Adaptive Gradient Algorithm)",
    adadelta: "Adadelta (Adaptive Delta)",
    adamax: "Adamax",
    nadam: "Nadam (Nesterov-accelerated Adaptive Moment Estimation)",
    ftrl: "FTRL (Follow-The-Regularized-Leader)",
    proximalSGD: "ProximalSGD",
    rmspropGraves: "RMSpropGraves",
  };
  const activationFunctions = {
    relu: "ReLU (Rectified Linear Unit)",
    sigmoid: "Sigmoid",
    tanh: "Tanh (Hyperbolic Tangent)",
    softmax: "Softmax",
    elu: "ELU (Exponential Linear Unit)",
    selu: "SELU (Scaled Exponential Linear Unit)",
    swish: "Swish",
    leakyRelu: "Leaky ReLU",
    prelu: "PReLU (Parametric ReLU)",
    thresholdedRelu: "Thresholded ReLU",
    hardSigmoid: "Hard Sigmoid",
    exponential: "Exponential",
    linear: "Linear",
  };
  
  
  const countIntermediateLayer = 0;
    // States
    const [mlpInfo, setMLPInfo] = useState({
        lossFunction: "selectLossFunction",
        optimizer: "selectOptimizer",
        inputLayer: {
          feature: "",
          type: "",
          activationFunction: "select-activation",
        },
        intermediateLayers: [],
        outputLayer: {
          type: "",
          activationFunction: "select-activation",
        },
      });


  const handleFormData = (model_info) => {
    setFormData({
        ...formData,
        modelInfo: model_info
    })
    console.log(formData)
  }
  const handleModelInfo = (e) => {
    const { name, value } = e.target;
    const updatedModelInfo = {
      ...mlpInfo,
      // inputLayer:{...inputLayer,feature=}
      [name]: value
    }
    setMLPInfo(updatedModelInfo)        // Javascript does not updates even by setModelInfo due to the asynchronous nature of state updates in React. When you call setModelInfo, the update to modelInfo doesn't happen immediately. Instead, it gets scheduled, and the state remains the same during the current execution context, which is why the console log shows the old state.
    // handleFormData(updatedModelInfo)
  }

  const handleInputLayer = (e)=>{
    
  }

  const onSubmit = (data) => {
    console.log('Form Submitted',data)
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modelInfo.intermediateLayer"
  });


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Loss Function:</span>
        <div className="select-loss-function">
          <select
            className="form-select"
            id= "lossFunction"
            {...register("modelInfo.lossFunction")}
          >
            <option value="selectLossFunction">
              Select your Loss Function
            </option>
            {Object.keys(lossFunctions).map((lossFunctionValue) => (
              <option key={lossFunctionValue} value={lossFunctionValue}>
                {lossFunctions[lossFunctionValue]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Optimizer Function:</span>
        <div className="select-Optimizer-function">
          <select
            className="form-select"
            {...register("modelInfo.optimizer")}
          >
            <option value="selectOptimizer">
              Select your Optimizer Function
            </option>
            {Object.keys(optimizers).map((optimizer_key) => (
              <option key={optimizer_key} value={optimizer_key}>
                {optimizers[optimizer_key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h4>Input Layer:</h4>
      <div className="input-group mb-3">
        <span className="input-group-text">Column Name and Type</span>
        <input
          type="text"
          aria-label="Feature"
          className="form-control"
          placeholder="Input_Shape of Dataset"
          {...register("modelInfo.inputLayer.inputShape")}
        />
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
          {...register("modelInfo.inputLayer.numNodes")}
        />
        <select
          className="form-select"
          {...register("modelInfo.inputLayer.activationFunction")}
        >
          <option value="select-activation">Activation Function</option>
          {Object.keys(activationFunctions).map((activation_key) => (
            <option key={activation_key} value={activation_key}>
              {activationFunctions[activation_key]}
            </option>
          ))}
        </select>
      </div>

      
      <h4>Intermediate Layer:</h4>
      <div id="parent-template-div">
        {fields.map((field,index) => (
          <div key={field.id} className="input-group mb-3">
          <span className="input-group-text">Column Name and Type</span>
          <input
            type="text"
            aria-label="Type"
            className="form-control"
            placeholder="Number of Nodes"
            {...register(`modelInfo.intermediateLayer.${index}.featureName`)}
          />
          <select
            className="form-select"
            {...register(`modelInfo.intermediateLayer.${index}.activationFunction`)}
          >
            <option value="select-activation">Activation Function</option>
            {Object.keys(activationFunctions).map((activation_key) => (
              <option key={activation_key} value={activation_key}>
                {activationFunctions[activation_key]}
              </option>
            ))}
          </select>
          <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
        </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={()=> append()} >
        Add
      </button>

      <h4>Output Layer:</h4>
      <div className="input-group mb-3">
        <span className="input-group-text">Column Name and Type</span>
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
          {...register("modelInfo.outputLayer.numNodes")}
        />
        <select
          className="form-select"
          {...register("modelInfo.outputLayer.activationFunction")}
        >
          <option value="select-activation">Activation Function</option>
          {Object.keys(activationFunctions).map((activation_key) => (
            <option key={activation_key} value={activation_key}>
              {activationFunctions[activation_key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MultiLayerPerceptron;
