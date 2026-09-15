import { SENSOR_DATA, PLANS } from '@/src/constants';
import { Tractor, BellRing, Search, ArrowRight, CheckCircle2, Moon, Sun, Info, Check } from 'lucide-react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onDarkModeToggle: (val: boolean) => void;
}

export function Settings({ isDarkMode, onDarkModeToggle }: SettingsProps) {
  return (
    <div className="space-y-16 pb-12">
      {/* Header */}
      <header className="mb-12">
        <h2 className="font-headline font-extrabold text-4xl tracking-tighter text-primary mb-2">Settings</h2>
        <p className="text-on-surface-variant font-medium">Fine-tune your autonomous cultivation parameters.</p>
      </header>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Farm Profile */}
        <section className="md:col-span-8 bg-surface-container-low rounded-[2rem] p-8 flex flex-col gap-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline font-bold text-2xl text-on-surface">Farm Profile</h3>
              <p className="text-sm text-on-surface-variant">Core identity and infrastructure details.</p>
            </div>
            <span className="p-3 bg-surface-container-lowest rounded-2xl text-primary shadow-sm">
              <Tractor size={28} />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <InputField label="Farm Name" value="Green Horizon Acres" />
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Setup Type</label>
              <select className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium">
                <option>Hydroponic Vertical Stack</option>
                <option>Aeroponic Chamber</option>
                <option>Soil-based Greenhouse</option>
              </select>
            </div>
            <InputField label="Plant Count" value="1240" type="number" />
            <InputField label="Main Crop" value="Heirloom Basil & Kale" />
          </div>

          <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-6 p-4 bg-surface-container-highest/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant shadow-sm border border-surface">
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="font-bold text-[10px] uppercase tracking-widest text-on-surface">Dark Mode</span>
              <div 
                onClick={() => onDarkModeToggle(!isDarkMode)}
                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${isDarkMode ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
            <button className="w-full sm:w-auto bg-primary text-white px-10 py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all text-sm">
              Save Profile
            </button>
          </div>
        </section>

        {/* Alert Logic */}
        <section className="md:col-span-4 bg-tertiary-container rounded-[2rem] p-8 text-white flex flex-col gap-8 shadow-xl">
          <div className="flex items-center gap-3">
            <BellRing size={24} />
            <h3 className="font-headline font-bold text-xl">Alert Logic</h3>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center p-4 bg-black/10 rounded-2xl">
              <span className="font-bold text-sm">Push Notifications</span>
              <div className="w-12 h-6 bg-secondary-container rounded-full relative p-1">
                <div className="absolute right-1 w-4 h-4 bg-primary rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Sensitivity</label>
                <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-1 rounded tracking-tighter">High</span>
              </div>
              <input type="range" className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" defaultValue={85} />
              <div className="flex gap-2 items-start opacity-60 italic text-[10px] leading-relaxed">
                <Info size={12} className="mt-0.5 shrink-0" />
                Higher sensitivity generates more frequent preventative diagnostics.
              </div>
            </div>
          </div>

          <div className="mt-auto h-32 rounded-2xl overflow-hidden relative group">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop" 
              alt="Analytics view" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary px-2.5 py-1 rounded shadow-lg">Smart View</span>
            </div>
          </div>
        </section>

        {/* Sensor Management */}
        <section className="md:col-span-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
            <div>
              <h3 className="font-headline font-bold text-2xl text-on-surface">Sensor Management</h3>
              <p className="text-sm text-on-surface-variant">Update and monitor your hardware ecosystem.</p>
            </div>
            <button className="text-primary font-bold text-xs flex items-center gap-2 group tracking-widest uppercase">
              Scan for New Nodes 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SENSOR_DATA.map((sensor) => {
              const Icon = (LucideIcons as any)[sensor.icon] || LucideIcons.Zap;
              return (
                <div key={sensor.id} className="bg-surface-container-lowest p-6 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md transition-all group border border-surface-container cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-surface-container/50 text-secondary group-hover:bg-secondary-container group-hover:text-primary transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">{sensor.name}</h4>
                      <p className="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-wider">{sensor.node}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${sensor.active ? 'bg-primary text-white scale-100' : 'bg-surface-container scale-90 opacity-40'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function InputField({ label, value, type = "text" }: { label: string, value: string, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">{label}</label>
      <input 
        type={type} 
        defaultValue={value} 
        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-medium"
      />
    </div>
  );
}
