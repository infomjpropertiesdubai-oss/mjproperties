"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  User,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface ConsultationRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  type_of_inquiry: string
  preferred_location: string
  budget_range: string
  message: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ConsultationRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [requests, setRequests] = useState<ConsultationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/consultation-requests')
      if (!response.ok) throw new Error('Failed to fetch requests')
      const data = await response.json()
      setRequests(data.data || [])
    } catch (error) {
      console.error('Error fetching consultation requests:', error)
      toast.error('Failed to fetch consultation requests')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm)
    const matchesType = typeFilter === "all" || request.type_of_inquiry === typeFilter
    const matchesLocation = locationFilter === "all" || request.preferred_location === locationFilter
    return matchesSearch && matchesType && matchesLocation
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInquiryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      buying: 'Buying Property',
      selling: 'Selling Property',
      renting: 'Renting Property',
      investment: 'Investment',
      valuation: 'Valuation',
      other: 'Other'
    }
    return labels[type] || type
  }

  const getBudgetLabel = (range: string) => {
    const labels: Record<string, string> = {
      'under-1m': 'Under 1M',
      '1m-2m': '1M - 2M',
      '2m-5m': '2M - 5M',
      '5m-10m': '5M - 10M',
      '10m-20m': '10M - 20M',
      'over-20m': 'Over 20M'
    }
    return labels[range] || range
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the request from ${name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/consultation-requests/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete request')
      toast.success('Request deleted successfully')
      fetchRequests()
    } catch (error) {
      console.error('Error deleting request:', error)
      toast.error('Failed to delete request')
    }
  }

  const uniqueTypes = Array.from(new Set(requests.map(r => r.type_of_inquiry)))
  const uniqueLocations = Array.from(new Set(requests.map(r => r.preferred_location).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Consultation Requests</h1>
          <p className="text-white/80">Manage all property consultation inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{requests.length}</p>
                </div>
                <User className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {requests.filter(r => {
                      const requestDate = new Date(r.created_at)
                      const now = new Date()
                      return requestDate.getMonth() === now.getMonth() &&
                             requestDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Buying Inquiries</p>
                  <p className="text-2xl font-bold text-white">
                    {requests.filter(r => r.type_of_inquiry === 'buying').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {requests.filter(r => r.is_active).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-mj-dark border-mj-gold/30 text-white placeholder-white/50 focus:border-mj-gold"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-white focus:border-mj-gold cursor-pointer">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getInquiryTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-white focus:border-mj-gold cursor-pointer">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location} className="capitalize">
                      {location.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Consultation Requests</CardTitle>
            <CardDescription className="text-white/80">
              {filteredRequests.length} requests found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mj-gold"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-mj-gold/20">
                    <TableHead className="text-mj-gold">Client</TableHead>
                    <TableHead className="text-mj-gold">Contact</TableHead>
                    <TableHead className="text-mj-gold">Inquiry Type</TableHead>
                    <TableHead className="text-mj-gold">Location</TableHead>
                    <TableHead className="text-mj-gold">Budget</TableHead>
                    <TableHead className="text-mj-gold">Date</TableHead>
                    <TableHead className="text-mj-gold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-white/60">
                        No consultation requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id} className="border-mj-gold/20">
                        <TableCell>
                          <div>
                            <p className="font-semibold text-white">
                              {request.first_name} {request.last_name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {request.is_active ? (
                                <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-500 text-white text-xs">Inactive</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-white/60" />
                              <span className="text-white/80">{request.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-white/60" />
                              <span className="text-white/80">{request.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-mj-gold text-mj-gold">
                            {getInquiryTypeLabel(request.type_of_inquiry)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-white/80">
                            {request.preferred_location ? (
                              <>
                                <MapPin className="h-3 w-3 text-mj-gold" />
                                <span className="capitalize">{request.preferred_location.replace('-', ' ')}</span>
                              </>
                            ) : (
                              <span className="text-white/40">Not specified</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.budget_range ? (
                            <div className="flex items-center gap-1 text-mj-gold">
                              <DollarSign className="h-3 w-3" />
                              <span className="text-sm">{getBudgetLabel(request.budget_range)}</span>
                            </div>
                          ) : (
                            <span className="text-white/40">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-white/80">
                          {formatDate(request.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal cursor-pointer"
                              onClick={() => {
                                setSelectedRequest(request)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                              onClick={() => handleDelete(request.id, `${request.first_name} ${request.last_name}`)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-mj-teal-light border-mj-gold/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-mj-gold">Request Details</DialogTitle>
              <DialogDescription className="text-white/60">
                Full consultation request information
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm">Name</label>
                    <p className="text-white font-medium">
                      {selectedRequest.first_name} {selectedRequest.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Email</label>
                    <p className="text-white">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm">Phone</label>
                    <p className="text-white">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Inquiry Type</label>
                    <p className="text-white">{getInquiryTypeLabel(selectedRequest.type_of_inquiry)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm">Preferred Location</label>
                    <p className="text-white capitalize">
                      {selectedRequest.preferred_location ? selectedRequest.preferred_location.replace('-', ' ') : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Budget Range</label>
                    <p className="text-white">
                      {selectedRequest.budget_range ? getBudgetLabel(selectedRequest.budget_range) : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm">Message</label>
                  <p className="text-white bg-mj-dark p-3 rounded-lg mt-1">
                    {selectedRequest.message || 'No message provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm">Submitted</label>
                    <p className="text-white">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Last Updated</label>
                    <p className="text-white">{formatDate(selectedRequest.updated_at)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-mj-gold hover:bg-mj-gold/90 text-mj-teal"
                    onClick={() => window.location.href = `mailto:${selectedRequest.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = `tel:${selectedRequest.phone}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
