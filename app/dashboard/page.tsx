"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Trophy,
  Target,
  Users,
  Play,
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  Gamepad2,
  Video,
  FlaskConical,
  Calculator,
  PenTool,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

// Extend Window type to include firebase
declare global {
  interface Window {
    firebase?: any
  }
}
import booksDataRaw from "@/data/books.json"

import TodoList from "@/components/TodoList"
import { useContext } from "react"
// Assuming you will create this context in context/TodoContext.tsx
import { TodoContext, TodoProvider } from "@/context/TodoContext"

interface Book {
  class: string
  subject: string
  title: string
  chapters: { chapter: string; url: string }[]
}

const booksData: Book[] = booksDataRaw as Book[]

function BooksSection({ userClass }: { userClass: string }) {
  function normalizeClass(val: string) {
    if (!val) return ""
    const match = val.match(/\d+/)
    return match ? match[0] : val.trim().toLowerCase()
  }
  const userClassNorm = normalizeClass(userClass)
  const filteredBooks = Array.isArray(booksData)
    ? booksData.filter((book: Book) => normalizeClass(book.class) === userClassNorm)
    : []

  if (!userClassNorm) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-amber-700">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">Please complete your profile to see books for your class.</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  if (filteredBooks.length === 0) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-700">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">No books found for your class.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const subjectColors = {
    Math: "from-blue-500 to-indigo-600",
    Science: "from-green-500 to-emerald-600",
    English: "from-purple-500 to-violet-600",
    History: "from-orange-500 to-red-600",
    Geography: "from-teal-500 to-cyan-600",
  }

  return (
    <div className="space-y-4">
      {filteredBooks.map((book) => (
        <Card
          key={book.subject}
          className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${subjectColors[book.subject as keyof typeof subjectColors] || "from-gray-500 to-gray-600"} text-white shadow-lg`}
              >
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{book.subject}</p>
                {book.chapters && book.chapters.length > 0 && (
                  <div className="space-y-2">
                    {book.chapters.slice(0, 3).map((ch) => (
                      <a
                        key={ch.chapter}
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 mr-2 mb-2"
                      >
                        <Play className="h-3 w-3" />
                        {ch.chapter}
                      </a>
                    ))}
                    {book.chapters.length > 3 && (
                      <span className="text-xs text-gray-500 ml-2">+{book.chapters.length - 3} more chapters</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Utility function for greeting
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

// Math mini-game: simple addition questions awarding xp
function MathMiniGame({ onComplete }: { onComplete: (xp: number) => void }) {
  const [q, setQ] = useState({ a: 0, b: 0, options: [] as number[] })
  const [score, setScore] = useState(0)
  const TARGET = 50
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    generate()
  }, [])

  function generate() {
    const a = Math.floor(Math.random() * 12) + 1
    const b = Math.floor(Math.random() * 12) + 1
    const correct = a + b
    const options = new Set<number>([correct])
    while (options.size < 4) {
      options.add(correct + (Math.floor(Math.random() * 11) - 5))
    }
    const opts = Array.from(options).sort(() => Math.random() - 0.5)
    setQ({ a, b, options: opts })
  }

  function choose(opt: number) {
    if (finished) return
    if (opt === q.a + q.b) {
      const newScore = score + 10
      setScore(newScore)
      if (newScore >= TARGET) {
        setFinished(true)
        setTimeout(() => {
          onComplete(newScore)
        }, 800)
      } else {
        generate()
      }
    } else {
      generate()
    }
  }

  return (
    <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Calculator className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-800">Math Challenge</h3>
          </div>
          <div className="text-4xl font-bold mb-6 text-indigo-700">
            {q.a} + {q.b} = ?
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {q.options.map((opt) => (
            <Button
              key={opt}
              onClick={() => choose(opt)}
              className="h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              disabled={finished}
            >
              {opt}
            </Button>
          ))}
        </div>
        <div className="text-center">
          <div className="text-lg text-blue-700 font-semibold mb-2">Score: {score}</div>
          <div className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
            Reach {TARGET} points to finish! 🎯
          </div>
        </div>
        {finished && (
          <div className="text-green-600 font-bold text-xl bg-green-100 px-6 py-3 rounded-full flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Well done! XP awarded.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Word mini-game
function WordMiniGame({ onComplete }: { onComplete: (xp: number) => void }) {
  const words = ["earth", "river", "planet", "school", "puzzle", "science"]
  const [word, setWord] = useState("")
  const [scrambled, setScrambled] = useState("")
  const [input, setInput] = useState("")

  useEffect(() => {
    const w = words[Math.floor(Math.random() * words.length)]
    setWord(w)
    setScrambled(shuffle(w))
  }, [])

  function shuffle(s: string) {
    return s
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  function submit() {
    if (input.trim().toLowerCase() === word) {
      onComplete(30)
    } else {
      setInput("")
      setScrambled(word)
      setTimeout(() => {
        const nw = words[Math.floor(Math.random() * words.length)]
        setWord(nw)
        setScrambled(shuffle(nw))
      }, 1000)
    }
  }

  return (
    <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <PenTool className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">Word Scramble</h3>
          </div>
          <div className="text-4xl font-bold text-pink-700 mb-6 tracking-wider">{scrambled}</div>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 text-purple-800 w-full max-w-xs text-center font-semibold bg-white/80"
          placeholder="Type the original word"
        />
        <div className="flex gap-3">
          <Button
            onClick={submit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              const nw = words[Math.floor(Math.random() * words.length)]
              setWord(nw)
              setScrambled(shuffle(nw))
              setInput("")
            }}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Shuffle
          </Button>
        </div>
        <div className="text-sm text-purple-600 bg-purple-100 px-4 py-2 rounded-full text-center">
          Solve to earn 30 XP 🏆
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardContent() {
  const [xp, setXp] = useState(850)
  const [greeting, setGreeting] = useState(getGreeting())
  const [xpProgress, setXpProgress] = useState(0)
  const [profile, setProfile] = useState({
    fullName: "",
    className: "",
    dateOfBirth: "",
    schoolName: "",
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState("")
  const [showMobileNav, setShowMobileNav] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("firebaseToken")
    if (!token) {
      window.location.href = "/"
    }
  }, [])

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      if (progress >= 60) {
        progress = 60
        clearInterval(interval)
      }
      setXpProgress(progress)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  function capitalizeFullName(name: string) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true)
      setProfileError("")
      try {
        const token = localStorage.getItem("firebaseToken")
        if (!token) {
          setProfileError("Not logged in. Please login.")
          setLoadingProfile(false)
          return
        }

        const res = await fetch("/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          setProfileError(`Failed to fetch profile. ${data.message || "Please try again."}`)
        } else {
          const user = data.user
          if (user) {
            setProfile({
              fullName: capitalizeFullName(user.fullName || ""),
              className: user.className || "",
              dateOfBirth: user.dateOfBirth || "",
              schoolName: user.schoolName || "",
            })
            setXp(user.xp ?? xp)
          } else {
            setProfileError("No profile data found.")
          }
        }
      } catch (err) {
        setProfileError("Error fetching profile. Please check your connection.")
        console.error("Failed to fetch profile", err)
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  const subjects = [
    {
      name: "Mathematics",
      progress: 75,
      color: "from-blue-500 to-indigo-600",
      icon: Calculator,
      lessons: 24,
      completed: 18,
    },
    {
      name: "Science",
      progress: 62,
      color: "from-green-500 to-emerald-600",
      icon: FlaskConical,
      lessons: 20,
      completed: 12,
    },
    {
      name: "English",
      progress: 90,
      color: "from-purple-500 to-violet-600",
      icon: BookOpen,
      lessons: 16,
      completed: 14,
    },
  ]

  const [fillWidths, setFillWidths] = useState(subjects.map(() => 0))
  useEffect(() => {
    const timers: number[] = []
    subjects.forEach((s, idx) => {
      let w = 0
      const t = window.setInterval(() => {
        w += 3
        if (w >= s.progress) {
          w = s.progress
          clearInterval(t)
        }
        setFillWidths((prev) => {
          const next = [...prev]
          next[idx] = w
          return next
        })
      }, 20)
      timers.push(t)
    })
    return () => timers.forEach((t) => clearInterval(t))
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("firebaseToken")
    window.location.href = "/"
  }

  const [showGame, setShowGame] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)

  function openGame(gameTitle: string) {
    setActiveGame(gameTitle)
    setShowGame(true)
  }
  function closeGame() {
    setShowGame(false)
    setActiveGame(null)
  }

  async function handleGameComplete(earnedXp: number) {
    setXp((prev) => prev + earnedXp)
    try {
      const token = localStorage.getItem("firebaseToken")
      await fetch("/api/users/updateXp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ xp: earnedXp }),
      })
    } catch (err) {
      console.error("Failed to update xp on server:", err)
    }
    closeGame()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  {loadingProfile
                    ? "Loading..."
                    : profileError
                      ? "Dashboard"
                      : `${greeting}, ${profile.fullName?.split(" ")[0] || "Student"}!`}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Ready to learn something new?</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Courses
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </Button>
              </nav>

              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{xp} XP</span>
              </div>

              {/* Avatar dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <img
                      src="/student-avatar.png"
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.fullName || "Student"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Class {profile.className || "Not set"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => window.location.href = "/profile"}
                    >
                      Profile
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Achievements</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowMobileNav(!showMobileNav)}>
                {showMobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          {showMobileNav && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-gray-900">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-gray-900">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Courses
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-gray-900">
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-gray-900">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-gray-600 hover:text-gray-900">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <TodoList />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button className="h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Start New Quiz
          </Button>
          <Button className="h-12 sm:h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Ask a Mentor
          </Button>
          <Button className="h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base sm:col-span-2 md:col-span-1">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            View Achievements
          </Button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Progress & Books */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {subjects.map((subject, idx) => {
                    const IconComponent = subject.icon
                    return (
                      <div key={subject.name} className="text-center">
                        <div
                          className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                          {subject.name}
                        </h3>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{subject.progress}%</div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          {subject.completed}/{subject.lessons} lessons
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${subject.color} transition-all duration-1000`}
                            style={{ width: `${fillWidths[idx]}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Books & Reading */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Books & Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BooksSection userClass={profile.className} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-8">
            {/* Interactive Games */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                  <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Learning Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div
                  onClick={() => openGame("Math Puzzles")}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Math Puzzles</h3>
                        <p className="text-xs sm:text-sm text-gray-600">742 playing</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 w-8 sm:h-9 sm:w-9 p-0">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div
                  onClick={() => openGame("Word Games")}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 cursor-pointer hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <PenTool className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Word Games</h3>
                        <p className="text-xs sm:text-sm text-gray-600">523 playing</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8 w-8 sm:h-9 sm:w-9 p-0">
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {/** Get tasks from TodoContext */}
                {(() => {
                  const { tasks } = useContext(TodoContext) || { tasks: [] }
                  if (!tasks || tasks.length === 0) {
                    return (
                      <div className="text-gray-500 text-sm">No tasks for today! 🎉</div>
                    )
                  }
                  return tasks.map((task: any, idx: number) => {
                    // Color/icon logic based on task type or index
                    let bg = "bg-green-50 border-green-200 text-green-800"
                    let Icon = CheckCircle
                    if (task.type === "reading" || idx % 3 === 1) {
                      bg = "bg-blue-50 border-blue-200 text-blue-800"
                      Icon = Clock
                    } else if (task.type === "video" || idx % 3 === 2) {
                      bg = "bg-purple-50 border-purple-200 text-purple-800"
                      Icon = Video
                    }
                    return (
                      <div
                        key={task.id || idx}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${bg}`}
                      >
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${bg.split(" ").pop()}`} />
                        <span className={`text-xs sm:text-sm font-medium ${bg.split(" ").pop()}`}>{task.text || task.title}</span>
                      </div>
                    )
                  })
                })()}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">1</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Ravi Kumar</p>
                    <p className="text-xs sm:text-sm text-gray-600">3,200 XP</p>
                  </div>
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Priya Singh</p>
                    <p className="text-xs sm:text-sm text-gray-600">2,950 XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">3</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">Fatima Khan</p>
                    <p className="text-xs sm:text-sm text-gray-600">2,600 XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">4</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">You!</p>
                    <p className="text-xs sm:text-sm text-gray-600">{xp} XP</p>
                  </div>
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] sm:h-[600px] overflow-hidden relative shadow-2xl">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
              <Button onClick={closeGame} variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                ✕
              </Button>
            </div>
            <div className="p-3 sm:p-6 h-full">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{activeGame}</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Complete challenges to earn XP and climb the leaderboard!
                </p>
              </div>

              <div className="h-[calc(100%-100px)] sm:h-[calc(100%-120px)]">
                {activeGame === "Math Puzzles" && <MathMiniGame onComplete={handleGameComplete} />}
                {activeGame === "Word Games" && <WordMiniGame onComplete={handleGameComplete} />}
                {!["Math Puzzles", "Word Games"].includes(activeGame || "") && (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center">
                      <Gamepad2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">Game not available yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <TodoProvider>
      <DashboardContent />
    </TodoProvider>
  )
}
