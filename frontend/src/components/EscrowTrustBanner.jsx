import React from 'react';
import { ShieldAlert, ChevronRight } from 'lucide-react';

export default function EscrowTrustBanner({ onLearnMore }) {
  return (
    <div className="escrow-banner">
      <div className="escrow-banner-left">
        <ShieldAlert size={14} color="#0D9488" />
        <span>Giao dịch an toàn 100% qua Escrow giữ tiền</span>
      </div>
      <button 
        type="button" 
        onClick={onLearnMore} 
        className="escrow-banner-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <span>Tìm hiểu</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
