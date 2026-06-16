import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#01311F] text-[#F3F2ED] py-12 border-t border-[#C6AA58]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[#C6AA58]">
              MANGIA
            </h3>
            <p className="text-sm text-[#F3F2ED]/75 max-w-sm">
              Authentic Italian dining crafted with local organic ingredients, age-old recipes, and passionate hospitality in an elegant, warm atmosphere.
            </p>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#C6AA58]">
              Dining Hours
            </h4>
            <div className="space-y-1 text-sm text-[#F3F2ED]/75">
              <p><span className="font-semibold text-white">Mon – Thu:</span> 12:00 PM – 10:00 PM</p>
              <p><span className="font-semibold text-white">Fri – Sat:</span> 12:00 PM – 11:00 PM</p>
              <p><span className="font-semibold text-white">Sunday:</span> 1:00 PM – 9:00 PM</p>
              <p className="text-[#C6AA58] text-xs pt-1 italic font-serif">Kitchen closes 45 minutes prior to rest.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 col-span-1">
            <h4 className="font-serif text-lg font-semibold text-[#C6AA58]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#F3F2ED]/75">
              <li>
                <Link to="/menu" className="hover:text-[#C6AA58] transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/book-table" className="hover:text-[#C6AA58] transition-colors">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-[#C6AA58] transition-colors">
                  Account Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#C6AA58]">
              Location & Contact
            </h4>
            <div className="space-y-1.5 text-sm text-[#F3F2ED]/75">
              <p>124 Rome Avenue</p>
              <p>Greenwich Village, NY 10012</p>
              <p className="pt-2"><span className="text-[#C6AA58] font-semibold">T:</span> (212) 555-8942</p>
              <p><span className="text-[#C6AA58] font-semibold">E:</span> host@mangia-restaurant.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#C6AA58]/10 text-center text-xs text-[#F3F2ED]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Mangia Restaurant. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#C6AA58] cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-[#C6AA58] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
