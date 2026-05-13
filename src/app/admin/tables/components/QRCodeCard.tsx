"use client";

import { QRCodeSVG } from "qrcode.react";
import { X as XIcon } from "lucide-react";

interface QRCodeCardProps {
  tableNum: string;
  qrLink: string;
  onRemove: (tableNum: string) => void;
}

export default function QRCodeCard({ tableNum, qrLink, onRemove }: QRCodeCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:border-orange-200 transition-all duration-500 break-inside-avoid mb-4 relative">
      {/* Delete button (only visible on hover and not during print) */}
      <button
        onClick={() => {
          if (confirm(`Xóa bàn ${tableNum}?`)) onRemove(tableNum);
        }}
        className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all print:hidden"
      >
        <XIcon size={16} />
      </button>

      <div
        className={`w-12 h-12 ${
          tableNum ? "bg-orange-500" : "bg-red-500"
        } text-white rounded-2xl flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-orange-100`}
      >
        {tableNum || "??"}
      </div>
      <div className="p-3 bg-white border-4 border-gray-50 rounded-3xl mb-4 group-hover:border-orange-50 transition-colors">
        <QRCodeSVG
          value={qrLink}
          size={120}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "https://placehold.co/100x100/orange/white?text=H",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">
        BÀN SỐ {tableNum}
      </p>
      <p className="text-[10px] text-gray-400 font-medium truncate w-full px-2">{qrLink}</p>

      <div className="hidden print:block mt-4 pt-4 border-t border-dashed border-gray-200 w-full">
        <p className="text-[10px] font-bold text-gray-800">HOMI MEDIA - MENU QR</p>
        <p className="text-[8px] text-gray-400 italic">Vui lòng quét mã để gọi món</p>
      </div>
    </div>
  );
}
