import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

const CNN = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      model_info: {
        input_shape: "",
        layers: [],
        output_layer: {
          num_nodes: "",
          activation_function: "",
        },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "model_info.layers",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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

  const layerTypes = {
    convolution: "Convolutional",
    pooling: "Pooling",
    dense: "Dense",
  };

  const poolingTypes = {
    max: "Max Pooling",
    average: "Average Pooling",
  };

  const renderLayerConfig = (layer, index) => {
    switch (layer.layer_type) {
      case "convolution":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Convolutional Layer</span>
            <input
              type="number"
              className="form-control"
              placeholder="Number of Filters"
              {...register(`model_info.layers.${index}.filters`, {
                required: true,
                min: 1,
              })}
            />
            {errors.model_info?.layers?.[index]?.filters && (
              <span className="text-danger">Number of filters is required</span>
            )}
            <input
              type="text"
              className="form-control"
              placeholder="Kernel Size"
              {...register(`model_info.layers.${index}.kernel_size`, {
                required: true,
              })}
            />
            {errors.model_info?.layers?.[index]?.kernel_size && (
              <span className="text-danger">Kernel size is required</span>
            )}
            <input
              type="text"
              className="form-control"
              placeholder="Stride"
              {...register(`model_info.layers.${index}.stride`, {
                required: true,
              })}
            />
            {errors.model_info?.layers?.[index]?.stride && (
              <span className="text-danger">Stride is required</span>
            )}
            <select
              className="form-select"
              {...register(`model_info.layers.${index}.activation_function`, {
                required: true,
              })}
            >
              <option value="">Select Activation Function</option>
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>
            {errors.model_info?.layers?.[index]?.activation_function && (
              <span className="text-danger">
                Activation function is required
              </span>
            )}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );
      case "pooling":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Pooling Layer</span>
            <select
              className="form-select"
              {...register(`model_info.layers.${index}.pooling_type`, {
                required: true,
              })}
            >
              <option value="">Select Pooling Type</option>
              {Object.keys(poolingTypes).map((key) => (
                <option key={key} value={key}>
                  {poolingTypes[key]}
                </option>
              ))}
            </select>
            {errors.model_info?.layers?.[index]?.pooling_type && (
              <span className="text-danger">Pooling type is required</span>
            )}
            <input
              type="text"
              className="form-control"
              placeholder="Pool Size"
              {...register(`model_info.layers.${index}.pool_size`, {
                required: true,
              })}
            />
            {errors.model_info?.layers?.[index]?.pool_size && (
              <span className="text-danger">Pool size is required</span>
            )}
            <input
              type="text"
              className="form-control"
              placeholder="Stride"
              {...register(`model_info.layers.${index}.stride`, {
                required: true,
              })}
            />
            {errors.model_info?.layers?.[index]?.stride && (
              <span className="text-danger">Stride is required</span>
            )}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );
      case "dense":
        return (
          <div key={layer.id} className="input-group mb-2">
            <span className="input-group-text">Dense Layer</span>
            <input
              type="number"
              className="form-control"
              placeholder="Number of Nodes"
              {...register(`model_info.layers.${index}.num_nodes`, {
                required: true,
                min: 1,
              })}
            />
            {errors.model_info?.layers?.[index]?.num_nodes && (
              <span className="text-danger">Number of nodes is required</span>
            )}
            <select
              className="form-select"
              {...register(`model_info.layers.${index}.activation_function`, {
                required: true,
              })}
            >
              <option value="">Select Activation Function</option>
              {Object.keys(activationFunctions).map((key) => (
                <option key={key} value={key}>
                  {activationFunctions[key]}
                </option>
              ))}
            </select>
            {errors.model_info?.layers?.[index]?.activation_function && (
              <span className="text-danger">
                Activation function is required
              </span>
            )}
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h5>Input Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Input Shape</span>
        <input
          type="text"
          className="form-control"
          placeholder="e.g., 64, 64, 3"
          {...register("model_info.input_shape", { required: true })}
        />
        {errors.model_info?.input_shape && (
          <span className="text-danger">Input shape is required</span>
        )}
      </div>

      <h5>Layers:</h5>
      <div id="parent-template-div">
        {fields.map((layer, index) => (
          <div key={layer.id}>
            <div className="input-group mb-2">
              <span className="input-group-text">Layer Type</span>
              <select
                className="form-select"
                {...register(`model_info.layers.${index}.layer_type`, {
                  required: true,
                })}
              >
                <option value="">Select Layer Type</option>
                {Object.keys(layerTypes).map((key) => (
                  <option key={key} value={key}>
                    {layerTypes[key]}
                  </option>
                ))}
              </select>
              {errors.model_info?.layers?.[index]?.layer_type && (
                <span className="text-danger">Layer type is required</span>
              )}
            </div>
            {renderLayerConfig(layer, index)}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => append({ layer_type: "" })}
      >
        Add Layer
      </button>

      <h5>Output Layer:</h5>
      <div className="input-group mb-3">
        <span className="input-group-text">Output Shape</span>
        <input
          type="number"
          className="form-control"
          placeholder="Number of Nodes"
          {...register("model_info.output_layer.num_nodes", {
            required: true,
            min: 1,
          })}
        />
        {errors.model_info?.output_layer?.num_nodes && (
          <span className="text-danger">Number of nodes is required</span>
        )}
        <select
          className="form-select"
          {...register("model_info.output_layer.activation_function", {
            required: true,
          })}
        >
          <option value="">Select Activation Function</option>
          {Object.keys(activationFunctions).map((key) => (
            <option key={key} value={key}>
              {activationFunctions[key]}
            </option>
          ))}
        </select>
        {errors.model_info?.output_layer?.activation_function && (
          <span className="text-danger">Activation function is required</span>
        )}
      </div>

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
};

export default CNN;
