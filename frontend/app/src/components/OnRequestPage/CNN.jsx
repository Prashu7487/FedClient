import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";

import TestMetricsMultiselect from "../OnWholeApp/helperFunctions";

const activationFunctions = {
  relu: "ReLU",
  sigmoid: "Sigmoid",
  tanh: "Tanh",
  softmax: "Softmax",
  leakyRelu: "Leaky ReLU",
  prelu: "PReLU",
  thresholdedRelu: "Thresholded ReLU",
  hardSigmoid: "Hard Sigmoid",
  exponential: "Exponential",
  linear: "Linear",
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

const layerTypes = {
  convolution: "Convolutional",
  pooling: "Pooling",
  dense: "Dense",
  flatten: "Flatten",
  reshape: "Reshape",
};

const poolingTypes = {
  max: "Max Pooling",
  average: "Average Pooling",
};

/*

Checks/validation can be included in the componenet later as these not invlove changing something out of this file...
this can be done by simply implementing the validation schema and Resolvers from react-hook-form to link the
checks mentioned in the schema

schema of this component (model_info obj generated by this component):

==================================================
{
  input_shape: "(128,128,1)",
  layers: Arbitrary Array like below.. 
    [ 
      {layer_type: 'dense', num_nodes: '5', activation_function: 'sigmoid'},
      {layer_type: 'flatten'},
      {layer_type: ''},
      {layer_type: 'convolution', filters: '8', kernel_size: '(5,5)', stride: '(2,2)', activation_function: 'relu'},
      {layer_type: 'reshape', target_shape: '(512,1)'},
      {layer_type: 'pooling', pooling_type: 'max', pool_size: '(2,2)', stride: '(2,2)'},
      {layer_type: ''}
    ],
  loss: string,
  optimizer: string,
  output_layer: 
    {
      activation_function: string,
      num_nodes: string
    }
}
==================================================
*/

const defaultValues = {
  input_shape: "(128,128,1)",
  layers: [
    {
      layer_type: "convolution",
      filters: "8",
      kernel_size: "(5,5)",
      stride: "(2,2)",
      activation_function: "relu",
    },
    { layer_type: "Dense", num_nodes: "5", activation_function: "sigmoid" },
    {
      layer_type: "pooling",
      pooling_type: "max",
      pool_size: "(2,2)",
      stride: "(2,2)",
    },
    { layer_type: "reshape", target_shape: "(512,1)" },
  ],
  loss: "mse",
  optimizer: "adam",
  output_layer: {
    activation_function: "sigmoid",
    num_nodes: "1",
  },
};

// don't remove the comments now..
const CNN = ({ control, register }) => {
  // const [layerVisibilities, setLayerVisibilities] = useState({});
  const { fields, append, remove } = useFieldArray({
    control,
    name: "model_info.layers",
  });

  // const changeVisibility = (index, event) => {
  //   const value = event.target.value;
  //   setLayerVisibilities((prev) => ({
  //     ...prev,
  //     [index]: value !== "", // Show config if layer_type is not empty
  //   }));
  // };

  const renderLayerConfig = (layer, index) => {
    switch (layer.layer_type) {
      // Convolution Layer
      case "convolution":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Convolutional Layer</span>

            {/*  number of filters  */}
            <input
              type="number"
              className="form-control"
              placeholder="Number of Filters e.g. 32"
              defaultValue={defaultValues.layers[0].filters}
              {...register(`model_info.layers.${index}.filters`)}
            />

            {/* Kernal size */}
            <input
              type="text"
              className="form-control"
              placeholder="Kernel Size e.g. (5,5)"
              defaultValue={defaultValues.layers[0].kernel_size}
              {...register(`model_info.layers.${index}.kernel_size`)}
            />

            {/* Stride */}
            <input
              type="text"
              className="form-control"
              placeholder="Stride e.g. (2,2)"
              defaultValue={defaultValues.layers[0].stride}
              {...register(`model_info.layers.${index}.stride`)}
            />

            {/* Activation Function */}
            <select
              className="form-select"
              defaultValue={defaultValues.layers[0].activation_function}
              {...register(`model_info.layers.${index}.activation_function`)}
            >
              <option value="">Select Activation Function</option>
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>

            {/* Remove Button */}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );

      // Pooling Layer
      case "pooling":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Pooling Layer</span>

            {/* Pooling type  */}
            <select
              className="form-select"
              defaultValue={defaultValues.layers[2].pooling_type}
              {...register(`model_info.layers.${index}.pooling_type`)}
            >
              <option value="">Select Pooling Type</option>
              {Object.keys(poolingTypes).map((key) => (
                <option key={key} value={key}>
                  {poolingTypes[key]}
                </option>
              ))}
            </select>

            {/* Pool Size  */}
            <input
              type="text"
              className="form-control"
              placeholder="Pool Size e.g. (2,2)"
              defaultValue={defaultValues.layers[2].pool_size}
              {...register(`model_info.layers.${index}.pool_size`)}
            />

            {/* Stride  */}
            <input
              type="text"
              className="form-control"
              placeholder="Stride e.g. (2,2)"
              defaultValue={defaultValues.layers[2].stride}
              {...register(`model_info.layers.${index}.stride`)}
            />

            {/* Remove Button  */}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );

      // Dense Layer
      case "dense":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Dense Layer</span>

            {/* NUmber of nodes */}
            <input
              type="number"
              className="form-control"
              placeholder="Number of Nodes e.g. 512"
              defaultValue={defaultValues.layers[1].num_nodes}
              {...register(`model_info.layers.${index}.num_nodes`)}
            />

            {/* Activation function  */}
            <select
              className="form-select"
              defaultValue={defaultValues.layers[1].activation_function}
              {...register(`model_info.layers.${index}.activation_function`)}
            >
              <option value="">Select Activation Function</option>
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>

            {/* Remove button  */}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );

      // Flatten Layer
      case "flatten":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Flatten Layer</span>

            {/* Remove button  */}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );

      // Reshape Layer
      case "reshape":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Reshape Layer</span>

            {/* Reshape target shape */}
            <input
              type="text"
              className="form-control"
              placeholder="Target Shape  e.g. (64, 64, 3) or (512,1)"
              defaultValue={defaultValues.layers[3].target_shape}
              {...register(`model_info.layers.${index}.target_shape`)}
            />

            {/* Remove button */}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );

      // Not a layer type case
      default:
        return null;
    }
  };

  // Start of model_info component
  return (
    <div>
      <p>
        Note: keeping first Layer as convolution is mandatory to avaoid error
      </p>
      <h5>Input Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Input Shape</span>

        {/* Input shape */}
        <input
          type="text"
          className="form-control"
          placeholder="e.g., 64, 64, 3"
          defaultValue={defaultValues.input_shape}
          {...register("model_info.input_shape")}
        />
      </div>

      {/* Layers */}
      <h5>Layers:</h5>
      <div id="parent-template-div">
        {fields.map((layer, index) => (
          <div key={layer.id}>
            <div className="input-group mb-2">
              <span className="input-group-text">Layer Type</span>
              <select
                className="form-select"
                {...register(`model_info.layers.${index}.layer_type`)}
                // onChange={(e) => changeVisibility(index, e)}
              >
                <option value="">Select Layer Type</option>
                {Object.keys(layerTypes).map((key) => (
                  <option key={key} value={key}>
                    {layerTypes[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* Rendering Layer configs */}
            {/* {layerVisibilities[index] && renderLayerConfig(layer, index)} */}
            {renderLayerConfig(layer, index)}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-dark mb-3"
        onClick={() => append({ layer_type: "" })}
      >
        Add Layer
      </button>

      <h5>Output Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Output Shape</span>

        {/* Output shape */}
        <input
          type="number"
          className="form-control"
          placeholder="Number of Nodes"
          defaultValue={defaultValues.output_layer.num_nodes}
          {...register("model_info.output_layer.num_nodes")}
        />

        {/* Output activation function */}
        <select
          className="form-select"
          defaultValue={defaultValues.output_layer.activation_function}
          {...register("model_info.output_layer.activation_function")}
        >
          <option value="">Select Activation Function</option>
          {Object.keys(activationFunctions).map((key) => (
            <option key={key} value={key}>
              {activationFunctions[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Select Loss */}
      <select
        className="form-select"
        defaultValue={defaultValues.loss}
        {...register("model_info.loss")}
      >
        <option value="">Select Loss Function</option>
        {Object.keys(lossFunctions).map((key) => (
          <option key={key} value={key}>
            {lossFunctions[key]}
          </option>
        ))}
      </select>

      {/* Select Optimizers */}
      <select
        className="form-select"
        defaultValue={defaultValues.optimizer}
        {...register("model_info.optimizer")}
      >
        <option value="">Select Optimizer</option>
        {Object.keys(optimizers).map((key) => (
          <option key={key} value={key}>
            {optimizers[key]}
          </option>
        ))}
      </select>

      {/* select test metrices */}
      <TestMetricsMultiselect register={register} />
    </div>
  );
};

export default CNN;
