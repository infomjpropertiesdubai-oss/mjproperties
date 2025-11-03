import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Lightbulb, Handshake } from "lucide-react"

const teamValues = [
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "We work together as a unified team to deliver the best results for our clients.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "Every team member is focused on achieving exceptional outcomes and exceeding expectations.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description: "We stay updated with market trends and continuously enhance our skills and knowledge.",
  },
  {
    icon: Handshake,
    title: "Client Partnership",
    description: "We build long-term relationships based on trust, transparency, and mutual success.",
  },
]

export function TeamValues() {
  return (
    <section className="py-16 bg-mj-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Our Team <span className="text-mj-gold">Philosophy</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that unite our team and drive our commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamValues.map((value, index) => (
            <Card key={index} className="bg-card border-mj-gold/20  hover:border-mj-gold hover:shadow-lg hover:shadow-mj-gold/20 transition-colors group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-mj-gold/10 group-hover:bg-mj-gold/20 transition-colors">
                    <value.icon className="h-8 w-8 text-mj-gold" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-mj-gold transition-colors">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
