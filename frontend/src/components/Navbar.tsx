import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ShoppingBag, Menu, X, LogOut, Calendar, Shield, Trash2, Plus, Minus, User as UserIcon } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout, cart, cartCount, cartTotal, updateCartQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#F3F2ED]/95 backdrop-blur-md border-b border-[#01311F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#01311F]">
                MANGIA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C6AA58] font-semibold border-l border-[#C6AA58]/50 pl-2">
                Restaurant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/menu"
              className={`font-medium transition-colors text-sm uppercase tracking-wider relative py-1 group ${
                isActive("/menu") ? "text-[#01311F] font-bold" : "text-[#01311F]/70 hover:text-[#01311F]"
              }`}
            >
              Menu
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C6AA58] transition-transform scale-x-0 group-hover:scale-x-100 ${isActive("/menu") ? "scale-x-100" : ""}`}></span>
            </Link>
            
            {(!user || user.role === "CUSTOMER") && (
              <Link
                to="/book-table"
                className={`font-medium transition-colors text-sm uppercase tracking-wider relative py-1 group ${
                  isActive("/book-table") ? "text-[#01311F] font-bold" : "text-[#01311F]/70 hover:text-[#01311F]"
                }`}
              >
                Book Table
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C6AA58] transition-transform scale-x-0 group-hover:scale-x-100 ${isActive("/book-table") ? "scale-x-100" : ""}`}></span>
              </Link>
            )}

            {user?.role === "CUSTOMER" && (
              <>
                <Link
                  to="/my-orders"
                  className={`font-medium transition-colors text-sm uppercase tracking-wider relative py-1 group ${
                    isActive("/my-orders") ? "text-[#01311F] font-bold" : "text-[#01311F]/70 hover:text-[#01311F]"
                  }`}
                >
                  My Orders
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C6AA58] transition-transform scale-x-0 group-hover:scale-x-100 ${isActive("/my-orders") ? "scale-x-100" : ""}`}></span>
                </Link>
                <Link
                  to="/my-reservations"
                  className={`font-medium transition-colors text-sm uppercase tracking-wider relative py-1 group ${
                    isActive("/my-reservations") ? "text-[#01311F] font-bold" : "text-[#01311F]/70 hover:text-[#01311F]"
                  }`}
                >
                  My Tables
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#C6AA58] transition-transform scale-x-0 group-hover:scale-x-100 ${isActive("/my-reservations") ? "scale-x-100" : ""}`}></span>
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 font-semibold text-sm uppercase tracking-widest text-[#C6AA58] hover:text-[#C6AA58]/85`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Area - Cart Bar, User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {(!user || user.role === "CUSTOMER") && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#01311F] hover:text-[#C6AA58] transition-colors"
                aria-label="Toggle cart view"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#01311F] text-[#F3F2ED] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#F3F2ED]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#01311F]/60">Welcome,</p>
                  <p className="text-sm font-bold text-[#01311F]">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-[#01311F] hover:bg-[#01311F]/95 text-[#F3F2ED] text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#01311F] hover:bg-[#C6AA58] hover:text-[#01311F] text-[#F3F2ED] text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu & Cart Trigger */}
          <div className="flex items-center space-x-3 md:hidden">
            {(!user || user.role === "CUSTOMER") && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#01311F]"
                aria-label="Toggle cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#01311F] text-[#F3F2ED] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#F3F2ED]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#01311F] focus:outline-none"
              aria-label="Toggle main menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#F3F2ED] border-b border-[#E6E4DB] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-serif text-lg text-[#01311F]"
          >
            Menu
          </Link>
          
          {(!user || user.role === "CUSTOMER") && (
            <Link
              to="/book-table"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-serif text-lg text-[#01311F]"
            >
              Book Table
            </Link>
          )}

          {user?.role === "CUSTOMER" && (
            <>
              <Link
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-serif text-lg text-[#01311F]"
              >
                My Orders
              </Link>
              <Link
                to="/my-reservations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-serif text-lg text-[#01311F]"
              >
                My Tables
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-serif text-lg text-[#C6AA58] font-bold"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-[#E6E4DB]">
            {user ? (
              <div className="space-y-3 px-3">
                <p className="text-sm font-bold text-[#01311F]">Session: {user.name} ({user.role})</p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#01311F] text-[#F3F2ED] font-semibold py-2.5 px-4 rounded-md text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-3">
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center block bg-[#01311F] text-[#F3F2ED] font-semibold py-2.5 px-4 rounded-md text-sm uppercase tracking-wider"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#01311F]/45 transition-opacity"
              onClick={() => setIsCartOpen(false)}
            ></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-[#F3F2ED] shadow-2xl border-l border-[#E6E4DB]">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between border-b border-[#E6E4DB] pb-5">
                      <h2 className="font-serif text-2xl font-bold text-[#01311F]" id="slide-over-title">
                        Your Selection
                      </h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setIsCartOpen(false)}
                          className="relative -m-2 p-2 text-[#01311F]/70 hover:text-[#01311F] focus:outline-none"
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      {cart.length === 0 ? (
                        <div className="text-center py-12 px-4">
                          <ShoppingBag className="w-12 h-12 text-[#01311F]/30 mx-auto mb-4" />
                          <p className="font-serif text-lg font-semibold text-[#01311F]">Your cart is empty</p>
                          <p className="text-sm text-[#01311F]/60 mt-1 max-w-xs mx-auto">
                            Browse our rich menu collections to add authentic gourmet Italian cuisine to your table.
                          </p>
                          <button
                            onClick={() => {
                              setIsCartOpen(false);
                              navigate("/menu");
                            }}
                            className="mt-6 bg-[#01311F] hover:bg-[#01311F]/90 text-[#F3F2ED] text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded-md"
                          >
                            Browse Menu
                          </button>
                        </div>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-[#E6E4DB]">
                          {cart.map((item) => (
                            <li key={item.menuItem.id} className="flex py-6">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-[#E6E4DB]">
                                <img
                                  src={item.menuItem.image}
                                  alt={item.menuItem.name}
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-semibold text-[#01311F]">
                                    <h3 className="font-serif pr-2">{item.menuItem.name}</h3>
                                    <p className="ml-4">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center gap-2 border border-[#E6E4DB] rounded-md bg-white p-1">
                                    <button
                                      onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                                      className="p-1 hover:text-[#C6AA58] transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center font-semibold text-[#01311F] text-xs">{item.quantity}</span>
                                    <button
                                      onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                                      className="p-1 hover:text-[#C6AA58] transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.menuItem.id)}
                                      className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-[#E6E4DB] px-4 py-6 sm:px-6 bg-white">
                      <div className="flex justify-between text-base font-bold text-[#01311F]">
                        <p>Subtotal</p>
                        <p>${cartTotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-[#01311F]/60">
                        Applicable duties and dining tax are calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate("/menu", { state: { openCheckout: true } });
                          }}
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-[#01311F] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#F3F2ED] shadow-sm hover:bg-[#01311F]/90 transition-colors"
                        >
                          Checkout Selection (${cartTotal.toFixed(2)})
                        </button>
                      </div>
                      <div className="mt-4 flex justify-center text-center text-sm text-[#01311F]/60">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-semibold text-[#C6AA58] hover:text-[#C6AA58]/80 transition-colors"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Continue Browsing
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
