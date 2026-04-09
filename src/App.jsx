import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  MapPin, 
  Compass, 
  User, 
  Plane, 
  Sparkles, 
  Clock, 
  CloudRain, 
  ChevronRight,
  Menu,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Coffee,
  Camera,
  Map as MapIcon,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Navbar component renders the app header, navigation links, and user menu.
const Navbar = ({ onViewChange, currentView, user, onSignIn, onSignOut, onSwitchAccount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-on-surface/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
            <Compass className="text-on-primary w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-on-surface">
            WanderMind <span className="text-primary tracking-widest text-xs uppercase ml-1 opacity-80">AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => onViewChange('landing')}
            className={`transition-colors font-medium ${currentView === 'landing' ? 'text-primary' : 'hover:text-primary opacity-70'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onViewChange('planning')}
            className={`transition-colors font-medium ${currentView === 'planning' ? 'text-primary' : 'hover:text-primary opacity-70'}`}
          >
            My Trips
          </button>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-all active:scale-95"
              >
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-72 glass border border-on-surface/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-5 border-b border-on-surface/10 bg-on-surface/5">
                        <p className="font-bold text-on-surface truncate">{user.displayName}</p>
                        <p className="text-sm text-on-surface/60 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => { onViewChange('profile'); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium"
                        >
                          <User size={18} />
                          <span>Profile</span>
                        </button>
                        <button 
                          onClick={() => { onSwitchAccount(); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left font-medium"
                        >
                          <RefreshCw size={18} />
                          <span>Switch Account</span>
                        </button>
                        <button 
                          onClick={() => { onSignOut(); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-left font-medium"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="hover:text-primary transition-colors font-medium opacity-70">Profile</button>
          )}
        </div>
        
        <div className="hidden md:flex items-center">
          {!user && (
            <button 
              onClick={onSignIn}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Sign In
            </button>
          )}
        </div>

        <button className="md:hidden text-on-surface" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 glass border-b border-on-surface/10 p-6 flex flex-col gap-6"
          >
            <button onClick={() => {onViewChange('landing'); setIsOpen(false)}} className="text-xl font-medium text-left">Home</button>
            <button onClick={() => {onViewChange('planning'); setIsOpen(false)}} className="text-xl font-medium text-left">My Trips</button>
            
            {user ? (
              <>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-on-surface/5">
                  <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-bold truncate">{user.displayName}</p>
                    <p className="text-sm text-on-surface/60 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => {onViewChange('profile'); setIsOpen(false)}} className="text-xl font-medium text-left">Profile</button>
                <button onClick={() => {onSwitchAccount(); setIsOpen(false)}} className="text-xl font-medium text-left">Switch Account</button>
                <button onClick={() => {onSignOut(); setIsOpen(false)}} className="text-xl font-medium text-left text-red-500">Logout</button>
              </>
            ) : (
              <>
                <button className="text-xl font-medium opacity-70 text-left">Profile</button>
                <button 
                  onClick={() => {onSignIn(); setIsOpen(false)}}
                  className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold"
                >
                  Sign In
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// FeatureCard renders an overview card on the landing page.
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="p-8 rounded-[2rem] bg-surface-container-low border border-on-surface/5 hover:border-primary/20 transition-all group lg:min-h-[320px]"
  >
    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
      <Icon className="text-primary w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-on-surface-variant leading-relaxed">
      {description}
    </p>
  </motion.div>
);

// DestinationCard displays a curated sample destination on the landing page.
const DestinationCard = ({ title, description, image, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    onClick={onClick}
    className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group cursor-pointer"
  >
    <img 
      src={image} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
    <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
      <h4 className="text-3xl font-bold mb-2 text-on-surface">{title}</h4>
      <p className="text-on-surface/80 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
        {description}
      </p>
      <div className="flex items-center text-primary font-bold group-hover:gap-2 transition-all">
        <span>Explore Plan</span>
        <ChevronRight size={20} />
      </div>
    </div>
  </motion.div>
);

// LandingPage contains the hero section and quick search UI.
const LandingPage = ({ onStartPlanning }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 text-white">
          <img 
            src="/assets/hero_bg.png" 
            className="w-full h-full object-cover brightness-50"
            alt="Cinematic Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/40 to-surface" />
        </div>

        <div className="relative z-10 max-w-5xl w-full text-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            AI-POWERED TRAVEL EXPERIENCES
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] text-on-surface"
          >
            Your AI Travel Companion — <br />
            <span className="text-primary italic">Plans That Adapt</span> in Real Time.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto glass p-2 rounded-[2.5rem] mt-12 border border-on-surface/10 shadow-2xl flex items-center gap-2"
          >
            <div className="flex-1 flex items-center px-6 gap-3">
              <Search className="text-primary w-6 h-6 whitespace-nowrap" />
              <input 
                type="text" 
                placeholder="Where does your mind want to wander?" 
                className="w-full bg-transparent border-none outline-none py-4 text-lg placeholder:text-on-surface/30 text-on-surface"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button 
              onClick={() => onStartPlanning(searchValue)}
              className="px-8 py-4 rounded-[2rem] bg-primary text-on-primary font-bold text-lg hover:brightness-110 transition-all whitespace-nowrap"
            >
              Generate Itinerary
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 text-on-surface/50 font-medium italic flex items-center justify-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            AI is ready: "Considering your preference for quiet sunsets and boutique stays..."
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={MapPin}
            title="Personalized Plans"
            description="Every suggestion is tuned to your unique travel fingerprint—from hidden local gems to your preferred pacing."
            delay={0}
          />
          <FeatureCard 
            icon={Clock}
            title="Live Adaptation"
            description="Flight delayed? Weather changed? WanderMind re-routes your entire day instantly to ensure no moment is wasted."
            delay={0.2}
          />
          <FeatureCard 
            icon={Sparkles}
            title="Smart Recommendations"
            description="Deep-learning insights that predict what you'll love before you even know it exists, from bistros to viewpoints."
            delay={0.4}
          />
        </div>
      </section>

      <section className="py-32 px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black mb-6">Wander Without Limits.</h2>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                Our AI analyzes millions of data points to curate destinations that match your current mood and season.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <DestinationCard 
              title="Cinque Terre Escape"
              description="Experience the rugged beauty of the Italian Riviera with an AI-curated hiking and dining circuit."
              image="/assets/cinque_terre.png"
              delay={0}
              onClick={() => onStartPlanning('Cinque Terre')}
            />
            <DestinationCard 
              title="Kyoto Zen Days"
              description="Discover the tranquil temples and autumnal colors of Japan's historic capital with a personalized Zen path."
              image="/assets/kyoto.png"
              delay={0.2}
              onClick={() => onStartPlanning('Kyoto')}
            />
          </div>
        </div>
      </section>
    </>
  );
};

// PlanningPage renders generated itinerary details and allows pace selection.
const PlanningPage = ({ destination, markdown }) => {
  const [pace, setPace] = useState('Moderate');
  
  if (!markdown) return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
      <div className="p-12 glass rounded-[2rem] border border-on-surface/10">
        <Sparkles size={48} className="text-primary mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl font-black mb-4">No content yet</h2>
        <p className="text-on-surface/60">Something went wrong or the AI returned an empty response.</p>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 border-r border-on-surface/5 pr-0 lg:pr-12">
          <div className="sticky top-32">
            <h2 className="text-4xl font-black mb-4">Planning Butler</h2>
            <div className="glass p-6 rounded-3xl border border-primary/20 mb-8 bg-primary/5">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="text-on-primary" />
                </div>
                <p className="font-medium text-lg leading-snug">
                  Excellent choice! {destination} is magical. I've built your perfect itinerary.
                </p>
              </div>
              <div className="flex items-start gap-2 text-primary/80 bg-primary/10 p-4 rounded-2xl text-sm">
                <Lightbulb size={18} className="shrink-0 mt-0.5" />
                <p><span className="font-bold">AI Tip:</span> {pace} pace allows for a balance of landmarks and hidden gems without burnout.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-on-surface/40 mb-4">Travel Pace</h4>
                <div className="flex gap-2">
                  {['Relaxed', 'Moderate', 'Fast'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setPace(p)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${pace === p ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-on-surface/40 mb-4">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {['Culinary', 'Traditional Arts', 'Modern Tech', 'Photography'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-surface-container border border-on-surface/5 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-12 relative rounded-[3rem] overflow-hidden aspect-[21/9]">
            <img src={`https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop`} className="w-full h-full object-cover" alt={destination} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent " />
            <div className="absolute bottom-10 left-10">
              <h1 className="text-5xl md:text-6xl font-black text-on-surface">{destination} Escape</h1>
              <p className="text-xl text-on-surface/70 mt-2 font-medium">3-Day AI Curated Journey</p>
            </div>
          </div>

          <div id="itinerary-container" className="prose prose-invert prose-p:text-on-surface/80 prose-headings:text-on-surface prose-strong:text-primary max-w-none glass p-10 rounded-[3rem] border border-on-surface/5">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  // App state variables
  const [view, setView] = useState('landing');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [itineraryMarkdown, setItineraryMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [backendProfile, setBackendProfile] = useState(null);

  // Subscribe to Firebase auth state changes and sync user profile data.
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Get the ID token to authenticate with the backend
          const idToken = await currentUser.getIdToken();
          
          // Fetch/Sync profile from backend
          const response = await fetch('http://localhost:3001/api/profile', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setBackendProfile(data);
          }
          
          // Legacy frontend-only sync (kept for compatibility)
          const userRef = doc(db, 'users', currentUser.uid);
          const userData = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            lastLogin: new Date()
          };
          await setDoc(userRef, userData, { merge: true });
        } catch (err) {
          console.error("Profile sync error:", err);
        }
      } else {
        setUser(null);
        setBackendProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);


  // Sign in the user through Firebase Google sign-in.
  const handleSignIn = async (isSwitch = false) => {
    try {
      if (isSwitch) {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
      } else {
        googleProvider.setCustomParameters({ prompt: undefined });
      }
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Auth Error:", error);
      alert(`Auth Error: ${error.message}`);
    }
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setView('landing');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Trigger itinerary generation through the backend API.
  const handleStartPlanning = async (dest) => {
    const destination = dest || 'Paris';
    setSelectedDestination(destination);
    setIsLoading(true);
    setError(null);
    setView('planning');
    window.scrollTo(0, 0);

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }
      
      const data = await response.json();
      setItineraryMarkdown(data.markdown);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden">
      <Navbar 
        onViewChange={setView} 
        currentView={view} 
        user={user}
        onSignIn={() => handleSignIn(false)}
        onSignOut={handleSignOut}
        onSwitchAccount={() => handleSignIn(true)}
      />
      
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onStartPlanning={handleStartPlanning} />
          </motion.div>
        ) : view === 'profile' ? (
          <motion.div 
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-20 px-6 max-w-4xl mx-auto"
          >
            <div className="glass p-12 rounded-[3rem] border border-on-surface/10 text-center">
              <div className="w-32 h-32 rounded-full border-4 border-primary mx-auto mb-8 overflow-hidden">
                <img src={user?.photoURL} alt={user?.displayName} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-4xl font-black mb-2">{user?.displayName}</h2>
              <p className="text-xl text-on-surface/60 mb-8">{user?.email}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="p-6 rounded-2xl bg-on-surface/5 border border-on-surface/5">
                  <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">Member Since</h4>
                  <p className="text-lg font-medium">{new Date(user?.metadata?.creationTime).toLocaleDateString()}</p>
                </div>
                <div className="p-6 rounded-2xl bg-on-surface/5 border border-on-surface/5">
                  <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">Account Type</h4>
                  <p className="text-lg font-medium text-primary">
                    {backendProfile?.accountType || 'AI Explorer (Free)'}
                  </p>
                </div>
              </div>
              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-left">

                <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Traveler Stats
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-on-surface">{backendProfile?.tripsGenerated || 0}</p>
                    <p className="text-xs text-on-surface/40 font-bold uppercase">Trips</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-on-surface">{backendProfile?.countriesVisited || 0}</p>
                    <p className="text-xs text-on-surface/40 font-bold uppercase">Places</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-on-surface">{backendProfile?.savedPins || 0}</p>
                    <p className="text-xs text-on-surface/40 font-bold uppercase">Saved</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('landing')}
                className="mt-12 px-8 py-3 rounded-full bg-primary text-on-primary font-bold hover:brightness-110 transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="planning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoading ? (
              <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                   <Sparkles className="text-primary animate-pulse" size={32} />
                </div>
                <h2 className="text-4xl font-black mb-4">Curating Your Experience</h2>
                <p className="text-on-surface/60 max-w-md">Our AI is analyzing {selectedDestination}'s local gems and weather patterns to build your perfect 3-day journey...</p>
              </div>
            ) : error ? (
              <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-8">
                   <X className="text-red-500" size={32} />
                </div>
                <h2 className="text-4xl font-black mb-4">Oops! Something went wrong</h2>
                <p className="text-red-500/80 max-w-md mb-8">{error}</p>
                <button 
                  onClick={() => onViewChange('landing')}
                  className="px-8 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors font-bold"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <PlanningPage destination={selectedDestination} markdown={itineraryMarkdown} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-20 px-6 border-t border-on-surface/10 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="text-on-primary w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold">WanderMind AI</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-on-surface/50 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>

          <div className="text-on-surface/30 text-sm">
            © 2026 WanderMind AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
