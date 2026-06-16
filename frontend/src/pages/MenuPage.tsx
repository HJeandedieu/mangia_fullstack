import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { categoriesApi, menuItemsApi, ordersApi } from "../api";
import { Category, MenuItem } from "../types";
import { ShoppingBag, Utensils, Search, MapPin, ClipboardList, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const MenuPage: React.FC = () => {
  const { user, cart, cartTotal, updateCartQuantity, removeFromCart, addToCart, clearCart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Categories & Menu items database state
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Checkout State
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>("DINE_IN");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Menu Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
          categoriesApi.getAll(),
          menuItemsApi.getAll()
        ]);
        setCategories(catsRes);
        setMenuItems(itemsRes);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load restaurant menu database.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Listen to openCheckout state passed from navbar cart drawer click
  useEffect(() => {
    if (location.state?.openCheckout) {
      setIsCheckoutStep(true);
    }
  }, [location.state]);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryDescription = selectedCategoryId === "all" 
    ? "Explore our full list of artisanal, freshly assembled gourmet Italian plates." 
    : categories.find(c => c.id === selectedCategoryId)?.description;

  // Handle Checkout submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in or register to place your order.");
      navigate("/auth", { state: { from: { pathname: "/menu" } } });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your basket is empty. Please select menu items first.");
      return;
    }

    if (orderType === "DELIVERY" && !deliveryAddress.trim()) {
      toast.error("Please specify a delivery address for your order.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        items: cart.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity
        })),
        orderType,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : undefined,
        notes: notes.trim() ? notes : undefined
      };

      const newOrder = await ordersApi.create(payload);
      toast.success(`Grazie! Order status PENDING. Order ID: ${newOrder.id}`);
      clearCart();
      setIsCheckoutStep(false);
      setDeliveryAddress("");
      setNotes("");
      navigate("/my-orders");
    } catch (err: any) {
      toast.error(err.message || "Could not place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2ED] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center md:text-left mb-10 pb-6 border-b border-[#E6E4DB]">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#01311F]">
            Il Nostro Menu
          </h1>
          <p className="text-sm sm:text-base text-[#01311F]/70 mt-2 font-light">
            Every dish is prepared using genuine, fresh hand-selected Italian imports and prepared upon your order.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8">
            <p className="font-semibold text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs underline font-bold mt-2 uppercase tracking-wider"
            >
              Try Reloading database
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content loading skeletons */}
            <div className="md:col-span-2 space-y-6">
              <div className="h-12 bg-white rounded-md animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            </div>
            {/* Right sidebar loading skeleton */}
            <div className="bg-[#E6E4DB]/50 h-96 rounded-lg animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Menu Browsing & Filtering */}
            <div className={`lg:col-span-8 space-y-6 ${isCheckoutStep ? "hidden lg:block lg:opacity-40 pointer-events-none" : ""}`}>
              
              {/* Category tabs list */}
              <div className="bg-white border border-[#01311F]/10 rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm">
                <button
                  onClick={() => setSelectedCategoryId("all")}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategoryId === "all"
                      ? "bg-[#01311F] text-white"
                      : "text-[#01311F] hover:bg-[#F3F2ED]"
                  }`}
                >
                  All Items
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategoryId === c.id
                        ? "bg-[#01311F] text-white"
                        : "text-[#01311F] hover:bg-[#F3F2ED]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Dynamic Category description */}
              <div className="bg-[#01311F]/5 border-l-2 border-[#C6AA58] p-4 rounded-r-md">
                <p className="text-xs text-[#01311F] italic font-serif leading-relaxed">
                  {activeCategoryDescription}
                </p>
              </div>

              {/* Search tool block */}
              <div className="relative rounded-xl shadow-sm max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for bolognese, burrata, tiramisu..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-sm text-[#01311F]"
                />
              </div>

              {/* Menu items Grid listings */}
              {filteredItems.length === 0 ? (
                <div className="bg-white border border-[#E6E4DB] text-center p-12 rounded-lg">
                  <Utensils className="w-12 h-12 text-[#01311F]/20 mx-auto mb-3" />
                  <p className="font-serif text-lg font-bold text-[#01311F]">No matching delicacies found</p>
                  <p className="text-sm text-[#01311F]/60 mt-1">Try relaxing your search terms or selects other categories filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`bg-white border border-[#01311F]/10 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative ${!item.isAvailable ? "opacity-60" : ""}`}
                    >
                      {/* Availability badge */}
                      {!item.isAvailable && (
                        <span className="absolute top-3 left-3 bg-red-650 text-white text-[10px] font-bold py-1 px-2.5 uppercase tracking-wider rounded shadow z-10">
                          Sold Out
                        </span>
                      )}

                      <div>
                        {/* Photo frame */}
                        <div className="aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>

                        {/* Title & Descriptors */}
                        <div className="p-5">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-serif text-lg font-bold text-[#01311F] leading-tight">
                              {item.name}
                            </h3>
                            <span className="font-serif text-[#C6AA58] font-bold text-lg whitespace-nowrap">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2.5 leading-relaxed font-light line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Add Box CTA */}
                      <div className="px-5 pb-5 pt-2">
                        <button
                          disabled={!item.isAvailable}
                          onClick={() => addToCart(item)}
                          className={`w-full py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl text-center transition-all ${
                            item.isAvailable 
                              ? "bg-[#01311F] text-[#F3F2ED] hover:bg-[#C6AA58] hover:text-[#01311F] active:translate-y-[0.5px]" 
                              : "bg-gray-150 text-gray-400 border border-gray-200 cursor-not-allowed"
                          }`}
                        >
                          {item.isAvailable ? "Add to Cart" : "Temporarily Sold Out"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Checkout Sidebar and Summary Basket */}
            <div className="lg:col-span-4">
              
              {/* CART BASKET SUMMARIES COLUMN */}
              {!isCheckoutStep ? (
                <div className="bg-white border border-[#01311F]/10 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E6E4DB] pb-4">
                    <div className="flex items-center gap-1.5 text-[#01311F]">
                      <ShoppingBag className="w-5 h-5 text-[#C6AA58]" />
                      <h2 className="font-serif text-lg font-bold">Your Cart</h2>
                    </div>
                    <span className="bg-[#01311F]/10 text-[#01311F] font-bold text-xs py-1 px-2.5 rounded-full">
                      {cart.length} items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-sm font-semibold text-[#01311F]/70">No treats selected yet</p>
                      <p className="text-xs text-[#01311F]/50">Select dishes on the left to include them in your basket.</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[#F3F2ED] pr-1">
                        {cart.map((item) => (
                          <div key={item.menuItem.id} className="py-3 flex justify-between items-center text-sm gap-2">
                            <div className="space-y-0.5">
                              <p className="font-serif font-bold text-[#01311F]">{item.menuItem.name}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-[#01311F]/60">Qty: {item.quantity}</span>
                                <button
                                  onClick={() => removeFromCart(item.menuItem.id)}
                                  className="text-[11px] text-red-500 hover:underline hover:text-red-650"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <span className="font-serif text-[#01311F] font-semibold text-xs text-right whitespace-nowrap">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-[#E6E4DB] pt-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#01311F]/70 font-semibold">Subtotal</span>
                          <span className="font-serif font-bold text-[#01311F]">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#01311F]/70 font-semibold">Taxes & Services</span>
                          <span className="text-xs text-[#01311F]/50">Calculated after details</span>
                        </div>
                        <div className="flex justify-between items-center text-base font-bold text-[#01311F] pt-2 border-t border-[#F3F2ED]">
                          <span>Est. Amount</span>
                          <span className="font-serif text-[#01311F] text-lg">${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!user) {
                            toast.info("Please sign in to progress with checking out.");
                            navigate("/auth", { state: { from: { pathname: "/menu" } } });
                            return;
                          }
                          setIsCheckoutStep(true);
                        }}
                        className="w-full bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] py-3.5 px-4 font-bold rounded-xl uppercase tracking-widest text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        Checkout Items
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                
                // ACTIVE CHECKOUT PANEL
                <div className="bg-white border border-[#01311F]/15 rounded-2xl p-6 shadow-md sticky top-24 space-y-6">
                  
                  {/* Checkout Header */}
                  <div className="flex items-center justify-between border-b border-[#E6E4DB] pb-4">
                    <div className="flex items-center gap-1.5 text-[#01311F]">
                      <CheckCircle2 className="w-5 h-5 text-[#C6AA58]" />
                      <h2 className="font-serif text-lg font-bold">Secure Checkout</h2>
                    </div>
                    <button
                      onClick={() => setIsCheckoutStep(false)}
                      className="text-xs font-bold text-[#01311F]/60 hover:text-[#01311F] underline"
                    >
                      Back to Menu
                    </button>
                  </div>

                  {/* Summary amount banner */}
                  <div className="bg-[#F3F2ED] rounded-lg p-4 border-l-4 border-[#C6AA58] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Order Summary</p>
                      <p className="text-xs font-semibold text-[#01311F] mt-0.5">{cart.length} items in the cart</p>
                    </div>
                    <span className="font-serif font-black text-lg text-[#01311F]">${cartTotal.toFixed(2)}</span>
                  </div>

                  {/* Checkout Configuration Form */}
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    
                    {/* Order Type picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                        Dining Service Option
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["DINE_IN", "TAKEAWAY", "DELIVERY"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOrderType(type)}
                            className={`py-2 px-1 text-[10px] font-bold rounded-xl text-center transition-all uppercase tracking-wider ${
                              orderType === type
                                ? "bg-[#01311F] text-white border-transparent"
                                : "bg-transparent text-[#01311F] border border-[#01311F]/15 hover:bg-[#F3F2ED]/45"
                            }`}
                          >
                            {type.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery address conditional render */}
                    {orderType === "DELIVERY" && (
                      <div className="space-y-1.5 block animate-fade-in">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
                          Delivery Address *
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <textarea
                            rows={2}
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="124 Via Roma Ave, Greenwich Village, NY"
                            className="block w-full pl-10 pr-3 py-2.5 bg-[#F3F2ED]/30 border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-xs text-[#01311F]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Cooking Preference notes */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-gray-400">
                        <ClipboardList className="w-3.5 h-3.5" />
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/70">
                          Special notes (allergies, preferences)
                        </label>
                      </div>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Please cook my pasta al dente. No plastic cutlery required."
                        className="block w-full px-3 py-2 bg-[#F3F2ED]/30 border border-[#01311F]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#01311F] focus:border-[#01311F] text-xs text-[#01311F]"
                      />
                    </div>

                    {/* Submit Order pay CTA */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Place My Order (${cartTotal.toFixed(2)})
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-gray-400 font-light mt-2 italic leading-relaxed">
                      By submitting, your order is instantly broadcast to restaurant staff terminals. Pay at delivery/dining table.
                    </p>
                  </form>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};
