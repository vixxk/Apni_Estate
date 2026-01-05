import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Loader2,
  User,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Backendurl } from "../App";

const ChatList = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const loggedInUserId = payload?.id;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${Backendurl}/api/chats/my/conversations/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversations(data.data.conversations || []);
        setFilteredConversations(data.data.conversations || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((c) => {
        const otherUser = c.vendor._id === loggedInUserId ? c.user : c.vendor;
        return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations, loggedInUserId]);

  const handleBack = () => navigate(-1);

  const openChat = (c) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const loggedInUserId = payload.id;

    const otherUser = c.vendor._id === loggedInUserId ? c.user : c.vendor;

    navigate("/chat", {
      state: {
        vendorId: otherUser._id,
        vendorName: otherUser.name,
        vendorAvatar: otherUser.avatar || null,
      },
    });
  };

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 pb-24 md:pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            {/* <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white shadow-md hover:shadow-lg hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </motion.button> */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-7 h-7 text-blue-600" />
                  Messages
                </h1>
                {totalUnread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1 min-w-[24px] text-center"
                  >
                    {totalUnread}
                  </motion.span>
                )}
              </div>
              {/* <p className="text-sm text-slate-500">
                View and continue your conversations
              </p> */}
            </div>
          </div>

          {/* Search Bar */}
          {conversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-all text-sm"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-500 font-medium">
                  Loading conversations...
                </p>
              </motion.div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center mx-auto mb-4"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-base font-semibold text-slate-800 mb-2">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? "Try searching with a different name"
                  : "Start a chat from a vendor's profile to see it listed here."}
              </p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredConversations.map((c, index) => {
                  const otherUser =
                    c.vendor._id === loggedInUserId ? c.user : c.vendor;

                  return (
                    <motion.button
                      key={`${c.vendor._id}-${c.user._id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openChat(c)}
                      whileHover={{ backgroundColor: "rgb(248 250 252)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-4 py-4 px-5 transition-all text-left"
                    >
                      <div className="relative">
                        {otherUser.avatar ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-gray-200 shadow-sm"
                          >
                            <User className="w-6 h-6 text-white" />
                          </motion.div>
                        )}
                        {c.unreadCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center shadow-md"
                          >
                            {c.unreadCount}
                          </motion.span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`text-base font-semibold truncate ${
                              c.unreadCount > 0
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {otherUser.name}
                          </p>

                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {c.lastAt
                              ? new Date(c.lastAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>

                        <p
                          className={`text-sm truncate ${
                            c.unreadCount > 0
                              ? "text-slate-600 font-medium"
                              : "text-slate-500"
                          }`}
                        >
                          {c.lastMessage || "No message"}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Bottom Helper */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mx-auto max-w-md"
        >
          💬 Stay connected with vendors and track all your property inquiries
        </motion.p>
      </div>
    </div>
  );
};

export default ChatList;