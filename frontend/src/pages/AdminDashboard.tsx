import React, { useState, useEffect } from "react";
import { 
  categoriesApi, 
  menuItemsApi, 
  tablesApi, 
  ordersApi, 
  reservationsApi 
} from "../api";
import { Category, MenuItem, Table, Order, Reservation } from "../types";
import { 
  Shield, 
  Settings, 
  Utensils, 
  Layers, 
  Coffee, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  RefreshCw, 
  Check, 
  X, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const AdminDashboard: React.FC = () => {
  // Navigation active control tab
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "tables" | "orders" | "reservations">("overview");

  // Core collections retrieved from database
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Loading & Global Errors state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Forms overlay / item selectors (Add & Update)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryEditItem, setCategoryEditItem] = useState<Category | null>(null); // if null -> add, else -> edit
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [menuItemEditItem, setMenuItemEditItem] = useState<MenuItem | null>(null);
  const [mName, setMName] = useState("");
  const [mPrice, setMPrice] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mCategory, setMCategory] = useState("");
  const [mImage, setMImage] = useState("");
  const [mAvailable, setMAvailable] = useState(true);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableEditItem, setTableEditItem] = useState<Table | null>(null);
  const [tNumber, setTNumber] = useState("");
  const [tCapacity, setTCapacity] = useState("2");
  const [tLocation, setTLocation] = useState<Table["location"]>("MAIN_ROOM");
  const [tStatus, setTStatus] = useState<Table["status"]>("AVAILABLE");

  // Load All Lists from back-end server on start
  const loadAllAdminData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      
      const [cats, items, tbls, ords, resvs] = await Promise.all([
        categoriesApi.getAll(),
        menuItemsApi.getAll(),
        tablesApi.getAll(),
        ordersApi.getAdminOrders(),
        reservationsApi.getAdminReservations()
      ]);

      setCategories(cats);
      setMenuItems(items);
      setTables(tbls);
      setOrders(ords);
      setReservations(resvs);
    } catch (err: any) {
      toast.error(err.message || "Failed to download database files for administration dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Compute stats metrics
  const activeOrdersCount = orders.filter(o => o.status === "PENDING" || o.status === "PREPARING").length;
  const pendingReservationsCount = reservations.filter(r => r.status === "PENDING").length;
  
  const estimatedRevenue = orders
    .filter(o => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // --- Categories CRUD mechanics ---
  const handleOpenAddCategory = () => {
    setCategoryEditItem(null);
    setCategoryName("");
    setCategoryDesc("");
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setCategoryEditItem(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || "");
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (categoryEditItem) {
        await categoriesApi.update(categoryEditItem.id, categoryName, categoryDesc);
        toast.success(`Category ${categoryName} modified successfully.`);
      } else {
        await categoriesApi.create(categoryName, categoryDesc);
        toast.success(`Category ${categoryName} created successfully.`);
      }
      setIsCategoryModalOpen(false);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Could not save category.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete category "${name}"? Dishes linked to it will require brand new categories.`)) {
      return;
    }
    try {
      await categoriesApi.delete(id);
      toast.success(`Category "${name}" deleted.`);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Could not delete category.");
    }
  };

  // --- MenuItems CRUD mechanics ---
  const handleOpenAddMenuItem = () => {
    setMenuItemEditItem(null);
    setMName("");
    setMPrice("");
    setMDesc("");
    setMCategory(categories[0]?.id || "");
    setMImage("");
    setMAvailable(true);
    setIsMenuItemModalOpen(true);
  };

  const handleOpenEditMenuItem = (item: MenuItem) => {
    setMenuItemEditItem(item);
    setMName(item.name);
    setMPrice(String(item.price));
    setMDesc(item.description);
    setMCategory(item.categoryId);
    setMImage(item.image || "");
    setMAvailable(item.isAvailable);
    setIsMenuItemModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mPrice || !mCategory) {
      toast.error("Please supply all mandatory fields for the dish formulation.");
      return;
    }

    const payload = {
      name: mName,
      price: parseFloat(mPrice),
      description: mDesc,
      categoryId: mCategory,
      image: mImage || undefined,
      isAvailable: mAvailable
    };

    try {
      if (menuItemEditItem) {
        await menuItemsApi.update(menuItemEditItem.id, payload);
        toast.success(`Dish "${mName}" successfully adjusted.`);
      } else {
        await menuItemsApi.create(payload);
        toast.success(`New Dish "${mName}" formulated and registered on the menu.`);
      }
      setIsMenuItemModalOpen(false);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "System is unable to write standard model to disk.");
    }
  };

  const handleDeleteMenuItem = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to remove dishes entry "${name}" from server database maps?`)) return;
    try {
      await menuItemsApi.delete(id);
      toast.success(`Dish "${name}" deleted successfully.`);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Could not delete dishes entry.");
    }
  };

  // --- Tables CRUD mechanics ---
  const handleOpenAddTable = () => {
    setTableEditItem(null);
    setTNumber(String(tables.length + 101));
    setTCapacity("2");
    setTLocation("MAIN_ROOM");
    setTStatus("AVAILABLE");
    setIsTableModalOpen(true);
  };

  const handleOpenEditTable = (table: Table) => {
    setTableEditItem(table);
    setTNumber(table.number);
    setTCapacity(String(table.capacity));
    setTLocation(table.location);
    setTStatus(table.status);
    setIsTableModalOpen(true);
  };

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tNumber) return;

    const payload = {
      number: tNumber,
      capacity: parseInt(tCapacity),
      location: tLocation,
      status: tStatus
    };

    try {
      if (tableEditItem) {
        await tablesApi.update(tableEditItem.id, payload);
        toast.success(`Table ${tNumber} layout reconfigured.`);
      } else {
        await tablesApi.create(payload);
        toast.success(`New Table ${tNumber} deployed to rooms directory.`);
      }
      setIsTableModalOpen(false);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Could not commit table adjustments.");
    }
  };

  const handleDeleteTable = async (id: string, num: string) => {
    if (!confirm(`Are you sure you want to retire table number ${num} from physical logs?`)) return;
    try {
      await tablesApi.delete(id);
      toast.success(`Table retired.`);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Retire failed.");
    }
  };

  // --- Workflow Processors (Status triggers) ---
  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const updated = await ordersApi.updateStatus(orderId, status);
      toast.success(`Order status changed to ${updated.status}.`);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status.");
    }
  };

  const handleUpdateResStatus = async (resId: string, status: Reservation["status"]) => {
    try {
      const updated = await reservationsApi.updateStatus(resId, status);
      toast.success(`Reservation status updated to ${updated.status}.`);
      loadAllAdminData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update reservation status.");
    }
  };


  return (
    <div className="min-h-screen bg-[#F3F2ED] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main upper header banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-[#01311F]/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#01311F] p-2.5 rounded-xl text-white">
              <Shield className="w-6 h-6 text-[#C6AA58]" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#01311F]">
                Administrative Control Panel
              </h1>
              <p className="text-xs text-[#01311F]/70 mt-0.5">
                Mangia Restaurant core state machinery, order flows, reservations and CRUD tables.
              </p>
            </div>
          </div>

          <button
            onClick={() => loadAllAdminData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-md transition-all active:translate-y-[0.5px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Control Panel
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#01311F] border-t-transparent mb-2"></div>
            <p className="text-[#01311F] font-bold text-sm">Synchronizing Mangia database clusters...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Upper stats widgets row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border border-[#01311F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
                <div className="bg-[#01311F]/10 p-3 rounded-full text-[#01311F]">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Queue Orders</p>
                  <p className="text-2xl font-serif font-black text-[#01311F]">{activeOrdersCount}</p>
                </div>
              </div>

              <div className="bg-white border border-[#01311F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
                <div className="bg-[#01311F]/10 p-3 rounded-full text-[#01311F]">
                  <Calendar className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Pending Tables</p>
                  <p className="text-2xl font-serif font-black text-[#01311F]">{pendingReservationsCount}</p>
                </div>
              </div>

              <div className="bg-white border border-[#01311F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
                <div className="bg-[#C6AA58]/10 p-3 rounded-full text-[#01311F]">
                  <DollarSign className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Earned Revenue</p>
                  <p className="text-2xl font-serif font-black text-[#01311F]">${estimatedRevenue.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white border border-[#01311F]/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4">
                <div className="bg-[#01311F]/10 p-3 rounded-full text-[#01311F]">
                  <Utensils className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Gastronomy Dishes</p>
                  <p className="text-2xl font-serif font-black text-[#01311F]">{menuItems.length} Plates</p>
                </div>
              </div>

            </div>

            {/* Core Tab Navigation links */}
            <div className="border-b border-[#01311F]/10 flex overflow-x-auto gap-4 scrollbar-thin">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "menu", label: "Menu Management", icon: Utensils },
                { id: "tables", label: "Tables Management", icon: Coffee },
                { id: "orders", label: "Order Tickets", icon: ShoppingBag },
                { id: "reservations", label: "Bookings List", icon: Calendar }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === t.id
                        ? "border-[#01311F] text-[#01311F]"
                        : "border-transparent text-gray-400 hover:text-[#01311F]"
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS RENDER BLOCK */}

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Quick raw activity check */}
                <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F3F2ED] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#01311F]">Live Orders Terminal</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs uppercase hover:underline text-[#C6AA58] font-bold">Manage tickets &rarr;</button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No orders registered on cloud database yet.</p>
                  ) : (
                    <div className="divide-y divide-[#F3F2ED] max-h-96 overflow-y-auto pr-1">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="py-3 flex justify-between items-center gap-2">
                          <div>
                            <p className="text-xs font-bold text-[#01311F]">{o.userName} ({o.orderType})</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{o.items.length} items &bull; {new Date(o.createdAt).toLocaleTimeString()}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-serif text-xs font-semibold text-[#01311F] mr-1">${o.totalAmount.toFixed(2)}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${o.status === "PENDING" ? "bg-amber-100 text-amber-800" : o.status === "PREPARING" ? "bg-blue-100 text-blue-800" : o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Quick book checking */}
                <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F3F2ED] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#01311F]">Upcoming Desk Bookings</h3>
                    <button onClick={() => setActiveTab("reservations")} className="text-xs uppercase hover:underline text-[#C6AA58] font-bold">Manage bookings &rarr;</button>
                  </div>

                  {reservations.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No upcoming reservations logged.</p>
                  ) : (
                    <div className="divide-y divide-[#F3F2ED] max-h-96 overflow-y-auto pr-1">
                      {reservations.slice(0, 5).map(r => (
                        <div key={r.id} className="py-3 flex justify-between items-center gap-2">
                          <div>
                            <p className="text-xs font-bold text-[#01311F]">{r.userName} ({r.guestCount} guests)</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{r.date} &bull; {r.time} &bull; Table #{r.tableNumber || "Auto"}</p>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${r.status === "PENDING" ? "bg-amber-100 text-amber-800" : r.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                            {r.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}


            {/* TAB 2: MENU & CATEGORY CRUD */}
            {activeTab === "menu" && (
              <div className="space-y-8">
                
                {/* Upper: Categories Sub-Section */}
                <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F3F2ED] pb-3">
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-lg font-bold text-[#01311F]">Menu Categories ({categories.length})</h3>
                      <p className="text-[10px] text-gray-400">Classify dishes beautifully for customer filtering navigation.</p>
                    </div>

                    <button
                      onClick={handleOpenAddCategory}
                      className="flex items-center gap-1.5 bg-[#01311F] hover:bg-[#01311F]/90 text-white font-bold py-2 px-3.5 rounded text-xs uppercase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((c) => (
                      <div key={c.id} className="border border-gray-200 rounded-md p-4 bg-[#F9F8F6] flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-[#01311F]">{c.name}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">{c.description || "No description provided."}</p>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-200/50">
                          <button
                            onClick={() => handleOpenEditCategory(c)}
                            className="p-1 text-gray-500 hover:text-[#01311F]"
                            title="Edit category settings"
                          >
                            <Edit3 className="w-4 h-4 cursor-pointer" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1 text-gray-500 hover:text-red-500"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lower: Plates Menu Items Sub-Section */}
                <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#F3F2ED] pb-3">
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-lg font-bold text-[#01311F]">Gastronomy dishes list ({menuItems.length})</h3>
                      <p className="text-[10px] text-gray-400">Maintain ingredients, descriptions, values, photos, and availability state.</p>
                    </div>

                    <button
                      onClick={handleOpenAddMenuItem}
                      className="flex items-center gap-1.5 bg-[#01311F] hover:bg-[#01311F]/90 text-white font-bold py-2.5 px-4 rounded text-xs uppercase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Culinary Dish
                    </button>
                  </div>

                  {/* Desktop Grid Layout listing */}
                  <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-[#F9F8F6]">
                        <tr className="text-left text-[10px] uppercase tracking-wider text-[#01311F]/60">
                          <th className="px-6 py-3 font-semibold">Dish details</th>
                          <th className="px-6 py-3 font-semibold">Category</th>
                          <th className="px-6 py-3 font-semibold">Price</th>
                          <th className="px-6 py-3 font-semibold">Status</th>
                          <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white text-xs">
                        {menuItems.map((item) => {
                          const catName = categories.find(c => c.id === item.categoryId)?.name || "Unknown";
                          return (
                            <tr key={item.id} className="hover:bg-zinc-50 font-light">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded border border-gray-200"
                                />
                                <div>
                                  <p className="font-serif font-bold text-[#01311F]" style={{fontSize: '13px'}}>{item.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-sm">{item.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-[#01311F]/5 text-[#01311F] font-bold px-2 py-0.5 rounded text-[10px]">
                                  {catName}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-serif font-bold text-[#01311F]">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`font-semibold px-2 py-0.5 rounded-full text-[9px] ${item.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                  {item.isAvailable ? "Available" : "Sold Out"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEditMenuItem(item)}
                                  className="p-1 hover:text-[#01311F] transition-colors"
                                  title="Edit dish variables"
                                >
                                  <Edit3 className="w-4 h-4 stroke-[1.5] inline-block cursor-pointer" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id, item.name)}
                                  className="p-1 hover:text-red-500 transition-colors"
                                  title="Delete dish formulation"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[1.5] inline-block cursor-pointer" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}


            {/* TAB 3: TABLES CRUD */}
            {activeTab === "tables" && (
              <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-[#F3F2ED] pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-lg font-bold text-[#01311F]">Physical Tables Layout List ({tables.length})</h3>
                    <p className="text-[10px] text-gray-400">Establish table numbers, seating capacities, placements, and current reservation codes.</p>
                  </div>

                  <button
                    onClick={handleOpenAddTable}
                    className="flex items-center gap-1.5 bg-[#01311F] hover:bg-[#01311F]/90 text-white font-bold py-2.5 px-4 rounded text-xs uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Configure Table
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tables.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded-lg p-5 bg-[#F9F8F6] relative flex flex-col justify-between">
                      <div>
                        {/* Upper row header */}
                        <div className="flex justify-between items-center">
                          <span className="font-serif text-lg font-black text-[#01311F]">Table #{t.number}</span>
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${t.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800 border-emerald-250" : t.status === "RESERVED" ? "bg-amber-100 text-amber-800 border-amber-250" : "bg-red-105 text-red-800 border-red-200"}`}>
                            {t.status}
                          </span>
                        </div>

                        {/* Capacity parameters */}
                        <div className="mt-4 space-y-2 text-xs">
                          <p className="text-gray-500">
                            Holds: <span className="font-bold text-[#01311F]">{t.capacity} Guests</span>
                          </p>
                          <p className="text-gray-500">
                            Location:{" "}
                            <span className="bg-zinc-200/50 text-[#01311F] font-bold px-1.5 rounded text-[10px] uppercase">
                              {t.location.replace("_", " ")}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 mt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleOpenEditTable(t)}
                          className="p-1 text-gray-500 hover:text-[#01311F]"
                          title="Configure table parameters"
                        >
                          <Edit3 className="w-4 h-4 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDeleteTable(t.id, t.number)}
                          className="p-1 text-gray-500 hover:text-red-500"
                          title="Delete table layout"
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* TAB 4: ORDERS TICKETS */}
            {activeTab === "orders" && (
              <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                <div className="border-b border-[#F3F2ED] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#01311F]">Active Dining & Delivery Tickets</h3>
                  <p className="text-[10px] text-gray-400">Receive customer live order requests, cook, compile recipes, and adjust server status files.</p>
                </div>

                {orders.length === 0 ? (
                  <p className="py-12 text-center text-xs text-gray-400">No active tickets registered on servers.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((o) => (
                      <div key={o.id} className="border border-gray-250 rounded-lg overflow-hidden bg-[#F9F8F6]/20">
                        {/* Upper row */}
                        <div className="bg-[#F9F8F6] px-5 py-3 border-b border-[#E6E4DB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-gray-400">TICKET: {o.id}</span>
                            <h4 className="text-sm font-black text-[#01311F] mt-0.5">{o.userName} ({o.userEmail})</h4>
                          </div>

                          <div className="space-y-1 sm:text-right">
                            <p className="text-xs text-gray-500 font-light">{new Date(o.createdAt).toLocaleString()}</p>
                            <p className="text-[10px] uppercase tracking-wider bg-zinc-200 inline-block px-1.5 py-0.5 rounded text-gray-700 font-bold font-mono">
                              {o.orderType}
                            </p>
                          </div>
                        </div>

                        {/* Contents details */}
                        <div className="p-5">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            
                            <div className="md:col-span-6 space-y-3">
                              <span className="text-[9px] font-extrabold uppercase text-gray-450 block tracking-widest border-b border-gray-100 pb-1">Cooking Formulation Checklist</span>
                              
                              <div className="space-y-2 text-xs">
                                {o.items.map((i, idx) => (
                                  <div key={idx} className="flex justify-between font-light">
                                    <span className="font-semibold text-xs text-[#01311F]">
                                      {i.quantity}x <span className="font-serif font-bold">{i.name}</span>
                                    </span>
                                    <span>${(i.price * i.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between font-bold text-[#01311F] text-sm">
                                  <span>Charged Total Amount</span>
                                  <span className="font-serif">${o.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-6 bg-[#F3F2ED]/45 rounded p-4 border border-gray-200/50 space-y-3">
                              <span className="text-[9px] font-extrabold uppercase text-gray-450 block tracking-widest border-b border-gray-200/60 pb-1">Kitchen / Delivery particulars</span>
                              
                              {o.orderType === "DELIVERY" && o.deliveryAddress && (
                                <p className="text-xs text-[#01311F]"><span className="font-bold">Loc:</span> {o.deliveryAddress}</p>
                              )}
                              
                              {o.notes && (
                                <p className="text-xs italic text-[#01311F]/85 bg-white/50 p-2 rounded leading-relaxed border border-gray-105">
                                  “{o.notes}”
                                </p>
                              )}

                              {/* STAGE CONTROLS SYSTEM */}
                              <div className="pt-2">
                                <span className="text-[9px] font-extrabold uppercase text-gray-450 block tracking-wider mb-2">Advance Stage Workflow</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {([
                                    { st: "PENDING", cl: "bg-amber-100 text-amber-800" },
                                    { st: "PREPARING", cl: "bg-blue-105 text-blue-800" },
                                    { st: "COMPLETED", cl: "bg-emerald-100 text-emerald-800" },
                                    { st: "CANCELLED", cl: "bg-rose-105 text-rose-800" }
                                  ] as const).map(({ st, cl }) => (
                                    <button
                                      key={st}
                                      onClick={() => handleUpdateOrderStatus(o.id, st)}
                                      className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                        o.status === st
                                          ? `${cl} border-2 border-[#01311F]/20 font-black`
                                          : "bg-white text-zinc-650 hover:bg-zinc-100 border border-gray-300"
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* TAB 5: RESERVATIONS BOOKINGS LIST */}
            {activeTab === "reservations" && (
              <div className="bg-white border border-[#E6E4DB] rounded-lg p-6 shadow-sm space-y-4">
                <div className="border-b border-[#F3F2ED] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#01311F]">Dining Table Reservations</h3>
                  <p className="text-[10px] text-gray-400">Validate guest count, assign physical tables, and authorize or reject booking requests.</p>
                </div>

                {reservations.length === 0 ? (
                  <p className="py-12 text-center text-xs text-gray-400">No desk bookings recorded.</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-[#F9F8F6]">
                        <tr className="text-left text-[10px] uppercase tracking-wider text-[#01311F]/60">
                          <th className="px-6 py-3 font-semibold">Guest details</th>
                          <th className="px-6 py-3 font-semibold">Dining particulars</th>
                          <th className="px-6 py-3 font-semibold">Table assignment</th>
                          <th className="px-6 py-3 font-semibold">Status state</th>
                          <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white text-xs">
                        {reservations.map((res) => (
                          <tr key={res.id} className="hover:bg-zinc-50 font-light">
                            <td className="px-6 py-4">
                              <p className="font-serif font-bold text-[#01311F]">{res.userName}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{res.userEmail}</p>
                            </td>
                            <td className="px-6 py-4 space-y-0.5">
                              <p className="font-semibold text-[#01311F]">{res.guestCount} Guests</p>
                              <p className="text-[10px] text-gray-400">{res.date} &bull; {res.time}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold font-mono text-[#01311F] bg-gray-100 py-0.5 px-2 rounded-md border">
                                {res.tableNumber && res.tableNumber !== "TBD" 
                                  ? `Table #${res.tableNumber}` 
                                  : "Auto Assign"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${res.status === "PENDING" ? "bg-amber-100 text-amber-800" : res.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-red-101 text-red-800"}`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleUpdateResStatus(res.id, "CONFIRMED")}
                                disabled={res.status === "CONFIRMED"}
                                className="bg-emerald-700 text-white rounded p-1 hover:bg-emerald-800 disabled:opacity-40 cursor-pointer"
                                title="Approve & confirm reservation seat"
                              >
                                <Check className="w-4 h-4 stroke-[2]" />
                              </button>
                              <button
                                onClick={() => handleUpdateResStatus(res.id, "CANCELLED")}
                                disabled={res.status === "CANCELLED"}
                                className="bg-rose-700 text-white rounded p-1 hover:bg-rose-800 disabled:opacity-40 cursor-pointer"
                                title="Reject / cancel table schedule"
                              >
                                <X className="w-4 h-4 stroke-[2]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* --- FLOATING MODALS OVERLAYS (CRUD Forms) --- */}

      {/* MODAL 1: ADD OR EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-[#01311F]/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#01311F] text-[#F3F2ED] py-4 px-6 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold tracking-tight text-[#C6AA58]">
                {categoryEditItem ? "Edit Category parameters" : "Formulate New Category"}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-white hover:text-[#C6AA58]">
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Antipasti, Primi, etc."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                  Description / Pitch
                </label>
                <textarea
                  rows={3}
                  placeholder="Elegant starters to kick off your meals..."
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="py-2 px-4 rounded border text-xs font-bold uppercase text-zinc-500 hover:bg-gray-50 cursor-pointer"
                >
                  Terminate
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-[#01311F] hover:bg-[#01311F]/90 text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Commit changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD OR EDIT MENU ITEM */}
      {isMenuItemModalOpen && (
        <div className="fixed inset-0 bg-[#01311F]/45 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-lg w-full overflow-hidden my-8">
            <div className="bg-[#01311F] text-[#F3F2ED] py-4 px-6 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold tracking-tight text-[#C6AA58]">
                {menuItemEditItem ? `Modify dish "${menuItemEditItem.name}"` : "Formulate New Menu Dish"}
              </h3>
              <button onClick={() => setIsMenuItemModalOpen(false)} className="text-white hover:text-[#C6AA58]">
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Dish Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bruschetta Classica"
                    value={mName}
                    onChange={(e) => setMName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.50"
                    value={mPrice}
                    onChange={(e) => setMPrice(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Associated Category *
                  </label>
                  <select
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-305 rounded text-xs text-[#01311F] focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Dish Photo link
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={mImage}
                    onChange={(e) => setMImage(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                  Detailed Chef Descriptions
                </label>
                <textarea
                  rows={3}
                  placeholder="Grilled rustico garlic sourdough tossed in cold-pressed balsamic glaze with diced vine core tomatoes..."
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="m-available"
                  checked={mAvailable}
                  onChange={(e) => setMAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#01311F] bg-gray-100 border-gray-350 rounded focus:ring-[#01311F]"
                />
                <label htmlFor="m-available" className="text-xs font-bold text-[#01311F]/80">
                  Dish is Active & Instantly Orderable in menu views.
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMenuItemModalOpen(false)}
                  className="py-2 px-4 rounded border text-xs font-bold uppercase text-zinc-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-[#01311F] hover:bg-[#01311F]/90 text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD OR EDIT TABLE */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-[#01311F]/45 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
            <div className="bg-[#01311F] text-[#F3F2ED] py-4 px-6 flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold tracking-tight text-[#C6AA58]">
                {tableEditItem ? `Modify Table #${tableEditItem.number}` : "Deploy Seating Desk"}
              </h3>
              <button onClick={() => setIsTableModalOpen(false)} className="text-white hover:text-[#C6AA58]">
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Table Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="101"
                    value={tNumber}
                    onChange={(e) => setTNumber(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="4"
                    value={tCapacity}
                    onChange={(e) => setTCapacity(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-305 rounded focus:outline-none focus:border-[#01311F] text-xs text-[#01311F]"
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Room Position
                  </label>
                  <select
                    value={tLocation}
                    onChange={(e) => setTLocation(e.target.value as any)}
                    className="block w-full py-2 px-3 border border-gray-305 rounded text-xs text-[#01311F] focus:outline-none"
                  >
                    <option value="MAIN_ROOM">MAIN ROOM</option>
                    <option value="TERRACE">TERRACE</option>
                    <option value="BAR">BAR LOUNGE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#01311F]/70 block">
                    Active Status
                  </label>
                  <select
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value as any)}
                    className="block w-full py-2 px-3 border border-gray-305 rounded text-xs text-[#01311F] focus:outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                  </select>
                </div>

              </div>

              <div className="pt-3 flex justify-end gap-3.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="py-2 px-4 rounded border text-xs font-bold uppercase text-zinc-500 hover:bg-gray-50 cursor-pointer"
                >
                  Exit
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-[#01311F] hover:bg-[#01311F]/90 text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Save parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
