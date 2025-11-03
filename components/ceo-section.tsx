import Image from "next/image"
import { Quote } from "lucide-react"

export function CEOSection() {
  return (
    <section className=" py-20 flex items-center justify-center bg-mj-dark">
      <div className="container mx-auto px-4 ">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* CEO Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                <Image
                  src="/images/CEO.jpg"
                  alt="CEO of MJ Properties"
                  height={500}
                  width={500}
                  className="object-cover rounded-2xl w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                  sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mj-dark/40 to-transparent rounded-2xl" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-mj-gold/20">
                    <Quote className="w-6 h-6 text-mj-gold" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-mj-white">
                    Message from the CEO
                  </h2>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <p className="text-sm md:text-lg text-white/80 leading-relaxed">
                  Welcome to MJ PROPERTIES — where trust, dedication,
                  and a passion for real estate drive everything we do.
                  Our goal is simple: to provide reliable, personalized
                  solutions that truly make a difference.
                  Buying or selling property is more than a transaction
                  — it's a personal journey. That’s why our team is here
                  to guide you every step of the way with honesty and
                  professionalism.
                  Thank you for choosing us. We’re proud to be part of
                  your real estate journey
                  </p>
                  
                  
                </div>
              </div>

              {/* CEO Signature */}
              <div className="pt-3 md:pt-6 border-t border-mj-gold/30">
                <div className="flex items-center gap-4">
                  {/* <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-mj-gold/20 flex items-center justify-center">
                    <span className="text-base md:text-xl font-bold text-mj-gold">AM</span>
                  </div> */}
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-mj-gold">AQIB MUNIR</h3>
                    <p className="text-xs md:text-base text-white/70">CEO & Founder, MJ Properties</p>
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