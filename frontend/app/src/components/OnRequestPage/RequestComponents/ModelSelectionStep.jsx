import React from "react";
import { CubeIcon } from "@heroicons/react/24/outline";
import { availableModels } from "./modelsConfig";
import { useFormContext } from "react-hook-form";

export default function ModelSelectionStep() {
  const { register, watch } = useFormContext();
  const selectedModel = watch("model_name");

  const ModelComponent = selectedModel
    ? availableModels[selectedModel]?.component
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CubeIcon className="h-6 w-6 text-purple-600" />
        <h4 className="text-lg font-semibold">Model Selection</h4>
      </div>

      <select
        {...register("model_name", { required: true })}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select your model</option>
        {Object.entries(availableModels).map(([key, model]) => (
          <option key={key} value={key}>
            {model.label}
          </option>
        ))}
      </select>

      {ModelComponent && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <ModelComponent />
        </div>
      )}
    </div>
  );
}

// import React from "react";
// import { CubeIcon } from "@heroicons/react/24/outline";
// import { availableModels } from "./modelsConfig.jsx";
// import { useFormContext } from "react-hook-form";

// export default function ModelSelectionStep() {
//   const {
//     register,
//     watch,
//     formState: { errors },
//   } = useFormContext();
//   const selectedModelKey = watch("model_name");
//   const ModelComponent = availableModels[selectedModelKey]?.component;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-2">
//         <CubeIcon className="h-6 w-6 text-purple-600" />
//         <h4 className="text-lg font-semibold">Model Selection</h4>
//       </div>

//       <select
//         {...register("model_name", { required: true })}
//         className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//       >
//         <option value="">Select your model</option>
//         {Object.keys(availableModels).map((modelKey) => (
//           <option key={modelKey} value={modelKey}>
//             {availableModels[modelKey].label}
//           </option>
//         ))}
//       </select>

//       {errors.model_name && (
//         <p className="text-red-500 text-sm mt-1">Please select a model</p>
//       )}

//       <div className="model-configuration">
//         {ModelComponent && <ModelComponent register={register} />}
//       </div>
//     </div>
//   );
// }
