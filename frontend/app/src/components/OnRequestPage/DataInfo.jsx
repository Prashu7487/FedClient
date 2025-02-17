import React from "react";
import { useFieldArray, Controller } from "react-hook-form";

export default function DataInfo({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dataset_info.feature_list",
  });

  return (
    <div className="container mt-3">
      {/* About Dataset */}
      <div className="input-group mb-3">
        <span className="input-group-text">About Dataset:</span>
        <input
          type="text"
          id="datainfo"
          aria-label="About Dataset"
          className="form-control"
          placeholder="Name, purpose, etc.."
          {...register(`dataset_info.about_dataset`)}
        />
      </div>

      {/* Parent Div (where cloned elements will be inserted) */}
      <div id="parent-template-div">
        {fields.map((field, index) => (
          <div key={field.id} className="input-group mb-3">
            <span className="input-group-text">Column Name and Type</span>
            <Controller
              render={({ field }) => (
                <input
                  {...field}
                  className="form-control"
                  placeholder="Feature Name"
                />
              )}
              name={`dataset_info.feature_list.${index}.feature_name`}
              control={control}
              defaultValue=""
            />
            <Controller
              render={({ field }) => (
                <input
                  {...field}
                  className="form-control"
                  placeholder="Type of Feature"
                />
              )}
              name={`dataset_info.feature_list.${index}.type_Of_feature`}
              control={control}
              defaultValue=""
            />
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
        className="btn btn-dark"
        onClick={() => append({ feature_name: "", type_Of_feature: "" })}
      >
        Add Feature
      </button>
    </div>
  );
}
