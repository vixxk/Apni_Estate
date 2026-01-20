import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  User as UserIcon,
  Loader2,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  X,
} from "lucide-react";
import { Backendurl } from "../App";

const LoadingSkeleton = () => (
  <div className="space-y-3 md:space-y-4 px-3 md:px-4 py-3 md:py-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 ${i % 2 === 0 ? "bg-blue-100 rounded-br-sm" : "bg-white rounded-bl-sm"
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
  const fileInputRef = useRef(null);

  const { vendorId: otherUserId } = useParams();
  const { vendorName, vendorAvatar } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selfChatError, setSelfChatError] = useState(false);
  const [chatHeader, setChatHeader] = useState({
    name: "",
    avatar: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setChatHeader({
      name: vendorName || "Chat",
      avatar: vendorAvatar || null,
    });
  }, [vendorName, vendorAvatar]);

  // redirect if not logged in / no otherUserId
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!otherUserId) {
      navigate("/properties", { replace: true });
      return;
    }
  }, [token, otherUserId, navigate]);

  // fetch logged-in user
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

  // prevent chatting with self
  useEffect(() => {
    if (!token || !otherUserId || !currentUser) return;

    if (currentUser._id === otherUserId || currentUser.id === otherUserId) {
      setSelfChatError(true);

      const timer = setTimeout(() => {
        navigate(-1);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [token, otherUserId, currentUser, navigate]);

  // fetch other user profile to get role for redirection
  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      if (!otherUserId) return;
      try {
        const { data } = await axios.get(
          `${Backendurl}/api/users/public/${otherUserId}`
        );
        setOtherUserProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch other user profile:", err);
      }
    };
    fetchOtherUserProfile();
  }, [otherUserId]);

  const handleProfileClick = () => {
    if (!otherUserProfile) return;

    if (otherUserProfile.role === "vendor") {
      navigate(`/vendor/${otherUserId}`);
    } else {
      navigate(`/user/${otherUserId}`);
    }
  };

  // polling for messages
  useEffect(() => {
    if (!currentUser || !otherUserId || !token) return;

    let intervalId;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${Backendurl}/api/chats/room/${otherUserId}`,
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
  }, [currentUser, otherUserId, token]);

  // auto-scroll only the messages container, not whole page
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleImageUpload = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${Backendurl}/api/upload/chat-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploading(false);
      setSelectedImage(null);
      return data.data.image;
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploading(false);
      alert("Image upload failed");
      return null;
    }
  };

  const sendImageMessage = async () => {
    if (!currentUser || !otherUserId || !token || !selectedImage) return;

    try {
      setSending(true);

      const payload = {
        otherUserId,
        image: selectedImage,
      };

      const { data } = await axios.post(`${Backendurl}/api/chats`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => [...prev, data.data]);
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to send image message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!currentUser || !otherUserId || !token) return;

    const hasText = input.trim().length > 0;
    const hasImage = !!selectedImage;

    if (!hasText && !hasImage) return;

    if (hasText && hasImage) {
      alert("Please send either text or image, not both.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        otherUserId,
        type: hasImage ? "image" : "text",
      };

      if (hasImage) {
        payload.image = selectedImage;
      } else {
        payload.message = input.trim();
      }

      setInput("");
      setSelectedImage(null);

      const { data } = await axios.post(`${Backendurl}/api/chats`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => [...prev, data.data]);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageData = await handleImageUpload(file);
      if (imageData) {
        setSelectedImage(imageData);
      }
    } else {
      alert("Please select a valid image file");
    }
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 md:pt-24 pb-32 md:pb-20 flex items-start justify-center px-4">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[65vh] md:h-[75vh]"
        >
          {/* Header */}
          <div
            onClick={handleProfileClick}
            className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 shadow-lg cursor-pointer hover:opacity-95 transition-opacity"
          >
            {chatHeader.avatar ? (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                src={chatHeader.avatar}
                alt={chatHeader.name}
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
                  {chatHeader.name}
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

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -z-10" />
          </div>

          {/* Messages area */}
          <div
            className="flex-1 bg-gradient-to-b from-slate-50/80 to-slate-50/50 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
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
                          className={`flex ${isMe ? "justify-end" : "justify-start"
                            }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm shadow-md ${isMe
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm"
                              : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                              }`}
                          >
                            {m.type === "image" && m.image?.url ? (
                              <div
                                className="relative cursor-pointer group"
                                onClick={() =>
                                  window.open(m.image.url, "_blank")
                                }
                              >
                                <img
                                  src={m.image.url}
                                  alt="Sent image"
                                  className="w-full max-h-64 md:max-h-72 object-contain rounded-xl"
                                />

                                {/* SINGLE overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                  <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-800 backdrop-blur-sm">
                                    Tap to view
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap break-words leading-relaxed">
                                {m.message}
                              </p>
                            )}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p
                                className={`text-[10px] md:text-[11px] ${isMe ? "text-blue-100" : "text-gray-400"
                                  }`}
                              >
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {isMe && (
                                <CheckCheck
                                  className={`w-3 h-3 ${index === messages.length - 1
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
          <div className="border-t border-slate-200 bg-white px-3 md:px-4 py-2.5 md:py-3">
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3 p-3 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center gap-3"
              >
                <img
                  src={selectedImage.url}
                  alt="Preview"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate mb-1">
                    Image ready to send
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(selectedImage.size / 1024)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 md:gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || sending || input.trim().length > 0}
                className={`p-2 md:p-2.5 rounded-full transition-all shadow-sm ${uploading || sending || input.trim().length > 0
                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  }`}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </motion.button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={uploading || sending || !!selectedImage}
                placeholder={
                  selectedImage
                    ? "Remove image to type a message"
                    : "Type your message..."
                }
                className="flex-1 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5 rounded-full border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-all placeholder:text-gray-400 disabled:opacity-50"
              />
              <motion.button
                type="submit"
                whileHover={{
                  scale:
                    sending || uploading || (!input.trim() && !selectedImage)
                      ? 1
                      : 1.05,
                }}
                whileTap={{
                  scale:
                    sending || uploading || (!input.trim() && !selectedImage)
                      ? 1
                      : 0.95,
                }}
                disabled={
                  sending || uploading || (!input.trim() && !selectedImage)
                }
                className={`inline-flex items-center justify-center rounded-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white shadow-lg transition-all ${sending || uploading || (!input.trim() && !selectedImage)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                  }`}
              >
                {sending || uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

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
                className="bg-white rounded-xl shadow-2xl px-5 py-5 md:px-6 w-[85%] max-w-sm text-center"
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
    </div>
  );
};

export default Chat;
