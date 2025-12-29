import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Home,
  Loader,
  Filter,
  Search,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { backendurl } from "../config/constants";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAppointments = async () => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${backendurl}/api/appointments/all`,  // 👈 must be /all
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (response.data.success) {
      const raw = response.data.appointments || [];

      const mapped = raw.map((apt) => ({
  _id: apt._id,
  propertyId: {
    title: apt.property?.title || "Unknown property",
    // join city + state (or address) into a string
    location:
      apt.property?.location
        ? `${apt.property.location.city || ""}${
            apt.property.location.state
              ? `, ${apt.property.location.state}`
              : ""
          }`
        : "Unknown location",
  },
  userId: {
    name: apt.user?.name || "Unknown",
    email: apt.user?.email || "",
  },
  date: apt.date,
  time: apt.time,
  status: apt.status || "pending",
  meetingLink: apt.meetingLink || "",
}));


      setAppointments(mapped);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("Failed to fetch appointments");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchTerm === "" ||
      apt.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || apt.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Appointments
            </h1>
            <p className="text-gray-600">
              Manage and track property viewing appointments
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.propertyId.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.propertyId.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.userId?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.userId?.email || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status
                          .charAt(0)
                          .toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>

                    {/* Meeting Link (read-only) */}
                    <td className="px-6 py-4">
                      {appointment.meetingLink ? (
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          <LinkIcon className="w-4 h-4" />
                          View Link
                        </a>
                      ) : (
                        <span className="text-gray-500">No link</span>
                      )}
                    </td>

                    {/* Actions (disabled for now) */}
                    <td className="px-6 py-4 text-sm text-gray-400">
                      Status/meeting actions will work once backend endpoints
                      are added.
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
