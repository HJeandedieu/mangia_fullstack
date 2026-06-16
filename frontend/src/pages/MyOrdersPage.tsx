import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../api";
import { Order } from "../types";
import { ShoppingBag, ChevronRight, Clock, MapPin, ClipboardList, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrders(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to download your purchase orders directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-250";
      case "PREPARING":
        return "bg-blue-105 text-blue-800 border-blue-200";
      case "COMPLETED":
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
        
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-[#01311F]/10">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#01311F]">
              Your Culinary Orders
            </h1>
            <p className="text-xs text-[#01311F]/70 mt-1">
              Live updates and historical tracking logs for your orders at Mangia.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 bg-white border border-[#01311F]/10 hover:bg-[#F3F2ED] text-[#01311F] text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
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
              <div key={n} className="bg-white rounded-2xl h-44 animate-pulse border border-[#01311F]/10"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#01311F]/10 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-14 h-14 text-[#01311F]/20 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#01311F]">You haven't placed any orders yet</h3>
              <p className="text-xs text-[#01311F]/60 max-w-sm mx-auto">
                Explore our rich Italian collections and let our chef cook something magnificent for you.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/menu"
                className="bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-[#F3F2ED] font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest inline-block transition-all shadow-md"
              >
                Browse Our Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white border border-[#01311F]/10 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Upper banner card */}
                <div className="bg-[#F3F2ED]/40 px-6 py-4 border-b border-[#01311F]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#01311F]/50 font-mono">Order ID: {order.id}</p>
                    <p className="text-xs text-[#01311F] font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C6AA58]" />
                      Placed {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] capitalize font-mono bg-[#01311F]/10 text-[#01311F] px-2.5 py-1 rounded-xl">
                      {order.orderType.replace("_", " ")}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items and Details list */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Items Column */}
                    <div className="md:col-span-7 space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/60 border-b border-[#F3F2ED] pb-2">
                        Selected Dishes
                      </h4>
                      <div className="divide-y divide-[#F3F2ED] space-y-2.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm pt-2.5 first:pt-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-[#01311F] bg-[#01311F]/5 rounded-lg w-7 h-7 flex items-center justify-center border border-[#01311F]/10">
                                {item.quantity}
                              </span>
                              <span className="font-serif font-bold text-[#01311F]">{item.name}</span>
                            </div>
                            <span className="font-serif text-[#01311F]/70 font-semibold text-xs">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & details column */}
                    <div className="md:col-span-5 bg-[#F3F2ED]/30 rounded-2xl p-5 border border-[#01311F]/10 space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/60 border-b border-[#01311F]/10 pb-1.5">
                        Dining particulars
                      </h4>

                      {order.orderType === "DELIVERY" && order.deliveryAddress && (
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wider text-[#01311F]/50 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-650" />
                            Delivery Address
                          </p>
                          <p className="text-xs text-[#01311F]/80 pl-4">{order.deliveryAddress}</p>
                        </div>
                      )}

                      {order.notes && (
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-wider text-[#01311F]/50 flex items-center gap-1">
                            <ClipboardList className="w-3 h-3" />
                            Kitchen Notes
                          </p>
                          <p className="text-xs italic text-[#01311F]/75 pl-4 bg-white/25 p-1.5 rounded-xl border border-[#01311F]/5">{order.notes}</p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#01311F]/10 flex justify-between items-center bg-transparent">
                        <span className="text-xs font-bold text-[#01311F]">Total Charged</span>
                        <span className="font-serif font-black text-[#01311F] text-lg">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
