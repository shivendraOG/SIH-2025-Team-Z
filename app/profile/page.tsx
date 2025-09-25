"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, GraduationCap, Users, Trophy, ArrowLeft } from "lucide-react"

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
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("firebaseToken")
        const res = await fetch("/api/users/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          setError(data.message || "Failed to fetch profile.")
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
          })
        }
      } catch (err) {
        setError("Error fetching profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Student Profile
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
            <p className="text-destructive font-medium">{error}</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Profile Header Card */}
            <Card className="p-8 bg-gradient-to-r from-card via-secondary/20 to-accent/10 border-2 border-border/50 shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-xl">
                    <AvatarImage
                      src={profile.avatarUrl || "/placeholder.svg?height=128&width=128&query=student avatar"}
                      alt={profile.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left space-y-3">
                    <h2 className="text-3xl font-bold text-foreground">{profile.fullName || "Student Name"}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {profile.className || "Class"}
                      </Badge>
                      <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        <Trophy className="w-3 h-3 mr-1" />
                        {profile.xp} XP
                      </Badge>
                      <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "-"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Academic Info */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/30 border-2 border-border/50">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Academic</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium text-foreground">{profile.className || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">School</p>
                      <p className="font-medium text-foreground">{profile.schoolName || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Info */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/20 border-2 border-border/50">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <CalendarDays className="w-5 h-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Personal</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium text-foreground">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Experience Points</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-chart-2 to-chart-3 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((profile.xp / 1000) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-chart-2">{profile.xp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Info */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-chart-3/20 border-2 border-border/50 md:col-span-2 lg:col-span-1">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-chart-3/10 rounded-lg">
                      <Users className="w-5 h-5 text-chart-3" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Family</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Father's Name</p>
                      <p className="font-medium text-foreground">{profile.fatherName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mother's Name</p>
                      <p className="font-medium text-foreground">{profile.motherName || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 via-chart-2/5 to-chart-3/5 border-2 border-primary/20">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Ready to learn more?</h3>
                    <p className="text-muted-foreground">Explore courses and track your progress</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                      View Courses
                    </Button>
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
