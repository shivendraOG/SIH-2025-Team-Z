"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Play, Star, Clock, CheckCircle } from "lucide-react";
import booksDataRaw from "@/data/books.json";

interface Book {
  class: string;
  subject: string;
  title: string;
  chapters: { chapter: string; url: string }[];
}

const booksData: Book[] = booksDataRaw as Book[];

// Add mock data for the new UI to work properly
const newBooksData = booksData.map((book) => ({
  ...book,
  chapters: book.chapters.map((ch, index) => ({
    ...ch,
    completed: index % 2 === 0, // Mocking completion status
    duration: `${Math.floor(Math.random() * 30) + 30} min`, // Mocking duration
  })),
}));

const subjectColors: { [key: string]: { gradient: string; accent: string; icon: string } } = {
  Mathematics: {
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "from-blue-400 to-indigo-500",
    icon: "🧮",
  },
  Physics: {
    gradient: "from-purple-600 via-purple-700 to-violet-800",
    accent: "from-purple-400 to-violet-500",
    icon: "⚛️",
  },
  Chemistry: {
    gradient: "from-emerald-600 via-emerald-700 to-teal-800",
    accent: "from-emerald-400 to-teal-500",
    icon: "🧪",
  },
  Biology: {
    gradient: "from-teal-600 via-teal-700 to-cyan-800",
    accent: "from-teal-400 to-cyan-500",
    icon: "🧬",
  },
  English: {
    gradient: "from-orange-600 via-orange-700 to-red-800",
    accent: "from-orange-400 to-red-500",
    icon: "📝",
  },
  History: {
    gradient: "from-amber-600 via-amber-700 to-yellow-800",
    accent: "from-amber-400 to-yellow-500",
    icon: "🏛️",
  },
  Geography: {
    gradient: "from-pink-600 via-pink-700 to-rose-800",
    accent: "from-pink-400 to-rose-500",
    icon: "🌍",
  },
};

function BooksSection({ userClass }: { userClass: string }) {
  function normalizeClass(val: string) {
    if (!val) return "";
    const match = val.match(/\d+/);
    return match ? match[0] : val.trim().toLowerCase();
  }

  const userClassNorm = normalizeClass(userClass);
  const filteredBooks = Array.isArray(newBooksData)
    ? newBooksData.filter((book) => normalizeClass(book.class) === userClassNorm)
    : [];

  const getCompletionStats = (book: any) => {
    const completed = book.chapters.filter((ch: any) => ch.completed).length;
    const total = book.chapters.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  if (!userClassNorm) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
            <p className="text-slate-400 max-w-sm">
              Please complete your profile to see personalized books for your class.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Books Available</h3>
            <p className="text-slate-400 max-w-sm">
              No books found for Class {userClass}. Check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Your Library</h2>
            <p className="text-slate-400 text-lg">
              Class {userClass} • {filteredBooks.length} subjects available
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">
            {Math.round(
              filteredBooks.reduce((acc, book) => acc + getCompletionStats(book).percentage, 0) /
                (filteredBooks.length || 1)
            )}
            %
          </div>
          <div className="text-slate-400 text-sm">Overall Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBooks.map((book, index) => {
          const colors = subjectColors[book.subject] || subjectColors.Mathematics;
          const stats = getCompletionStats(book);

          return (
            <Card
              key={book.subject}
              className={`bg-gradient-to-br ${colors.gradient} border-0 text-white hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-3xl cursor-pointer group overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12 group-hover:rotate-45 transition-transform duration-1000"></div>

              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${colors.accent} rounded-3xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white/20`}
                    >
                      {colors.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                        {book.subject}
                      </CardTitle>
                      <p className="text-white/80 text-sm font-medium">{book.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-semibold">4.8</span>
                    </div>
                    <div className="text-white/60 text-xs">Rating</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/90 font-medium">Progress</span>
                    <span className="text-white font-bold">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.accent} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-white/70">
                    <span>
                      {stats.completed} of {stats.total} chapters
                    </span>
                    <span>{stats.total - stats.completed} remaining</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                {book.chapters && book.chapters.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Chapters ({book.chapters.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {book.chapters.map((chapter, chapterIndex) => (
                        <a
                          key={chapterIndex}
                          href={chapter.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 group/chapter border border-white/20 hover:border-white/40"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                              (chapter as any).completed
                                ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400/50"
                                : "bg-white/20 text-white group-hover/chapter:bg-white/30"
                            }`}
                          >
                            {(chapter as any).completed ? <CheckCircle className="w-5 h-5" /> : chapterIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium transition-colors duration-300 line-clamp-1 ${
                                (chapter as any).completed
                                  ? "text-emerald-300"
                                  : "text-white group-hover/chapter:text-yellow-200"
                              }`}
                            >
                              {chapter.chapter}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-white/50" />
                              <span className="text-white/60 text-xs">{(chapter as any).duration}</span>
                              {(chapter as any).completed && (
                                <span className="text-emerald-400 text-xs font-medium">✓ Completed</span>
                              )}
                            </div>
                          </div>
                          <div className="text-white/60 group-hover/chapter:text-white/80 transition-colors duration-300">
                            <Play className="w-4 h-4" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-white/50" />
                    </div>
                    <span className="text-white/60">No chapters available</span>
                  </div>
                )}

                <button
                  className={`w-full px-6 py-4 bg-gradient-to-r ${colors.accent} backdrop-blur-sm rounded-2xl text-white font-semibold hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group/button shadow-lg border border-white/20 hover:border-white/40`}
                >
                  <BookOpen className="w-5 h-5 group-hover/button:scale-110 transition-transform duration-300" />
                  <span className="group-hover/button:text-yellow-100 transition-colors duration-300">
                    Continue Reading
                  </span>
                  <Play className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <CardContent className="py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Learning Journey</h3>
                <p className="text-slate-300">Track your progress across all subjects</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {filteredBooks.reduce((acc, book) => acc + getCompletionStats(book).completed, 0)}
                </div>
                <div className="text-slate-400 text-sm">Chapters Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {filteredBooks.reduce((acc, book) => acc + book.chapters.length, 0)}
                </div>
                <div className="text-slate-400 text-sm">Total Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{filteredBooks.length}</div>
                <div className="text-slate-400 text-sm">Active Subjects</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function for greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ---------- Simple React games (inline) ---------- */

// Math mini-game: simple addition questions awarding xp
function MathMiniGame({ onComplete }: { onComplete: (xp: number) => void }) {
  const [q, setQ] = useState({ a: 0, b: 0, options: [] as number[] });
  const [score, setScore] = useState(0);
  const TARGET = 50; // XP threshold to "win" (award total)
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function generate() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const correct = a + b;
    const options = new Set<number>([correct]);
    while (options.size < 4) {
      options.add(correct + (Math.floor(Math.random() * 11) - 5));
    }
    const opts = Array.from(options).sort(() => Math.random() - 0.5);
    setQ({ a, b, options: opts });
  }

  function choose(opt: number) {
    if (finished) return;
    if (opt === q.a + q.b) {
      const newScore = score + 10;
      setScore(newScore);
      if (newScore >= TARGET) {
        setFinished(true);
        setTimeout(() => {
          onComplete(newScore);
        }, 800);
      } else {
        generate();
      }
    } else {
      // wrong answer, just regenerate
      generate();
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4">
      <div className="text-lg font-semibold">Math Puzzle</div>
      <div className="text-2xl font-bold mb-2">
        {q.a} + {q.b} = ?
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            disabled={finished}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-200">Score: {score}</div>
      </div>
      <div className="mt-auto text-xs text-gray-300">
        Correct answers +10 XP. Reach {TARGET} to finish.
      </div>
      {finished && (
        <div className="mt-4 text-green-400 font-bold text-lg">
          🎉 Well done! XP awarded.
        </div>
      )}
    </div>
  );
}

// Word mini-game: simple scramble — quick 1-question reward
function WordMiniGame({ onComplete }: { onComplete: (xp: number) => void }) {
  const words = ["earth", "river", "planet", "school", "puzzle", "science"];
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  useEffect(() => {
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setScrambled(shuffle(w));
  }, []);

  function shuffle(s: string) {
    return s
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  function submit() {
    if (input.trim().toLowerCase() === word) {
      onComplete(30); // award 30 xp
    } else {
      // small UX: reveal correct answer after wrong attempt
      setInput("");
      setScrambled(word);
      setTimeout(() => {
        const nw = words[Math.floor(Math.random() * words.length)];
        setWord(nw);
        setScrambled(shuffle(nw));
      }, 1000);
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4">
      <div className="text-lg font-semibold">Word Scramble</div>
      <div className="text-2xl font-bold">{scrambled}</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="px-3 py-2 rounded-md bg-white/10 text-white w-full max-w-xs"
        placeholder="Type the original word"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-green-600 text-white"
        >
          Submit
        </button>
        <button
          onClick={() => {
            const nw = words[Math.floor(Math.random() * words.length)];
            setWord(nw);
            setScrambled(shuffle(nw));
            setInput("");
          }}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white"
        >
          Shuffle
        </button>
      </div>
      <div className="mt-auto text-xs text-gray-300">
        Solve to earn XP (30 XP for correct answer).
      </div>
    </div>
  );
}

/* ---------- Dashboard (main) ---------- */

export default function Dashboard() {
  const [xp, setXp] = useState(850);
  const [greeting, setGreeting] = useState(getGreeting());
  const [xpProgress, setXpProgress] = useState(0);
  const [profile, setProfile] = useState({
    fullName: "",
    className: "",
    dateOfBirth: "",
    schoolName: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      window.location.href = "/phone";
    }
  }, []);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 60) {
        progress = 60;
        clearInterval(interval);
      }
      setXpProgress(progress);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  function capitalizeFullName(name: string) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      setProfileError("");
      try {
        const token = localStorage.getItem("firebaseToken");
        if (!token) {
          setProfileError("Not logged in. Please login.");
          setLoadingProfile(false);
          return;
        }

        const res = await fetch("/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setProfileError(`Failed to fetch profile. ${data.message || "Please try again."}`);
        } else {
          const user = data.user;
          if (user) {
            setProfile({
              fullName: capitalizeFullName(user.fullName || ""),
              className: user.className || "",
              dateOfBirth: user.dateOfBirth || "",
              schoolName: user.schoolName || "",
            });
            setXp(user.xp ?? xp);
          } else {
            setProfileError("No profile data found.");
          }
        }
      } catch (err) {
        setProfileError("Error fetching profile. Please check your connection.");
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);



  const subjects = [
    {
      name: "Math",
      colorBg: "bg-blue-50",
      colorText: "text-blue-700",
      colorProgress: "bg-yellow-400",
      progress: 75,
    },
    {
      name: "Science",
      colorBg: "bg-green-50",
      colorText: "text-green-700",
      colorProgress: "bg-green-400",
      progress: 62,
    },
    {
      name: "English",
      colorBg: "bg-yellow-50",
      colorText: "text-yellow-700",
      colorProgress: "bg-indigo-400",
      progress: 90,
    },
  ];

  const [fillWidths, setFillWidths] = useState(subjects.map(() => 0));
  useEffect(() => {
    const timers: number[] = [];
    subjects.forEach((s, idx) => {
      let w = 0;
      const t = window.setInterval(() => {
        w += 3;
        if (w >= s.progress) {
          w = s.progress;
          clearInterval(t);
        }
        setFillWidths((prev) => {
          const next = [...prev];
          next[idx] = w;
          return next;
        });
      }, 20);
      timers.push(t);
    });
    return () => timers.forEach((t) => clearInterval(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("firebaseToken");
    window.location.href = "/";
  };

  // SectionCard helper (kept same visuals)
  function SectionCard({ title, gradient, children, icon }: any) {
    return (
      <section
        className={`bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-xl border border-white/10 backdrop-blur-lg mb-4`}
      >
        <h2 className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-400 to-gray-300 mb-3 drop-shadow-lg uppercase tracking-wide">
          <span className="text-2xl">{icon}</span>
          <span>{title}</span>
        </h2>
        {children}
      </section>
    );
  }

  // Mini games list (display only)
  const miniGames = [
    {
      title: "Math Puzzles",
      color: "from-yellow-500 to-orange-500",
      players: "742",
      icon: "🧮",
    },
    {
      title: "Word Games",
      color: "from-indigo-500 to-purple-500",
      players: "523",
      icon: "🔤",
    },
  ];

  const [showGame, setShowGame] = useState(false);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  function openGame(gameTitle: string) {
    setActiveGame(gameTitle);
    setShowGame(true);
  }
  function closeGame() {
    setShowGame(false);
    setActiveGame(null);
  }

  async function handleGameComplete(earnedXp: number) {
    setXp((prev) => prev + earnedXp);
    // send to backend to update xp (optional)
    try {
      const token = localStorage.getItem("firebaseToken");
      await fetch("/api/users/updateXp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ xp: earnedXp }),
      });
    } catch (err) {
      console.error("Failed to update xp on server:", err);
    }
    closeGame();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#292a44] via-[#434377] to-[#80c7ff]">
      {/* Header Banner */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-purple-900/80 via-indigo-900/70 to-black/70 backdrop-blur-xl p-8 text-white shadow-2xl border-b border-purple-400/20 rounded-b-3xl">
        {/* Greeting and Profile */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">
            {loadingProfile
              ? "Loading..."
              : profileError
                ? profileError
                : `${greeting}${profile.fullName ? ", " + profile.fullName + " 👋" : ""
                }`}
          </h1>

          {/* User Info Pills */}
          {!loadingProfile && !profileError && (
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/30 border border-purple-300/30 shadow-inner text-white hover:scale-105 hover:shadow-purple-500/40 transition">
                🎓 <span className="font-semibold text-cyan-200">Class</span>
                <span className="font-bold">{profile.className || "-"}</span>
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/30 border border-emerald-300/30 shadow-inner text-white hover:scale-105 hover:shadow-emerald-400/40 transition">
                📅 <span className="font-semibold text-cyan-200">DOB</span>
                <span className="font-bold">
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : "-"}
                </span>
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/30 border border-indigo-300/30 shadow-inner text-white hover:scale-105 hover:shadow-indigo-400/40 transition">
                🏫 <span className="font-semibold text-cyan-200">School</span>
                <span className="font-bold">{profile.schoolName || "-"}</span>
              </span>
            </div>
          )}
        </div>

        {/* XP, avatar, lang, logout */}
        <div className="flex items-center gap-6 mt-6 md:mt-0">
          <div className="bg-gradient-to-r from-purple-700/70 to-indigo-800/50 px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 border border-purple-300/20 relative">
            <span className="font-semibold text-yellow-300">⚡ XP</span>
            <span className="text-white font-bold text-lg">{xp}</span>
            <div className="ml-3 w-28 h-3 bg-white/20 rounded-full border border-yellow-200/30 shadow-inner overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* <img
            src="/student-avatar.png"
            alt="profile avatar"
            className="rounded-full w-12 h-12 border-4 border-yellow-400 shadow-lg hover:scale-105 transition-transform duration-300"
          /> */}
          <select
            aria-label="Language selector"
            className="bg-gray-800/60 border border-gray-500/40 rounded-lg text-sm px-3 py-2 text-white hover:bg-gray-700/80 transition cursor-pointer shadow"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-700 text-white text-sm font-bold hover:scale-105 hover:from-red-700 hover:to-pink-800 transition shadow-lg border border-red-200/40"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Live Class Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-purple-700 via-teal-700 to-blue-800 p-8 mx-4 mt-6 shadow-2xl border border-purple-600/40 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        {/* Decorative Curve or Shape */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-40 blur-xl transform rotate-12 -z-10"></div>

        <div className="space-y-4">
          {/* Greeting */}
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 drop-shadow-2xl">
            {greeting}, {profile.fullName || "Student"}! 🌟
          </div>

          {/* Class Information */}
          <div className="text-lg text-gray-200 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-3">
            <span className="text-4xl animate-bounce">🎉</span>
            <span className="text-xl md:text-2xl font-medium">New science live class today at 4:00PM!</span>

            {/* Button */}
            <button
              className="ml-3 px-6 py-3 text-sm rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-2xl hover:from-teal-600 hover:to-cyan-600 transition duration-300 transform hover:scale-105"
              aria-label="Join live class"
            >
              Join Now
            </button>
          </div>
        </div>

        {/* Mascot Image */}
        <div className="mt-6 md:mt-0 relative">
          <img
            src="/friendly-mascot-robot.jpg"
            alt="Mascot"
            className="w-24 h-24 md:w-32 md:h-32 select-none drop-shadow-xl hover:rotate-12 transition-transform duration-300 ease-in-out"
            loading="lazy"
          />
        </div>
      </section>


      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 mx-4 flex-wrap justify-between">
        <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-indigo-400 flex-1 max-w-xs text-center ">
          🎯 Start New Quiz
        </button>
        <button className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-green-400 flex-1 max-w-xs text-center ">
          🤝 Ask a Mentor
        </button>
        <button className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-yellow-400 flex-1 max-w-xs text-center ">
          🏅 View Badges
        </button>
      </div>

      {/* Main dashboard grid */}
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Progress Tracking Section */}
        <SectionCard
          gradient="from-black/50 via-cyan-900/60 to-blue-800/50"
          icon="📊"
          title="My Progress Tracking"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {subjects.map((sub, idx) => (
              <div
                key={sub.name}
                className="bg-black/40 rounded-2xl p-5 text-center border border-white/10 hover:shadow-2xl transition text-sm"
              >
                <div className="font-bold text-white mb-2 text-lg drop-shadow">
                  {sub.name}
                </div>
                <div className="mb-3 text-gray-200">
                  {sub.progress}% completed
                </div>
                <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 transition-all duration-300 shadow-md`}
                    style={{ width: `${fillWidths[idx]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Books & Reading */}
        <SectionCard
          gradient="from-green-300/20 to-green-700/50"
          icon="📚"
          title="Books & Reading"
        >
          <BooksSection userClass={profile.className} />
        </SectionCard>


        {/* Notes & Study */}
        <SectionCard
          gradient="from-purple-200/20 to-pink-600/40"
          icon="📝"
          title="Notes & Study"
        >
          <div className="space-y-3">
            <div className="bg-purple-600/20 border border-purple-300/30 rounded-lg p-4 hover:bg-purple-700/40 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold text-white">My Notes</div>
                  <div className="text-sm text-gray-200">15 subjects</div>
                </div>
              </div>
            </div>
            <div className="bg-indigo-600/20 border border-indigo-200/30 rounded-lg p-4 hover:bg-indigo-700/40 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✏️</span>
                <div>
                  <div className="font-semibold text-white">Study Planner</div>
                  <div className="text-sm text-gray-200">Weekly schedule</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Games & Fun (now with playable mini-games) */}
        <SectionCard
          gradient="from-yellow-100/20 to-yellow-700/40"
          icon="🎮"
          title="Games & Fun"
        >
          <div className="space-y-3">
            {miniGames.map((g) => (
              <div
                key={g.title}
                className="bg-yellow-600/20 border border-yellow-200/30 rounded-lg p-4 hover:bg-yellow-700/40 transition cursor-pointer shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{g.title}</div>
                    <div className="text-sm text-gray-300">
                      {g.players} Playing
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openGame(g.title)}
                    className="px-3 py-2 rounded-lg bg-white/10 text-white"
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
            {/* Word Games card (kept separate for style parity) */}
            <div className="bg-orange-600/20 border border-orange-200/30 rounded-lg p-4 hover:bg-orange-700/40 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧩</span>
                <div>
                  <div className="font-semibold text-white">Word Games</div>
                  <div className="text-sm text-gray-300">
                    Vocabulary builder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ... other SectionCards (Quiz & Tests, Simulations, Videos ...) */}
        <SectionCard
          gradient="from-red-200/10 to-pink-500/30"
          icon="🎯"
          title="Quiz & Tests"
        >
          <div className="space-y-3">
            <div className="bg-red-600/20 border border-red-200/30 rounded-lg p-4 hover:bg-red-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">❓</span>
                <div>
                  <div className="font-semibold text-white">Daily Quiz</div>
                  <div className="text-sm text-gray-300">5 questions</div>
                </div>
              </div>
            </div>
            <div className="bg-pink-600/20 border border-pink-200/30 rounded-lg p-4 hover:bg-pink-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-semibold text-white">Mock Tests</div>
                  <div className="text-sm text-gray-300">Practice exams</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          gradient="from-teal-400/20 to-cyan-500/30"
          icon="🔬"
          title="Simulations"
        >
          <div className="space-y-3">
            <div className="bg-teal-600/20 border border-teal-200/30 rounded-lg p-4 hover:bg-teal-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚗️</span>
                <div>
                  <div className="font-semibold text-white">Chemistry Lab</div>
                  <div className="text-sm text-gray-300">
                    Virtual experiments
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-cyan-600/20 border border-cyan-200/30 rounded-lg p-4 hover:bg-cyan-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔬</span>
                <div>
                  <div className="font-semibold text-white">Physics Sim</div>
                  <div className="text-sm text-gray-300">Motion & forces</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          gradient="from-violet-400/20 to-purple-800/20"
          icon="🎥"
          title="Videos & Media"
        >
          <div className="space-y-3">
            <div className="bg-violet-600/20 border border-violet-200/30 rounded-lg p-4 hover:bg-violet-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📹</span>
                <div>
                  <div className="font-semibold text-white">Lecture Videos</div>
                  <div className="text-sm text-gray-300">Expert teachers</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-600/20 border border-purple-200/30 rounded-lg p-4 hover:bg-purple-700/30 transition cursor-pointer shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <div className="font-semibold text-white">Animations</div>
                  <div className="text-sm text-gray-300">Concept videos</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Today's Tasks */}
        <SectionCard
          gradient="from-emerald-400/10 to-green-900/20"
          icon="✅"
          title="Today's Tasks"
        >
          <ul className="space-y-3">
            <li className="bg-emerald-600/20 border border-emerald-200/30 rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-emerald-700/30 transition">
              <span className="text-xl">📝</span>
              <span className="text-white">Complete Science Quiz 4</span>
            </li>
            <li className="bg-blue-600/20 border border-blue-200/30 rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-blue-700/30 transition">
              <span className="text-xl">📚</span>
              <span className="text-white">Read English Chapter 3</span>
            </li>
            <li className="bg-yellow-600/20 border border-yellow-200/30 rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-yellow-700/30 transition">
              <span className="text-xl">🎥</span>
              <span className="text-white">Watch: Fractions in Maths</span>
            </li>
          </ul>
        </SectionCard>

        {/* Today's Timetable */}
        <SectionCard
          gradient="from-orange-500/10 to-red-400/10"
          icon="🕐"
          title="Today's Timetable"
        >
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-3 bg-orange-600/20 border border-orange-200/30 rounded-lg p-3">
              <span className="font-semibold text-yellow-400 w-16">2:00pm</span>
              <span className="text-white">🧮 Maths - Chapter 5 Revision</span>
            </li>
            <li className="flex items-center gap-3 bg-green-600/20 border border-green-200/30 rounded-lg p-3">
              <span className="font-semibold text-yellow-400 w-16">3:30pm</span>
              <span className="text-white">🌱 Science - Experiment Video</span>
            </li>
            <li className="flex items-center gap-3 bg-purple-600/20 border border-purple-200/30 rounded-lg p-3">
              <span className="font-semibold text-yellow-400 w-16">4:00pm</span>
              <span className="text-white">💻 Live Class: Science Doubts</span>
            </li>
          </ul>
        </SectionCard>

        {/* Leaderboard */}
        <SectionCard
          gradient="from-purple-400/10 to-pink-400/10"
          icon="🏆"
          title="Leaderboard"
        >
          <ol className="space-y-2">
            <li className="flex items-center gap-3 bg-yellow-600/20 border border-yellow-200/30 rounded-lg p-3 shadow">
              <span className="text-yellow-400 font-bold">1.</span>
              <span className="text-2xl">🌟</span>
              <span className="text-white font-semibold">
                Ravi Kumar (XP: 3200)
              </span>
            </li>
            <li className="flex items-center gap-3 bg-gray-600/20 border border-gray-200/30 rounded-lg p-3">
              <span className="text-gray-400 font-bold">2.</span>
              <span className="text-2xl">🥈</span>
              <span className="text-white">Priya Singh (XP: 2950)</span>
            </li>
            <li className="flex items-center gap-3 bg-orange-600/20 border border-orange-200/30 rounded-lg p-3">
              <span className="text-orange-400 font-bold">3.</span>
              <span className="text-2xl">🥉</span>
              <span className="text-white">Fatima Khan (XP: 2600)</span>
            </li>
            <li className="flex items-center gap-3 bg-cyan-600/20 border border-cyan-200/30 rounded-lg p-3 ring-2 ring-cyan-300">
              <span className="text-cyan-400 font-bold">4.</span>
              <span className="text-2xl">🎯</span>
              <span className="text-white font-semibold">You! (XP: {xp})</span>
            </li>
          </ol>
        </SectionCard>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed z-30 bottom-3 left-3 right-3 md:hidden flex bg-gray-900/95 backdrop-blur-2xl border-t border-gray-700 shadow-xl rounded-2xl">
        {[
          { label: "Home", icon: "🏠" },
          { label: "Subjects", icon: "📚" },
          { label: "Tasks", icon: "📝" },
          { label: "Rank", icon: "🏆" },
          { label: "Profile", icon: "👤" },
        ].map(({ label, icon }) => (
          <button
            key={label}
            className="flex-1 p-3 flex flex-col items-center justify-center text-gray-300 text-xs hover:text-white hover:bg-gray-800/50 transition rounded-lg m-1"
            aria-label={label}
            type="button"
          >
            <span className="text-lg">{icon}</span>
            <span className="mt-1">{label}</span>
          </button>
        ))}
      </nav>

      {/* Game modal */}
      {showGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl w-full max-w-2xl h-[520px] overflow-hidden relative shadow-2xl border border-white/10">
            <button
              onClick={closeGame}
              className="absolute top-3 right-3 text-white text-2xl px-3 py-1"
            >
              ✕
            </button>
            <div className="p-4 h-full text-white flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{activeGame}</h3>
                <div className="text-sm text-gray-300">
                  Earn XP by completing challenges
                </div>
              </div>

              <div className="flex-1 mt-4">
                {activeGame === "Math Puzzles" && (
                  <MathMiniGame onComplete={handleGameComplete} />
                )}
                {activeGame === "Word Games" && (
                  <WordMiniGame onComplete={handleGameComplete} />
                )}
                {!["Math Puzzles", "Word Games"].includes(activeGame || "") && (
                  <div className="p-6 text-center text-gray-300">
                    Game not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
