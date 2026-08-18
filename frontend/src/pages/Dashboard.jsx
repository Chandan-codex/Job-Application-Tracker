import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import FilterBar from "../components/FilterBar";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const { user, token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  // Fetch all applications for the current user
  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  // Compute dashboard statistics dynamically
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
    const interview = applications.filter((a) => a.status === "Interview").length;
    const selected = applications.filter((a) => a.status === "Selected").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;

    return { total, applied, shortlisted, interview, selected, rejected };
  }, [applications]);

  // Filtered applications based on search and status dropdown
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Add or Edit success handler
  const handleFormSuccess = (savedApp) => {
    if (editingApplication) {
      // Update existing item in state
      setApplications((prev) =>
        prev.map((app) => (app._id === savedApp._id ? savedApp : app))
      );
    } else {
      // Prepend new item in state
      setApplications((prev) => [savedApp, ...prev]);
    }
  };

  // Open modal in create mode
  const handleOpenCreate = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (app) => {
    setEditingApplication(app);
    setIsFormOpen(true);
  };

  // Delete application handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete application");
      }

      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "Job Hunter"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your job search progress, interview schedules, and application outcomes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
        >
          <span className="text-base mr-1.5 font-bold">+</span> Add Application
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total
          </span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Applied
          </span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{stats.applied}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm text-center">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Shortlisted
          </span>
          <p className="text-2xl font-bold text-purple-700 mt-1">{stats.shortlisted}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm text-center">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Interview
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats.interview}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm text-center">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
            Selected
          </span>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.selected}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm text-center">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
            Rejected
          </span>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={fetchApplications}
            className="text-red-700 font-semibold underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Applications Grid / States */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-3 text-sm text-gray-500">Loading your applications...</p>
        </div>
      ) : filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-gray-900">No applications added yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Start organizing your job search by logging your first application.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            + Add Your First Application
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-gray-900">No matching applications found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search query or status filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
            }}
            className="mt-4 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ApplicationForm
        isOpen={isFormOpen}
        initialData={editingApplication}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </main>
  );
};

export default Dashboard;
