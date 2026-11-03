"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FiX,
  FiPrinter,
  FiDownload,
  FiCheckCircle,
  FiTruck,
  FiPhone,
  FiMapPin,
  FiClock,
  FiUser,
  FiShoppingBag,
} from "react-icons/fi";
import { useShop } from "@/context/ShopContext";
import toast from "react-hot-toast";

interface OrderInvoiceModalProps {
  orderId: string | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({
  orderId,
  onClose,
}: OrderInvoiceModalProps) {
  const { orders, updateOrderStatus, shippingSettings } = useShop();
  const printRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "png" | "jpg">("pdf");
  const [isDownloading, setIsDownloading] = useState(false);

  if (!orderId) return null;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    const toastId = toast.loading(`Generating 1-page ${downloadFormat.toUpperCase()} invoice...`);

    try {
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;

      const canvas = await html2canvas(printRef.current, {
        scale: 2.5, // Crisp retina clarity
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const fileName = `Invoice-${order.id}`;

      if (downloadFormat === "png") {
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Invoice downloaded as PNG (1 Page)", { id: toastId });
      } else if (downloadFormat === "jpg") {
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.98);
        link.click();
        toast.success("Invoice downloaded as JPG (1 Page)", { id: toastId });
      } else if (downloadFormat === "pdf") {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const margin = 12;
        const maxContentWidth = pageWidth - margin * 2;
        const maxContentHeight = pageHeight - margin * 2;

        let imgWidth = maxContentWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Ensure invoice strictly fits on exactly 1 single page
        if (imgHeight > maxContentHeight) {
          imgHeight = maxContentHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        const xOffset = margin + (maxContentWidth - imgWidth) / 2;
        const yOffset = margin;

        pdf.addImage(imgData, "JPEG", xOffset, yOffset, imgWidth, imgHeight, undefined, "FAST");
        pdf.save(`${fileName}.pdf`);
        toast.success("Invoice downloaded as PDF (1 Page)", { id: toastId });
      }
    } catch (err) {
      console.error("Export invoice error:", err);
      toast.error("Failed to generate invoice. Please try again.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Global CSS for Strict 1-Page Printing & Background Elimination */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible !important;
          }
          #invoice-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 16px !important;
            box-shadow: none !important;
            border: 1px solid #e4e4e7 !important;
            border-radius: 16px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto animate-in zoom-in-95 duration-150">
          
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="p-3 sm:p-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/80 rounded-t-3xl print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xs sm:text-sm text-[#ff2056] uppercase tracking-wider">
                Store Invoice
              </span>
              <span className="text-zinc-400">•</span>
              <span className="font-mono font-bold text-xs text-zinc-700">{order.id}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Format Selector Pills (PDF, PNG, JPG) */}
              <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-0.5 shadow-2xs">
                {(["pdf", "png", "jpg"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setDownloadFormat(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase transition-all cursor-pointer ${
                      downloadFormat === fmt
                        ? "bg-[#ff2056] text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Download Selected Format Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title={`Download 1-page invoice as ${downloadFormat.toUpperCase()}`}
              >
                {isDownloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiDownload size={13} />
                )}
                <span>Download {downloadFormat.toUpperCase()}</span>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="py-1.5 px-2.5 sm:px-3 rounded-xl bg-[#ff2056] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#3D182D] transition-colors cursor-pointer shadow-xs"
                title="Print 1-page invoice"
              >
                <FiPrinter size={13} />
                <span className="hidden sm:inline">Print</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                aria-label="Close invoice"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Single-Page Printable & Exportable Invoice Container */}
          <div
            id="invoice-print-area"
            ref={printRef}
            className="p-6 sm:p-8 space-y-6 text-xs text-zinc-800 bg-white"
          >
            
            {/* 1. Header with Logo & Store Info */}
            <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ff2056] text-white flex items-center justify-center font-serif font-black text-xl">
                    B
                  </div>
                  <div>
                    <h1 className="font-serif font-black text-lg text-zinc-900 uppercase tracking-tight">
                      BORKA SHOP
                    </h1>
                    <p className="text-[10px] text-zinc-500 tracking-wider uppercase font-semibold">
                      Premier Modest Fashion in Bangladesh
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Helpline: {shippingSettings.helplinePhone} • {shippingSettings.helplineEmail}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-base font-black text-zinc-900 block">
                  {order.id}
                </span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Date: {order.createdAt}</p>
                <span
                  className={`mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    order.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : order.status === "Processing"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : order.status === "Shipped"
                      ? "bg-purple-50 text-purple-800 border border-purple-200"
                      : order.status === "Cancelled"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  Status: {order.status}
                </span>
              </div>
            </div>

            {/* 2. Customer & Delivery Address Card */}
            <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Customer Recipient
                </span>
                <p className="font-bold text-sm text-zinc-900">{order.customerName}</p>
                <p className="text-zinc-600 mt-0.5">{order.phone}</p>
                <span className="mt-1 inline-block text-[10px] text-zinc-500 font-medium capitalize">
                  Checkout Type: {order.role}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Delivery Destination
                </span>
                <p className="text-zinc-800 leading-relaxed">{order.address}</p>
                <span className="mt-1 inline-block text-[10px] font-bold text-[#ff2056] capitalize">
                  Zone: {order.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                </span>
              </div>
            </div>

            {/* 3. Itemized Products Table */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-2.5 px-4">Item Details</th>
                    <th className="py-2.5 px-3">Size / Color</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {item.productImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative">
                              <Image
                                src={item.productImage}
                                alt={item.productName || "Product"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center text-zinc-400">
                              <FiShoppingBag size={18} />
                            </div>
                          )}
                          <span className="font-bold text-zinc-900 line-clamp-1">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-600">
                        <span>Size: {item.size}</span>
                        <span className="block text-[10px] text-zinc-400">{item.color}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-zinc-800">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-600">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Total Calculation Breakdown */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 border-t border-zinc-200 pt-3">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold">৳{order.deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-[#ff2056] pt-2 border-t border-zinc-200">
                  <span>Grand Total:</span>
                  <span>৳{order.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Payment Method:</span>
                  <span className="font-bold uppercase">{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* 5. Footer Notice */}
            <div className="text-center text-[10px] text-zinc-400 pt-4 border-t border-zinc-100">
              <p>Thank you for shopping with Borka Shop! Easy 7-day exchange guarantee nationwide.</p>
              <p className="mt-0.5">Computer-generated receipt • No physical signature required.</p>
            </div>

          </div>

          {/* Status Changer Footer (Hidden in Print) */}
          <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 rounded-b-3xl flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-700">Update Status:</span>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-white border border-zinc-300 text-xs font-bold text-zinc-800 focus:outline-none focus:border-[#ff2056] cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="py-2 px-5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
