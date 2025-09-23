"use client"

import { useState, useEffect } from "react"
import {
  FaGamepad,
  FaLanguage,
  FaWifi,
  FaChartLine,
  FaTrophy,
  FaStar,
  FaBook,
  FaAtom,
  FaCalculator,
  FaCode,
  FaGraduationCap,
  FaUsers,
  FaAward,
} from "react-icons/fa"

export default function Home() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
      setStars(newStars)
    }
    generateStars()
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <FaStar
              key={star.id}
              className="absolute text-yellow-300 opacity-70 animate-pulse"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animationDelay: `${star.delay}s`,
                fontSize: "12px",
              }}
            />
          ))}
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: "0.5s" }}>
          <FaBook className="text-4xl text-cyan-400 opacity-80" />
        </div>
        <div className="absolute top-32 right-20 animate-bounce" style={{ animationDelay: "1s" }}>
          <FaAtom className="text-3xl text-green-400 opacity-80" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: "1.5s" }}>
          <FaCalculator className="text-3xl text-pink-400 opacity-80" />
        </div>
        <div className="absolute bottom-32 right-10 animate-bounce" style={{ animationDelay: "2s" }}>
          <FaCode className="text-4xl text-orange-400 opacity-80" />
        </div>

        {/* Main Content */}
        <div className="text-center z-10 px-4">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-8 leading-tight drop-shadow-2xl animate-pulse">
            Learning Made Fun,
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-extrabold">
              For Every Student, Everywhere! 🚀
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students across Odisha in our gamified learning adventure! Master STEM subjects through
            interactive games, quizzes, and challenges. 🎮📚
          </p>

          {/* Gamified Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => (window.location.href = "/phone")}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-yellow-400/50 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-110 animate-pulse"
            >
              🎮 Start Learning Adventure
            </button>
            <button
              onClick={() => (window.location.href = "/phone")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-purple-400/50 hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-110"
            >
              📚 Join the Fun Now!
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <span className="text-gray-200 text-sm font-semibold">Active Students</span>
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-yellow-400 text-sm font-bold">15,000+</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-lg">
            🌟 Why Choose Our Platform? 🌟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* STEM Games Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-3xl text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
              <div className="text-6xl mb-4 animate-bounce">🎮</div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">STEM Games</h3>
              <p className="text-lg opacity-90 mb-6">
                Interactive quizzes, puzzles, and simulations that make learning science and math super fun!
              </p>
              <div className="flex justify-center gap-2">
                <FaGamepad className="text-2xl text-cyan-300" />
                <FaAtom className="text-2xl text-green-300" />
                <FaCalculator className="text-2xl text-pink-300" />
              </div>
            </div>

            {/* Multilingual Card */}
            <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white p-8 rounded-3xl text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50">
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: "0.2s" }}>
                🌍
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Multilingual</h3>
              <p className="text-lg opacity-90 mb-6">
                Learn in your preferred language - Odia, Hindi, or English. Choose what works best for you!
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <FaLanguage className="text-2xl text-cyan-300" />
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">ଓଡ଼ିଆ</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">हिंदी</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">English</span>
              </div>
            </div>

            {/* Offline Card */}
            <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-8 rounded-3xl text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50">
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: "0.4s" }}>
                📶
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Works Offline</h3>
              <p className="text-lg opacity-90 mb-6">
                No internet? No problem! Download lessons and sync when you're back online.
              </p>
              <div className="flex justify-center gap-2">
                <FaWifi className="text-2xl text-cyan-300" />
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              </div>
            </div>

            {/* Teacher Dashboard Card */}
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 text-white p-8 rounded-3xl text-center transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50">
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: "0.6s" }}>
                📊
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">Teacher Dashboard</h3>
              <p className="text-lg opacity-90 mb-6">
                Track student progress, assign tasks, and celebrate achievements with detailed analytics.
              </p>
              <div className="flex justify-center gap-2">
                <FaChartLine className="text-2xl text-cyan-300" />
                <FaUsers className="text-2xl text-green-300" />
                <FaGraduationCap className="text-2xl text-purple-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 drop-shadow-lg">
            🏆 Student Champions Leaderboard 🏆
          </h2>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 max-w-4xl mx-auto border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Top Student */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl text-black transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="text-4xl mb-2 animate-bounce">🥇</div>
                <h3 className="text-2xl font-bold mb-2">Priya Sharma</h3>
                <p className="text-lg opacity-80 mb-4">Class 10 ⭐</p>
                <div className="flex justify-center items-center gap-2">
                  <FaTrophy className="text-2xl" />
                  <span className="text-2xl font-bold">2,450 pts</span>
                </div>
              </div>

              {/* Second Place */}
              <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: "0.2s" }}>
                  🥈
                </div>
                <h3 className="text-2xl font-bold mb-2">Arjun Patel</h3>
                <p className="text-lg opacity-90 mb-4">Class 9 ⭐</p>
                <div className="flex justify-center items-center gap-2">
                  <FaTrophy className="text-2xl" />
                  <span className="text-2xl font-bold">2,320 pts</span>
                </div>
              </div>

              {/* Third Place */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: "0.4s" }}>
                  🥉
                </div>
                <h3 className="text-2xl font-bold mb-2">Sita Mohanty</h3>
                <p className="text-lg opacity-90 mb-4">Class 8 ⭐</p>
                <div className="flex justify-center items-center gap-2">
                  <FaTrophy className="text-2xl" />
                  <span className="text-2xl font-bold">2,180 pts</span>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all duration-300">
                <FaUsers className="text-3xl text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">15,000+</div>
                <div className="text-sm text-gray-300">Active Students</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all duration-300">
                <FaAward className="text-3xl text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">8,500+</div>
                <div className="text-sm text-gray-300">Achievements</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all duration-300">
                <FaBook className="text-3xl text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-300">Lessons</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all duration-300">
                <FaGraduationCap className="text-3xl text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Government Branding */}
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-2 text-cyan-400">Government of Odisha</div>
              <div className="text-lg opacity-80">Department of School Education</div>
              <div className="text-sm opacity-60 mt-2">Empowering Education Through Technology 🚀</div>
            </div>

            {/* School Logos Placeholder */}
            <div className="text-center">
              <div className="text-lg font-semibold mb-4 text-purple-400">Partner Schools</div>
              <div className="flex justify-center gap-4 flex-wrap">
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm border border-gray-600">
                  Kendriya Vidyalaya
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm border border-gray-600">DAV Public School</div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-sm border border-gray-600">
                  Government High School
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-right">
              <div className="text-lg font-semibold mb-2 text-green-400">Contact Us</div>
              <div className="text-sm opacity-80 mb-1">📧 info@odishaedtech.gov.in</div>
              <div className="text-sm opacity-80 mb-1">📞 +91-674-123-4567</div>
              <div className="text-sm opacity-80">🌐 www.odishaedtech.gov.in</div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm opacity-60">
            © 2025 Gamified Learning Platform - Government of Odisha. All rights reserved. 🎓
          </div>
        </div>
      </footer>
    </div>
  )
}
