export type TabType = 'tab-monitor' | 'tab-logs' | 'tab-specs' | 'tab-wiring';

export interface Vehicle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  plate: string;
  radarTriggered: boolean;
  cameraTriggered: boolean;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  plate: string;
  speed: number;
  limit: number;
  isOverspeed: boolean;
  camera: string;
  imageUrl?: string;
}

export interface CameraSpec {
  id: string;
  name: string;
  brand: string;
  type: string;
  sensor: string;
  isGlobalShutter: boolean;
  triggerLatency: string;
  storage: string;
  estPrice: string;
  features: string[];
}
