import { Shield, Bell, Database, Globe, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Configure platform-wide parameters and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs (Sidebar style inside page) */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-primary-600 font-bold shadow-sm">
            <Globe className="w-5 h-5" />
            <span>General</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
            <Lock className="w-5 h-5" />
            <span>Security</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
            <Database className="w-5 h-5" />
            <span>Database & Backups</span>
          </button>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
              General Configuration
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Platform Name</label>
                  <input type="text" defaultValue="NovelThai" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Support Email</label>
                  <input type="email" defaultValue="support@novelthai.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Maintenance Mode</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900">Disable platform access</div>
                    <p className="text-xs text-slate-500">Redirect all users to a maintenance page</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button className="admin-button-primary px-8 py-3 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="admin-card border-rose-100">
            <h2 className="text-lg font-bold text-rose-600 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h2>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="text-sm font-bold text-rose-900 mb-1">Clear System Cache</div>
              <p className="text-xs text-rose-600 mb-4">This will force revalidation of all static pages and novel data.</p>
              <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                Clear Cache Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
