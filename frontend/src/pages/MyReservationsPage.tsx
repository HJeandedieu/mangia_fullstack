import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reservationsApi } from "../api";
import { Reservation } from "../types";
import { Calendar, Users, Clock, Coffee, Sparkles, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";

export const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationsApi.getMyReservations();
      setReservations(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to download your dining bookings catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getStatusStyle = (status: Reservation["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-250 animate-pulse";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800 border-emerald-250";
      case "CANCELLED":
        return "bg-rose-105 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2ED] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Reservation upper logs container */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-[#E6E4DB]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#01311F]">
              Your Table Bookings
            </h1>
            <p className="text-xs text-[#01311F]/70 mt-1">
              Your scheduled dining settings and layout allocations inside Mangia.
            </p>
          </div>
          <button
            onClick={fetchReservations}
            className="flex items-center gap-1.5 bg-white border border-[#E6E4DB] hover:bg-gray-50 text-[#01311F] text-xs font-bold py-2.5 px-4 rounded-md transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh List
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-xs mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-lg h-44 animate-pulse border border-[#E6E4DB]"></div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white border border-[#E6E4DB] rounded-lg p-12 text-center space-y-4 shadow-sm">
            <Calendar className="w-14 h-14 text-[#01311F]/20 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#01311F]">No table bookings found</h3>
              <p className="text-xs text-[#01311F]/60 max-w-sm mx-auto">
                Arrange a beautiful wooden lounge table or an outdoor trellis setup in advance for special dinners.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/book-table"
                className="bg-[#01311F] hover:bg-[#01311F]/90 text-white font-bold py-3 px-6 rounded-md text-xs uppercase tracking-widest inline-block"
              >
                Book Table
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservations.map((res) => (
              <div 
                key={res.id}
                className="bg-white border border-[#E6E4DB] rounded-lg shadow-sm hover:border-[#01311F]/20 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Header Banner */}
                <div className="bg-[#F9F8F6] px-5 py-4 border-b border-[#E6E4DB] flex justify-between items-center bg-zinc-50">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">Code: {res.id}</p>
                    <p className="text-[10px] font-bold text-[#C6AA58] tracking-widest uppercase mt-0.5 font-serif italic">Mangia Restaurant</p>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded border uppercase tracking-wider ${getStatusStyle(res.status)}`}>
                    {res.status}
                  </span>
                </div>

                {/* Core contents */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Parameters specs */}
                  <div className="grid grid-cols-3 gap-1 divide-x divide-[#F3F2ED] text-center">
                    
                    <div className="px-1 first:pl-0 space-y-1">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/60">Guests</span>
                      </div>
                      <p className="text-sm font-bold text-[#01311F]">{res.guestCount} Guests</p>
                    </div>

                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/60">Time</span>
                      </div>
                      <p className="text-sm font-bold text-[#01311F]">{res.time}</p>
                    </div>

                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/60">Date</span>
                      </div>
                      <p className="text-xs font-bold text-[#01311F]">{res.date}</p>
                    </div>

                  </div>

                  {/* Seating Assignment information */}
                  <div className="bg-[#F3F2ED] rounded-md p-3.5 flex items-center gap-3 border border-[#E6E4DB]/55">
                    <Coffee className="w-5 h-5 text-[#C6AA58] stroke-[1.5]" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/60">Assigned table</p>
                      <p className="text-xs font-bold text-[#01311F]">
                        {res.tableNumber && res.tableNumber !== "TBD" 
                          ? `Table #${res.tableNumber}` 
                          : "Auto Assigning on Arrival"}
                      </p>
                    </div>
                  </div>

                  {/* notes */}
                  {res.notes && (
                    <div className="text-xs text-[#01311F]/70 border-t border-[#F3F2ED] pt-3">
                      <span className="font-bold block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Occasion / Requests</span>
                      <p className="italic bg-[#F9F8F6] p-2.5 rounded text-[11px] leading-relaxed">
                        “{res.notes}”
                      </p>
                    </div>
                  )}

                </div>

                {/* Footer strip warning */}
                <div className="bg-[#01311F]/5 py-2.5 px-5 text-center text-[10px] text-[#01311F]/60 border-t border-[#F3F2ED]">
                  Please contact us if your guest metrics or hours shift.
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
