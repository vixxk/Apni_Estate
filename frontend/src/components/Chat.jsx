import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ArrowLeft,
  Send,
  User as UserIcon,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { Backendurl } from "../App";
import { useParams } from "react-router-dom";

const LoadingSkeleton = () => (
  <div className="space-y-3 md:space-y-4 px-3 md:px-4 py-3 md:py-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 ${
            i % 2 === 0 ? "bg-blue-100 rounded-br-sm" : "bg-white rounded-bl-sm"
          } animate-pulse`}
        >
          <div className="h-3 md:h-4 bg-gray-300 rounded w-32 md:w-40 mb-2"></div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-16 md:w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  const { vendorId } = useParams();
  const { vendorName, vendorAvatar } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [selfChatError, setSelfChatError] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!vendorId) {
      navigate("/properties", { replace: true });
      return;
    }

    // Prevent vendor chatting with himself
    if (
      currentUser &&
      currentUser.role === "vendor" &&
      currentUser._id === vendorId
    ) {
      setSelfChatError(true);

      const timer = setTimeout(() => {
        navigate(-1);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [token, vendorId, currentUser, navigate]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get(`${Backendurl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(data.data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    if (token) {
      fetchMe();
    }
  }, [token]);

  useEffect(() => {
    if (!currentUser || !vendorId || !token) return;

    let intervalId;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${Backendurl}/api/chats/room/${vendorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newMessages = data?.data?.messages || [];

        if (newMessages.length > 0) {
          const latestId = newMessages[newMessages.length - 1]._id;
          if (latestId !== lastMessageIdRef.current) {
            lastMessageIdRef.current = latestId;
            setMessages(newMessages);
          }
        } else {
          setMessages([]);
        }

        setLoadingMessages(false);
      } catch (err) {
        console.error("Polling error:", err);
        setLoadingMessages(false);
      }
    };

    fetchMessages();
    intervalId = setInterval(fetchMessages, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser, vendorId, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !vendorId || !token) return;

    try {
      setSending(true);

      const payload = {
        vendorId: currentUser.role === "vendor" ? currentUser._id : vendorId,
        userId: currentUser.role === "user" ? currentUser._id : vendorId,
        message: input.trim(),
      };

      const { data } = await axios.post(`${Backendurl}/api/chats`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => [...prev, data.data]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getOtherParty = () => {
    if (!currentUser)
      return { name: vendorName || "Vendor", avatar: vendorAvatar || null };
    if (currentUser.role === "user") {
      return { name: vendorName || "Vendor", avatar: vendorAvatar || null };
    }
    return { name: "User", avatar: null };
  };

  const other = getOtherParty();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 md:pt-20 pb-24 md:pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[70vh] md:h-[75vh]"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 shadow-lg">
            {/* <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button> */}

            {other.avatar ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                src={other.avatar}
                alt={other.name}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-white/60 object-cover shadow-md"
              />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/60 shadow-md"
              >
                <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-white font-semibold text-sm md:text-base truncate">
                  {other.name}
                </h1>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] md:text-xs text-white backdrop-blur-sm whitespace-nowrap"
                >
                  Secure Chat
                </motion.span>
              </div>
              <p className="text-[11px] md:text-xs text-blue-100 mt-0.5 truncate">
                You can discuss property details and ask questions here.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-1 text-blue-100 text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
              <MessageCircle className="w-4 h-4" />
              <span>ApniEstate</span>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10" />
          </div>

          {/* Messages area */}
          <div className="flex-1 bg-gradient-to-b from-slate-50/80 to-slate-50/50 overflow-y-auto">
            {loadingMessages ? (
              <LoadingSkeleton />
            ) : messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center max-w-xs mx-auto px-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center mx-auto mb-3"
                  >
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <h2 className="text-gray-800 font-semibold text-sm md:text-base mb-1">
                    Start your first conversation
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Say hello and ask any questions you have about the property
                    or services.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="px-3 md:px-4 py-3 md:py-4">
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((m, index) => {
                      const isMe =
                        currentUser &&
                        (m.sender === currentUser.id ||
                          m.sender === currentUser._id ||
                          m.sender?._id === currentUser.id ||
                          m.sender?._id === currentUser._id);
                      return (
                        <motion.div
                          key={m._id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm shadow-md ${
                              isMe
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                                : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words leading-relaxed">
                              {m.message}
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p
                                className={`text-[10px] md:text-[11px] ${
                                  isMe ? "text-blue-100" : "text-gray-400"
                                }`}
                              >
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {isMe && (
                                <CheckCheck
                                  className={`w-3 h-3 ${
                                    index === messages.length - 1
                                      ? "text-blue-200"
                                      : "text-blue-300"
                                  }`}
                                />
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="border-t border-slate-200 bg-white px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              maxLength={500}
              className="flex-1 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-full border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all placeholder:text-gray-400"
            />
            <motion.button
              type="submit"
              whileHover={{
                scale: sending || !input.trim() ? 1 : 1.05,
              }}
              whileTap={{ scale: sending || !input.trim() ? 1 : 0.95 }}
              disabled={sending || !input.trim()}
              className={`inline-flex items-center justify-center rounded-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white shadow-lg transition-all ${
                sending || !input.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
              }`}
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Bottom helper */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4 text-[11px] md:text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mx-auto inline-block"
        >
          🔐 Chats are secure and for information purposes only
        </motion.p> */}
      </div>
      <AnimatePresence>
        {selfChatError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl shadow-2xl px-6 py-5 max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Action Not Allowed
              </h3>

              <p className="text-sm text-gray-600">
                You cannot contact yourself.
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Redirecting you back…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
