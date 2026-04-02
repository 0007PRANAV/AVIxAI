import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ColorTheme = "blue" | "purple" | "green" | "orange" | "pink";

export interface UserProfile {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  bio: string;
  location: string;
  website: string;
}

export interface UserState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  streakShields: number;
  badges: string[];
  completedCourses: string[];
  enrolledCourses: string[];
  completedLessons: string[];
  completedQuizzes: string[];
  savedJobs: string[];
  bookmarks: string[];
  referralCode: string;
  referrals: number;
  usedReferralEmails: string[];
  lastLogin: string;
  profileCompletion: number;
  profile: UserProfile;
  missions: Mission[];
  notifications: Notification[];
  recentlyViewed: string[];
  colorTheme: ColorTheme;
  mode: "learner" | "hirer";
  friends: Friend[];
  friendRequests: FriendRequest[];
  followers: string[];
  following: string[];
  sentFriendRequests: FriendRequest[];
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  progress: number;
  total: number;
  type: "daily" | "weekly";
  completed: boolean;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "xp" | "badge" | "streak" | "job" | "system";
  time: string;
  read: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserLevel: number;
  time: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Friend {
  id: string;
  name: string;
  level: number;
  xp: number;
  lastSeen: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  text: string;
  time: string;
}

const XP_PER_LEVEL = [0, 500, 1200, 2000, 3500, 5500, 8000, 11000, 15000, 20000, 27000];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    if (xp >= XP_PER_LEVEL[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForLevel(level: number): number {
  return XP_PER_LEVEL[Math.min(level - 1, XP_PER_LEVEL.length - 1)] || 0;
}

export function getXPForNextLevel(level: number): number {
  return XP_PER_LEVEL[Math.min(level, XP_PER_LEVEL.length - 1)] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
}

function generateReferralCode(): string {
  return `LQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function calcProfileCompletion(profile: UserProfile, name: string): number {
  const fields = [
    name,
    profile.phone,
    profile.email,
    profile.linkedin,
    profile.github,
    profile.bio,
    profile.location,
  ];
  const filled = fields.filter(f => f && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

const DEFAULT_MISSIONS: Mission[] = [
  { id: "d1", title: "Daily Learner", desc: "Complete 1 lesson today", xp: 30, progress: 0, total: 1, type: "daily", completed: false, icon: "📚" },
  { id: "d2", title: "Quiz Master", desc: "Pass 1 quiz today", xp: 50, progress: 0, total: 1, type: "daily", completed: false, icon: "🎯" },
  { id: "d3", title: "Streak Keeper", desc: "Log in 3 days in a row", xp: 25, progress: 1, total: 3, type: "daily", completed: false, icon: "🔥" },
  { id: "w1", title: "Course Explorer", desc: "Complete 5 lessons this week", xp: 150, progress: 2, total: 5, type: "weekly", completed: false, icon: "🚀" },
  { id: "w2", title: "Social Butterfly", desc: "Visit 3 different sections this week", xp: 80, progress: 1, total: 3, type: "weekly", completed: false, icon: "🦋" },
  { id: "w3", title: "Quiz Champion", desc: "Pass 3 quizzes this week", xp: 200, progress: 0, total: 3, type: "weekly", completed: false, icon: "🏆" },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Welcome back!", message: "You have a 12-day streak. Keep it up!", type: "streak", time: "2 min ago", read: false },
  { id: "n2", title: "+25 XP earned", message: "You completed a lesson in JavaScript Fundamentals", type: "xp", time: "1 hour ago", read: false },
  { id: "n3", title: "New job match", message: "8 new jobs matching your skills are available", type: "job", time: "3 hours ago", read: true },
  { id: "n4", title: "Complete your profile!", message: "Your profile is only 14% complete. Fill it in to unlock job applications and be visible to hirers.", type: "system", time: "just now", read: false },
];

const DEFAULT_PROFILE: UserProfile = {
  phone: "",
  email: "",
  linkedin: "",
  github: "",
  twitter: "",
  bio: "",
  location: "",
  website: "",
};

const DEFAULT_USER: UserState = {
  name: "Pranav",
  xp: 1240,
  level: 4,
  streak: 12,
  streakShields: 2,
  badges: ["on-fire", "quick-learner", "sharp-shooter"],
  completedCourses: [],
  enrolledCourses: ["js-fundamentals"],
  completedLessons: ["js-1", "js-2", "js-3", "js-4", "js-5"],
  completedQuizzes: [],
  savedJobs: [],
  bookmarks: [],
  referralCode: generateReferralCode(),
  referrals: 0,
  usedReferralEmails: [],
  lastLogin: new Date().toISOString().split("T")[0],
  profileCompletion: 14,
  profile: DEFAULT_PROFILE,
  missions: DEFAULT_MISSIONS,
  notifications: DEFAULT_NOTIFICATIONS,
  recentlyViewed: ["js-fundamentals", "react-course"],
  colorTheme: "blue",
  mode: "learner",
  friends: [],
  friendRequests: [],
  followers: [],
  following: [],
  sentFriendRequests: [],
};

interface AppContextType {
  user: UserState;
  addXP: (amount: number, reason?: string) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: "learner" | "hirer") => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSaveJob: (jobId: string) => void;
  completeMission: (missionId: string) => void;
  addRecentlyViewed: (itemId: string) => void;
  unreadCount: number;
  showConfetti: () => void;
  confettiActive: boolean;
  useStreakShield: () => void;
  enrollCourse: (courseId: string) => void;
  claimReferralXP: (email: string) => boolean;
  updateProfile: (profile: Partial<UserProfile>, name?: string) => void;
  sendFriendRequest: (username: string) => boolean;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem("lq-user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER,
          ...parsed,
          profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
          usedReferralEmails: parsed.usedReferralEmails || [],
        };
      }
    } catch {}
    return DEFAULT_USER;
  });
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("lq-user", JSON.stringify(user));
    document.documentElement.className = `dark theme-${user.colorTheme}`;
  }, [user]);

  const showConfetti = useCallback(() => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  }, []);

  const addXP = useCallback((amount: number, _reason?: string) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      const leveledUp = newLevel > prev.level;
      if (leveledUp) showConfetti();
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, [showConfetti]);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setUser(prev => ({ ...prev, colorTheme: theme }));
  }, []);

  const setMode = useCallback((mode: "learner" | "hirer") => {
    setUser(prev => ({ ...prev, mode }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setUser(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  }, []);

  const toggleSaveJob = useCallback((jobId: string) => {
    setUser(prev => ({
      ...prev,
      savedJobs: prev.savedJobs.includes(jobId)
        ? prev.savedJobs.filter(j => j !== jobId)
        : [...prev.savedJobs, jobId],
    }));
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setUser(prev => {
      const mission = prev.missions.find(m => m.id === missionId);
      if (!mission || mission.completed) return prev;
      return {
        ...prev,
        missions: prev.missions.map(m =>
          m.id === missionId ? { ...m, completed: true, progress: m.total } : m
        ),
        xp: prev.xp + mission.xp,
      };
    });
  }, []);

  const addRecentlyViewed = useCallback((itemId: string) => {
    setUser(prev => ({
      ...prev,
      recentlyViewed: [itemId, ...prev.recentlyViewed.filter(i => i !== itemId)].slice(0, 10),
    }));
  }, []);

  const useStreakShield = useCallback(() => {
    setUser(prev => {
      if (prev.streakShields <= 0) return prev;
      return { ...prev, streakShields: prev.streakShields - 1 };
    });
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    setUser(prev => {
      if (prev.enrolledCourses.includes(courseId)) return prev;
      return {
        ...prev,
        enrolledCourses: [...prev.enrolledCourses, courseId],
        xp: prev.xp + 30,
        level: getLevelFromXP(prev.xp + 30),
      };
    });
  }, []);

  const claimReferralXP = useCallback((email: string): boolean => {
    let claimed = false;
    setUser(prev => {
      const normalized = email.trim().toLowerCase();
      if (prev.usedReferralEmails.includes(normalized)) return prev;
      claimed = true;
      return {
        ...prev,
        usedReferralEmails: [...prev.usedReferralEmails, normalized],
        referrals: prev.referrals + 1,
        xp: prev.xp + 15,
        level: getLevelFromXP(prev.xp + 15),
        notifications: [
          {
            id: `ref-${Date.now()}`,
            title: "+15 XP — Referral Joined!",
            message: `Your referral (${email}) joined AVIxAI! Bonus XP added.`,
            type: "xp" as const,
            time: "just now",
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
    return claimed;
  }, []);

  const updateProfile = useCallback((profileUpdate: Partial<UserProfile>, name?: string) => {
    setUser(prev => {
      const newProfile = { ...prev.profile, ...profileUpdate };
      const newName = name !== undefined ? name : prev.name;
      const completion = calcProfileCompletion(newProfile, newName);
      return {
        ...prev,
        name: newName,
        profile: newProfile,
        profileCompletion: completion,
      };
    });
  }, []);

  const sendFriendRequest = useCallback((username: string): boolean => {
    let success = false;
    setUser(prev => {
      if (username.toLowerCase() === prev.name.toLowerCase()) return prev;
      if (prev.friends.some(f => f.name.toLowerCase() === username.toLowerCase())) return prev;
      if (prev.sentFriendRequests.some(r => r.fromUserName.toLowerCase() === username.toLowerCase())) return prev;
      
      success = true;
      const newRequest: FriendRequest = {
        id: `req-${Date.now()}`,
        fromUserId: `${Date.now()}`,
        fromUserName: prev.name,
        fromUserLevel: prev.level,
        time: "just now",
        status: "pending",
      };
      
      return {
        ...prev,
        sentFriendRequests: [...prev.sentFriendRequests, newRequest],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: "Friend request sent",
            message: `Friend request sent to ${username}!`,
            type: "system" as const,
            time: "just now",
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
    return success;
  }, []);

  const acceptFriendRequest = useCallback((requestId: string) => {
    setUser(prev => {
      const request = prev.friendRequests.find(r => r.id === requestId);
      if (!request) return prev;
      
      const newFriend: Friend = {
        id: request.fromUserId,
        name: request.fromUserName,
        level: request.fromUserLevel,
        xp: 0,
        lastSeen: "just now",
      };
      
      return {
        ...prev,
        friends: [...prev.friends, newFriend],
        friendRequests: prev.friendRequests.filter(r => r.id !== requestId),
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: "Friend request accepted",
            message: `You're now friends with ${request.fromUserName}!`,
            type: "system" as const,
            time: "just now",
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });
  }, []);

  const rejectFriendRequest = useCallback((requestId: string) => {
    setUser(prev => ({
      ...prev,
      friendRequests: prev.friendRequests.filter(r => r.id !== requestId),
    }));
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setUser(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== friendId),
    }));
  }, []);

  const followUser = useCallback((userId: string) => {
    setUser(prev => {
      if (prev.following.includes(userId)) return prev;
      return {
        ...prev,
        following: [...prev.following, userId],
      };
    });
  }, []);

  const unfollowUser = useCallback((userId: string) => {
    setUser(prev => ({
      ...prev,
      following: prev.following.filter(id => id !== userId),
    }));
  }, []);

  const unreadCount = user.notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user,
      addXP,
      setColorTheme,
      setMode,
      markNotificationRead,
      markAllNotificationsRead,
      toggleSaveJob,
      completeMission,
      addRecentlyViewed,
      unreadCount,
      showConfetti,
      confettiActive,
      useStreakShield,
      enrollCourse,
      claimReferralXP,
      updateProfile,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      followUser,
      unfollowUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
