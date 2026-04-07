import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  MessageCircle, 
  User, 
  Settings,
  Heart,
  Sparkles,
  Target,
  Shield
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/vitals', icon: Activity, label: 'Vitals' },
    { to: '/chat', icon: MessageCircle, label: 'Ask Health Sathi' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">स्वास्थ्य सहायक</h1>
            <p className="text-xs text-blue-600 font-medium">Your Health Companion</p>
          </div>
        </div>
      </div>

      <nav className="px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 mb-1">Need Help?</p>
          <p className="text-xs text-green-600">Chat with Health Sathi AI for instant health guidance.</p>
        </div>
      </div>
    </aside>
  );
}
