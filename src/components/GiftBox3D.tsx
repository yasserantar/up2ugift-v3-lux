'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Confetti (pure CSS particles) ───────────────────────── */
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#ecc573', '#dfb256', '#ec4899', '#d946ef', '#a855f7', '#22c55e', '#3b82f6'];
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      {Array.from({ length: 70 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width:  `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? '50%' : '3px',
          animation: `confettiFall ${1.8 + Math.random() * 1.8}s ease-in ${Math.random() * 0.6}s forwards`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ── CSS 3D Gift Box ──────────────────────────────────────── */
export default function GiftBox({ opened = false, onOpen }: { opened?: boolean; onOpen?: () => void }) {
  const [isOpen, setIsOpen] = useState(opened);
  const [burst, setBurst] = useState(false);
  const [msg, setMsg] = useState(false);

  const handleClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    setBurst(true);
    setTimeout(() => { setMsg(true); setBurst(false); }, 500);
    onOpen?.();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 relative select-none">
      <Confetti active={burst} />

      {/* ── The Box ── */}
      <motion.div
        onClick={handleClick}
        animate={isOpen ? { y: [0, -20, 0], rotate: [0, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ cursor: isOpen ? 'default' : 'pointer', perspective: 800 }}
        whileHover={!isOpen ? { scale: 1.05 } : {}}
        whileTap={!isOpen ? { scale: 0.95 } : {}}
      >
        {/* Floating wrapper */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-[180px] h-[200px]"
        >
          {/* Gold & Pink Glow ring */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
              width: 150, height: 26, borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(236,197,115,0.7), rgba(236,72,153,0.3) 50%, transparent 70%)',
              filter: 'blur(5px)',
            }}
          />

          {/* LID */}
          <motion.div
            animate={isOpen ? { rotateX: -130, y: -40 } : { rotateX: 0, y: 0 }}
            transition={{ duration: 0.7, ease: 'backOut' }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 52, transformOrigin: 'top center',
              zIndex: isOpen ? 0 : 10,
            }}
          >
            {/* Lid face - Luxurious Purple */}
            <div style={{
              width: '100%', height: '100%', borderRadius: '10px 10px 0 0',
              background: 'linear-gradient(135deg, #581c87, #2e1065)',
              border: '2px solid rgba(236,197,115,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }} className="flex items-center justify-center">
              {/* Gold stripe on lid */}
              <div style={{ width: 18, height: '100%', background: 'linear-gradient(180deg, #ecc573, #dfb256)', borderRadius: 4 }} />
            </div>
            {/* Bow */}
            <motion.div
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)' }}
            >
              {/* Left bow - Pink */}
              <div style={{
                position: 'absolute', left: -22, top: 2,
                width: 22, height: 14, borderRadius: '50% 0 0 50%',
                background: 'linear-gradient(135deg, #ec4899, #d946ef)',
                transform: 'rotate(-20deg)',
                boxShadow: '0 0 10px rgba(236,72,153,0.5)',
              }} />
              {/* Right bow - Pink */}
              <div style={{
                position: 'absolute', right: -22, top: 2,
                width: 22, height: 14, borderRadius: '0 50% 50% 0',
                background: 'linear-gradient(135deg, #d946ef, #ec4899)',
                transform: 'rotate(20deg)',
                boxShadow: '0 0 10px rgba(236,72,153,0.5)',
              }} />
              {/* Center knot - Gold */}
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ecc573, #dfb256)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 12px rgba(236,197,115,0.8)',
              }} />
            </motion.div>
          </motion.div>

          {/* BOX BODY - Royal Indigo Black */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 150,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            borderRadius: '0 0 12px 12px',
            border: '2px solid rgba(236,197,115,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(236,197,115,0.1)',
            overflow: 'hidden',
          }}>
            {/* Vertical gold stripe */}
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              width: 18, height: '100%',
              background: 'linear-gradient(180deg, #ecc573, #dfb256)',
              opacity: 0.85,
            }} />
            {/* Horizontal gold stripe */}
            <div style={{
              position: 'absolute', top: '45%', transform: 'translateY(-50%)',
              width: '100%', height: 14,
              background: 'linear-gradient(90deg, #dfb256, #ecc573, #dfb256)',
              opacity: 0.85,
            }} />
            {/* Shine effect */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
            }} />

            {/* Inner glow when opened */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, rgba(236,197,115,0.4), transparent 70%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem',
                  }}
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ── CTA / Message ── */}
      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              key="cta"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              onClick={handleClick}
              className="px-8 py-3.5 bg-gradient-to-r from-[#ecc573] via-[#dfb256] to-[#ecc573] text-stone-950 rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(236,197,115,0.45)] hover:shadow-[0_0_25px_rgba(236,197,115,0.6)] hover:scale-105 active:scale-95 transition-all animate-pulse"
            >
              👆 اضغط لفتح الهدية والمفاجأة!
            </motion.button>
          )}
          {msg && (
            <motion.div
              key="msg"
              initial={{ opacity: 0, scale: 0.8, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-panel border-[#ecc573]/20 p-5 text-center max-w-[280px]"
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-black bg-gradient-to-r from-[#ecc573] to-pink-500 bg-clip-text text-transparent">مبروك! هديتك جاهزة</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
