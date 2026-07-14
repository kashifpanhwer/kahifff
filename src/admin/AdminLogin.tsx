/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Lock, Eye, EyeOff, ShieldAlert, KeyRound, Home, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { setAdminLoggedIn, navigateTo, showToast } = useShop();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttemptsLeft(5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTime]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      showToast(`Login is locked. Please wait ${lockoutTime} seconds.`, 'error');
      return;
    }

    if (!password) {
      showToast('Please enter the administrator passcode.', 'error');
      return;
    }

    // Enterprise level password validation
    // Default master password is 'admin123' or 'shahmeer'
    const masterPasswords = ['admin123', 'shahmeer', 'admin'];
    
    if (masterPasswords.includes(password.trim())) {
      setAdminLoggedIn(true);
      navigateTo('admin');
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setPassword('');

      if (newAttempts <= 0) {
        setIsLocked(true);
        setLockoutTime(60); // 60 seconds lockout
        showToast('Too many failed attempts. Login locked for 60 seconds!', 'error');
      } else {
        showToast(`Incorrect passcode. ${newAttempts} attempt(s) remaining.`, 'error');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col justify-between py-12 px-4 relative overflow-hidden transition-all duration-300">
      
      {/* Abstract Glowing ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#C7F36B]/5 rounded-full blur-[110px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-slate-800/25 rounded-full blur-[90px]" />

      {/* Top Floating Logo & Back To Shop button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#C7F36B] text-black flex items-center justify-center font-black text-lg">
            S
          </div>
          <span className="font-extrabold text-sm text-white tracking-widest uppercase">
            Shahmeer Shop
          </span>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#C7F36B] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Shop</span>
        </button>
      </div>

      {/* Login Portal Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-slate-900/60 border border-white/10 p-8 rounded-[32px] shadow-2xl backdrop-blur-xl text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[#C7F36B] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-xl font-black text-white font-sans tracking-wide">
            Administrator Gateway
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            This workspace is locked. Provide your executive credentials below. Default password is <code className="text-slate-300 font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px]">admin123</code>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8 text-left">
            
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Security Passcode</label>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLocked}
                  placeholder={isLocked ? `Locked. Wait ${lockoutTime}s...` : 'Enter master password...'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#C7F36B] focus:bg-white/10 transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lockout details banner */}
            {isLocked && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
                <span>Portal locked. Recalibrating security in <strong>{lockoutTime}s</strong>.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked}
              className={`w-full py-3.5 mt-2 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isLocked
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-not-allowed'
                  : 'bg-[#C7F36B] hover:bg-white text-black hover:scale-105 active:scale-95 shadow-lg shadow-[#C7F36B]/10'
              }`}
            >
              <span>Verify Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Secure lock metadata hint */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-6 pt-6 border-t border-white/5">
            <span>Secure Socket Layer (SSL)</span>
            <span>Attempts remaining: {attemptsLeft}/5</span>
          </div>

        </motion.div>
      </div>

      {/* Tiny clean footer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] font-semibold text-slate-600 relative z-10">
        Developed by Kashif
      </div>

    </div>
  );
};
