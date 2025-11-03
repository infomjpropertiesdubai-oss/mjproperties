"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  Trash2,
  Download,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface NewsletterSubscription {
  id: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function NewsletterSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/newsletter-subscriptions')
      if (!response.ok) throw new Error('Failed to fetch subscriptions')
      const data = await response.json()
      setSubscriptions(data.data || [])
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error)
      toast.error('Failed to fetch newsletter subscriptions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && subscription.is_active) ||
      (statusFilter === 'inactive' && !subscription.is_active)
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

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete the subscription for ${email}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/newsletter-subscriptions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete subscription')
      toast.success('Subscription deleted successfully')
      fetchSubscriptions()
    } catch (error) {
      console.error('Error deleting subscription:', error)
      toast.error('Failed to delete subscription')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/newsletter-subscriptions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (!response.ok) throw new Error('Failed to update subscription')
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchSubscriptions()
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed Date', 'Last Updated'],
      ...filteredSubscriptions.map(sub => [
        sub.email,
        sub.is_active ? 'Active' : 'Inactive',
        formatDate(sub.created_at),
        formatDate(sub.updated_at)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Subscriptions exported successfully')
  }

  const activeSubscriptions = subscriptions.filter(s => s.is_active).length
  const thisMonthSubscriptions = subscriptions.filter(s => {
    const subDate = new Date(s.created_at)
    const now = new Date()
    return subDate.getMonth() === now.getMonth() &&
           subDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Newsletter Subscriptions</h1>
          <p className="text-white/80">Manage all newsletter subscribers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
                </div>
                <Users className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Active</p>
                  <p className="text-2xl font-bold text-white">{activeSubscriptions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">{thisMonthSubscriptions}</p>
                </div>
                <Calendar className="h-8 w-8 text-mj-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm">
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Growth Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {subscriptions.length > 0 ? Math.round((thisMonthSubscriptions / subscriptions.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-mj-gold" />
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
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-mj-dark border-mj-gold/30 text-white placeholder-white/50 focus:border-mj-gold"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  className={statusFilter === 'all' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal'}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  className={statusFilter === 'active' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal'}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  className={statusFilter === 'inactive' ? 'bg-mj-gold text-mj-teal' : 'border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-mj-teal'}
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Subscribers</CardTitle>
            <CardDescription className="text-white/80">
              {filteredSubscriptions.length} subscribers found
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
                    <TableHead className="text-mj-gold">Email</TableHead>
                    <TableHead className="text-mj-gold">Status</TableHead>
                    <TableHead className="text-mj-gold">Subscribed Date</TableHead>
                    <TableHead className="text-mj-gold">Last Updated</TableHead>
                    <TableHead className="text-mj-gold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-white/60">
                        No newsletter subscriptions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id} className="border-mj-gold/20">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-mj-gold" />
                            <span className="text-white font-medium">{subscription.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {subscription.is_active ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500 text-white">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-white/80">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-white/60" />
                            {formatDate(subscription.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {formatDate(subscription.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className={subscription.is_active
                                ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer"
                                : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white cursor-pointer"
                              }
                              onClick={() => handleToggleStatus(subscription.id, subscription.is_active)}
                            >
                              {subscription.is_active ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                              onClick={() => handleDelete(subscription.id, subscription.email)}
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
      </div>
    </div>
  )
}
