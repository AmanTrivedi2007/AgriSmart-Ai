import { Droplet, ArrowRight, Brain, Zap, Sun, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';

interface SingleAlert {
  id: string;
  created_at: string;
  Severity: string | null;
  Message: string | null;
  is_resolved: boolean | null;
}

interface AlertsProps {
  alertsData: SingleAlert[];
}

export function Alerts({ alertsData }: AlertsProps) {
  const activeAlerts = alertsData.filter((a) => !a.is_resolved);

  return (
    <div className="max-w-xl mx-auto space-y-12">
      {/* Header */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-error-container text-error px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
            </span>
            {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">Alerts & Insights</h1>
        <p className="text-on-surface-variant font-medium leading-relaxed">
          Keeping an eye on your garden's heartbeat. Here's what needs attention today.
        </p>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-primary/20">All Alerts</button>
        <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-container-highest transition-colors">Critical</button>
        <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-container-highest transition-colors">Normal</button>
      </div>

      {/* Alert List */}
      <div className="space-y-6">
        {alertsData.length === 0 ? (
          <div className="text-center text-on-surface-variant mt-10 py-16">
            <Zap size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No alerts right now</p>
            <p className="text-sm opacity-60 mt-1">Your farm is running smoothly</p>
          </div>
        ) : (
          alertsData.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`group relative bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border-l-8 ${alert.Severity === 'critical' ? 'border-error' : 'border-tertiary'
                } overflow-hidden transition-all duration-400 hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${alert.Severity === 'critical' ? 'bg-error-container text-error' : 'bg-tertiary-container text-white'
                    }`}>
                  {alert.Message?.toLowerCase().includes('light') ? (
  <Sun size={24} fill="yellow" />
) : alert.Message?.toLowerCase().includes('ph') ? (
  <FlaskConical size={24} fill="purple" />
) : (
  <Droplet size={24} fill="currentColor" />
)}
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${alert.Severity === 'critical' ? 'text-error' : 'text-tertiary'
                      }`}>
                      {alert.Severity ?? 'info'} Priority
                    </p>
                    <h3 className="text-xl font-bold text-on-surface">
                      {alert.Message ?? 'Farm Alert'}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">
                  {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${alert.is_resolved
                    ? 'bg-tertiary-container text-tertiary'
                    : 'bg-error-container text-error'
                  }`}>
                  {alert.is_resolved ? '✅ Resolved' : '🔴 Active'}
                </span>
                <button className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  View AI Advice
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Proactive Tip Card */}
      <section className="mt-12">
        <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Proactive Tip</span>
            <h3 className="text-2xl font-bold mb-3 leading-tight tracking-tight">Optimizing your <br />morning ritual</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-[240px]">
              Data suggests watering 30 minutes earlier tomorrow will reduce evaporation by 15%.
            </p>
            <button className="bg-white/20 backdrop-blur-md border border-surface-container-highest/30 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-primary transition-all">
              Apply Schedule
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none rotate-12">
            <Brain size={180} strokeWidth={1} />
          </div>
          <div className="absolute top-6 right-6 text-white/40">
            <Zap size={32} fill="currentColor" />
          </div>
        </div>
      </section>
    </div>
  );
}