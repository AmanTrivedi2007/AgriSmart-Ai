export type NavTab = 'home' | 'diagnosis' | 'advisor' | 'alerts' | 'subs' | 'settings';

export const SENSOR_DATA = [
  { id: 'temp', name: 'Ambient Temp', node: 'Node 04-A', icon: 'Thermometer', active: true },
  { id: 'water', name: 'Root Hydration', node: 'Node 04-B', icon: 'Droplets', active: true },
  { id: 'light', name: 'PAR Intensity', node: 'Node 02-L', icon: 'Sun', active: true },
  { id: 'co2', name: 'CO2 Saturation', node: 'Node 09-G', icon: 'Wind', active: false },
  { id: 'ph', name: 'pH Balance', node: 'Node 05-H', icon: 'Beaker', active: true },
  { id: 'vpd', name: 'VPD Index', node: 'Node 01-F', icon: 'CloudRain', active: false },
];

export const ALERTS = [
  {
    id: 1,
    priority: 'critical',
    title: 'Your plant is thirsty 💧',
    time: '2m ago',
    description: 'Soil moisture in Section A (Tomato Vines) has dropped to 12%. Immediate irrigation is recommended to prevent wilting.',
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 2,
    priority: 'high',
    title: 'Uninvited guests spotted 🐛',
    time: '45m ago',
    description: "AI analysis detected potential Aphid activity on the Kale patch. Let's handle this before they multiply!",
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=300&auto=format&fit=crop'
  }
];

export const PLANS = [
  {
    name: 'Silver',
    description: 'Essential monitoring for small family farms.',
    price: '3,000',
    features: ['7-Day Data History', '10 AI Analysis / Month', 'Standard Email Support'],
    isCurrent: true
  },
  {
    name: 'Gold',
    description: 'Precision tools for growing commercial enterprises.',
    price: '4,000',
    features: ['30-Day Data History', 'Unlimited AI Analysis', 'Priority 24/7 Chat Support', 'Satellite Crop Stress Mapping'],
    popular: true
  },
  {
    name: 'Diamond',
    description: 'Industrial scale analytics for cooperatives.',
    price: '7,000',
    features: ['Lifetime Data Archive', 'Custom AI Models', 'Dedicated Account Manager', 'API Infrastructure Access']
  }
];
