import { InformationCircleIcon } from "@heroicons/react/24/outline";
import InfoItem from "./InfoItem";
import FeatureList from "./FeatureList";

const DatasetInfo = ({ data }) => (
  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
        <InformationCircleIcon className="h-5 w-5 text-indigo-700 mr-2" />
        Dataset Information
      </h3>
      <InfoItem
        label="About Dataset"
        value={data?.dataset_info?.about_dataset}
      />
      <FeatureList
        label="Feature List"
        features={data?.dataset_info?.feature_list}
      />
    </div>
  </div>
);

export default DatasetInfo;
