import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const url_get_all_dataset = process.env.REACT_APP_GET_DATASET;

const DatasetCard = ({ dataset }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/Datasets/${dataset.code}`);
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div
            onClick={handleCardClick}
            className="flex items-center border-b py-4 hover:bg-gray-50 cursor-pointer"
        >
            {/* Dataset Image or Initials */}
            <div className="w-32 h-24 flex-shrink-0">
                {dataset.image ? (
                    <img
                        src={dataset.image}
                        alt={dataset.name}
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-300 text-white text-xl font-bold rounded-md">
                        {getInitials(dataset.name)}
                    </div>
                )}
            </div>

            {/* Dataset Details */}
            <div className="ml-4 flex-1">
                <h3 className="text-xl font-semibold text-blue-700 mb-1">
                    {dataset.name}
                    {dataset.subtitle && (
                        <span className="text-gray-600 font-medium ml-2">
                            ({dataset.subtitle})
                        </span>
                    )}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {dataset.description}
                </p>
                <div className="flex text-sm text-gray-500">
                    <span className="mr-6">
                        <strong className="text-gray-700">{dataset.paper_count || 0}</strong> Papers
                    </span>
                    <span>
                        <strong className="text-gray-700">{dataset.benchmark_count || 0}</strong> Benchmarks
                    </span>
                </div>
            </div>
        </div>
    );
};

const DatasetList = () => {
    const [datasets, setDatasets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDatasets = async () => {
        try {
            const res = await axios.get(url_get_all_dataset);
            console.log('Dataset fetched from Server:', res.data);
            setDatasets(res.data);
        } catch (error) {
            console.log('Error Fetching Data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchDatasets();
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <p className="text-center">Loading datasets...</p>;
    }

    return (
        <div className="p-6 font-sans max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Datasets</h2>
            <div className="divide-y">
                {datasets.map((dataset, index) => (
                    <DatasetCard key={index} dataset={dataset} />
                ))}
            </div>
        </div>
    );
};

export default DatasetList;
