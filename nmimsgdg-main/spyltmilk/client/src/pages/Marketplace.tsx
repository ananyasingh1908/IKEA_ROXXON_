import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { useFurnitureStore } from "../store/furnitureStore";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";
import type { FurnitureCategory, FurnitureCondition, Furniture } from "../types/furniture";

const CATEGORIES: FurnitureCategory[] = [
    "All",
    "Chairs",
    "Desks",
    "Tables",
    "Sofas",
    "Beds",
    "Cabinets",
    "Shelves",
    "Storage",
    "Lighting",
    "Office",
    "Classroom",
    "Hospital",
    "Outdoor"
];

const CONDITIONS: Array<FurnitureCondition | "All"> = ["All", "Like New", "Excellent", "Good", "Fair"];

export const Marketplace: React.FC = () => {
    const navigate = useNavigate();

    const selectedCategory = useFurnitureStore((state) => state.selectedCategory);
    const setCategory = useFurnitureStore((state) => state.setCategory);
    const selectedCondition = useFurnitureStore((state) => state.selectedCondition);
    const setCondition = useFurnitureStore((state) => state.setCondition);
    const searchQuery = useFurnitureStore((state) => state.searchQuery);
    const setSearchQuery = useFurnitureStore((state) => state.setSearchQuery);
    const getFilteredFurniture = useFurnitureStore((state) => state.getFilteredFurniture);

    const addObject = useRoomStore((state) => state.addObject);
    const showToast = useUIStore((state) => state.showToast);

    // Modal States for Buy Now & Swap Features
    const [checkoutItem, setCheckoutItem] = useState<Furniture | null>(null);
    const [swapItem, setSwapItem] = useState<Furniture | null>(null);

    // Checkout Form State
    const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

    // Swap Form State
    const [offeredItem, setOfferedItem] = useState("Birch Desk Chair");
    const [offeredEstValue, setOfferedEstValue] = useState(2000);
    const [swapConfirmedCode, setSwapConfirmedCode] = useState<string | null>(null);

    const filteredItems = getFilteredFurniture();

    const handleAddToRoom = (furniture: Furniture) => {
        addObject({
            productId: furniture.id,
            type: "furniture",
            name: furniture.name,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: furniture.width,
            depth: furniture.depth,
            height: furniture.height,
            color: furniture.color,
            modelUrl: furniture.modelUrl,
            price: furniture.price,
            condition: furniture.condition
        });
        showToast(`Added "${furniture.name}" to 3D Room`);
        navigate("/secondhand.html");
    };

    const handleConfirmBuy = () => {
        const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderConfirmedId(generatedId);
        showToast(`Order #${generatedId} confirmed!`);
    };

    const handleConfirmSwap = () => {
        const generatedCode = `SWAP-${Math.floor(10000 + Math.random() * 90000)}`;
        setSwapConfirmedCode(generatedCode);
        showToast(`Swap request #${generatedCode} submitted!`);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans pb-16">
            <Navbar />

            {/* Header Banner */}
            <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="text-xs font-bold text-[#0058A3] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            Verified Pre-Loved Furniture
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                            Second-Hand Furniture Marketplace
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Buy, Sell & Swap pre-loved Scandinavian designs with instant 3D room preview.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="w-full md:w-96">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search desks, chairs, sofas, tables..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                            />
                            <svg className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filters */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-200 mb-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sub-Filters */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
                        <span>Condition:</span>
                        <select
                            value={selectedCondition}
                            onChange={(e) => setCondition(e.target.value as FurnitureCondition | "All")}
                            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                        >
                            {CONDITIONS.map((cond) => (
                                <option key={cond} value={cond}>
                                    {cond}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                        Showing {filteredItems.length} items
                    </span>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            {/* Color / Asset Visual Placeholder */}
                            <div
                                className="relative h-48 flex items-center justify-center p-6 transition-transform group-hover:scale-105 duration-500"
                                style={{ backgroundColor: item.color ? `${item.color}15` : "#F1F5F9" }}
                            >
                                <div
                                    className="w-24 h-24 rounded-2xl shadow-md border-2 border-white flex items-center justify-center"
                                    style={{ backgroundColor: item.color || "#64748B" }}
                                >
                                    <span className="text-white text-xs font-black uppercase text-center px-1">
                                        {item.category}
                                    </span>
                                </div>

                                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                    {item.condition}
                                </span>

                                {item.originalPrice && (
                                    <span className="absolute top-3 right-3 bg-[#FFDB00] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                                        Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold text-[#0058A3] uppercase tracking-wider block">
                                        {item.category}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-base mt-0.5 group-hover:text-[#0058A3] transition-colors leading-snug">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <span>📍</span>
                                        <span>{item.location}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                                </div>

                                {/* Dimensions, Price & Action Buttons */}
                                <div className="pt-3 border-t border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                        <span>Dim: {item.width}m × {item.depth}m × {item.height}m</span>
                                        <span className="text-[10px] text-slate-400">Seller: {item.sellerName}</span>
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-baseline justify-between">
                                            <div>
                                                <span className="text-xl font-extrabold text-slate-900">
                                                    ₹{item.price.toLocaleString("en-IN")}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="text-xs text-slate-400 line-through ml-1.5">
                                                        ₹{item.originalPrice.toLocaleString("en-IN")}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                                        </div>

                                        {/* Action Buttons: ADD TO CART, SWAP, + 3D ROOM */}
                                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if ((window as any).addToIkeaCart) {
                                                        (window as any).addToIkeaCart({
                                                            id: item.id || ('sh-' + item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')),
                                                            name: item.name,
                                                            price: item.price,
                                                            originalPrice: item.originalPrice,
                                                            category: item.category,
                                                            condition: item.condition,
                                                            description: item.description,
                                                            image: (window as any).resolveFurnitureImageByTitle ? (window as any).resolveFurnitureImageByTitle(item.name, item.category) : undefined
                                                        }, e.currentTarget);
                                                    }
                                                }}
                                                className="py-2 rounded-xl bg-[#0058A3] hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
                                                title="Add to Shopping Bag"
                                            >
                                                <span>Add to cart</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSwapItem(item);
                                                    setSwapConfirmedCode(null);
                                                }}
                                                className="py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
                                            >
                                                <span>🔄 Swap</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToRoom(item);
                                                }}
                                                className="py-2 rounded-xl bg-[#FFDB00] hover:bg-yellow-400 text-black text-[11px] font-extrabold transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
                                                title="Add to 3D Room Planner"
                                            >
                                                <span>+ 3D</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL 1: BUY NOW CHECKOUT MODAL */}
            {checkoutItem && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-[#0058A3] text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase text-[#FFDB00] block">Marketplace Checkout</span>
                                <h3 className="font-extrabold text-base">Buy Secondhand Furniture</h3>
                            </div>
                            <button
                                onClick={() => setCheckoutItem(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {!orderConfirmedId ? (
                            <div className="p-6 space-y-5">
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-[#0058A3] text-xs">
                                        {checkoutItem.category}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-xs text-slate-900">{checkoutItem.name}</h4>
                                        <span className="text-sm font-black text-slate-900">₹{checkoutItem.price.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Fulfillment Method</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod("delivery")}
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${deliveryMethod === "delivery" ? "border-[#0058A3] bg-blue-50 text-[#0058A3]" : "border-slate-200 text-slate-600"}`}
                                        >
                                            🚚 Home Delivery (+₹299)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod("pickup")}
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${deliveryMethod === "pickup" ? "border-[#0058A3] bg-blue-50 text-[#0058A3]" : "border-slate-200 text-slate-600"}`}
                                        >
                                            🚗 Self Pickup (Free)
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                    >
                                        <option value="upi">📱 UPI (GPay / PhonePe / Paytm)</option>
                                        <option value="card">💳 Credit / Debit Card</option>
                                        <option value="cash">💵 Cash on Pickup / Delivery</option>
                                        <option value="credits">⭐ Swap Credits Balance (₹5,400 avail)</option>
                                    </select>
                                </div>

                                <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                                    <div className="flex justify-between text-slate-600 font-semibold">
                                        <span>Item Price:</span>
                                        <span>₹{checkoutItem.price.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-semibold">
                                        <span>Fulfillment Fee:</span>
                                        <span>{deliveryMethod === "delivery" ? "₹299" : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                                        <span>Total Payable:</span>
                                        <span className="text-[#0058A3]">
                                            ₹{(checkoutItem.price + (deliveryMethod === "delivery" ? 299 : 0)).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmBuy}
                                    className="w-full py-3 rounded-2xl bg-[#0058A3] hover:bg-blue-800 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    Confirm Order & Pay Now →
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 text-center space-y-4">
                                <span className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
                                    ✓
                                </span>
                                <h4 className="text-xl font-black text-slate-900">Order Confirmed!</h4>
                                <p className="text-xs font-bold text-slate-600">
                                    Order ID: <span className="font-mono text-[#0058A3]">{orderConfirmedId}</span>
                                </p>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
                                    <p className="font-bold text-slate-800">Fulfillment: Tomorrow, 2:00 PM</p>
                                    <p className="text-slate-500">Seller: {checkoutItem.sellerName} (Verified)</p>
                                </div>
                                <button
                                    onClick={() => setCheckoutItem(null)}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL 2: REQUEST SWAP MODAL */}
            {swapItem && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase text-purple-200 block">Furniture Swap Mechanism</span>
                                <h3 className="font-extrabold text-base">Request Furniture Swap</h3>
                            </div>
                            <button
                                onClick={() => setSwapItem(null)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {!swapConfirmedCode ? (
                            <div className="p-6 space-y-5">
                                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase text-purple-700 block">Target Item to Acquire</span>
                                    <h4 className="font-black text-slate-900 text-xs">{swapItem.name}</h4>
                                    <p className="text-xs font-bold text-purple-900">Listed Value: ₹{swapItem.price.toLocaleString("en-IN")}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Choose Your Furniture to Offer</label>
                                    <select
                                        value={offeredItem}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const val = name.includes("Chair") ? 2000 : name.includes("Desk") ? 3500 : 1500;
                                            setOfferedItem(name);
                                            setOfferedEstValue(val);
                                        }}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                    >
                                        <option value="Birch Desk Chair">Birch Desk Chair (Est. Value ₹2,000)</option>
                                        <option value="Compact Study Desk">Compact Study Desk (Est. Value ₹3,500)</option>
                                        <option value="Wooden Side Table">Wooden Side Table (Est. Value ₹1,500)</option>
                                    </select>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                                    <span className="font-extrabold text-slate-900 block">Swap Credit & Value Difference</span>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Target Item Value:</span>
                                        <span>₹{swapItem.price.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Your Offered Item:</span>
                                        <span>- ₹{offeredEstValue.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                                        <span>Net Difference Settlement:</span>
                                        <span className="text-purple-700">
                                            {swapItem.price >= offeredEstValue
                                                ? `Pay Difference: ₹${(swapItem.price - offeredEstValue).toLocaleString("en-IN")}`
                                                : `Receive Credit: ₹${(offeredEstValue - swapItem.price).toLocaleString("en-IN")}`}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmSwap}
                                    className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    Submit Swap Request →
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 text-center space-y-4">
                                <span className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
                                    🔄
                                </span>
                                <h4 className="text-xl font-black text-slate-900">Swap Requested!</h4>
                                <p className="text-xs font-bold text-slate-600">
                                    Swap Code: <span className="font-mono text-purple-700">{swapConfirmedCode}</span>
                                </p>
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-left space-y-1">
                                    <p className="font-bold text-purple-900">Swap Proposal Sent to {swapItem.sellerName}</p>
                                    <p className="text-purple-700">Value Settlement: Net difference held in escrow</p>
                                </div>
                                <button
                                    onClick={() => setSwapItem(null)}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
