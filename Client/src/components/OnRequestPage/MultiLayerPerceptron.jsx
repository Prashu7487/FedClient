import React from "react";
import { useFieldArray } from "react-hook-form";

const MultiLayerPerceptron = ({ control, register }) => {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "model_info.intermediate_layer",
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          justifyContent: "space-between",
        }}
      >
        <span>
          <h5>Loss Function:</h5>
        </span>
        <div className="select-loss-function">
          <select
            className="form-select"
            id="lossFunction"
            {...register("model_info.loss_function")}
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
          marginBottom: "10px",
          justifyContent: "space-between",
        }}
      >
        <span>
          <h5>Optimizer Function:</h5>
        </span>
        <div className="select-Optimizer-function">
          <select className="form-select" {...register("model_info.optimizer")}>
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

      <h5>Input Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Column Name and Type</span>
        <input
          type="text"
          aria-label="Feature"
          className="form-control"
          placeholder="Input_Shape of Dataset"
          {...register("model_info.input_layer.input_shape")}
        />
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
          {...register("model_info.input_layer.num_nodes")}
        />
        <select
          className="form-select"
          {...register("model_info.input_layer.activation_function")}
        >
          <option value="select-activation">Activation Function</option>
          {Object.keys(activationFunctions).map((activation_key) => (
            <option key={activation_key} value={activation_key}>
              {activationFunctions[activation_key]}
            </option>
          ))}
        </select>
      </div>

      <h5>Intermediate Layer:</h5>
      <div id="parent-template-div">
        {fields.map((field, index) => (
          <div key={field.id} className="input-group mb-2">
            <span className="input-group-text">Column Name and Type</span>
            <input
              type="text"
              aria-label="Type"
              className="form-control"
              placeholder="Number of Nodes"
              {...register(
                `model_info.intermediate_layer.${index}.feature_name`
              )}
            />
            <select
              className="form-select"
              {...register(
                `model_info.intermediate_layer.${index}.activation_function`
              )}
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
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => append()}
      >
        Add Intermediate Level
      </button>

      <h5>Output Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Column Name and Type</span>
        <input
          type="text"
          aria-label="Type"
          className="form-control"
          placeholder="Number of Nodes"
          {...register("model_info.output_layer.num_nodes")}
        />
        <select
          className="form-select"
          {...register("model_info.output_layer.activation_function")}
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
