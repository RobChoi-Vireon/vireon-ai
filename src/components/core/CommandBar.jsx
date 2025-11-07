
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { User } from '@/entities/User';
import { createPageUrl } from '@/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Newspaper,
  Zap,
  Briefcase,
  BookOpenCheck,
  FileText,
  Target,
  BarChart,
  Moon,
  Sun,
  Search,
  Sparkles,
  Maximize
} from 'lucide-react';

export default function CommandBar({ open, setOpen, navigationCategories }) {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [actions, setActions] = useState([]);

  // Define a shortcuts object. The outline suggests its use for navigation items
  // but does not provide specific mappings for them.
  // For AI Assistant and Fullscreen, the shortcuts are hardcoded within their CommandItems.
  // Initializing as an empty object prevents runtime errors for `shortcuts[item.url]`.
  const shortcuts = {};

  useEffect(() => {
    if (open) {
      // Fetch dynamic data when the command bar is opened
      const fetchSavedItems = async () => {
        try {
          const user = await User.me();
          const prefs = await base44.entities.UserPreference.filter({ created_by: user.email });
          if (prefs.length > 0) {
            // This part can be expanded to fetch saved articles, ideas, etc.
          }
        } catch (error) {
          console.error("Could not fetch saved items:", error);
        }
      };
      fetchSavedItems();
    }
  }, [open]);

  useEffect(() => {
    // This is the main listener for the command bar shortcut
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((currentOpen) => !currentOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="sm:max-w-[550px] max-h-[80vh]"
    >
      <div className="relative">
        <CommandInput
          placeholder="Type a command or search..."
          className="h-12 text-base"
        />
        <CommandList className="max-h-[60vh] overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>

          {navigationCategories.map((category) => (
            <CommandGroup key={category.title} heading={category.title}>
              {category.items.map((item) => (
                <CommandItem
                  key={item.url}
                  onSelect={() => runCommand(() => navigate(item.url))}
                  className="cursor-pointer py-3 px-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  {shortcuts[item.url] && (
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                      {shortcuts[item.url]}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Actions">
             <CommandItem
               onSelect={() => runCommand(() => navigate(createPageUrl('AIAssistant')))}
               className="cursor-pointer py-3 px-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
             >
                <Sparkles className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 text-sm font-medium">Open AI Assistant</span>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">⌘⇧A</span>
             </CommandItem>
             <CommandItem
               onSelect={() => runCommand(() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen())}
               className="cursor-pointer py-3 px-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
             >
               <Maximize className="h-4 w-4 text-gray-500 dark:text-gray-400" />
               <span className="flex-1 text-sm font-medium">Toggle Fullscreen</span>
               <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">⌘⇧F</span>
             </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
