import { PropertySearch } from "./property-search";

export function PropertySearchSection() {
  return (
      <section className="py-8 relative z-10 bg-mj-dark">
            <div className="container mx-auto px-4 absolute -top-10 left-0 right-0 rounded-lg h-32 z-[9999]">
              <PropertySearch />
            </div>
        </section>

  )
}