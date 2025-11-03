
import Image from "next/image"
import Link from "next/link"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaEnvelope, FaPhone, FaArrowLeft, FaQuoteLeft, FaStar, FaAward, FaHandshake, FaCertificate, FaTrophy, FaChartLine, FaHome, FaUsers, FaMapMarkerAlt, FaClock, FaShieldAlt, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram, FaPinterest, FaUser } from "react-icons/fa"
import { TeamMember } from "@/lib/team-members"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Social media platform icon mapping
const socialMediaIcons: Record<string, any> = {
  'facebook': FaFacebookF,
  'linkedin': FaLinkedinIn,
  'twitter': FaTwitter,
  'instagram': FaInstagram,
  'youtube': FaYoutube,
  'tiktok': FaTiktok,
  'whatsapp': FaWhatsapp,
  'telegram': FaTelegram,
  'pinterest': FaPinterest
}

// Capitalize platform name for display
const capitalizePlatform = (platform: string): string => {
  const platformMap: Record<string, string> = {
    'facebook': 'Facebook',
    'linkedin': 'LinkedIn',
    'twitter': 'Twitter',
    'instagram': 'Instagram',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'whatsapp': 'WhatsApp',
    'telegram': 'Telegram',
    'pinterest': 'Pinterest'
  }
  const lowerPlatform = platform.toLowerCase()
  return platformMap[lowerPlatform] || platform.charAt(0).toUpperCase() + platform.slice(1)
}

interface TeamMemberDetailProps {
  teamMember: TeamMember
}

export function TeamMemberDetail({ teamMember }: TeamMemberDetailProps) {
  const {
    name,
    title,
    bio,
    specialization,
    personal_message,
    image_url,
    email,
    phone,
    facebook_url,
    linkedin_url,
    twitter_url,
    instagram_url,
    social_media_links,
    years_experience,
    properties_sold,
    satisfied_clients,
    performance_rating
  } = teamMember
  
  // Check if image URL is valid
  const hasValidImage = image_url && image_url.trim() && image_url.startsWith('http')

  // Get all social media links (use social_media_links if available, otherwise fall back to legacy fields)
  const allSocialLinks = social_media_links && social_media_links.length > 0 
    ? social_media_links 
    : [
        ...(facebook_url ? [{ id: 'facebook', platform: 'facebook', url: facebook_url }] : []),
        ...(linkedin_url ? [{ id: 'linkedin', platform: 'linkedin', url: linkedin_url }] : []),
        ...(twitter_url ? [{ id: 'twitter', platform: 'twitter', url: twitter_url }] : []),
        ...(instagram_url ? [{ id: 'instagram', platform: 'instagram', url: instagram_url }] : [])
      ]

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: title,
    description: bio || `${name} is a ${title} at MJ Properties`,
    email: email,
    telephone: phone,
    image: image_url,
    worksFor: {
      "@type": "Organization",
      name: "MJ Properties",
      url: "https://www.mjproperties.com"
    },
    ...(specialization && {
      knowsAbout: specialization
    }),
    ...(years_experience && {
      jobTitle: `${title} with ${years_experience}+ years experience`
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <article className="min-h-screen bg-gradient-to-br from-mj-teal via-mj-teal-light to-mj-dark">
      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4" itemScope itemType="https://schema.org/Person">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/team">
              <Button variant="outline" className="bg-mj-gold/10 border-mj-gold/30 text-mj-gold hover:bg-mj-gold/20">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Team
              </Button>
            </Link>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Mobile Image */}
            <div className="relative mb-8">
              <div className="relative w-full aspect-[1/4] max-h-[350px] rounded-2xl overflow-hidden shadow-lg">
                {hasValidImage ? (
                  <Image
                    src={image_url!}
                    alt={name}
                    fill
                    className="object-center object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-mj-gold/30 via-mj-gold/20 to-mj-gold/10 flex flex-col items-center justify-center gap-3">
                    <FaUser className="text-6xl text-mj-gold/60" />
                    <p className="text-mj-gold/70 text-sm font-medium">No Image Available</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Mobile Content */}
            <div className="space-y-6">
              <header className="text-center">
                <h1 className="text-3xl font-bold text-mj-white mb-2" itemProp="name">
                  {name}
                </h1>
                <h2 className="text-xl text-mj-gold font-semibold mb-1" itemProp="jobTitle">
                  {title}
                </h2>
              </header>

              {/* Mobile Message */}
              <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaQuoteLeft className="text-mj-gold text-lg" />
                    <h3 className="text-lg font-semibold text-mj-gold">Personal Message</h3>
                  </div>
                  <blockquote className="text-mj-white/90 text-sm italic leading-relaxed">
                    "{personal_message || 'Welcome to MJ Properties! I\'m passionate about helping you find your perfect home in Dubai\'s dynamic real estate market.'}"
                  </blockquote>
                  <footer className="mt-3 text-mj-gold/80 text-sm font-medium">
                    — {name}
                  </footer>
                </CardContent>
              </Card>

              {/* Mobile Specialization */}
              {specialization && (
                <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCertificate className="text-mj-gold text-lg" />
                      <h3 className="text-lg font-semibold text-mj-gold">Specialization</h3>
                    </div>
                    <p className="text-mj-white/90 text-sm leading-relaxed">
                      {specialization}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Bio */}
              {bio && (
                <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaAward className="text-mj-gold text-lg" />
                      <h3 className="text-lg font-semibold text-mj-gold">About Me</h3>
                    </div>
                    <p className="text-mj-white/90 text-sm leading-relaxed" itemProp="description">
                      {bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Contact */}
              {(email || phone) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mj-gold text-center">Get In Touch</h3>
                  {email && (
                    <a 
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 p-4 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:bg-mj-gold/20 transition-colors"
                      itemProp="email"
                    >
                      <FaEnvelope className="text-mj-gold text-lg" />
                      <span className="text-mj-white text-sm">{email}</span>
                    </a>
                  )}
                  {phone && (
                    <a 
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 p-4 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:bg-mj-gold/20 transition-colors"
                      itemProp="telephone"
                    >
                      <FaPhone className="text-mj-gold text-lg" />
                      <span className="text-mj-white text-sm">{phone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Mobile Social */}
              {allSocialLinks.length > 0 && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-mj-gold mb-4">Connect With Me</h3>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {allSocialLinks.map((link) => {
                      const Icon = socialMediaIcons[link.platform.toLowerCase()]
                      if (!Icon) return null
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:bg-mj-gold/20 transition-colors"
                          aria-label={`Follow ${name} on ${capitalizePlatform(link.platform)}`}
                        >
                          <Icon className="text-mj-gold text-lg" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 items-start">
            {/* Desktop Image */}
            <div className="relative">
              <div className="relative w-full aspect-[3/4] max-h-[600px] rounded-2xl overflow-hidden shadow-xl">
                {hasValidImage ? (
                  <Image
                    src={image_url!}
                    alt={name}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-mj-gold/30 via-mj-gold/20 to-mj-gold/10 flex flex-col items-center justify-center gap-3">
                    <FaUser className="text-6xl text-mj-gold/60" />
                    <p className="text-mj-gold/70 text-sm font-medium">No Image Available</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Desktop Content */}
            <div className="space-y-6">
              <header>
                <div className="group flex flex-col items-start w-fit">
                  <h1 className="text-4xl lg:text-5xl font-bold text-mj-white mb-3 cursor-pointer" itemProp="name">
                    {name}
                  </h1>
                  <div className="h-1 w-16 bg-mj-gold rounded-full mb-4 group-hover:w-full transition-all duration-300" />
                </div>
                <h2 className="text-2xl text-mj-gold font-semibold mb-2" itemProp="jobTitle">
                  {title}
                </h2>
              </header>

              {/* Desktop Message */}
              <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaQuoteLeft className="text-mj-gold text-xl" />
                    <h3 className="text-xl font-semibold text-mj-gold">Personal Message</h3>
                  </div>
                  <blockquote className="text-mj-white/90 leading-relaxed italic">
                    "{personal_message || 'Welcome to MJ Properties! I\'m passionate about helping you find your perfect home in Dubai\'s dynamic real estate market.'}"
                  </blockquote>
                  <footer className="mt-3 text-mj-gold/80 font-medium">
                    — {name}
                  </footer>
                </CardContent>
              </Card>

              {/* Desktop Specialization */}
              {specialization && (
                <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCertificate className="text-mj-gold text-xl" />
                      <h3 className="text-xl font-semibold text-mj-gold">Specialization</h3>
                    </div>
                    <p className="text-mj-white/90 leading-relaxed">
                      {specialization}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Desktop Bio */}
              {bio && (
                <Card className="bg-mj-teal-light/50 border-mj-gold/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaAward className="text-mj-gold text-xl" />
                      <h3 className="text-xl font-semibold text-mj-gold">About Me</h3>
                    </div>
                    <p className="text-mj-white/90 leading-relaxed" itemProp="description">
                      {bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Desktop Contact */}
              {(email || phone) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaHandshake className="text-mj-gold text-xl" />
                    <h3 className="text-xl font-semibold text-mj-gold">Get In Touch</h3>
                  </div>
                  {email && (
                    <a 
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 p-4 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors"
                      itemProp="email"
                    >
                      <FaEnvelope className="text-mj-gold text-lg" />
                      <span className="text-mj-white">{email}</span>
                    </a>
                  )}
                  {phone && (
                    <a 
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 p-4 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors"
                      itemProp="telephone"
                    >
                      <FaPhone className="text-mj-gold text-lg" />
                      <span className="text-mj-white">{phone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Desktop Social */}
              {allSocialLinks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-mj-gold">Connect With Me</h3>
                <div className="flex gap-3 flex-wrap">
                  {allSocialLinks.map((link) => {
                    const Icon = socialMediaIcons[link.platform.toLowerCase()]
                    if (!Icon) return null

                    // Format WhatsApp URL if needed
                    let url = link.url
                    if (link.platform.toLowerCase() === 'whatsapp') {
                      // If URL doesn't start with http/https, assume it's a phone number
                      if (!url.startsWith('http')) {
                        // Remove any non-numeric characters
                        const phone = url.replace(/\D/g, '')
                        url = `https://wa.me/${phone}`
                      }
                    }

                    return (
                      <a
                        key={link.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-mj-teal-light/30 rounded-lg border border-mj-gold/20 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors"
                        aria-label={`Follow ${name} on ${capitalizePlatform(link.platform)}`}
                      >
                        <Icon className="text-mj-gold text-xl" />
                      </a>
                    )
                  })}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Stats & Achievements */}
      {((years_experience ?? 0) > 0 || (properties_sold ?? 0) > 0 || (satisfied_clients ?? 0) > 0 || (performance_rating ?? 0) > 0) && (
      <section className="py-12 px-4 bg-mj-dark/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-mj-white mb-2">Professional Excellence</h2>
            <p className="text-mj-white/70">
              Committed to delivering exceptional real estate services with proven results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(years_experience ?? 0) > 0 && (
            <Card className="bg-mj-teal-light/30 border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-mj-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-mj-gold">{(years_experience ?? 0)}+</span>
                </div>
                <h3 className="text-lg font-semibold text-mj-gold mb-2">Years Experience</h3>
                <p className="text-mj-white/80 text-sm">
                  Deep expertise in Dubai real estate market
                </p>
              </CardContent>
            </Card>
            )}
            {(properties_sold ?? 0) > 0 && (
            <Card className="bg-mj-teal-light/30 border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-mj-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHome className="text-2xl text-mj-gold" />
                </div>
                <h3 className="text-lg font-semibold text-mj-gold mb-2">{(properties_sold ?? 0)}+</h3>
                <p className="text-mj-white/80 text-sm">
                  Properties Sold & Leased
                </p>
              </CardContent>
            </Card>
            )}
            {(satisfied_clients ?? 0) > 0 && (
            <Card className="bg-mj-teal-light/30 border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-mj-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-mj-gold" />
                </div>
                <h3 className="text-lg font-semibold text-mj-gold mb-2">{(satisfied_clients ?? 0)}+</h3>
                <p className="text-mj-white/80 text-sm">
                  Satisfied Clients
                </p>
              </CardContent>
            </Card>
            )}
            {(performance_rating ?? 0) > 0 && (
            <Card className="bg-mj-teal-light/30 border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-mj-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-2xl text-mj-gold" />
                </div>
                <h3 className="text-lg font-semibold text-mj-gold mb-2">Top {Math.round((performance_rating ?? 0) * 100)}%</h3>
                <p className="text-mj-white/80 text-sm">
                  Agent Performance Rating
                </p>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </section>
      )}
      {/* Call to Action - Simplified */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-mj-gold/10 to-mj-gold/5 rounded-2xl p-8 border border-mj-gold/30 hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20">
            <h2 className="text-2xl md:text-3xl font-bold text-mj-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-mj-white/80 mb-6">
              Let {name} help you navigate the Dubai real estate market with expertise and personalized service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-mj-gold text-mj-teal cursor-pointer hover:bg-mj-gold/90 px-8 py-3">
                  Contact {name.split(' ')[0]}
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" size="lg" className="border-mj-gold text-mj-gold cursor-pointer px-8 py-3">
                  View Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
    </>
  )
}
