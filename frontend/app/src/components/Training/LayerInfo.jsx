const LayerInfo = ({ layer }) => (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow mt-4">
      <h4 className="font-bold text-indigo-600 mb-2">{layer.layer_type}</h4>
      <ul className="space-y-2">
        {layer.layer_type === "convolution" && (
          <>
            <li className="flex justify-between">
              <span className="text-gray-600">Filters:</span>
              <span className="font-medium">{layer.filters || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Kernel Size:</span>
              <span className="font-medium">{layer.kernel_size || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Stride:</span>
              <span className="font-medium">{layer.stride || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Activation Function:</span>
              <span className="font-medium">
                {layer.activation_function || "N/A"}
              </span>
            </li>
          </>
        )}
        {layer.layer_type === "pooling" && (
          <>
            <li className="flex justify-between">
              <span className="text-gray-600">Pooling Type:</span>
              <span className="font-medium">{layer.pooling_type || "N/A"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Pool Size:</span>
              <span className="font-medium">{layer.pool_size || "N/A"}</span>
            </li>
          </>
        )}
        {layer.layer_type === "flatten" && (
          <li className="text-gray-500 italic">
            No additional details available
          </li>
        )}
      </ul>
    </div>
  );

export default LayerInfo;