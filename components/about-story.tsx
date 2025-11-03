import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Award, TrendingUp, Building2, Shield, Star, Clock } from "lucide-react"

export function AboutStory() {
  return (
    <section id="our-story" className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-mj-gold rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-mj-gold rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-mj-gold rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
            Our <span className="text-mj-gold">Story</span>
          </h2>
          <p className="text-base lg:text-lg text-white/90 max-w-5xl mx-auto leading-relaxed">
            MJ PROPERTIES is a dynamic and reliable real estate company
            committed to transforming your property dreams into reality. With
            a strong foundation of trust, transparency, and professionalism, we
            specialize in buying, selling, and renting residential and commercial
            properties across prime locations.
            Our team of experienced real estate professionals is dedicated to
            providing personalized service, market expertise, and seamless
            transactions. 
            We believe in building long-term relationships with our clients
            through integrity, innovation, and customer satisfaction. With MJ
            PROPERTIES, real estate isn't just a transaction – it's a partnership.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16 sm:mb-20">
          {/* Left Content - Mission & Vision */}
          <div className="space-y-8">
            {/* Mission Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                  <div className="p-3 rounded-full bg-mj-gold/20 group-hover:bg-mj-gold/30 transition-colors">
                    <Heart className="w-6 h-6 text-mj-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-mj-gold mb-4">Our Mission</h3>
                    <ul className="list-disc list-inside text-white/90 leading-relaxed space-y-1">
                      <li>Deliver professional and transparent real estate services</li>
                      <li>Simplify property transactions with expert guidance</li>
                      <li>Build trust-based lasting relationships</li>
                      <li>Support sustainable community development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-mj-gold/20 hover:border-mj-gold/40 transition-all duration-300 group">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="p-3 rounded-full bg-mj-gold/20 group-hover:bg-mj-gold/30 transition-colors text-center">
                    <Eye className="w-6 h-6 text-mj-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-mj-gold mb-4">Our Vision</h3>
                    <p className="text-white/90 leading-relaxed">
                      To become the most trusted and innovative real
                      estate company, setting new standards of
                      excellence by delivering unmatched service and
                      creating long-term value for our clients, partners,
                      and communities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Right Content - Image with Stats */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1489516408517-0c0a15662682?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
                alt="MJ Properties Office"
                width={600}
                height={500}
                className="w-full h-[400px] sm:h-[500px] lg:h-[580px] object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-mj-dark to-transparent" />
              
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 rounded-full bg-mj-gold/30 backdrop-blur-sm">
                        <Clock className="w-6 h-6 text-mj-gold" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-sm font-medium text-white/80">Client Support</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 rounded-full bg-mj-gold/30 backdrop-blur-sm">
                        <Target className="w-6 h-6 text-mj-gold" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-sm font-medium text-white/80">Client Focus</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-3 rounded-full bg-mj-gold/30 backdrop-blur-sm">
                        <Building2 className="w-6 h-6 text-mj-gold" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">Dubai</div>
                    <div className="text-sm font-medium text-white/80">Market Experts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
