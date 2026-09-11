import { Droplet, Sun, Sprout, FlaskConical, Activity } from 'lucide-react';
import { motion } from 'motion/react';

type DashboardProps = {
  sensorData: any[]
}

export function Dashboard({ sensorData }: DashboardProps) {
  const ph = sensorData.find(s => s.sensor_type === 'ph')?.value
const moisture = sensorData.find(s => s.sensor_type === 'moisture')?.value
const light = sensorData.find(s => s.sensor_type === 'light')?.value
const temperature = sensorData.find(s => s.sensor_type === 'temperature')?.value
const water = sensorData.find(s => s.sensor_type === 'water')?.value
const humidity = sensorData.find(s => s.sensor_type === 'humidity')?.value
  return (
    <div className="space-y-12">
      {/* Hero Section: Health Circular Indicator */}
      <section className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-8"
        >
          {/* Background Track */}
          <div className="absolute inset-0 rounded-full bg-surface-container-high/50" />
          
          {/* Progress Indicator (Solid Filled Circle) */}
          <svg className="absolute inset-0 -rotate-90 w-full h-full">
            <circle
              className="text-primary-container"
              cx="50%"
              cy="50%"
              fill="currentColor"
              r="48%"
              stroke="none"
            />
          </svg>
          
          {/* Central Content */}
          <div className="text-center z-10 w-[80%] h-[80%] flex flex-col items-center justify-center text-white">
            <span className="font-headline font-black text-5xl md:text-6xl tracking-tighter">97%</span>
            <p className="font-headline font-bold text-white/90 text-sm mt-1 uppercase tracking-wider">Excellent Health</p>
            <div className="mt-6 px-4 py-1.5 glass-card rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              Optimal Growth
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center max-w-md">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Your Greenhouse is Thriving</h2>
          <p className="text-primary font-bold text-lg mt-2 text-balance leading-tight">
            AI analysis suggests a 12% yield increase compared to last cycle.
          </p>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Water Level */}
        <div className="md:col-span-1 bg-surface-container-low rounded-[2.5rem] p-8 flex flex-col items-center justify-between min-h-[360px] relative overflow-hidden">
          <div className="text-center">
            <Droplet className="text-tertiary mx-auto mb-2" size={32} />
            <h3 className="font-headline font-bold text-on-surface text-lg">Water Tank</h3>
          </div>
          
          <div className="w-24 h-48 bg-surface-container-highest rounded-3xl border-4 border-surface shadow-inner relative overflow-hidden flex items-end">
            <motion.div 
              initial={{ height: '0%' }}
              animate={{ height: `${water ?? 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full bg-gradient-to-t from-tertiary-container to-tertiary"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-2xl text-white drop-shadow-md">{water}%</span>
            </div>
          </div>
          
          <p className="font-bold text-tertiary text-sm">Next refill: 3 days</p>
        </div>

        {/* Light Intensity */}
        <div className="md:col-span-2 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl asymmetric-shadow" style={{ background: 'linear-gradient(135deg, #F6C445 0%, #FFF3C4 100%)' }}>
          <div className="flex justify-between items-start text-[#5D4037]">
            <div>
              <Sun size={40} fill="currentColor" fillOpacity={1} className="mb-2" />
              <h3 className="font-headline font-extrabold text-2xl tracking-tight">Light Intensity</h3>
            </div>
            <div className="bg-[#5D4037]/10 backdrop-blur-md px-4 py-2 rounded-2xl">
              <span className="font-black text-xl">{light} LUX</span>
            </div>
          </div>
          
          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="flex-1 h-32 bg-[#5D4037]/5 rounded-2xl flex items-end p-2 gap-1">
              {[40, 60, 90, 70, 50, 30].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-[#5D4037]/30 rounded-full"
                />
              ))}
            </div>
            <div className="text-right text-[#5D4037]">
              <span className="block font-black text-4xl">74%</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-80">Efficiency</span>
            </div>
          </div>
        </div>

        {/* Moisture */}
        <div className="md:col-span-1 bg-surface-container-lowest rounded-[2.5rem] p-8 flex flex-col justify-between border border-outline-variant/10 shadow-sm relative overflow-hidden group">
          {/* Decorative Moisture Visual */}
          <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-[0.05] dark:opacity-[0.1] translate-y-10 group-hover:translate-y-5 transition-transform duration-1000">
            <svg viewBox="0 0 1440 320" className="w-full h-full fill-secondary">
              <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="relative z-10">
            <Sprout className="text-secondary mb-4" size={32} />
            <h3 className="font-headline font-bold text-on-surface text-lg leading-tight">Soil Moisture</h3>
            <p className="text-on-surface-variant text-sm mt-1 italic">Optimal Range</p>
          </div>
          
          <div className="mt-6 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-5xl text-primary tracking-tighter">{moisture}</span>
              <span className="text-on-surface-variant font-bold">%</span>
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${moisture ?? 0}%` }}
                className="bg-primary h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* pH Status */}
        <div className="md:col-span-2 bg-surface-container-high rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-surface-container-highest transition-colors cursor-pointer group">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary">
              <FlaskConical size={32} />
            </div>
            <div>
              <h3 className="font-headline font-bold text-on-surface text-xl">pH Status</h3>
              <p className="text-primary font-bold">pH {ph} - Optimal</p>
            </div>
          </div>
          
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-surface-container-high ${i === 1 ? 'bg-tertiary-container' : i === 2 ? 'bg-primary-container' : 'bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold'}`}>
                {i === 3 && '+'}
              </div>
            ))}
          </div>
        </div>

        {/* Nutrient Card */}
        <div className="md:col-span-2 bg-surface-container-low rounded-[2.5rem] p-8 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Activity className="text-tertiary" size={32} />
            <div>
              <span className="block text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Nutrient Intake</span>
              <span className="font-headline font-extrabold text-2xl text-on-surface">Bio-Active</span>
            </div>
          </div>
          <div className="h-12 w-24 overflow-hidden rounded-xl bg-surface-container-highest">
            <img 
              alt="Nutrient visual" 
              className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 transition-all duration-500"
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=100&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <section className="bg-surface-container-low rounded-[3rem] p-10 ambient-lift relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <div className="w-16 h-16 bg-surface-container-lowest rounded-3xl flex items-center justify-center text-primary mb-6 shadow-sm">
              <Activity size={32} />
            </div>
            <h2 className="font-headline text-2xl font-black text-on-surface leading-tight">Plant Growth (7 Days)</h2>
            <p className="mt-4 text-on-surface-variant leading-relaxed text-sm">
              AI analysis confirms stable biomass accumulation across all nodes.
            </p>
          </div>
          
          <div className="md:w-2/3 w-full h-48 flex items-end justify-between gap-3 px-2">
            {[40, 55, 45, 70, 65, 85, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className="w-full bg-primary-container/80 rounded-t-xl"
                />
                <span className="text-[10px] font-bold text-on-surface-variant/40 mt-3 uppercase tracking-tighter">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
