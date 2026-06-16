import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Utensils, Award, Clock, Heart, Shield } from "lucide-react";

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F2ED]">
      {/* Hero Section */}
      <section className="relative bg-[#01311F] text-[#F3F2ED] py-20 sm:py-32 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,170,88,0.15),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Typography Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C6AA58] font-bold">
                Welcome to Mangia Restaurant
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-white">
                Artisanal Italian <br />
                <span className="text-[#C6AA58]">Gastronomy</span>
              </h1>
              <p className="text-base sm:text-lg text-[#F3F2ED]/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Experience culinary excellence crafted with passion. Hand-rolled pastas, legacy recipes, and exceptional wines selected in the heart of Greenwich Village.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/menu"
                  className="bg-[#C6AA58] hover:bg-white hover:text-[#01311F] text-[#01311F] px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md hover:translate-y-[-1px] text-center"
                >
                  Explore Our Menu
                </Link>
                <Link
                  to="/book-table"
                  className="bg-transparent border border-[#F3F2ED]/35 hover:border-[#C6AA58] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:bg-white/5 text-center"
                >
                  Reserve A Table
                </Link>
              </div>
            </div>

            {/* Visual Hero Block */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden border border-[#C6AA58]/20 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Elegant table layout in Mangia restaurant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#01311F]/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-[#F3F2ED] text-[#01311F] p-5 rounded-xl border-l-[6px] border-[#C6AA58] shadow-md">
                  <p className="font-serif text-lg font-bold italic">“The Abruzzo Kitchen”</p>
                  <p className="text-xs text-[#01311F]/70 mt-1">Our monthly menu highlight showcasing the rich rustic recipes of Abruzzo, Italy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience / Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C6AA58] font-bold">Uncompromising Quality</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#01311F]">The Mangia Philosophy</h2>
            <div className="h-0.5 w-16 bg-[#C6AA58] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Card 1 */}
            <div className="p-8 border border-[#01311F]/10 rounded-2xl hover:shadow-md transition-shadow bg-[#F3F2ED]/35 space-y-4">
              <div className="bg-[#01311F]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-[#01311F]">
                <Utensils className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#01311F]">Hand-Crafted Pasta</h3>
              <p className="text-sm text-[#01311F]/70 leading-relaxed">
                Every ribbon of tagliatelle and folded piece of ravioli is hand-rolled in our kitchen daily using fine stone-ground Semola.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 border border-[#01311F]/10 rounded-2xl hover:shadow-md transition-shadow bg-[#F3F2ED]/35 space-y-4">
              <div className="bg-[#01311F]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-[#01311F]">
                <Award className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#01311F]">Legacy Wine Cellar</h3>
              <p className="text-sm text-[#01311F]/70 leading-relaxed">
                Our curated, sommelier-selected collection features over 200 labels from Tuscany, Piedmont, and boutique organic producers.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 border border-[#01311F]/10 rounded-2xl hover:shadow-md transition-shadow bg-[#F3F2ED]/35 space-y-4">
              <div className="bg-[#01311F]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-[#01311F]">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#01311F]">Elegant Social Halls</h3>
              <p className="text-sm text-[#01311F]/70 leading-relaxed">
                Whether sharing inside our warm main wooden dining hall, or under fairy lights on the terrace, Mangia is built for connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Showcase (Bento Grid Style) */}
      <section className="py-20 bg-[#F3F2ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Double image frame */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#01311F]/10 h-48 sm:h-64 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                    alt="Salad Caprese"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#01311F]/10 h-64 sm:h-80 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
                    alt="Tagliatelle cooked by chef"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="rounded-2xl overflow-hidden border border-[#01311F]/10 h-64 sm:h-80 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600&q=80"
                    alt="Fresh beef filet cooked"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#01311F]/10 h-48 sm:h-64 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
                    alt="Hand-rolled italian tiramisu"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C6AA58] font-bold">Unveiling our kitchen secrets</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#01311F] leading-tight">
                Honoring the Italian Traditions of Simple Ingredients
              </h2>
              <p className="text-sm sm:text-base text-[#01311F]/75 leading-relaxed font-light">
                At Mangia, we make food that tastes of family. Every tomato is hand-crushed, our rosemary sprigs are plucked from local green farms, and our dough contains only water, sea salt, yeast, and the finest Italian flour. 
              </p>
              <p className="text-sm sm:text-base text-[#01311F]/75 leading-relaxed font-light">
                We believe that the best stories are shared around an expansive table over deep talk, heavy platters of pasta, and a full glass of Montepulciano. Let us host you tonight.
              </p>

              <div className="pt-4 flex items-center gap-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-[#F3F2ED] overflow-hidden bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80" alt="Chef Vito" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#F3F2ED] overflow-hidden bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80" alt="Sous Chef Luigi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#01311F]">Chef Vito & Team</h4>
                  <p className="text-xs text-[#01311F]/60 font-serif italic">Culinary Curators at Mangia NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct CTA Reservation Strip */}
      <section className="bg-[#01311F] text-[#F3F2ED] py-16 border-t border-[#C6AA58]/20 relative">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Join Us for an Unforgettable Evening</h2>
          <p className="text-sm sm:text-base text-[#F3F2ED]/85 max-w-lg mx-auto font-light">
            Due to limited table configuration capacities inside our Greenwich Village location, we highly recommend booking your reservation up to two weeks in advance.
          </p>
          <div className="pt-2">
            <Link
              to="/book-table"
              className="bg-[#C6AA58] hover:bg-white hover:text-[#01311F] text-[#01311F] px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest inline-block transition-transform transform hover:scale-[1.02] active:scale-95 shadow-lg"
            >
              Reserve Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
