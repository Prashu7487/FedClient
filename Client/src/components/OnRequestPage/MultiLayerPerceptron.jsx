import React from "react";
import { useState } from "react";

/*
const [formData, setFormData] = useState({
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
*/

const MultiLayerPerceptron = ({formData,setFormData}) => {
  
  
    // States
    const [lossFunction, setLossFunction] = useState("")
    const [optimizer, setOptimizer] = useState("")
    const [activationFunction, setActivationFunction] = useState("")
    const [countIntermediateLayer, setCountIntermediateLayer] = useState("")
    const [modelInfo, setModelInfo] = useState({
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
    
  }

  
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
            value={formData.modelInfo.lossFunction}
            name="lossFunction"
            onChange={handleInputChange}
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
            value={optimizer}
            onChange={(e) => setOptimizer(e.target.value)}
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
        />
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
        />
        <select
          className="form-select"
          value={activationFunction}
          onChange={(e) => setActivationFunction(e.target.value)}
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
      {Array.from({ length: countIntermediateLayer }, () => (
        <div className="input-group mb-3">
          <span className="input-group-text">Column Name and Type</span>
          <input
            type="text"
            aria-label="Type"
            className="form-control"
            placeholder="Number of Nodes"
          />
          <select
            className="form-select"
            value={activationFunction}
            onChange={(e) => setActivationFunction(e.target.value)}
          >
            <option value="select-activation">Activation Function</option>
            {Object.keys(activationFunctions).map((activation_key) => (
              <option key={activation_key} value={activation_key}>
                {activationFunctions[activation_key]}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Add a button here for adding more layers */}
      <div className="row">
        <div className="col-auto mb-3">
          <button
            className="btn btn-primary"
            onClick={() =>
              setCountIntermediateLayer(countIntermediateLayer + 1)
            }
          >
            Add Intermediate Layer
          </button>
        </div>
        <div className="col-auto mb-3">
          <button
            className="btn btn-primary"
            onClick={() =>
              setCountIntermediateLayer(countIntermediateLayer - 1)
            }
            disabled={countIntermediateLayer === 1} // Disable if there's only 1 layer
          >
            Remove Last Intermediate Layer
          </button>
        </div>
      </div>

      <h4>Output Layer:</h4>
      <div className="input-group mb-3">
        <span className="input-group-text">Column Name and Type</span>
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
        />
        <select
          className="form-select"
          value={activationFunction}
          onChange={(e) => setActivationFunction(e.target.value)}
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
