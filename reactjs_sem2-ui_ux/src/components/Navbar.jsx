import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, LogOut, LogIn, BookOpen, Ticket, Menu, Users, User, Compass
} from 'lucide-react';
import GitEventLogo from './GitEventLogo';

import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getList, KEYS } from '../utils/storage';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search: wait 200ms after the user stops typing before querying.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      const events = getList(KEYS.EVENTS);
      const query = searchQuery.toLowerCase();
      const matches = events
        .filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.category.toLowerCase().includes(query)
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSuggestionClick(event) {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/events/${event.id}`);
  }

  function highlightMatch(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <React.Fragment>
        {text.slice(0, index)}
        <strong className="text-zinc-400">{text.slice(index, index + query.length)}</strong>
        {text.slice(index + query.length)}
      </React.Fragment>
    );
  }

  return (
    <nav className="sticky top-6 z-50 w-[calc(100%-2rem)] max-w-7xl mx-auto bg-black/70 backdrop-blur-xl border border-white/10 rounded-full shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-border p-0">
                <ScrollArea className="h-full py-6">
                  <div className="px-6 py-2">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 mb-8">
                      <GitEventLogo size={28} />
                    </Link>
                    
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-slate-300" asChild onClick={() => setMobileMenuOpen(false)}>
                        <Link to="/home">
                          <Compass className="mr-2 h-4 w-4" />
                          Discover
                        </Link>
                      </Button>
                      {isLoggedIn && (
                        <>
                          <Button variant="ghost" className="w-full justify-start text-slate-300" asChild onClick={() => setMobileMenuOpen(false)}>
                            <Link to="/my-schedule">
                              <BookOpen className="mr-2 h-4 w-4" />
                              My Schedule
                            </Link>
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-slate-300" asChild onClick={() => setMobileMenuOpen(false)}>
                            <Link to="/my-tickets">
                              <Ticket className="mr-2 h-4 w-4" />
                              My Tickets
                            </Link>
                          </Button>
                          <Button variant="ghost" className="w-full justify-start text-zinc-400" asChild onClick={() => setMobileMenuOpen(false)}>
                            <Link to="/hosted-events">
                              <Users className="mr-2 h-4 w-4" />
                              Hosted Events
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <GitEventLogo size={32} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/home" className={navigationMenuTriggerStyle()}>
                    <Compass className="w-4 h-4 mr-2" />
                    Discover
                  </Link>
                </NavigationMenuItem>
                {isLoggedIn && (
                  <>
                    <NavigationMenuItem>
                    <Link to="/my-schedule" className={navigationMenuTriggerStyle()}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Schedule
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/my-tickets" className={navigationMenuTriggerStyle()}>
                      <Ticket className="w-4 h-4 mr-2" />
                      Tickets
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/hosted-events" className={`${navigationMenuTriggerStyle()} text-zinc-400 hover:text-zinc-300`}>
                      <Users className="w-4 h-4 mr-2" />
                      Hosted Events
                    </Link>
                  </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: Search + Notifications + Profile */}
          <div className="flex items-center gap-2">
            
            {/* Search */}
            <div className="hidden sm:block relative max-w-sm w-full md:w-64 lg:w-80" ref={searchRef}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-9 bg-black/60 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-full focus:border-white/30 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              {/* Suggestion dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  {suggestions.map((event) => (
                    <button
                      key={event.id}
                      onMouseDown={() => handleSuggestionClick(event)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-sm"
                    >
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 flex-shrink-0">
                        {event.category}
                      </span>
                      <span className="text-foreground truncate">
                        {highlightMatch(event.title, searchQuery)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
                    <button onClick={markAllRead} className="text-xs text-zinc-400 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-8">No notifications yet</p>
                    ) : (
                      notifications.slice().reverse().map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={`flex flex-col items-start px-4 py-3 cursor-pointer ${
                            !notif.read ? 'bg-zinc-500/10' : ''
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <p className="text-sm leading-snug">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
                  {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button variant="ghost" size="sm" className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/50" onClick={clearAll}>
                          Clear all
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Profile */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-1">
                    <Avatar className="h-8 w-8 border border-white/20">
                      <AvatarImage
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=18181b&color=fff`}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-zinc-800 text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || 'student@campusevent.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-schedule" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>My Schedule</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-tickets" className="cursor-pointer">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/hosted-events" className="cursor-pointer text-zinc-400">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Hosted Events</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-white hover:bg-gray-200 text-black rounded-full px-6">
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </Link>
              </Button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
