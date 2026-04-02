import { useState } from "react";
import { Users, Search, UserPlus, MessageCircle, Trash2, CheckCircle, XCircle, Inbox, Send, X, UserCheck, Eye, EyeOff, Heart } from "lucide-react";
import { Link } from "wouter";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

interface ChatMessage {
  id: string;
  from: string;
  text: string;
  time: string;
}

// Mock users database for searching
const MOCK_USERS = [
  { id: "u1", name: "Arjun K.", level: 8, xp: 8500, bio: "Full-stack developer", followers: 234, following: 56 },
  { id: "u2", name: "Priya M.", level: 7, xp: 7200, bio: "React enthusiast", followers: 189, following: 42 },
  { id: "u3", name: "Dev B.", level: 4, xp: 3500, bio: "Learning JavaScript", followers: 45, following: 78 },
  { id: "u4", name: "Meera J.", level: 5, xp: 5000, bio: "Data science learner", followers: 112, following: 89 },
  { id: "u5", name: "Karan T.", level: 6, xp: 6200, bio: "DevOps engineer", followers: 156, following: 67 },
  { id: "u6", name: "Sunita L.", level: 9, xp: 10000, bio: "AI researcher", followers: 523, following: 123 },
  { id: "u7", name: "Vikram P.", level: 5, xp: 4800, bio: "Web developer", followers: 89, following: 34 },
];

export default function Friends() {
  const { user, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, followUser, unfollowUser } = useApp();
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search" | "followers" | "following">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof MOCK_USERS>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatInput, setChatInput] = useState("");
  const [viewingUser, setViewingUser] = useState<typeof MOCK_USERS[0] | null>(null);

  const handleSearch = () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const results = MOCK_USERS.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      u.name.toLowerCase() !== user.name.toLowerCase() &&
      !user.friends.some(f => f.name.toLowerCase() === u.name.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSendRequest = (username: string) => {
    const success = sendFriendRequest(username);
    if (success) {
      showXPToast("👋", `Friend request sent to ${username}!`, "#4F8EF7");
      handleSearch();
    } else {
      showXPToast("⚠️", "Could not send friend request", "#FF4D4D");
    }
  };

  const handleAccept = (requestId: string) => {
    const request = user.friendRequests.find(r => r.id === requestId);
    acceptFriendRequest(requestId);
    showXPToast("✅", `You're now friends with ${request?.fromUserName}!`, "#2ECC8E");
  };

  const handleReject = (requestId: string) => {
    rejectFriendRequest(requestId);
    showXPToast("✓", "Friend request rejected", "rgba(136,144,168,1)");
  };

  const handleRemove = (friendName: string, friendId: string) => {
    removeFriend(friendId);
    showXPToast("👋", `${friendName} removed from friends`, "#FF5FA0");
  };

  const handleFollow = (userId: string) => {
    followUser(userId);
    showXPToast("✅", "Now following!", "#2ECC8E");
  };

  const handleUnfollow = (userId: string) => {
    unfollowUser(userId);
    showXPToast("👋", "Unfollowed", "rgba(136,144,168,1)");
  };

  const sendChatMessage = () => {
    if (!selectedChat || !chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      from: user.name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));
    setChatInput("");
  };

  const getMockUserById = (id: string) => MOCK_USERS.find(u => u.id === id);

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Users size={22} style={{ color: "var(--lq-blue)" }} /> Friends & Network
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>
        Connect with learners, send friend requests, follow others, and chat with your friends.
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { icon: "👥", value: user.friends.length.toString(), label: "Friends", color: "var(--lq-blue)" },
          { icon: "🤝", value: user.followers.length.toString(), label: "Followers", color: "var(--lq-purple)" },
          { icon: "👀", value: user.following.length.toString(), label: "Following", color: "var(--lq-green)" },
          { icon: "📥", value: user.friendRequests.length.toString(), label: "Requests", color: "var(--lq-orange)" },
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[9px]" style={{ color: "rgba(136,144,168,1)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b flex-wrap" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        {[
          { id: "friends", label: "My Friends", icon: Users, count: user.friends.length },
          { id: "requests", label: "Requests", icon: Inbox, count: user.friendRequests.length },
          { id: "search", label: "Find Friends", icon: Search, count: null },
          { id: "followers", label: "Followers", icon: Eye, count: user.followers.length },
          { id: "following", label: "Following", icon: EyeOff, count: user.following.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === tab.id ? "border-blue-500" : "border-transparent"
            }`}
            style={activeTab === tab.id ? { color: "var(--lq-blue)" } : { color: "rgba(136,144,168,1)" }}
          >
            <tab.icon size={16} /> {tab.label}
            {tab.count > 0 && (
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: tab.id === "requests" ? "var(--lq-red)" : "var(--lq-purple)", color: "#fff" }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div>
          {user.friends.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">No friends yet. Send friend requests to connect with others!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.friends.map(friend => {
                const mockUser = getMockUserById(friend.id);
                return (
                  <div key={friend.id}
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))" }}>
                          {friend.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{friend.name}</div>
                          <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Level {friend.level}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs mb-3">
                      <span style={{ color: "rgba(136,144,168,1)" }}>
                        <Eye size={12} className="inline mr-1" />
                        {mockUser?.followers || 0} followers
                      </span>
                      <span style={{ color: "rgba(136,144,168,1)" }}>
                        <EyeOff size={12} className="inline mr-1" />
                        {mockUser?.following || 0} following
                      </span>
                    </div>

                    <div className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
                      Last seen: {friend.lastSeen}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedChat(friend.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }}>
                        <MessageCircle size={14} /> Chat
                      </button>
                      <button
                        onClick={() => handleRemove(friend.name, friend.id)}
                        className="flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Followers Tab */}
      {activeTab === "followers" && (
        <div>
          {user.followers.length === 0 ? (
            <div className="text-center py-12">
              <Eye size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">No followers yet. Build your network by being active in the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.followers.map((followerId, idx) => {
                const mockUser = getMockUserById(followerId) || { id: followerId, name: `User ${idx + 1}`, level: 1, xp: 0, bio: "", followers: 0, following: 0 };
                const isFollowing = user.following.includes(followerId);
                return (
                  <div key={followerId}
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: "linear-gradient(135deg, var(--lq-green), var(--lq-blue))" }}>
                        {mockUser.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{mockUser.name}</div>
                        <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Level {mockUser.level}</div>
                      </div>
                    </div>

                    <div className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
                      {mockUser.bio || "No bio yet"}
                    </div>

                    <div className="flex gap-2">
                      {isFollowing ? (
                        <button
                          onClick={() => handleUnfollow(followerId)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                          style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
                        >
                          <EyeOff size={14} /> Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(followerId)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                          style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)" }}
                        >
                          <UserCheck size={14} /> Follow Back
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Following Tab */}
      {activeTab === "following" && (
        <div>
          {user.following.length === 0 ? (
            <div className="text-center py-12">
              <EyeOff size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">You're not following anyone yet. Discover learners in the search tab!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.following.map((followingId, idx) => {
                const mockUser = getMockUserById(followingId) || { id: followingId, name: `User ${idx + 1}`, level: 1, xp: 0, bio: "", followers: 0, following: 0 };
                return (
                  <div key={followingId}
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-pink))" }}
                      >
                        {mockUser.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{mockUser.name}</div>
                        <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Level {mockUser.level}</div>
                      </div>
                    </div>

                    <div className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
                      {mockUser.bio || "No bio yet"}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUnfollow(followingId)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
                      >
                        <EyeOff size={14} /> Unfollow
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div>
          {user.friendRequests.length === 0 ? (
            <div className="text-center py-12">
              <Inbox size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">No pending friend requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.friendRequests.map(request => (
                <div key={request.id}
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(79,142,247,.15)" }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }}
                    >
                      {request.fromUserName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{request.fromUserName}</div>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Level {request.fromUserLevel} • {request.time}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all"
                      style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)" }}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all"
                      style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div>
          <div className="flex gap-2 mb-5">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.13)", color: "#fff" }}
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(136,144,168,1)" }} />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 rounded-lg text-sm font-bold"
              style={{ background: "var(--lq-blue)", color: "#fff" }}>
              Search
            </button>
          </div>

          {searchResults.length === 0 && searchQuery.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">Search for learners by name to add them as friends or follow them</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} style={{ color: "rgba(136,144,168,0.3)", margin: "0 auto 1rem" }} />
              <p style={{ color: "rgba(136,144,168,1)" }} className="text-sm">No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map(mockUser => {
                const isFollowing = user.following.includes(mockUser.id);
                return (
                  <div key={mockUser.id}
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: "linear-gradient(135deg, var(--lq-green), var(--lq-blue))" }}
                        >
                          {mockUser.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{mockUser.name}</div>
                          <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Level {mockUser.level}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs mb-3">
                      <span style={{ color: "rgba(136,144,168,1)" }}>
                        <Heart size={12} className="inline mr-1" />
                        {mockUser.followers} followers
                      </span>
                      <span style={{ color: "rgba(136,144,168,1)" }}>
                        <Eye size={12} className="inline mr-1" />
                        {mockUser.following} following
                      </span>
                    </div>

                    <div className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
                      {mockUser.bio}
                    </div>

                    <div className="text-xs mb-3" style={{ color: "var(--lq-yellow)" }}>
                      ⚡ {mockUser.xp.toLocaleString()} XP
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendRequest(mockUser.name)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)" }}
                      >
                        <UserPlus size={14} /> Add Friend
                      </button>
                      {isFollowing ? (
                        <button
                          onClick={() => handleUnfollow(mockUser.id)}
                          className="flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all"
                          style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
                        >
                          <EyeOff size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(mockUser.id)}
                          className="flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all"
                          style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }}
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
          onClick={() => setSelectedChat(null)}
        >
          <div className="w-full md:w-96 h-96 md:h-[500px] rounded-t-2xl md:rounded-2xl flex flex-col"
            style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))" }}>
                  {user.friends.find(f => f.id === selectedChat)?.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{user.friends.find(f => f.id === selectedChat)?.name}</div>
                  <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Online</div>
                </div>
              </div>
              <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(chatMessages[selectedChat] || []).map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.from === user.name ? "flex-row-reverse" : ""}`}>
                  <div className="text-xs font-bold px-3 py-2 rounded-lg"
                    style={msg.from === user.name
                      ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }
                      : { background: "rgba(22,27,46,1)", color: "rgba(136,144,168,1)" }
                    }
                  >
                    {msg.text}
                    <div className="text-[10px] mt-1" style={{ color: "rgba(90,96,122,1)" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {(chatMessages[selectedChat] || []).length === 0 && (
                <div className="text-center text-xs" style={{ color: "rgba(136,144,168,1)" }}>
                  Start a conversation! Say hello 👋
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
              />
              <button onClick={sendChatMessage} className="p-2 rounded-lg transition-transform hover:scale-105 gradient-bg">
                <Send size={16} style={{ color: "white" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
