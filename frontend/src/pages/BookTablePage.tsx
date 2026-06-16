import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { tablesApi, reservationsApi } from "../api";
import { Table as TableType } from "../types";
import { Calendar, Users, Clock, Coffee, ShieldAlert, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const BookTablePage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Tables state from API
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form parameters state
  const [guestCount, setGuestCount] = useState<number>(2);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("19:00");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options lists
  const guestCountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  const timeOptions = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30"
  ];

  // Retrieve available tables list on load
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const res = await tablesApi.getAll();
        setTables(res);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to download tables schedule configuration layout.");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // Filter tables by capacity
  const suitableTables = tables.filter(t => t.capacity >= guestCount);

  // Handle reserve submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Authenticating is required to book a table. Please sign in.");
      navigate("/auth", { state: { from: { pathname: "/book-table" } } });
      return;
    }

    if (!date) {
      toast.error("Please pick a desired date for reservation dining.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        guestCount,
        date,
        time,
        notes: notes.trim() || undefined,
        tableId: selectedTableId || undefined
      };

      const newReservation = await reservationsApi.create(payload);
      toast.success(`Booking requested successfully! Assigned Code: ${newReservation.id}`);
      navigate("/my-reservations");
    } catch (err: any) {
      toast.error(err.message || "Could not save reservation. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2ED] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Welcome intro */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C6AA58] font-bold">Online Reservations</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#01311F]">
            Reserve A Table
          </h1>
          <p className="text-sm text-[#01311F]/70 max-w-md mx-auto leading-relaxed">
            Let us arrange a cozy table layout matching your preference inside our dining rooms or terrace galleries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reservation rules notes */}
          <div className="lg:col-span-4 bg-white border border-[#01311F]/10 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#01311F]">Booking Policies</h3>
            <div className="space-y-3 text-xs text-[#01311F]/75 leading-relaxed">
              <p>
                <span className="font-bold text-[#01311F]">Arrival Cushion:</span> We hold reserved dining tables for up to 15 minutes past scheduled hours. Please call if delayed.
              </p>
              <p>
                <span className="font-bold text-[#01311F]">Large Parties:</span> Sessions for 10+ guests require custom seating schemes. Reach our coordinator at (212) 555-8942.
              </p>
              <p>
                <span className="font-bold text-[#01311F]">Terrace Dining:</span> Outdoor terrace seats are weather-dependent. In case of rain, guests are transitioned to our indoor wooden lounges immediately.
              </p>
            </div>
            
            <div className="pt-2 border-t border-[#F3F2ED] flex items-center gap-2 text-[#C6AA58]">
              <Coffee className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Complimentary digestif included</span>
            </div>
          </div>

          {/* Core Booking Form */}
          <div className="lg:col-span-8 bg-white border border-[#01311F]/15 rounded-2xl p-6 sm:p-8 shadow-md">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-xs mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Guest Count */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users className="w-3.5 h-3.5 text-[#01311F]/70" />
                    <label className="text-xs font-bold uppercase text-[#01311F]/70">Table Guests</label>
                  </div>
                  <select
                    value={guestCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setGuestCount(val);
                      setSelectedTableId(""); // reset table pick
                    }}
                    className="block w-full py-2.5 px-3 bg-[#F3F2ED]/40 border border-[#01311F]/15 rounded-xl text-sm text-[#01311F] focus:outline-none focus:border-[#01311F]"
                  >
                    {guestCountOptions.map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reservation date */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-[#01311F]/70" />
                    <label className="text-xs font-bold uppercase text-[#01311F]/70">Select Date</label>
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full py-2 px-3 bg-[#F3F2ED]/40 border border-[#01311F]/15 rounded-xl text-sm text-[#01311F] focus:outline-none focus:border-[#01311F]"
                  />
                </div>

                {/* Time slice */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#01311F]/70" />
                    <label className="text-xs font-bold uppercase text-[#01311F]/70 font-semibold">Select Time</label>
                  </div>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-[#F3F2ED]/40 border border-[#01311F]/15 rounded-xl text-sm text-[#01311F] focus:outline-none focus:border-[#01311F]"
                  >
                    {timeOptions.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Selections Area */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold uppercase text-[#01311F]/70">
                    Specific Table Assignment (Optional)
                  </label>
                  <span className="text-[10px] text-gray-400">Suitable tables for {guestCount} guests shown</span>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-xs text-gray-400">Locating matching seating guides...</div>
                ) : suitableTables.length === 0 ? (
                  <div className="bg-[#C6AA58]/10 border border-[#C6AA58]/25 rounded-2xl p-4 flex gap-2 text-xs text-[#01311F]">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#C6AA58]" />
                    <p>
                      No tables currently configured perfectly for {guestCount} guests. We will automatically custom-combine contiguous layouts upon arrival to comfortably accommodate your party. Feel free to complete reservation below.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Default auto layout choice */}
                    <button
                      type="button"
                      onClick={() => setSelectedTableId("")}
                      className={`p-3 text-left rounded-xl border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                        selectedTableId === ""
                          ? "bg-[#01311F]/5 text-[#01311F] border-[#01311F]"
                          : "bg-white text-[#01311F] border-[#01311F]/15 hover:bg-[#F3F2ED]/40"
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold">Auto Assign Table</span>
                        {selectedTableId === "" && <CheckCircle className="w-3.5 h-3.5 text-[#C6AA58]" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Best available option</p>
                    </button>

                    {/* Suitables */}
                    {suitableTables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTableId(t.id)}
                        className={`p-3 text-left rounded-xl border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                          selectedTableId === t.id
                            ? "bg-[#01311F]/5 text-[#01311F] border-[#01311F]"
                            : "bg-white text-[#01311F] border-[#01311F]/15 hover:bg-[#F3F2ED]/40"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-bold">Table #{t.number}</span>
                          {selectedTableId === t.id && <CheckCircle className="w-3.5 h-3.5 text-[#C6AA58]" />}
                        </div>
                        <div className="mt-1 flex justify-between items-center text-[10px] text-gray-450">
                          <span>Holds {t.capacity} guests</span>
                          <span className="uppercase font-semibold text-[8px] bg-[#01311F]/10 text-gray-700 px-1 rounded">
                            {t.location.replace("_", " ")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Special message notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#01311F]/70 block">
                  Dietary requirements or Seating requests
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anniversary celebration. Nest table in corner close to window please. No pineapples/peanuts in foods."
                  className="block w-full py-2 px-3 bg-[#F3F2ED]/30 border border-[#01311F]/15 rounded-xl text-sm text-[#01311F] focus:outline-none focus:border-[#01311F]"
                />
              </div>

              {/* CTAs */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-[#F3F2ED] font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "Authorize & Book Table"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
