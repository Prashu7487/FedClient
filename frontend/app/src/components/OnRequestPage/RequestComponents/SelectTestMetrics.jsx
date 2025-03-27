// import { CheckCircleIcon } from "@heroicons/react/24/outline";

const testMetricsOptions = [
  { value: "mse", label: "Mean Squared Error" },
  { value: "mae", label: "Mean Absolute Error" },
  { value: "rmse", label: "Root Mean Squared Error" },
  { value: "msle", label: "Mean Squared Logarithmic Error" },
  { value: "mape", label: "Mean Absolute Percentage Error" },
  { value: "accuracy", label: "Accuracy" },
  { value: "precision", label: "Precision" },
  { value: "recall", label: "Recall" },
  { value: "f1_score", label: "F1 Score" },
  { value: "auc", label: "Area Under Curve (AUC)" },
  { value: "log_loss", label: "Log Loss" },
  { value: "r2_score", label: "R^2 Score" },
];

// Multiselect Component for Test Metrics

const SelectTestMetrics = ({ register }) => {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h5 className="text-lg font-semibold text-gray-700 mb-3">
        Select Test Metrics:
      </h5>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {testMetricsOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
          >
            <input
              type="checkbox"
              value={option.value}
              id={`test-metric-${option.value}`}
              className="w-4 h-4 accent-blue-500"
              {...register("model_info.test_metrics")}
            />
            <span className="text-gray-700 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectTestMetrics;

// multi import and export
// export { TestMetricsMultiselect, LossSelect, ActivationSelect };
// import { TestMetricsMultiselect, LossSelect, ActivationSelect } from './Components';
