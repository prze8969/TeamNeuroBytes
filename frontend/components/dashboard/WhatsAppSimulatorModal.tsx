'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/LocaleContext';
import { API_BASE_URL } from '@/lib/api';

interface ChatMessage {
  sender: 'bot' | 'farmer';
  text: string;
  time: string;
}

export function WhatsAppSimulatorModal() {
  const t = useTranslations('whatsappSimulator');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: "🌾 *Welcome to KisanSetu Market Linkage Bot* 🌾\n_(Govt. of India • Agmarknet & FPO Trade Network)_\n\nPlease choose an option:\n\n1️⃣ *List New Crop Produce* (AI grading & buyer bids)\n2️⃣ *Check Live APMC Mandi Rates & AI Forecast*\n3️⃣ *View My Active Bids & Escrow Payouts*\n4️⃣ *Kisan Helpdesk & Grievance*\n\n_Reply with 1, 2, 3, or 4_",
      time: '15:30'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const newFarmerMsg: ChatMessage = {
      sender: 'farmer',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newFarmerMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/whatsapp/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_phone: '+919876543210',
          message_type: 'text',
          text: textToSend,
          latitude: 20.0125,
          longitude: 73.7910,
          district: 'Nashik'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply: ChatMessage = {
          sender: 'bot',
          text: data.reply || "Message received by KisanSetu.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botReply]);
      } else {
        throw new Error();
      }
    } catch {
      setTimeout(() => {
        let reply = "✅ Option recorded. Reply *MENU* to view options.";
        if (textToSend === '1') {
          reply = "🌾 *KisanSetu - Step 1/4: Crop Listing*\n\nPlease reply with your crop name and variety.\n\n_Example: Sharbati Wheat or Red Onion_";
        } else if (textToSend === '2') {
          reply = "📊 *Today's Agmarknet Mandi Benchmarks:*\n\n• *Nashik APMC* (Wheat): Modal ₹25.50/kg | 7D: ₹27.20/kg\n• *Lasalgaon APMC* (Onion): Modal ₹21.50/kg | 7D: ₹23.00/kg\n• *Pune APMC* (Tomato): Modal ₹19.00/kg | 7D: ₹21.50/kg\n\nReply *1* to list your produce!";
        } else if (textToSend === '3') {
          reply = "📦 *Your Registered Lots:*\n• Lot #99 - *Sharbati Wheat* (Grade A)\n  Weight: 5.0T | Base: ₹24.50/kg | Status: *BID_ACCEPTED* (Escrow Locked: ₹1,32,500)";
        }
        setMessages((prev) => [...prev, {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4 backdrop-blur-xl">
      {/* WhatsApp Header */}
      <div className="flex items-center justify-between bg-[#075e54] text-white p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-xl shadow-inner font-bold">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black tracking-tight text-white">{t('botTitle')}</h3>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 rounded font-extrabold">{t('verified')}</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              {t('status')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono bg-black/20 px-2 py-1 rounded text-emerald-200">
            +91-9876543210
          </span>
        </div>
      </div>

      {/* WhatsApp Chat Viewport */}
      <div className="rounded-xl bg-[#0b141a] border border-slate-800 p-4 h-80 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-[82%] rounded-xl p-3 shadow-md whitespace-pre-line leading-relaxed ${
              m.sender === 'farmer'
                ? 'ml-auto bg-[#005c4b] text-white rounded-tr-none border border-[#02735e]'
                : 'mr-auto bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/60'
            }`}
          >
            <div>{m.text}</div>
            <span className="text-[9px] text-slate-400 self-end mt-1 font-mono">{m.time} ✓✓</span>
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-[#202c33] text-slate-300 p-2.5 rounded-xl text-[11px] italic border border-slate-700/60 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            {t('typing')}
          </div>
        )}
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 self-center">{t('quickPrompts')}</span>
        <button
          onClick={() => sendMessage('1')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          {t('listNewCrop')}
        </button>
        <button
          onClick={() => sendMessage('2')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          {t('apmcRates')}
        </button>
        <button
          onClick={() => sendMessage('3')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          {t('escrowPayouts')}
        </button>
        <button
          onClick={() => sendMessage('Sharbati Wheat')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          🌾 Sharbati Wheat
        </button>
        <button
          onClick={() => sendMessage('50 Quintal, ₹26/kg')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          📦 50 Qtl, ₹26/kg
        </button>
        <button
          onClick={() => sendMessage('MENU')}
          className="text-xs bg-slate-950 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 px-3 py-1 rounded-full border border-slate-800 transition-all cursor-pointer"
        >
          🔄 MENU
        </button>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          placeholder={t('placeholder')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="bg-slate-950 border-slate-800 text-white text-xs h-10 focus:border-emerald-500"
        />
        <Button
          onClick={() => sendMessage()}
          className="bg-[#00a884] hover:bg-[#02735e] text-slate-950 font-black text-xs px-6 h-10 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          {t('send')}
        </Button>
      </div>
    </div>
  );
}
