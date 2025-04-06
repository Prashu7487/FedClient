import { InformationCircleIcon } from "@heroicons/react/24/outline";
import FeatureList from "./FeatureList";
import InfoItem from "./InfoItem";
import LayerInfo from "./LayerInfo";

const ModelConfig = ({ data }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100">
    <div className="bg-white p-5 rounded-xl border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-indigo-700 mr-2" />
          Model Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <InfoItem label="Input Shape" value={data?.model_info?.input_shape} />
          <InfoItem label="Loss Function" value={data?.model_info?.loss} />
          <InfoItem label="Optimizer" value={data?.model_info?.optimizer} />
          <InfoItem
            label="Number of Nodes"
            value={data?.model_info?.output_layer?.num_nodes}
          />
          <InfoItem
            label="Activation Function"
            value={data?.model_info?.output_layer?.activation_function}
          />
        </div>
        <FeatureList
          label="Test Metrics"
          features={data?.model_info?.test_metrics}
        />

        {/* Model Architecture - Layers */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Model Architecture (Layers)
          </h4>
          {data?.model_info?.layers?.length > 0 ? (
            data.model_info.layers.map((layer, index) => (
              <LayerInfo key={index} layer={layer} />
            ))
          ) : (
            <div className="text-gray-400">No layer information available</div>
          )}
        </div>
      </div>
  </div>
);

export default ModelConfig;
