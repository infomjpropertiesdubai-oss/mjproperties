"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  Filter
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface PropertyInquiry {
  id: string
  name: string
  email: string
  phone: string
  inquiry_type: string
  message: string | null
  property_id: string
  status: string
  created_at: string
  updated_at: string
  properties?: {
    id: string
    title: string
  }
}

export default function PropertyInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<PropertyInquiry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchInquiries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/property-inquiries')
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      const data = await response.json()
      setInquiries(data.data || [])
    } catch (error) {
      console.error('Error fetching property inquiries:', error)
      toast.error('Failed to fetch property inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm) ||
      inquiry.properties?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    return matchesSearch && matchesStatus
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
      viewing: 'Schedule Viewing',
      info: 'Request Information',
      financing: 'Financing Options',
      offer: 'Make an Offer'
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "outline" },
      contacted: { label: "Contacted", variant: "secondary" },
      closed: { label: "Closed", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" }
    }
    return badges[status] || { label: status, variant: "outline" }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/property-inquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update status')
      }

      toast.success(`Status updated to ${newStatus}`)
      fetchInquiries()
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error(error.message || 'Failed to update status')
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    
    try {
      const response = await fetch(`/api/property-inquiries?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete inquiry')
      }

      toast.success('Inquiry deleted successfully')
      fetchInquiries()
    } catch (error: any) {
      console.error('Error deleting inquiry:', error)
      toast.error(error.message || 'Failed to delete inquiry')
    }
  }

  // Calculate stats
  const totalInquiries = inquiries.length
  const thisMonthInquiries = inquiries.filter(i => {
    const inquiryDate = new Date(i.created_at)
    const now = new Date()
    return inquiryDate.getMonth() === now.getMonth() &&
           inquiryDate.getFullYear() === now.getFullYear()
  }).length
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length
  const contactedInquiries = inquiries.filter(i => i.status === 'contacted').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Property Inquiries</h1>
          <p className="text-white/80">Manage all property inquiries from potential clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Inquiries</p>
                  <p className="text-2xl font-bold text-white">{totalInquiries}</p>
                </div>
                <Building2 className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonthInquiries}</p>
                </div>
                <Calendar className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white">{pendingInquiries}</p>
                </div>
                <Clock className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Contacted</p>
                  <p className="text-2xl font-bold text-white">{contactedInquiries}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search by name, email, phone, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-mj-teal-light/80 border-mj-gold/20 text-white pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-mj-teal-light/80 border-mj-gold/20 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-white/60">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60">No inquiries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-mj-gold/20">
                      <TableHead className="text-mj-gold">Name</TableHead>
                      <TableHead className="text-mj-gold">Email</TableHead>
                      <TableHead className="text-mj-gold">Phone</TableHead>
                      <TableHead className="text-mj-gold">Property</TableHead>
                      <TableHead className="text-mj-gold">Inquiry Type</TableHead>
                      <TableHead className="text-mj-gold">Status</TableHead>
                      <TableHead className="text-mj-gold">Date</TableHead>
                      <TableHead className="text-mj-gold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => {
                      const statusBadge = getStatusBadge(inquiry.status)
                      return (
                        <TableRow key={inquiry.id} className="border-mj-gold/10">
                          <TableCell className="text-white">{inquiry.name}</TableCell>
                          <TableCell className="text-white/80">{inquiry.email}</TableCell>
                          <TableCell className="text-white/80">{inquiry.phone}</TableCell>
                          <TableCell className="text-white/80">
                            {inquiry.properties?.title ? (
                              <a 
                                href={`/properties/${inquiry.property_id}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-mj-gold hover:underline"
                              >
                                {inquiry.properties.title}
                              </a>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {getInquiryTypeLabel(inquiry.inquiry_type)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          </TableCell>
                          <TableCell className="text-white/60">{formatDate(inquiry.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-mj-gold text-mj-gold hover:bg-mj-gold"
                                    onClick={() => setSelectedInquiry(inquiry)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-mj-dark border-mj-gold/20 text-white max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-mj-gold text-2xl">Inquiry Details</DialogTitle>
                                    <DialogDescription className="text-white/60">
                                      {formatDate(inquiry.created_at)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-white/60 text-sm mb-1">Name</p>
                                        <p className="text-white">{inquiry.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-sm mb-1">Inquiry Type</p>
                                        <p className="text-white">{getInquiryTypeLabel(inquiry.inquiry_type)}</p>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-sm mb-1">Email</p>
                                        <a href={`mailto:${inquiry.email}`} className="text-mj-gold hover:underline">
                                          {inquiry.email}
                                        </a>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-sm mb-1">Phone</p>
                                        <a href={`tel:${inquiry.phone}`} className="text-mj-gold hover:underline">
                                          {inquiry.phone}
                                        </a>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-white/60 text-sm mb-1">Property</p>
                                        {inquiry.properties?.title ? (
                                          <a 
                                            href={`/properties/${inquiry.property_id}`} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-mj-gold hover:underline"
                                          >
                                            {inquiry.properties.title}
                                          </a>
                                        ) : (
                                          <p className="text-white">N/A</p>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-white/60 text-sm mb-1">Status</p>
                                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                                      </div>
                                    </div>
                                    {inquiry.message && (
                                      <div>
                                        <p className="text-white/60 text-sm mb-2">Message</p>
                                        <p className="text-white bg-mj-teal-light/30 p-4 rounded-lg">
                                          {inquiry.message}
                                        </p>
                                      </div>
                                    )}
                                    <div className="flex gap-2">
                                      <Select
                                        value={inquiry.status}
                                        onValueChange={(value) => updateStatus(inquiry.id, value)}
                                      >
                                        <SelectTrigger className="border-mj-gold/20 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="contacted">Contacted</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                onClick={() => deleteInquiry(inquiry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

