import React from "react";
import { useFieldArray } from "react-hook-form";
import {
  XCircleIcon,
  PlusCircleIcon,
  CubeIcon,
  ArrowsPointingOutIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import SelectTestMetrics from "../RequestComponents/SelectTestMetrics";
import { useFormContext } from "react-hook-form";

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

const layerIcons = {
  convolution: <ViewColumnsIcon className="h-4 w-4" />,
  pooling: <Squares2X2Icon className="h-4 w-4" />,
  dense: <ChartBarIcon className="h-4 w-4" />,
  flatten: <ArrowsPointingOutIcon className="h-4 w-4" />,
  reshape: <CubeIcon className="h-4 w-4" />,
};

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
    { layer_type: "dense", num_nodes: "5", activation_function: "sigmoid" },
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

const CNN = () => {
  const { control, register, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "model_info.layers",
  });

  const handleAddLayer = (layerType) => {
    const baseConfig = { layer_type: layerType };

    switch (layerType) {
      case "convolution":
        append({
          ...baseConfig,
          filters: "8",
          kernel_size: "(3,3)",
          stride: "(1,1)",
          activation_function: "relu",
        });
        break;
      case "pooling":
        append({
          ...baseConfig,
          pooling_type: "max",
          pool_size: "(2,2)",
          stride: "(2,2)",
        });
        break;
      case "dense":
        append({
          ...baseConfig,
          num_nodes: "64",
          activation_function: "relu",
        });
        break;
      case "reshape":
        append({
          ...baseConfig,
          target_shape: "(128,1)",
        });
        break;
      default:
        append(baseConfig);
    }
  };

  const renderLayerConfig = (layer, index) => {
    if (!layer.layer_type) return null;

    const layerColor =
      {
        convolution: "bg-blue-50 border-blue-200",
        pooling: "bg-purple-50 border-purple-200",
        dense: "bg-green-50 border-green-200",
        flatten: "bg-yellow-50 border-yellow-200",
        reshape: "bg-orange-50 border-orange-200",
      }[layer.layer_type] || "bg-gray-50 border-gray-200";

    switch (layer.layer_type) {
      case "convolution":
        return (
          <div
            className={`mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg ${layerColor}`}
          >
            <div className="col-span-2 flex items-center gap-2">
              {layerIcons.convolution}
              <span className="font-semibold text-blue-700">
                Convolutional Layer
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Filters
              </label>
              <input
                type="number"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 32"
                {...register(`model_info.layers.${index}.filters`)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kernel Size
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. (5,5)"
                {...register(`model_info.layers.${index}.kernel_size`)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Stride
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. (2,2)"
                {...register(`model_info.layers.${index}.stride`)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Activation
              </label>
              <select
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                {...register(`model_info.layers.${index}.activation_function`)}
              >
                {Object.keys(activationFunctions).map((key) => (
                  <option key={key} value={key}>
                    {activationFunctions[key]}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                type="button"
                onClick={() => remove(index)}
              >
                <XCircleIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        );
      case "pooling":
        return (
          <div
            className={`mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg ${layerColor}`}
          >
            <div className="col-span-2 flex items-center gap-2">
              {layerIcons.pooling}
              <span className="font-semibold text-purple-700">
                Pooling Layer
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pooling Type
              </label>
              <select
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-purple-500"
                {...register(`model_info.layers.${index}.pooling_type`)}
              >
                {Object.keys(poolingTypes).map((key) => (
                  <option key={key} value={key}>
                    {poolingTypes[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pool Size
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-purple-500"
                placeholder="e.g. (2,2)"
                {...register(`model_info.layers.${index}.pool_size`)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Stride
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-purple-500"
                placeholder="e.g. (2,2)"
                {...register(`model_info.layers.${index}.stride`)}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                type="button"
                onClick={() => remove(index)}
              >
                <XCircleIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        );
      case "dense":
        return (
          <div
            className={`mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg ${layerColor}`}
          >
            <div className="col-span-2 flex items-center gap-2">
              {layerIcons.dense}
              <span className="font-semibold text-green-700">Dense Layer</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nodes
              </label>
              <input
                type="number"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-green-500"
                placeholder="e.g. 64"
                {...register(`model_info.layers.${index}.num_nodes`)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Activation
              </label>
              <select
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-green-500"
                {...register(`model_info.layers.${index}.activation_function`)}
              >
                {Object.keys(activationFunctions).map((key) => (
                  <option key={key} value={key}>
                    {activationFunctions[key]}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                type="button"
                onClick={() => remove(index)}
              >
                <XCircleIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        );
      case "flatten":
        return (
          <div
            className={`mt-2 p-2 border rounded-lg ${layerColor} flex justify-between items-center`}
          >
            <div className="flex items-center gap-2">
              {layerIcons.flatten}
              <span className="font-semibold text-yellow-700">
                Flatten Layer
              </span>
            </div>
            <button
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
              type="button"
              onClick={() => remove(index)}
            >
              <XCircleIcon className="h-3 w-3" /> Remove
            </button>
          </div>
        );
      case "reshape":
        return (
          <div
            className={`mt-2 grid grid-cols-1 gap-3 p-3 border rounded-lg ${layerColor}`}
          >
            <div className="flex items-center gap-2">
              {layerIcons.reshape}
              <span className="font-semibold text-orange-700">
                Reshape Layer
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Target Shape
              </label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-orange-500"
                placeholder="e.g. (512,1)"
                {...register(`model_info.layers.${index}.target_shape`)}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                type="button"
                onClick={() => remove(index)}
              >
                <XCircleIcon className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-red-600 text-sm font-medium mb-4 flex items-center gap-1">
        <XCircleIcon className="h-4 w-4" />
        <span>Note: First layer should be convolutional to avoid errors</span>
      </p>

      {/* Input Layer */}
      <div className="mb-4 p-3 bg-white rounded-lg border">
        <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
          <CubeIcon className="h-4 w-4 text-blue-500" />
          <span>Input Layer</span>
        </h5>
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium">Input Shape:</label>
          <input
            type="text"
            className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., (128,128,1)"
            defaultValue={defaultValues.input_shape}
            {...register("model_info.input_shape")}
          />
        </div>
      </div>

      {/* Layers Section */}
      <div className="mb-4">
        <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
          <ViewColumnsIcon className="h-4 w-4 text-blue-500" />
          <span>Model Layers</span>
        </h5>
        <div className="space-y-2">
          {fields.map((layer, index) => (
            <div key={layer.id} className="bg-white p-2 rounded-lg border">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium">
                  Layer {index + 1}:
                </label>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
                  {layerIcons[layer.layer_type] || (
                    <CubeIcon className="h-3 w-3" />
                  )}
                  <span>
                    {layerTypes[layer.layer_type] || "Select Layer Type"}
                  </span>
                </div>
              </div>

              {renderLayerConfig(layer, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Add Layer Buttons */}
      <div className="mb-6">
        <h5 className="text-xs font-medium mb-2">Add New Layer:</h5>
        <div className="flex flex-wrap gap-2">
          {Object.keys(layerTypes).map((key) => (
            <button
              key={key}
              type="button"
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center space-x-1 border border-blue-100"
              onClick={() => handleAddLayer(key)}
            >
              <PlusCircleIcon className="h-3 w-3" />
              <span>{layerTypes[key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output Layer */}
      <div className="mb-4 p-3 bg-white rounded-lg border">
        <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
          <ChartBarIcon className="h-4 w-4 text-blue-500" />
          <span>Output Layer</span>
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nodes
            </label>
            <input
              type="number"
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
              placeholder="Number of Nodes"
              defaultValue={defaultValues.output_layer.num_nodes}
              {...register("model_info.output_layer.num_nodes")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Activation
            </label>
            <select
              className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
              defaultValue={defaultValues.output_layer.activation_function}
              {...register("model_info.output_layer.activation_function")}
            >
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loss Function Selection */}
      <div className="mb-3 p-3 bg-white rounded-lg border">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Loss Function:
        </label>
        <select
          className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
          defaultValue={defaultValues.loss}
          {...register("model_info.loss")}
        >
          {Object.keys(lossFunctions).map((key) => (
            <option key={key} value={key}>
              {lossFunctions[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Optimizer Selection */}
      <div className="mb-3 p-3 bg-white rounded-lg border">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Optimizer:
        </label>
        <select
          className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
          defaultValue={defaultValues.optimizer}
          {...register("model_info.optimizer")}
        >
          {Object.keys(optimizers).map((key) => (
            <option key={key} value={key}>
              {optimizers[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Test Metrics Selection */}
      <div className="p-3 bg-white rounded-lg border">
        <SelectTestMetrics register={register} />
      </div>
    </div>
  );
};

export default CNN;

// import React, { useState } from "react";
// import { useFieldArray } from "react-hook-form";
// import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
// import SelectTestMetrics from "../RequestComponents/SelectTestMetrics";
// import { useFormContext } from "react-hook-form";

// const activationFunctions = {
//   relu: "ReLU",
//   sigmoid: "Sigmoid",
//   tanh: "Tanh",
//   softmax: "Softmax",
//   leakyRelu: "Leaky ReLU",
//   prelu: "PReLU",
//   thresholdedRelu: "Thresholded ReLU",
//   hardSigmoid: "Hard Sigmoid",
//   exponential: "Exponential",
//   linear: "Linear",
// };

// const optimizers = {
//   sgd: "Stochastic Gradient Descent",
//   rmsprop: "RMSprop (Root Mean Square Propagation)",
//   adam: "Adam (Adaptive Moment Estimation)",
//   adagrad: "Adagrad (Adaptive Gradient Algorithm)",
//   adadelta: "Adadelta (Adaptive Delta)",
//   adamax: "Adamax",
//   nadam: "Nadam (Nesterov-accelerated Adaptive Moment Estimation)",
//   ftrl: "FTRL (Follow-The-Regularized-Leader)",
//   proximalSGD: "ProximalSGD",
//   rmspropGraves: "RMSpropGraves",
// };

// const lossFunctions = {
//   mse: "Mean Squared Error",
//   mae: "Mean Absolute Error",
//   binaryCrossentropy: "Binary Crossentropy",
//   categoricalCrossentropy: "Categorical Crossentropy",
//   hinge: "Hinge",
//   huber: "Huber",
//   klDivergence: "Kullback-Leibler Divergence",
//   logCosh: "Log-Cosh",
//   poisson: "Poisson",
//   sparseCategoricalCrossentropy: "Sparse Categorical Crossentropy",
// };

// const layerTypes = {
//   convolution: "Convolutional",
//   pooling: "Pooling",
//   dense: "Dense",
//   flatten: "Flatten",
//   reshape: "Reshape",
// };

// const poolingTypes = {
//   max: "Max Pooling",
//   average: "Average Pooling",
// };

// const defaultValues = {
//   input_shape: "(128,128,1)",
//   layers: [
//     {
//       layer_type: "convolution",
//       filters: "8",
//       kernel_size: "(5,5)",
//       stride: "(2,2)",
//       activation_function: "relu",
//     },
//     { layer_type: "Dense", num_nodes: "5", activation_function: "sigmoid" },
//     {
//       layer_type: "pooling",
//       pooling_type: "max",
//       pool_size: "(2,2)",
//       stride: "(2,2)",
//     },
//     { layer_type: "reshape", target_shape: "(512,1)" },
//   ],
//   loss: "mse",
//   optimizer: "adam",
//   output_layer: {
//     activation_function: "sigmoid",
//     num_nodes: "1",
//   },
// };

// const CNN = () => {
//   const { control, register, setValue } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "model_info.layers",
//   });

//   const handleAddLayer = (layerType) => {
//     const baseConfig = { layer_type: layerType };

//     switch (layerType) {
//       case "convolution":
//         append({
//           ...baseConfig,
//           filters: "8",
//           kernel_size: "(3,3)",
//           stride: "(1,1)",
//           activation_function: "relu",
//         });
//         break;
//       case "pooling":
//         append({
//           ...baseConfig,
//           pooling_type: "max",
//           pool_size: "(2,2)",
//           stride: "(2,2)",
//         });
//         break;
//       case "dense":
//         append({
//           ...baseConfig,
//           num_nodes: "64",
//           activation_function: "relu",
//         });
//         break;
//       case "reshape":
//         append({
//           ...baseConfig,
//           target_shape: "(128,1)",
//         });
//         break;
//       default:
//         append(baseConfig);
//     }
//   };

//   const renderLayerConfig = (layer, index) => {
//     if (!layer.layer_type) return null;

//     switch (layer.layer_type) {
//       case "convolution":
//         return (
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
//             <div className="col-span-2">
//               <span className="font-semibold text-blue-600">
//                 Convolutional Layer
//               </span>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Filters
//               </label>
//               <input
//                 type="number"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="Number of Filters"
//                 {...register(`model_info.layers.${index}.filters`)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Kernel Size
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. (5,5)"
//                 {...register(`model_info.layers.${index}.kernel_size`)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Stride
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. (2,2)"
//                 {...register(`model_info.layers.${index}.stride`)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Activation
//               </label>
//               <select
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 {...register(`model_info.layers.${index}.activation_function`)}
//               >
//                 {Object.keys(activationFunctions).map((key) => (
//                   <option key={key} value={key}>
//                     {activationFunctions[key]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-span-2 flex justify-end">
//               <button
//                 className="btn btn-danger flex items-center gap-1 text-sm"
//                 type="button"
//                 onClick={() => remove(index)}
//               >
//                 <XCircleIcon className="h-4 w-4" /> Remove Layer
//               </button>
//             </div>
//           </div>
//         );
//       case "pooling":
//         return (
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
//             <div className="col-span-2">
//               <span className="font-semibold text-blue-600">Pooling Layer</span>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Pooling Type
//               </label>
//               <select
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 {...register(`model_info.layers.${index}.pooling_type`)}
//               >
//                 {Object.keys(poolingTypes).map((key) => (
//                   <option key={key} value={key}>
//                     {poolingTypes[key]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Pool Size
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. (2,2)"
//                 {...register(`model_info.layers.${index}.pool_size`)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Stride
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. (2,2)"
//                 {...register(`model_info.layers.${index}.stride`)}
//               />
//             </div>

//             <div className="col-span-2 flex justify-end">
//               <button
//                 className="btn btn-danger flex items-center gap-1 text-sm"
//                 type="button"
//                 onClick={() => remove(index)}
//               >
//                 <XCircleIcon className="h-4 w-4" /> Remove Layer
//               </button>
//             </div>
//           </div>
//         );
//       case "dense":
//         return (
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
//             <div className="col-span-2">
//               <span className="font-semibold text-blue-600">Dense Layer</span>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Number of Nodes
//               </label>
//               <input
//                 type="number"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. 64"
//                 {...register(`model_info.layers.${index}.num_nodes`)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Activation
//               </label>
//               <select
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 {...register(`model_info.layers.${index}.activation_function`)}
//               >
//                 {Object.keys(activationFunctions).map((key) => (
//                   <option key={key} value={key}>
//                     {activationFunctions[key]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-span-2 flex justify-end">
//               <button
//                 className="btn btn-danger flex items-center gap-1 text-sm"
//                 type="button"
//                 onClick={() => remove(index)}
//               >
//                 <XCircleIcon className="h-4 w-4" /> Remove Layer
//               </button>
//             </div>
//           </div>
//         );
//       case "flatten":
//         return (
//           <div className="mt-2 p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
//             <span className="font-semibold text-blue-600">Flatten Layer</span>
//             <button
//               className="btn btn-danger flex items-center gap-1 text-sm"
//               type="button"
//               onClick={() => remove(index)}
//             >
//               <XCircleIcon className="h-4 w-4" /> Remove Layer
//             </button>
//           </div>
//         );
//       case "reshape":
//         return (
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
//             <div className="col-span-2">
//               <span className="font-semibold text-blue-600">Reshape Layer</span>
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Target Shape
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g. (512,1)"
//                 {...register(`model_info.layers.${index}.target_shape`)}
//               />
//             </div>

//             <div className="col-span-2 flex justify-end">
//               <button
//                 className="btn btn-danger flex items-center gap-1 text-sm"
//                 type="button"
//                 onClick={() => remove(index)}
//               >
//                 <XCircleIcon className="h-4 w-4" /> Remove Layer
//               </button>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-100 rounded-lg shadow">
//       <p className="text-red-600 font-medium mb-4">
//         Note: Keeping the first layer as convolution is mandatory to avoid
//         errors.
//       </p>

//       {/* Input Layer */}
//       <div className="mb-6">
//         <h5 className="text-lg font-semibold mb-2">Input Layer:</h5>
//         <div className="flex flex-col space-y-2">
//           <label className="text-sm font-medium">Input Shape:</label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             placeholder="e.g., (128,128,1)"
//             defaultValue={defaultValues.input_shape}
//             {...register("model_info.input_shape")}
//           />
//         </div>
//       </div>

//       {/* Layers Section */}
//       <div className="mb-6">
//         <h5 className="text-lg font-semibold mb-2">Layers:</h5>
//         <div className="space-y-4">
//           {fields.map((layer, index) => (
//             <div key={layer.id} className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-sm font-medium">Layer Type:</label>
//                 <select
//                   className="w-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   value={layer.layer_type || ""}
//                   onChange={(e) => {
//                     setValue(
//                       `model_info.layers.${index}.layer_type`,
//                       e.target.value
//                     );
//                   }}
//                 >
//                   <option value="">Select Layer Type</option>
//                   {Object.keys(layerTypes).map((key) => (
//                     <option key={key} value={key}>
//                       {layerTypes[key]}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {renderLayerConfig(layer, index)}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add Layer Buttons */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         <span className="text-sm font-medium w-full">Add New Layer:</span>
//         {Object.keys(layerTypes).map((key) => (
//           <button
//             key={key}
//             type="button"
//             className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
//             onClick={() => handleAddLayer(key)}
//           >
//             <PlusCircleIcon className="h-4 w-4" />
//             <span>Add {layerTypes[key]}</span>
//           </button>
//         ))}
//       </div>

//       {/* Output Layer */}
//       <div className="mb-6">
//         <h5 className="text-lg font-semibold mb-2">Output Layer:</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Number of Nodes
//             </label>
//             <input
//               type="number"
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Number of Nodes"
//               defaultValue={defaultValues.output_layer.num_nodes}
//               {...register("model_info.output_layer.num_nodes")}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Activation Function
//             </label>
//             <select
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               defaultValue={defaultValues.output_layer.activation_function}
//               {...register("model_info.output_layer.activation_function")}
//             >
//               {Object.keys(activationFunctions).map((key) => (
//                 <option key={key} value={key}>
//                   {activationFunctions[key]}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loss Function Selection */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Loss Function:
//         </label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           defaultValue={defaultValues.loss}
//           {...register("model_info.loss")}
//         >
//           {Object.keys(lossFunctions).map((key) => (
//             <option key={key} value={key}>
//               {lossFunctions[key]}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Optimizer Selection */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Optimizer:
//         </label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           defaultValue={defaultValues.optimizer}
//           {...register("model_info.optimizer")}
//         >
//           {Object.keys(optimizers).map((key) => (
//             <option key={key} value={key}>
//               {optimizers[key]}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Test Metrics Selection */}
//       <div>
//         <SelectTestMetrics register={register} />
//       </div>
//     </div>
//   );
// };

// export default CNN;

// import React, { useState } from "react";
// import { useFieldArray } from "react-hook-form";
// import { XCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
// import SelectTestMetrics from "../RequestComponents/SelectTestMetrics";
// import { useFormContext } from "react-hook-form";

// const activationFunctions = {
//   relu: "ReLU",
//   sigmoid: "Sigmoid",
//   tanh: "Tanh",
//   softmax: "Softmax",
//   leakyRelu: "Leaky ReLU",
//   prelu: "PReLU",
//   thresholdedRelu: "Thresholded ReLU",
//   hardSigmoid: "Hard Sigmoid",
//   exponential: "Exponential",
//   linear: "Linear",
// };

// const optimizers = {
//   sgd: "Stochastic Gradient Descent",
//   rmsprop: "RMSprop (Root Mean Square Propagation)",
//   adam: "Adam (Adaptive Moment Estimation)",
//   adagrad: "Adagrad (Adaptive Gradient Algorithm)",
//   adadelta: "Adadelta (Adaptive Delta)",
//   adamax: "Adamax",
//   nadam: "Nadam (Nesterov-accelerated Adaptive Moment Estimation)",
//   ftrl: "FTRL (Follow-The-Regularized-Leader)",
//   proximalSGD: "ProximalSGD",
//   rmspropGraves: "RMSpropGraves",
// };

// const lossFunctions = {
//   mse: "Mean Squared Error",
//   mae: "Mean Absolute Error",
//   binaryCrossentropy: "Binary Crossentropy",
//   categoricalCrossentropy: "Categorical Crossentropy",
//   hinge: "Hinge",
//   huber: "Huber",
//   klDivergence: "Kullback-Leibler Divergence",
//   logCosh: "Log-Cosh",
//   poisson: "Poisson",
//   sparseCategoricalCrossentropy: "Sparse Categorical Crossentropy",
// };

// const layerTypes = {
//   convolution: "Convolutional",
//   pooling: "Pooling",
//   dense: "Dense",
//   flatten: "Flatten",
//   reshape: "Reshape",
// };

// const poolingTypes = {
//   max: "Max Pooling",
//   average: "Average Pooling",
// };

// /*

// Checks/validation can be included in the componenet later as these not invlove changing something out of this file...
// this can be done by simply implementing the validation schema and Resolvers from react-hook-form to link the
// checks mentioned in the schema

// schema of this component (model_info obj generated by this component):

// ==================================================
// {
//   input_shape: "(128,128,1)",
//   layers: Arbitrary Array like below..
//     [
//       {layer_type: 'dense', num_nodes: '5', activation_function: 'sigmoid'},
//       {layer_type: 'flatten'},
//       {layer_type: ''},
//       {layer_type: 'convolution', filters: '8', kernel_size: '(5,5)', stride: '(2,2)', activation_function: 'relu'},
//       {layer_type: 'reshape', target_shape: '(512,1)'},
//       {layer_type: 'pooling', pooling_type: 'max', pool_size: '(2,2)', stride: '(2,2)'},
//       {layer_type: ''}
//     ],
//   loss: string,
//   optimizer: string,
//   output_layer:
//     {
//       activation_function: string,
//       num_nodes: string
//     }
// }
// ==================================================
// */

// const defaultValues = {
//   input_shape: "(128,128,1)",
//   layers: [
//     {
//       layer_type: "convolution",
//       filters: "8",
//       kernel_size: "(5,5)",
//       stride: "(2,2)",
//       activation_function: "relu",
//     },
//     { layer_type: "Dense", num_nodes: "5", activation_function: "sigmoid" },
//     {
//       layer_type: "pooling",
//       pooling_type: "max",
//       pool_size: "(2,2)",
//       stride: "(2,2)",
//     },
//     { layer_type: "reshape", target_shape: "(512,1)" },
//   ],
//   loss: "mse",
//   optimizer: "adam",
//   output_layer: {
//     activation_function: "sigmoid",
//     num_nodes: "1",
//   },
// };

// // don't remove the comments now..
// const CNN = () => {
//   // const [layerVisibilities, setLayerVisibilities] = useState({});
//   const { control, register } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "model_info.layers",
//   });

//   // const changeVisibility = (index, event) => {
//   //   const value = event.target.value;
//   //   setLayerVisibilities((prev) => ({
//   //     ...prev,
//   //     [index]: value !== "", // Show config if layer_type is not empty
//   //   }));
//   // };

//   const renderLayerConfig = (layer, index) => {
//     switch (layer.layer_type) {
//       case "convolution":
//         return (
//           <div
//             key={layer.id}
//             className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
//           >
//             <span className="font-semibold">Convolutional Layer</span>

//             <input
//               type="number"
//               className="input"
//               placeholder="Number of Filters e.g. 32"
//               {...register(`model_info.layers.${index}.filters`)}
//             />

//             <input
//               type="text"
//               className="input"
//               placeholder="Kernel Size e.g. (5,5)"
//               {...register(`model_info.layers.${index}.kernel_size`)}
//             />

//             <input
//               type="text"
//               className="input"
//               placeholder="Stride e.g. (2,2)"
//               {...register(`model_info.layers.${index}.stride`)}
//             />

//             <select
//               className="select"
//               {...register(`model_info.layers.${index}.activation_function`)}
//             >
//               <option value="">Select Activation Function</option>
//               {Object.keys(activationFunctions).map((key) => (
//                 <option key={key} value={key}>
//                   {activationFunctions[key]}
//                 </option>
//               ))}
//             </select>

//             <button
//               className="btn btn-danger flex items-center gap-2"
//               type="button"
//               onClick={() => remove(index)}
//             >
//               <XCircleIcon className="h-5 w-5" /> Remove
//             </button>
//           </div>
//         );
//       case "pooling":
//         return (
//           <div
//             key={layer.id}
//             className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
//           >
//             <span className="font-semibold">Pooling Layer</span>

//             <select
//               className="select"
//               {...register(`model_info.layers.${index}.pooling_type`)}
//             >
//               <option value="">Select Pooling Type</option>
//               {Object.keys(poolingTypes).map((key) => (
//                 <option key={key} value={key}>
//                   {poolingTypes[key]}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               className="input"
//               placeholder="Pool Size e.g. (2,2)"
//               {...register(`model_info.layers.${index}.pool_size`)}
//             />

//             <button
//               className="btn btn-danger flex items-center gap-2"
//               type="button"
//               onClick={() => remove(index)}
//             >
//               <XCircleIcon className="h-5 w-5" /> Remove
//             </button>
//           </div>
//         );
//       case "flatten":
//         return (
//           <div
//             key={layer.id}
//             className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
//           >
//             <span className="font-semibold">Flatten Layer</span>

//             {/* Remove button */}
//             <button
//               className="btn btn-danger flex items-center gap-2"
//               type="button"
//               onClick={() => remove(index)}
//             >
//               {" "}
//               Remove{" "}
//             </button>
//           </div>
//         );
//       case "reshape":
//         return (
//           <div
//             key={layer.id}
//             className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm"
//           >
//             <span className="font-semibold">Reshape Layer</span>

//             {/* Reshape target shape */}
//             <input
//               type="text"
//               className="input"
//               placeholder="Target Shape  e.g. (64, 64, 3) or (512,1)"
//               defaultValue={defaultValues.layers[3].target_shape}
//               {...register(`model_info.layers.${index}.target_shape`)}
//             />

//             {/* Remove button */}
//             <button
//               className="btn btn-danger flex items-center gap-2"
//               type="button"
//               onClick={() => remove(index)}
//             >
//               <XCircleIcon className="h-5 w-5" /> Remove
//             </button>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // Start of model_info component
//   return (
//     <div className="p-4 bg-gray-100 rounded-lg shadow">
//       <p className="text-red-600 font-medium">
//         Note: Keeping the first layer as convolution is mandatory to avoid
//         errors.
//       </p>

//       {/* Input Layer */}
//       <h5 className="text-lg font-semibold mt-4">Input Layer:</h5>
//       <div className="flex items-center space-x-2">
//         <label className="text-sm font-medium">Input Shape:</label>
//         <input
//           type="text"
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           placeholder="e.g., 64, 64, 3"
//           defaultValue={defaultValues.input_shape}
//           {...register("model_info.input_shape")}
//         />
//       </div>

//       {/* Layers Section */}
//       <h5 className="text-lg font-semibold mt-6">Layers:</h5>
//       <div id="parent-template-div">
//         {fields.map((layer, index) => (
//           <div key={layer.id} className="bg-white p-4 rounded-lg shadow mb-4">
//             <div className="flex items-center space-x-2">
//               <label className="text-sm font-medium">Layer Type:</label>
//               <select
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 {...register(`model_info.layers.${index}.layer_type`)}
//               >
//                 <option value="">Select Layer Type</option>
//                 {Object.keys(layerTypes).map((key) => (
//                   <option key={key} value={key}>
//                     {layerTypes[key]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Rendering Layer Configurations */}
//             {renderLayerConfig(layer, index)}
//           </div>
//         ))}
//       </div>

//       {/* Add Layer Button */}
//       <button
//         type="button"
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//         onClick={() => append({ layer_type: "" })}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 4v16m8-8H4"
//           />
//         </svg>
//         <span>Add Layer</span>
//       </button>

//       {/* Output Layer */}
//       <h5 className="text-lg font-semibold mt-6">Output Layer:</h5>
//       <div className="flex items-center space-x-2">
//         <label className="text-sm font-medium">Output Shape:</label>
//         <input
//           type="number"
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           placeholder="Number of Nodes"
//           defaultValue={defaultValues.output_layer.num_nodes}
//           {...register("model_info.output_layer.num_nodes")}
//         />
//       </div>

//       <div className="flex items-center space-x-2 mt-2">
//         <label className="text-sm font-medium">Activation Function:</label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           defaultValue={defaultValues.output_layer.activation_function}
//           {...register("model_info.output_layer.activation_function")}
//         >
//           <option value="">Select Activation Function</option>
//           {Object.keys(activationFunctions).map((key) => (
//             <option key={key} value={key}>
//               {activationFunctions[key]}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Loss Function Selection */}
//       <div className="mt-4">
//         <label className="text-sm font-medium">Loss Function:</label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           defaultValue={defaultValues.loss}
//           {...register("model_info.loss")}
//         >
//           <option value="">Select Loss Function</option>
//           {Object.keys(lossFunctions).map((key) => (
//             <option key={key} value={key}>
//               {lossFunctions[key]}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Optimizer Selection */}
//       <div className="mt-4">
//         <label className="text-sm font-medium">Optimizer:</label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           defaultValue={defaultValues.optimizer}
//           {...register("model_info.optimizer")}
//         >
//           <option value="">Select Optimizer</option>
//           {Object.keys(optimizers).map((key) => (
//             <option key={key} value={key}>
//               {optimizers[key]}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Test Metrics Selection */}
//       <div className="mt-4">
//         <SelectTestMetrics register={register} />
//       </div>
//     </div>
//   );
// };

// export default CNN;
