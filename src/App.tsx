import { useState, useCallback, useRef } from 'react';
import { TabType, LogEntry } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MonitorTab } from './components/MonitorTab';
import { LogsTab } from './components/LogsTab';
import { SpecsTab } from './components/SpecsTab';
import { WiringTab } from './components/WiringTab';
import { SnapshotModal } from './components/SnapshotModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tab-monitor');
  const [roadLimit, setRoadLimit] = useState<number>(20);
  const [selectedCamera, setSelectedCamera] = useState<string>('TNO-7180RLP');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Stats Counters
  const [totalVehicleCount, setTotalVehicleCount] = useState<number>(0);
  const [overspeedCount, setOverspeedCount] = useState<number>(0);

  // Logs & Snapshots
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<LogEntry | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Real-time Header Violation Alert
  const [isViolationAlert, setIsViolationAlert] = useState<boolean>(false);
  const [lastViolationSpeed, setLastViolationSpeed] = useState<number | null>(null);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => !prev);
  }, []);

  const handleTriggerFlash = useCallback(() => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 350);
  }, []);

  const handleAddLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => [entry, ...prev]);
    if (entry.isOverspeed) {
      setLastViolationSpeed(entry.speed);
      setIsViolationAlert(true);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      alertTimerRef.current = setTimeout(() => {
        setIsViolationAlert(false);
      }, 3500);
    }
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleIncrementVehicleCount = useCallback(() => {
    setTotalVehicleCount((prev) => prev + 1);
  }, []);

  const handleIncrementOverspeedCount = useCallback(() => {
    setOverspeedCount((prev) => prev + 1);
  }, []);

  // Filter recent snapshots that have imageUrl
  const recentSnapshots = logs.filter((l) => Boolean(l.imageUrl)).slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased pb-16 md:pb-6">
      {/* Camera Shutter Flash Overlay */}
      <div
        id="flashOverlay"
        className={`fixed inset-0 pointer-events-none z-50 ${
          isFlashing ? 'shutter-flash' : 'opacity-0'
        }`}
      />

      {/* Top Header with live overspeed violation alert indicator */}
      <Header
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isViolationAlert={isViolationAlert}
        lastViolationSpeed={lastViolationSpeed}
      />

      {/* Navigation (Desktop & Mobile) */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-4">
        {activeTab === 'tab-monitor' && (
          <MonitorTab
            roadLimit={roadLimit}
            onSetRoadLimit={setRoadLimit}
            selectedCamera={selectedCamera}
            onSelectCamera={setSelectedCamera}
            isSoundEnabled={isSoundEnabled}
            totalVehicleCount={totalVehicleCount}
            overspeedCount={overspeedCount}
            recentSnapshots={recentSnapshots}
            onAddLog={handleAddLog}
            onIncrementVehicleCount={handleIncrementVehicleCount}
            onIncrementOverspeedCount={handleIncrementOverspeedCount}
            onOpenModal={setActiveModalItem}
            onTriggerFlash={handleTriggerFlash}
          />
        )}

        {activeTab === 'tab-logs' && (
          <LogsTab
            logs={logs}
            onClearLogs={handleClearLogs}
            onOpenModal={setActiveModalItem}
          />
        )}

        {activeTab === 'tab-specs' && <SpecsTab />}

        {activeTab === 'tab-wiring' && <WiringTab />}
      </main>

      {/* Detailed Snapshot Inspection Modal */}
      <SnapshotModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}
