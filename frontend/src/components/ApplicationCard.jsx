import React from "react";

const getStatusBadge = (status) => {
  switch (status) {
    case "Applied":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Shortlisted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Interview":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Selected":
      return "bg-green-50 text-green-700 border-green-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ApplicationCard = ({ application, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top row: Company, Position & Status Badge */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {application.company}
            </h3>
            <p className="text-sm font-medium text-gray-600 mt-0.5">
              {application.position}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="space-y-1.5 text-xs text-gray-600 my-3">
          {application.jobType && (
            <div className="flex items-center space-x-1.5">
              <span className="font-medium text-gray-500">Type:</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                {application.jobType}
              </span>
            </div>
          )}

          {application.location && (
            <div className="flex items-center space-x-1.5">
              <span className="font-medium text-gray-500">Location:</span>
              <span>📍 {application.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-gray-500">Applied:</span>
            <span>📅 {formatDate(application.applicationDate)}</span>
          </div>

          {application.interviewDate && (
            <div className="flex items-center space-x-1.5 text-amber-700 font-medium">
              <span className="text-gray-500">Interview:</span>
              <span>⏰ {formatDate(application.interviewDate)}</span>
            </div>
          )}

          {application.notes && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic line-clamp-3">
                "{application.notes}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-3 mt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(application)}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(application._id)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
