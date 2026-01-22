import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  User,
  MapPin,
  IndianRupee,
  Calendar,
  Building,
  Trash2,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Maximize,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PropertyReviewCard = ({ property, onApprove, onReject, onDelete }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(property._id, approveNotes);
    setLoading(false);
    setShowApproveModal(false);
    setApproveNotes("");
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setLoading(true);
    await onReject(property._id, rejectReason, rejectNotes);
    setLoading(false);
    setShowRejectModal(false);
    setRejectReason("");
    setRejectNotes("");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Review",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    };

    const config = statusConfig[property.status] || statusConfig.pending;

    return (
      <span
        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="p-3 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
            {/* Property Image */}
            <div className="w-full h-32 sm:h-40 lg:w-48 lg:h-48 flex-shrink-0">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0].url}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Building className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="flex-1 space-y-2 lg:space-y-4">
              <div className="flex items-start justify-between gap-2 lg:gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                      {property.title}
                    </h3>
                    {getStatusBadge()}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 line-clamp-2">
  Technology optimized per workload                  {property.description}
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <IndianRupee className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500">Price</p>
                    <p className="text-xs lg:text-sm font-bold text-gray-900">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {property.features?.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <BedDouble className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-500">Bedrooms</p>
                      <p className="text-xs lg:text-sm font-bold text-gray-900">
                        {property.features.bedrooms}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 lg:gap-2">
                  <Building className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500">Type</p>
                    <p className="text-xs lg:text-sm font-bold text-gray-900 capitalize">
                      {property.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 lg:gap-2">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] lg:text-xs text-gray-500">Submitted</p>
                    <p className="text-xs lg:text-sm font-bold text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              {property.owner && (
                <div className="bg-gray-50 rounded-lg p-2 lg:p-4">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-7 h-7 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs lg:text-base font-semibold text-gray-900">
                        {property.owner.name}
                      </p>
                      <p className="text-[10px] lg:text-sm text-gray-600">
                        {property.owner.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 lg:gap-2 text-blue-600 hover:text-blue-700 font-semibold text-xs lg:text-sm"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Show More Details
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 lg:mt-6 pt-3 lg:pt-6 border-t border-gray-200 space-y-3 lg:space-y-4"
              >
                {/* Location */}
                {property.location && (
                  <div>
                    <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1.5 lg:mb-2 flex items-center gap-1.5 lg:gap-2">
                      <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600" />
                      Location
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-2.5 lg:p-4 space-y-1.5 lg:space-y-2">
                      {property.location.address && (
                        <p className="text-xs lg:text-sm text-gray-700">
                          <span className="font-semibold">Address:</span>{" "}
                          {property.location.address}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs lg:text-sm">
                        {property.location.city && (
                          <p className="text-gray-700">
                            <span className="font-semibold">City:</span>{" "}
                            {property.location.city}
                          </p>
                        )}
                        {property.location.state && (
                          <p className="text-gray-700">
                            <span className="font-semibold">State:</span>{" "}
                            {property.location.state}
                          </p>
                        )}
                        {property.location.pincode && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Pincode:</span>{" "}
                            {property.location.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                {property.features && (
                  <div>
                    <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1.5 lg:mb-2">
                      Features
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
                      {property.features.bedrooms > 0 && (
                        <div className="bg-blue-50 rounded-lg p-2 lg:p-3 text-center">
                          <BedDouble className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-0.5 lg:mb-1" />
                          <p className="text-xs lg:text-sm font-semibold">
                            {property.features.bedrooms} Beds
                          </p>
                        </div>
                      )}
                      {property.features.bathrooms > 0 && (
                        <div className="bg-blue-50 rounded-lg p-2 lg:p-3 text-center">
                          <Bath className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-0.5 lg:mb-1" />
                          <p className="text-xs lg:text-sm font-semibold">
                            {property.features.bathrooms} Baths
                          </p>
                        </div>
                      )}
                      {property.features.area && (
                        <div className="bg-blue-50 rounded-lg p-2 lg:p-3 text-center">
                          <Maximize className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-0.5 lg:mb-1" />
                          <p className="text-xs lg:text-sm font-semibold">
                            {property.features.area} sqft
                          </p>
                        </div>
                      )}
                      {property.features.furnished && (
                        <div className="bg-blue-50 rounded-lg p-2 lg:p-3 text-center">
                          <Building className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-0.5 lg:mb-1" />
                          <p className="text-xs lg:text-sm font-semibold capitalize">
                            {property.features.furnished}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.features?.amenities &&
                  property.features.amenities.length > 0 && (
                    <div>
                      <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1.5 lg:mb-2">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-1.5 lg:gap-2">
                        {property.features.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 lg:px-3 py-0.5 lg:py-1 bg-green-50 text-green-700 rounded-full text-[10px] lg:text-sm font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Contact Info */}
                {property.contactInfo && (
                  <div>
                    <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1.5 lg:mb-2">
                      Contact Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-2.5 lg:p-4 space-y-1.5 lg:space-y-2">
                      {property.contactInfo.phone && (
                        <div className="flex items-center gap-2 text-xs lg:text-sm">
                          <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
                          <span className="text-gray-700">
                            {property.contactInfo.phone}
                          </span>
                        </div>
                      )}
                      {property.contactInfo.email && (
                        <div className="flex items-center gap-2 text-xs lg:text-sm">
                          <Mail className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
                          <span className="text-gray-700">
                            {property.contactInfo.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Review Info */}
                {property.adminReview?.reviewedBy && (
                  <div className="bg-gray-50 rounded-lg p-2.5 lg:p-4">
                    <h4 className="text-xs lg:text-sm font-semibold text-gray-900 mb-1.5 lg:mb-2">
                      Review Information
                    </h4>
                    <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                      <p>
                        <span className="font-semibold">Reviewed by:</span>{" "}
                        {property.adminReview.reviewedBy}
                      </p>
                      <p>
                        <span className="font-semibold">Reviewed at:</span>{" "}
                        {formatDate(property.adminReview.reviewedAt)}
                      </p>
                      {property.adminReview.rejectionReason && (
                        <p className="text-red-600">
                          <span className="font-semibold">Reason:</span>{" "}
                          {property.adminReview.rejectionReason}
                        </p>
                      )}
                      {property.adminReview.notes && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Notes:</span>{" "}
                          {property.adminReview.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-3 lg:mt-6 pt-3 lg:pt-6 border-t border-gray-200 flex flex-wrap gap-2 lg:gap-3">
            {property.status === "pending" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowApproveModal(true)}
                  className="flex items-center gap-1.5 lg:gap-2 px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg lg:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-xs lg:text-base"
                >
                  <CheckCircle className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  Approve
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-1.5 lg:gap-2 px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg lg:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-xs lg:text-base"
                >
                  <XCircle className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
                  Reject
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDelete(property._id)}
              className="flex items-center gap-1.5 lg:gap-2 px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg lg:rounded-xl font-semibold shadow-md transition-colors ml-auto text-xs lg:text-base"
            >
              <Trash2 className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 lg:p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-8 w-[90%] md:w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-4 lg:mb-6">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
                  Approve Property
                </h3>
                <p className="text-xs lg:text-base text-gray-600">
                  This property will be published publicly
                </p>
              </div>

              <div className="mb-4 lg:mb-6">
                <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-300 text-gray-700 rounded-lg lg:rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg lg:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Approving..." : "Approve"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 lg:p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-8 w-[90%] md:w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-4 lg:mb-6">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <XCircle className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
                  Reject Property
                </h3>
                <p className="text-xs lg:text-base text-gray-600">
                  Please provide a reason for rejection
                </p>
              </div>

              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter the reason for rejecting this property..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-gray-700 mb-1.5 lg:mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base border-2 border-gray-300 text-gray-700 rounded-lg lg:rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg lg:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyReviewCard;
