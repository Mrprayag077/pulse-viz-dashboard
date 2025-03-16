import { LoaderCircle } from "lucide-react";

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center rounded-2xl h-screen bg-gray-900">
      <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white rounded-full shadow-2xl animate-pulse">
        <LoaderCircle className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingComponent;
