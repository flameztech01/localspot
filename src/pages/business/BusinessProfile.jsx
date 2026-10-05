import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, Briefcase, Calendar, 
  CreditCard, LogOut, CheckCircle2, XCircle, MapPin, 
  Phone, Mail, Clock, HelpCircle, FileText, Users,
  Globe, Camera, Image as ImageIcon, Link, Share2, 
  Receipt, Plus
} from 'lucide-react';

// --- Reusable Components ---

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
    active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
  }`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </div>
);

const CheckboxItem = ({ label, checked = true }) => (
  <div className="flex items-center gap-2">
    {checked ? (
      <CheckCircle2 size={18} className="text-green-500" />
    ) : (
      <XCircle size={18} className="text-gray-300" />
    )}
    <span className={`text-sm ${checked ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
  </div>
);

// --- Tab Content Components ---

const GeneralInfoTab = () => (
  <div className="space-y-6">
    {/* Cover Image & Profile Header */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 w-full bg-gradient-to-r from-orange-400 to-gray-800 relative">
        <div className="absolute right-10 top-0 bottom-0 w-64 bg-red-400 rounded-full mix-blend-multiply opacity-80 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 w-32 h-32 bg-black rounded-full mix-blend-multiply opacity-60"></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-8 pb-8 relative">
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
              <img src="https://i.pravatar.cc/150?img=12" alt="Business Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900">Elysian Restaurant & Lounge</h2>
          <CheckCircle2 size={18} className="text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-400" />
              <span>123 Main Street, City, State</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span>contact@example.com</span>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-400" />
              <span>Mon - Fri: 9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-400" />
              <span>Sat - Sun: 10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-400" />
              <span>Located in: Downtown Mall</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* About Section */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">About</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  </div>
);

const GalleryTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Gallery</h3>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
        <Camera size={16} />
        Upload Media
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 relative group overflow-hidden cursor-pointer">
          <ImageIcon size={24} className="text-gray-300 group-hover:scale-110 transition-transform" />
        </div>
      ))}
    </div>
  </div>
);

const LocationTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
    <h3 className="text-lg font-semibold mb-4">Location & Directions</h3>
    <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative">
      {/* Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <MapPin size={48} />
        <span className="ml-2 font-medium">Interactive Map Area</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3 text-sm text-gray-600">
        <h4 className="font-semibold text-gray-900">Address</h4>
        <p>123 Main Street, Suite 400</p>
        <p>City, State, 12345</p>
        <p>United States</p>
      </div>
      <div className="space-y-3 text-sm text-gray-600">
        <h4 className="font-semibold text-gray-900">Parking & Transit</h4>
        <p>Free on-site parking available</p>
        <p>Valet parking available on weekends</p>
        <p>2 blocks from Central Metro Station</p>
      </div>
    </div>
  </div>
);

const InvoiceEstimatesTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Invoice & Estimates</h3>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        <Plus size={16} />
        Create New
      </button>
    </div>
    
    {/* Placeholder Table */}
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-medium">Invoice #</th>
            <th className="px-6 py-3 font-medium">Client</th>
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Amount</th>
            <th className="px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-2"><Receipt size={16} className="text-gray-400"/> INV-001</td>
            <td className="px-6 py-4">Acme Corp</td>
            <td className="px-6 py-4">Oct 12, 2023</td>
            <td className="px-6 py-4">$1,200.00</td>
            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span></td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 flex items-center gap-2"><Receipt size={16} className="text-gray-400"/> INV-002</td>
            <td className="px-6 py-4">Globex Inc</td>
            <td className="px-6 py-4">Oct 15, 2023</td>
            <td className="px-6 py-4">$850.00</td>
            <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const TeamTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Team Members</h3>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        <Plus size={16} />
        Add Member
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { name: 'Jane Doe', role: 'General Manager', img: 'https://i.pravatar.cc/150?img=32' },
        { name: 'John Smith', role: 'Head Chef', img: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Alice Johnson', role: 'Event Coordinator', img: 'https://i.pravatar.cc/150?img=45' },
      ].map((member, idx) => (
        <div key={idx} className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm">
            <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
          </div>
          <h4 className="font-medium text-gray-900">{member.name}</h4>
          <p className="text-xs text-gray-500">{member.role}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Component ---

const BusinessProfile = () => {
  const tabs = [
    'General info',
    'Gallery',
    'Location',
    'Invoice & Estimates',
    'Team'
  ];
  
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">LS</span>
            </div>
            <span className="font-bold text-lg tracking-tight">LOCALSPOT</span>
          </div>

          {/* User Profile Snippet */}
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Business Account</p>
                <p className="text-xs text-gray-500">View profile</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            <SidebarItem icon={Briefcase} label="Business profile" active />
            <SidebarItem icon={Bell} label="Notifications" />
            <SidebarItem icon={Calendar} label="Analytics dashboard" />
            <SidebarItem icon={FileText} label="Services" />
            <SidebarItem icon={CreditCard} label="Payments" />
            <SidebarItem icon={LogOut} label="Logout" />
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <HelpCircle size={18} />
            <span className="text-sm">Help Center</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Home</a>
            <a href="#" className="hover:text-gray-900">About us</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Saved Place</a>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2">
              <User size={18} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Business profile</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <User size={16} />
              View profile
            </button>
          </div>

          {/* Completion Status Card */}
          <div className="bg-[#FFF5EE] border border-[#FFE4D6] rounded-xl p-6 flex flex-col md:flex-row items-start gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray="85, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
                  85%
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Profile completion</p>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-gray-800 mb-3">Completion profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <CheckboxItem label="Confirm your location" checked />
                <CheckboxItem label="Add social links" checked />
                <CheckboxItem label="Add business description" checked />
                <CheckboxItem label="Add business hours" checked />
                <CheckboxItem label="Upload cover image" checked={false} />
                <CheckboxItem label="Add services" checked={true} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 flex gap-6 overflow-x-auto pb-0">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Content */}
          <div className="mt-6">
            {activeTab === 'General info' && <GeneralInfoTab />}
            {activeTab === 'Gallery' && <GalleryTab />}
            {activeTab === 'Location' && <LocationTab />}
            {activeTab === 'Invoice & Estimates' && <InvoiceEstimatesTab />}
            {activeTab === 'Team' && <TeamTab />}
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-12 py-8 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">LS</span>
                </div>
                <span className="font-bold text-sm tracking-tight">LOCALSPOT</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">1234 Street Name, City, State, 12345</p>
              <p className="text-xs text-gray-500">hello@localspot.com</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-3">Explore</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Home</a></li>
                <li><a href="#" className="hover:text-gray-900">About us</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact us</a></li>
                <li><a href="#" className="hover:text-gray-900">Saved Place</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">For Business</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Business profile</a></li>
                <li><a href="#" className="hover:text-gray-900">Analytics</a></li>
                <li><a href="#" className="hover:text-gray-900">Payments</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Legal & Privacy</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <p>© 2024 Localspot. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600">Terms of Service</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default BusinessProfile;