
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, Settings, HelpCircle, LogOut, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const rankFor = (xp) => {
  const ranksData = [
      { key:"cipher", xp_min:0 },
      { key:"acolyte", xp_min:500 },
      { key:"sentinel", xp_min:2000 },
      { key:"luminary", xp_min:6000 },
      { key:"ascendant", xp_min:15000 },
      { key:"oracle", xp_min:40000 }
  ];
  let cur = ranksData[0];
  for (const r of ranksData) if (xp >= r.xp_min) cur = r;
  return cur.key;
};

export default function UserMenu() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch real user data but override xp_total for prototype consistency
                const userData = await base44.auth.me();
                const mockUser = {
                    ...userData,
                    xp_total: 2450, // This XP value corresponds to the "Sentinel" rank
                };
                setUser(mockUser);
            } catch (error) {
                console.error("Failed to fetch user, using fallback data.", error);
                 // Fallback to a full mock user if auth fails during prototyping
                setUser({
                    full_name: "Robert Choi",
                    email: "robertchoi@surgepro.io",
                    avatar_url: "",
                    xp_total: 2450
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await base44.auth.logout();
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading) return <div className="w-9 h-9 rounded-full bg-gray-700/50 animate-pulse" />;
    if (!user) return null;

    const userRank = rankFor(user.xp_total || 0);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#171A21] transition-all duration-200">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user.avatar_url} alt={user.full_name} />
                        <AvatarFallback className="bg-slate-700 text-white font-semibold">
                            {getInitials(user.full_name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 mr-4 mt-2 p-0 bg-[#1A1D22]/80 backdrop-blur-2xl border border-white/10 text-white shadow-2xl rounded-2xl origin-top-right"
                sideOffset={10}
                align="end"
                asChild
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <DropdownMenuLabel className="px-4 py-3">
                        <p className="font-semibold text-base text-gray-100">{user.full_name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 w-fit">
                            <Award className="w-3.5 h-3.5" />
                            <span className="capitalize">{userRank}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <div className="p-2">
                        <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Me')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:!text-white hover:!bg-white/[0.07] focus-visible:outline-none focus-visible:!bg-white/[0.07] focus-visible:!text-white transition-colors cursor-pointer">
                                <User className="w-4 h-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                             <Link to="#" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:!text-white hover:!bg-white/[0.07] focus-visible:outline-none focus-visible:!bg-white/[0.07] focus-visible:!text-white transition-colors cursor-pointer">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="#" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:!text-white hover:!bg-white/[0.07] focus-visible:outline-none focus-visible:!bg-white/[0.07] focus-visible:!text-white transition-colors cursor-pointer">
                                <HelpCircle className="w-4 h-4" />
                                <span>Help & Support</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <div className="p-2">
                        <DropdownMenuItem 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none !text-red-400 hover:!text-red-300 hover:!bg-red-500/10 focus-visible:!bg-red-500/10 focus-visible:!text-red-300"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </DropdownMenuItem>
                    </div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
