"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Star,
  Award,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation"
import { TeamMember } from "@/lib/team-members"

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingIndex, setIsDeletingIndex] = useState<number | null>(null)
 const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true)
      const response = await fetch("/api/team-members")
      const data = await response.json()
      setTeamMembers(data.data)
      setIsLoading(false)
    }
    fetchTeamMembers()
  }, [])

  const handleEdit = (member: TeamMember) => {
    sessionStorage.setItem('editingMember', JSON.stringify(member))
    router.push(`/admin/team/edit`)
    setEditingMember(member)
  }


    const handleDelete = async (memberId: string, index: number) => {
    setIsDeleting(true)
    setIsDeletingIndex(index)
    try {
      const response = await fetch(`/api/team-members?id=${memberId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete team member')
      }

      // Remove the team member from the list
      setTeamMembers(prev => prev.filter(member => member.id !== memberId))
      toast.success('Team member deleted successfully')
    } catch (error: any) {
      console.error('Error deleting team member:', error)
      toast.error('Failed to delete team member: ' + error.message)
    } finally {
      setIsDeleting(false)
      setIsDeletingIndex(null)
    }
  }



  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.specialization === roleFilter
    const matchesStatus = statusFilter === "all" || member.is_active === (statusFilter === "active")
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Team Members Management</h1>
          <p className="text-mj-white/80">Manage your real estate team and professionals</p>
        </div>

        {/* Controls */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-mj-white/60" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-mj-dark border-mj-gold/30 text-mj-white placeholder-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Luxury Penthouses" className="cursor-pointer">Luxury Penthouses</SelectItem>
                  <SelectItem value="Commercial Properties" className="cursor-pointer">Commercial Properties</SelectItem>
                  <SelectItem value="Waterfront Villas" className="cursor-pointer">Waterfront Villas</SelectItem>
                  <SelectItem value="Residential Properties" className="cursor-pointer">Residential Properties</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                 <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
                  <SelectItem value="inactive" className="cursor-pointer">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="w-full bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer"
                onClick={() => router.push("/admin/team/add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Team Members</CardTitle>
            <CardDescription className="text-mj-white/80">
              {teamMembers.length} team members found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mj-gold"></div>
                <p className="text-mj-white/80">Loading team members...</p>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-mj-gold/20">
                  <TableHead className="text-mj-gold">Member</TableHead>
                  <TableHead className="text-mj-gold">Specialization</TableHead>
                  <TableHead className="text-mj-gold">Contact</TableHead>
                  <TableHead className="text-mj-gold">Bio</TableHead>
                  <TableHead className="text-mj-gold">Performance</TableHead>
                  <TableHead className="text-mj-gold">Status</TableHead>
                  <TableHead className="text-mj-gold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member, index) => (
                  <TableRow key={member.id} className="border-mj-gold/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-mj-gold/30">
                          <AvatarImage 
                            src={member.image_url} 
                            alt={member.name}
                          />
                          <AvatarFallback className="bg-mj-gold/20 text-mj-gold border-mj-gold/30">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-mj-white">{member.name}</p>
                          <p className="text-sm text-mj-white/60">{member.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-mj-gold text-mj-gold">
                        {member.specialization || "No specialization"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-mj-white/80">{member.email || "No email"}</p>
                        <p className="text-sm text-mj-white/60">{member.phone || "No phone"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-mj-white/80 max-w-lg">
                      {member.bio
                        ? (
                            member.bio.length > 70
                              ? (
                                  <span title={member.bio}>
                                    {member.bio.slice(0, 50)}...
                                  </span>
                                )
                              : member.bio
                          )
                        : "No bio"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-mj-white/80">{member.is_active ? "Active" : "Inactive"}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-mj-gold" />
                          <span className="text-sm text-mj-white/80">{member.display_order || "No display order"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={member.is_active ? "default" : "secondary"}
                        className={member.is_active ? "bg-mj-gold text-mj-teal" : ""}
                      >
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-white cursor-pointer"
                          onClick={() => handleEdit(member)}
                          >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                              disabled={isDeleting || isDeletingIndex === index}
                            >
                              {isDeletingIndex === index ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-mj-dark border-mj-gold/30">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-mj-gold">Delete Team Member</AlertDialogTitle>
                              <AlertDialogDescription className="text-mj-white/80">
                                Are you sure you want to delete {member.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => member.id && handleDelete(member.id, index)}
                              >
                                {isDeletingIndex === index ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

