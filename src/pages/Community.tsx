import { useState } from "react";
import { Users, Heart, MessageCircle, Share2, Send, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  color: string;
  level: number;
  time: string;
  content: string;
  likes: number;
  tag: string;
  comments: Comment[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: "p1", author: "Arjun K.", avatar: "A", color: "#4F8EF7", level: 8, time: "2 hours ago",
    content: "Just completed the React course with a 98% quiz score! 🎉 The AI tutor made such a difference — I could ask questions instantly. For anyone starting React, focus on useState and useEffect first. They're 80% of what you'll use daily.",
    likes: 47, tag: "Achievement",
    comments: [
      { id: "c1", author: "Priya M.", avatar: "P", color: "#9B6FFF", text: "Congrats Arjun! What resources did you use alongside the course?", time: "1h ago" },
      { id: "c2", author: "Dev B.", avatar: "D", color: "#2ECC8E", text: "98% is insane! I'm at 72% and feeling stuck. Any tips?", time: "45m ago" },
    ],
  },
  {
    id: "p2", author: "Priya M.", avatar: "P", color: "#9B6FFF", level: 7, time: "5 hours ago",
    content: "Day 28 of my learning streak 🔥 Pro tip: Set a specific time every day for learning. I do 30 mins at 7 AM before work. It's become as natural as brushing my teeth. The streak system here really keeps me accountable!",
    likes: 89, tag: "Tip",
    comments: [
      { id: "c3", author: "Karan T.", avatar: "K", color: "#FF5FA0", text: "The morning routine tip is gold. Starting tomorrow!", time: "3h ago" },
    ],
  },
  {
    id: "p3", author: "Dev B.", avatar: "D", color: "#2ECC8E", level: 4, time: "1 day ago",
    content: "Question for the community: For someone coming from a non-CS background, what's the best order to take the courses? I've done HTML/CSS and now wondering if I should go straight to JS or try Python first?",
    likes: 23, tag: "Question",
    comments: [
      { id: "c4", author: "Meera J.", avatar: "M", color: "#FF8C42", text: "Definitely JS next! Python is more backend/data science. JS keeps you on the web dev path.", time: "22h ago" },
      { id: "c5", author: "Arjun K.", avatar: "A", color: "#4F8EF7", text: "JS → React → Node.js is the classic path. Stick to the web stack for now!", time: "20h ago" },
    ],
  },
  {
    id: "p4", author: "Meera J.", avatar: "M", color: "#FF8C42", level: 5, time: "2 days ago",
    content: "Got my first job interview thanks to AVIxAI! The certificate from the JavaScript Fundamentals course really helped my resume stand out. The company HR specifically mentioned it. Don't underestimate the value of these certificates! 💼",
    likes: 156, tag: "Success Story",
    comments: [
      { id: "c6", author: "Sunita L.", avatar: "S", color: "#2EC4B6", text: "This is so inspiring! Which company if you don't mind sharing?", time: "2d ago" },
      { id: "c7", author: "Vikram P.", avatar: "V", color: "#FFD166", text: "Congrats! You deserve it. All the best for the interview! 🙌", time: "2d ago" },
    ],
  },
  {
    id: "p5", author: "Karan T.", avatar: "K", color: "#FF5FA0", level: 6, time: "3 days ago",
    content: "Redeemed my streak shield just in time — almost missed a day because of power cut 😅 But the shield saved my 20-day streak! The XP spent was worth it. Now back on track. Is anyone else doing a 30-day challenge?",
    likes: 34, tag: "Discussion",
    comments: [],
  },
];

const TAG_COLORS: Record<string, string> = {
  "Achievement": "rgba(255,209,102,.1)", "Tip": "rgba(46,204,142,.1)",
  "Question": "rgba(79,142,247,.1)", "Success Story": "rgba(155,111,255,.1)",
  "Discussion": "rgba(255,140,66,.1)",
};
const TAG_TEXT: Record<string, string> = {
  "Achievement": "var(--lq-yellow)", "Tip": "var(--lq-green)",
  "Question": "var(--lq-blue)", "Success Story": "var(--lq-purple)",
  "Discussion": "var(--lq-orange)",
};

export default function Community() {
  const { user, addXP } = useApp();
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  function toggleLike(postId: string) {
    setLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    // Removed XP reward for likes
  }

  function handlePost() {
    if (!newPost.trim()) return;
    const post: Post = {
      id: `p-new-${Date.now()}`,
      author: user.name,
      avatar: user.name[0],
      color: "var(--lq-blue)",
      level: user.level,
      time: "just now",
      content: newPost,
      likes: 0,
      tag: "Discussion",
      comments: [],
    };
    setPosts(prev => [post, ...prev]);
    setNewPost("");
    // Removed XP reward for posts (was 10 XP)
  }

  function handleAddComment(postId: string) {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    const comment: Comment = {
      id: `cm-${Date.now()}`,
      author: user.name,
      avatar: user.name[0],
      color: "var(--lq-blue)",
      text,
      time: "just now",
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Users size={22} style={{ color: "var(--lq-pink)" }} /> Community
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>
        Connect with thousands of learners. Share wins, ask questions, and grow together.
      </p>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { icon: "👥", value: "50,234", label: "Learners", color: "var(--lq-blue)" },
          { icon: "💬", value: "12,400", label: "Posts this month", color: "var(--lq-purple)" },
          { icon: "🔥", value: "98%", label: "Avg streak kept", color: "var(--lq-orange)" },
          { icon: "🏆", value: "1,240", label: "Certifications issued", color: "var(--lq-yellow)" },
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg font-black mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Post Creator */}
      <div className="p-4 rounded-2xl mb-5" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
        <div className="flex gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))" }}>
            {user.name[0]}
          </div>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share a win, ask a question, or help a fellow learner..."
            rows={3}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handlePost}
            className="px-4 py-2 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-105"
          >
            Share with Community
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: `${post.color}25`, color: post.color }}>
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{post.author}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(155,111,255,.1)", color: "var(--lq-purple)" }}>Lv.{post.level}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: TAG_COLORS[post.tag] || "rgba(255,255,255,.06)", color: TAG_TEXT[post.tag] || "white" }}>
                      {post.tag}
                    </span>
                    <span className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>{post.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(232,234,240,.9)" }}>{post.content}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
                  style={{ color: likes[post.id] ? "var(--lq-pink)" : "rgba(90,96,122,1)" }}
                >
                  <Heart size={14} fill={likes[post.id] ? "var(--lq-pink)" : "none"} />
                  {post.likes + (likes[post.id] ? 1 : 0)}
                </button>
                <button
                  onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-xs transition-all hover:scale-105"
                  style={{ color: openComments === post.id ? "var(--lq-blue)" : "rgba(90,96,122,1)" }}
                >
                  <MessageCircle size={14} /> {post.comments.length}
                  <span className="text-[10px]">Comments</span>
                </button>
                <button
                  className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(90,96,122,1)" }}
                  onClick={() => showXPToast("🔗", "Post link copied!", "#4F8EF7")}
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {openComments === post.id && (
              <div className="border-t" style={{ borderColor: "rgba(255,255,255,.06)", background: "rgba(8,11,20,.5)" }}>
                {post.comments.length > 0 && (
                  <div className="px-4 pt-3 space-y-3">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{ background: `${c.color}25`, color: c.color }}>
                          {c.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)" }}>
                            <span className="font-bold mr-1.5">{c.author}</span>
                            <span style={{ color: "rgba(200,204,220,1)" }}>{c.text}</span>
                          </div>
                          <div className="text-[10px] mt-0.5 ml-1" style={{ color: "rgba(90,96,122,1)" }}>{c.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {post.comments.length === 0 && (
                  <div className="px-4 pt-3 text-xs text-center" style={{ color: "rgba(90,96,122,1)" }}>
                    No comments yet — be the first! (+3 XP)
                  </div>
                )}
                <div className="flex gap-2 p-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))" }}>
                    {user.name[0]}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleAddComment(post.id)}
                      placeholder="Write a comment... (+3 XP)"
                      className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center gradient-bg"
                    >
                      <Send size={13} style={{ color: "white" }} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
