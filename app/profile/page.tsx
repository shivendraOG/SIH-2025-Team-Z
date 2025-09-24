"use client";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    className: "",
    dateOfBirth: "",
    schoolName: "",
    joinedAt: "",
    xp: 0,
    fatherName: "",
    motherName: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("firebaseToken");
        const res = await fetch("/api/users/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || "Failed to fetch profile.");
        } else {
          setProfile({
            fullName: data.user.fullName || "",
            className: data.user.className || "",
            dateOfBirth: data.user.dateOfBirth || "",
            schoolName: data.user.schoolName || "",
            joinedAt: data.user.createdAt || "",
            xp: data.user.xp || 0,
            fatherName: data.user.fatherName || "",
            motherName: data.user.motherName || "",
            avatarUrl: data.user.avatarUrl || "",
          });
        }
      } catch (err) {
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#292a44] via-[#434377] to-[#80c7ff] p-4">
      <div className="w-full max-w-lg bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-black/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-purple-400/20 mt-8">
        <div className="flex items-center mb-4">
          <button
            className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm font-bold shadow hover:bg-gray-700 transition mr-2"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg text-center flex-1">
            Profile
          </h1>
        </div>
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <div className="flex flex-col gap-4 text-white">
            <div className="flex flex-col items-center gap-2">
              <img
                src={profile.avatarUrl || "/student-avatar.png"}
                alt="Avatar"
                className="rounded-full w-20 h-20 border-4 border-yellow-400 shadow-lg"
              />
              <div className="text-2xl font-bold">{profile.fullName}</div>
              <div className="text-sm text-gray-300">
                Joined:{" "}
                {profile.joinedAt
                  ? new Date(profile.joinedAt).toLocaleDateString()
                  : "-"}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-600/30 border border-purple-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-cyan-200 font-semibold">Class</span>
                <span className="font-bold text-lg">
                  {profile.className || "-"}
                </span>
              </div>
              <div className="bg-emerald-600/30 border border-emerald-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-cyan-200 font-semibold">DOB</span>
                <span className="font-bold text-lg">
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="bg-indigo-600/30 border border-indigo-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-cyan-200 font-semibold">School</span>
                <span className="font-bold text-lg">
                  {profile.schoolName || "-"}
                </span>
              </div>
              <div className="bg-yellow-600/30 border border-yellow-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-yellow-200 font-semibold">XP</span>
                <span className="font-bold text-lg">{profile.xp}</span>
              </div>
              <div className="bg-pink-600/30 border border-pink-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-pink-200 font-semibold">Father</span>
                <span className="font-bold text-lg">
                  {profile.fatherName || "-"}
                </span>
              </div>
              <div className="bg-blue-600/30 border border-blue-300/30 rounded-xl p-4 flex flex-col items-center">
                <span className="text-blue-200 font-semibold">Mother</span>
                <span className="font-bold text-lg">
                  {profile.motherName || "-"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
