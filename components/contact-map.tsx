"use client"

export function ContactMap() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-mj-gold mb-2">Find Our Office</h3>
        <p className="text-muted-foreground">Visit us at our Business Bay location</p>
      </div>
      
      <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] group">
        {/* Enhanced Map Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-mj-teal/10 to-mj-gold/10 rounded-2xl p-1 shadow-2xl">
          <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
            {/* Embedded Google Maps with enhanced styling */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1739405345!2d55.2598612!3d25.1856772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43ea0d4d7ab7%3A0x4e100b1f786eafc0!2sMJ%20Properties!5e0!3m2!1sen!2s!4v1635789012345!5m2!1sen!2s&markers=color:0xFFD700%7Clabel:MJ%7C25.1856772,55.2598612&zoom=16&maptype=roadmap"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MJ Properties Office Location"
              className="rounded-xl"
            />
            
            {/* Overlay gradient for better visual appeal */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none rounded-xl" />
          </div>
        </div>
        
        {/* Floating action button */}
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=25.1856772,55.2598612"
            target="_blank"
            rel="no-referrer"
            className="inline-flex items-center gap-2 bg-mj-gold hover:bg-mj-gold/90 text-mj-teal px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Directions
          </a>
        </div>
      </div>
      
      <div className="">
        <p className="text-sm text-muted-foreground">
          Located in the heart of Business Bay, our office is easily accessible by car and public transport.
          Visitor parking is available in the building.
        </p>
      </div>
    </div>
  )
}
