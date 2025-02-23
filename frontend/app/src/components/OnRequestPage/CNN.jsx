import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
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
      case "convolution":
        return (
          <div
            key={layer.id}
            className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
          >
            <span className="font-semibold">Convolutional Layer</span>

            <input
              type="number"
              className="input"
              placeholder="Number of Filters e.g. 32"
              {...register(`model_info.layers.${index}.filters`)}
            />

            <input
              type="text"
              className="input"
              placeholder="Kernel Size e.g. (5,5)"
              {...register(`model_info.layers.${index}.kernel_size`)}
            />

            <input
              type="text"
              className="input"
              placeholder="Stride e.g. (2,2)"
              {...register(`model_info.layers.${index}.stride`)}
            />

            <select
              className="select"
              {...register(`model_info.layers.${index}.activation_function`)}
            >
              <option value="">Select Activation Function</option>
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>

            <button
              className="btn btn-danger flex items-center gap-2"
              type="button"
              onClick={() => remove(index)}
            >
              <XCircleIcon className="h-5 w-5" /> Remove
            </button>
          </div>
        );
      case "pooling":
        return (
          <div
            key={layer.id}
            className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
          >
            <span className="font-semibold">Pooling Layer</span>

            <select
              className="select"
              {...register(`model_info.layers.${index}.pooling_type`)}
            >
              <option value="">Select Pooling Type</option>
              {Object.keys(poolingTypes).map((key) => (
                <option key={key} value={key}>
                  {poolingTypes[key]}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input"
              placeholder="Pool Size e.g. (2,2)"
              {...register(`model_info.layers.${index}.pool_size`)}
            />

            <button
              className="btn btn-danger flex items-center gap-2"
              type="button"
              onClick={() => remove(index)}
            >
              <XCircleIcon className="h-5 w-5" /> Remove
            </button>
          </div>
        );
      case "flatten":
        return (
          <div
            key={layer.id}
            className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
          >
            <span className="font-semibold">Flatten Layer</span>

            {/* Remove button */}
            <button
              className="btn btn-danger flex items-center gap-2"
              type="button"
              onClick={() => remove(index)}
            >
              {" "}
              Remove{" "}
            </button>
          </div>
        );
      case "reshape":
        return (
          <div
            key={layer.id}
            className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
          >
            <span className="font-semibold">Reshape Layer</span>

            {/* Reshape target shape */}
            <input
              type="text"
              className="input"
              placeholder="Target Shape  e.g. (64, 64, 3) or (512,1)"
              defaultValue={defaultValues.layers[3].target_shape}
              {...register(`model_info.layers.${index}.target_shape`)}
            />

            {/* Remove button */}
            <button
              className="btn btn-danger flex items-center gap-2"
              type="button"
              onClick={() => remove(index)}
            >
              <XCircleIcon className="h-5 w-5" /> Remove
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Start of model_info component
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <p className="text-red-600 font-medium">
        Note: Keeping the first layer as convolution is mandatory to avoid
        errors.
      </p>

      {/* Input Layer */}
      <h5 className="text-lg font-semibold mt-4">Input Layer:</h5>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Input Shape:</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 64, 64, 3"
          defaultValue={defaultValues.input_shape}
          {...register("model_info.input_shape")}
        />
      </div>

      {/* Layers Section */}
      <h5 className="text-lg font-semibold mt-6">Layers:</h5>
      <div id="parent-template-div">
        {fields.map((layer, index) => (
          <div key={layer.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Layer Type:</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register(`model_info.layers.${index}.layer_type`)}
              >
                <option value="">Select Layer Type</option>
                {Object.keys(layerTypes).map((key) => (
                  <option key={key} value={key}>
                    {layerTypes[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* Rendering Layer Configurations */}
            {renderLayerConfig(layer, index)}
          </div>
        ))}
      </div>

      {/* Add Layer Button */}
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        onClick={() => append({ layer_type: "" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add Layer</span>
      </button>

      {/* Output Layer */}
      <h5 className="text-lg font-semibold mt-6">Output Layer:</h5>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Output Shape:</label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Number of Nodes"
          defaultValue={defaultValues.output_layer.num_nodes}
          {...register("model_info.output_layer.num_nodes")}
        />
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <label className="text-sm font-medium">Activation Function:</label>
        <select
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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

      {/* Loss Function Selection */}
      <div className="mt-4">
        <label className="text-sm font-medium">Loss Function:</label>
        <select
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Optimizer Selection */}
      <div className="mt-4">
        <label className="text-sm font-medium">Optimizer:</label>
        <select
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Test Metrics Selection */}
      <div className="mt-4">
        <TestMetricsMultiselect register={register} />
      </div>
    </div>
  );
};

export default CNN;
