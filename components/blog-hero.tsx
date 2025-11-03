export function BlogHero() {
  return (
    <section className="pt-12 pb-16 bg-mj-dark">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mj-white leading-tight">
              Real Estate Insights           
            </h1>
            <div className="w-64 h-1 bg-gradient-to-r from-mj-gold to-transparent mx-auto rounded-full"></div>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-mj-gold font-medium leading-relaxed max-w-3xl mx-auto">
            Expert analysis, market trends, and investment guidance
          </p>
          
         
        </div>
      </div>
    </section>
  )
}
