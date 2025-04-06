import { InformationCircleIcon } from "@heroicons/react/24/outline";
import InfoItem from "./InfoItem";
import StatusItem from "./StatusItem";


const SessionInfo = ({ data }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 mb-6">
    {/* Session Information Header */}
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
      <InformationCircleIcon className="h-5 w-5 text-indigo-700 mr-2" />
      Session Information
    </h3>

    {/* Session Details Grid */}
    <div className="bg-white p-5 rounded-xl border border-gray-100 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
        <InformationCircleIcon className="h-5 w-5 text-indigo-700 mr-2" />
        Session Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <InfoItem label="Organisation Name" value={data?.organisation_name} />
        <InfoItem label="Model Name" value={data?.model_name} />
        <InfoItem label="Standard Mean" value={data?.std_mean} />
        <InfoItem label="Standard Deviation" value={data?.std_deviation} />
        <StatusItem
          label="Training Status"
          status={data?.training_status === 1 ? "In Progress" : "Not Started"}
        />
        <StatusItem
          label="Client Status"
          status={data?.client_status === 2 ? "Connected" : "Disconnected"}
        />
      </div>
    </div>
  </div>
);

export default SessionInfo;
