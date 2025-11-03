"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getProperties, deleteProperty, Property, PROPERTY_TYPES, PROPERTY_STATUS } from "@/lib/properties"

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const router = useRouter()

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const filters: any = {
        limit: 100, // Get all properties for now
        offset: 0,
      }

      if (statusFilter !== "all") {
        filters.status = statusFilter
      }
      if (typeFilter !== "all") {
        filters.property_type = typeFilter
      }
      if (searchTerm) {
        filters.search = searchTerm
      }

      const response = await getProperties(filters)
      setProperties(response.data)
      setTotal(response.pagination.total)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to fetch properties')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [statusFilter, typeFilter, searchTerm])

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await deleteProperty(id)
      toast.success('Property deleted successfully')
      fetchProperties() // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark text-mj-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <h1 className="text-3xl font-bold text-mj-gold mb-2">Properties Management</h1>
          <p className="text-mj-white/80">Manage all your property listings</p>
        </div>

        {/* Controls */}
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-mj-white/60" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-mj-dark border-mj-gold/30 text-mj-white placeholder-mj-white/50 focus:border-mj-gold focus:ring-mj-gold/20"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Status</SelectItem>
                  {PROPERTY_STATUS.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 cursor-pointer w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  <SelectItem value="all">All Types</SelectItem>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="w-full bg-mj-gold hover:bg-mj-gold-light text-mj-teal shadow-lg cursor-pointer"
              onClick={() => router.push("/admin/properties/add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        
        <Card className="bg-mj-teal-light/80 border-mj-gold/20 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-mj-gold">All Properties</CardTitle>
            <CardDescription className="text-mj-white/80">
              {total} properties found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mj-gold"></div>
                <p className="text-mj-white/80">Loading properties...</p>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-mj-gold/20">
                  <TableHead className="text-mj-gold">Property</TableHead>
                  <TableHead className="text-mj-gold">Type</TableHead>
                  <TableHead className="text-mj-gold">Location</TableHead>
                  <TableHead className="text-mj-gold">Price</TableHead>
                  <TableHead className="text-mj-gold">Status</TableHead>
                  <TableHead className="text-mj-gold">Details</TableHead>
                  <TableHead className="text-mj-gold">Views</TableHead>
                  <TableHead className="text-mj-gold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-mj-white/60">
                      No properties found. Try adjusting your filters or create a new property.
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => {
                  const firstImage = property.images?.[0]
                  return (
                    <TableRow key={property.id} className="border-mj-gold/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {firstImage ? (
                            <Image
                              src={firstImage.image_url}
                              alt={firstImage.image_alt}
                              width={60}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-[60px] h-10 bg-mj-gold/20 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-mj-white/60">No Image</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-mj-white text-sm max-w-xs truncate">
                              {property.title}
                            </div>
                            <div className="text-xs text-mj-white/60">
                              {property.bedrooms} bed • {property.bathrooms} bath • {property.area_value} {property.area_unit}
                            </div>
                            {(property.is_featured || property.is_hot_property) && (
                              <div className="flex gap-1 mt-1">
                                {property.is_featured && (
                                  <Badge variant="outline" className="border-mj-gold text-mj-gold text-xs">
                                    Featured
                                  </Badge>
                                )}
                                {property.is_hot_property && (
                                  <Badge variant="outline" className="border-orange-500 text-orange-500 text-xs">
                                    Hot
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-mj-gold text-mj-gold">
                          {property.property_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-mj-white/80">{property.location}</TableCell>
                      <TableCell className="text-mj-gold font-bold">{formatPrice(property.price)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={property.status === "available" ? "default" : property.status === "sold" ? "secondary" : "destructive"}
                          className={property.status === "available" ? "bg-mj-gold text-mj-teal" : ""}
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-mj-white/80 text-sm">
                        <div>Floor: {property.floor_number}</div>
                        <div>Parking: {property.parking_spaces}</div>
                        <div>Built: {property.year_built}</div>
                      </TableCell>
                      <TableCell className="text-mj-white/80">{property.view_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-mj-gold text-mj-gold hover:bg-mj-gold hover:text-white cursor-pointer"
                            onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer"
                            onClick={() => router.push(`/properties/${property.id}`)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                  })
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
