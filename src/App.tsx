import { supabase } from './supabase'
import { useState, useEffect, useRef } from 'react';
import { Header, BottomNav } from '@/src/components/layout/Navigation';
import { Dashboard } from '@/src/components/screens/Dashboard';
import { Advisor } from '@/src/components/screens/Advisor';
import { Alerts } from '@/src/components/screens/Alerts';
import { Settings } from '@/src/components/screens/Settings';
import { Subscriptions } from '@/src/components/screens/Subscriptions';
import { NavTab } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {

  // ─── UI STATE ───────────────────────────────────────────────
  // Controls which screen is visible and the dark mode toggle
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ─── DATA STATE ──────────────────────────────────────────────
  // All live data fetched from Supabase — passed down as props to screens
  const [sensorData, setSensorData] = useState<any[]>([])
  const [alertsData, setAlertsData] = useState<any[]>([])
  const [prescriptionData, setPrescriptionData] = useState<any[]>([])
  const [subscriptionData, setSubscriptionData] = useState<any[]>([])

  // ─── SENSORS REF ─────────────────────────────────────────────
  // useRef keeps sensors accessible inside Realtime callbacks
  // without needing them in state (avoids re-renders)
  const sensorsRef = useRef<any[]>([])


  // ─── DATA FETCHING + REALTIME SETUP ──────────────────────────
  // Runs once on mount. Fetches all initial data, then opens
  // a Realtime channel to listen for live changes from Supabase.
  useEffect(() => {

    let isActive = true
    let channel: any = null

    // ── INITIAL DATA FETCH ──────────────────────────────────────
    // Pulls all tables on first load. Must complete BEFORE
    // Realtime channel subscribes — so sensorsRef is populated
    // and Realtime events can be enriched with sensor_type + unit.
    const fetchSensorData = async () => {

      // Fetch all sensors (used to join sensor_type onto readings)
      const { data: sensors, error: sensorsError } = await supabase
        .from('sensors')
        .select('*')

      // Fetch sensor readings — newest first so dedup keeps latest value
      const { data: readings, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('recorded_at', { ascending: false })

      // Fetch alerts, prescriptions, subscriptions
      const { data: alerts, error: alertsError } = await supabase
        .from('Alerts')
        .select('*')

        const { data: alertsRows, error: alertsRowsError } = await supabase
        .from('Alerts')
        .select('*')


      const { data: prescriptions, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*')

      const { data: subs, error: subsError } = await supabase
        .from('Subscriptions')
        .select('*')

      // Stop if any fetch failed
      if (sensorsError || readingsError || alertsError || prescriptionsError || subsError) {
        console.error('Fetch error:', sensorsError || readingsError || alertsError || prescriptionsError || subsError)
        return
      }

      

      // ── JOIN: attach sensor_type + unit to each reading ────────
      // Sensor readings only have sensor_id — we join sensors table
      // to get the human-readable sensor_type (ph, moisture, etc.)
      const combined = readings.map(reading => {
        const sensor = sensors.find(s => s.id === reading.Sensor_id)
        return {
          ...reading,
          sensor_type: sensor?.Sensor_type,
          unit: sensor?.unit
        }
      })

      // ── DEDUP: keep only the latest reading per sensor type ─────
      // Since readings are ordered newest first, the first time we
      // see a sensor_type in reduce = most recent value. We keep it,
      // skip duplicates. Dashboard always shows current readings.
      const latest = combined.reduce((acc, curr) => {
        if (!acc.find(r => r.sensor_type === curr.sensor_type)) {
          acc.push(curr)
        }
        return acc
      }, [])

      // ── POPULATE STATE + REF ────────────────────────────────────
      setSensorData(latest)
      setAlertsData(alertsRows)
      setPrescriptionData(prescriptions)
      setSubscriptionData(subs)

      // Store sensors in ref so Realtime callbacks can access them
      // without causing re-renders or stale closure issues
      sensorsRef.current = sensors
    }

    // ── RUN SETUP ───────────────────────────────────────────────
    // Awaits fetch before subscribing — ensures sensorsRef is
    // populated before any Realtime event fires
    const run = async () => {
      await fetchSensorData()
      if (!isActive) return

      // Remove any stale channels from prior HMR reloads
      supabase.getChannels().forEach((existingChannel) => {
        if (existingChannel.topic === 'realtime:farmi-realtime') {
          supabase.removeChannel(existingChannel)
        }
      })

      // ── REALTIME CHANNEL ───────────────────────────────────────
      // Opens a WebSocket connection to Supabase.
      // Listens for INSERT events on key tables and updates
      // state instantly — no page refresh needed.
      channel = supabase
        .channel('farmi-realtime')

        // New sensor reading inserted → enrich + replace old value
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
          (payload) => {
            // Look up sensor metadata from ref (populated before subscribe)
            const sensor = sensorsRef.current.find(s => s.id === payload.new.Sensor_id)
            const enriched = {
              ...payload.new,
              sensor_type: sensor?.Sensor_type,
              unit: sensor?.unit
            }
            // Replace the old reading for this sensor_type with the new one
            // Prevents stale values showing on Dashboard
            setSensorData(prev => {
              const filtered = prev.filter(r => r.sensor_type !== enriched.sensor_type)
              return [enriched, ...filtered]
            })
          }
        )

        // New alert inserted → append to alerts list
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Alerts' },
          (payload) => {
            setAlertsData(prev => [...prev, payload.new])
          }

          
        )

        // New prescription inserted → append to prescriptions list
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prescriptions' },
          (payload) => {
            setPrescriptionData(prev => [...prev, payload.new])
          }
        )

        // New subscription inserted → append to subscriptions list
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Subscriptions' },
          (payload) => {
            setSubscriptionData(prev => [...prev, payload.new])
          }
        )

        .subscribe((status) => {
          console.log('Realtime status:', status)
        })
    }

    run()

    // ── CLEANUP ──────────────────────────────────────────────────
    // When component unmounts, close the Realtime channel
    // Prevents memory leaks and duplicate subscriptions
    return () => {
      isActive = false
      if (channel) supabase.removeChannel(channel)
    }

  }, []) // ← empty array = runs once on mount only


  // ─── DARK MODE ───────────────────────────────────────────────
  // Adds/removes 'dark' class on <html> when toggle changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  // ─── SCREEN RENDERER ─────────────────────────────────────────
  // Returns the correct screen component based on active tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':     return <Dashboard sensorData={sensorData} />;
      case 'advisor':  return <Advisor sensorData={sensorData} alertsData={alertsData} />;
      case 'alerts':   return <Alerts alertsData={alertsData} />;
      case 'subs':     return <Subscriptions subscriptionData={subscriptionData} />;
      case 'settings': return <Settings isDarkMode={isDarkMode} onDarkModeToggle={setIsDarkMode} />;
      default:         return <Dashboard sensorData={sensorData} />;
    }
  };


  // ─── RENDER ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32 transition-colors duration-500 bg-surface text-on-surface">

      {/* Top header bar */}
      <Header />

      {/* Main content area — animates between screens */}
      <main className="max-w-5xl mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.1] }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation — switches active tab */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

    </div>
  );
}