import { NativeModules, DeviceEventEmitter, EmitterSubscription } from 'react-native';

// Get modules directly by name (matching getName() return values)
const BarometerModule = NativeModules.BarometerModule;
const LevelModule = NativeModules.LevelModule;
const LightMeterModule = NativeModules.LightMeterModule;
const CompassModule = NativeModules.CompassModule;
const SoundMeterModule = NativeModules.SoundMeterModule;
const ProximityModule = NativeModules.ProximityModule;
const GravityModule = NativeModules.GravityModule;

// Debug: Log all available native modules and sensor modules
if (__DEV__) {
  console.log('Available Native Modules:', Object.keys(NativeModules));
  console.log('Sensor Modules:', {
    BarometerModule: !!BarometerModule,
    LevelModule: !!LevelModule,
    LightMeterModule: !!LightMeterModule,
    CompassModule: !!CompassModule,
    SoundMeterModule: !!SoundMeterModule,
    ProximityModule: !!ProximityModule,
    GravityModule: !!GravityModule,
  });
}

// Barometer types
export interface BarometerData {
  pressure: number; // hPa
}

// Level types
export interface LevelData {
  x: number;
  y: number;
  z: number;
  pitch: number; // degrees
  roll: number; // degrees
}

// LightMeter types
export interface LightMeterData {
  lux: number;
}

// Compass types
export interface CompassData {
  azimuth: number; // degrees (0-360)
}

// SoundMeter types
export interface SoundMeterData {
  decibels: number;
  amplitude: number;
}

// Proximity types
export interface ProximityData {
  distance: number; // cm (binary sensor: 0 or maxRange, e.g., 5cm)
}

// Gravity types
export interface GravityData {
  x: number; // m/s²
  y: number; // m/s²
  z: number; // m/s²
  magnitude: number; // m/s² (sqrt(x² + y² + z²))
}

// Event listener types
export type BarometerListener = (data: BarometerData) => void;
export type LevelListener = (data: LevelData) => void;
export type LightMeterListener = (data: LightMeterData) => void;
export type CompassListener = (data: CompassData) => void;
export type SoundMeterListener = (data: SoundMeterData) => void;
export type ProximityListener = (data: ProximityData) => void;
export type GravityListener = (data: GravityData) => void;

// Sensor module classes
class SensorModuleBase {
  protected module: any;
  protected eventName: string;
  protected subscription: EmitterSubscription | null = null;

  constructor(module: any, eventName: string) {
    this.module = module;
    this.eventName = eventName;
  }

  startListening() {
    if (!this.module) {
      console.warn(`Sensor module is not available. Make sure the native module is properly registered.`);
      return;
    }
    if (typeof this.module.startListening !== 'function') {
      console.warn(`startListening is not a function on module:`, this.module);
      return;
    }
    this.module.startListening();
  }

  stopListening() {
    if (!this.module) {
      return;
    }
    if (typeof this.module.stopListening === 'function') {
      this.module.stopListening();
    }
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  protected addListener(listener: (data: any) => void, eventName: string) {
    // Remove existing subscription if any
    if (this.subscription) {
      this.subscription.remove();
    }
    // Use DeviceEventEmitter directly instead of NativeEventEmitter
    this.subscription = DeviceEventEmitter.addListener(eventName, listener);
  }
}

export class BarometerSensor extends SensorModuleBase {
  constructor() {
    super(BarometerModule, 'BarometerData');
  }

  addListener(listener: BarometerListener) {
    super.addListener(listener, 'BarometerData');
  }
}

export class LevelSensor extends SensorModuleBase {
  constructor() {
    super(LevelModule, 'LevelData');
  }

  addListener(listener: LevelListener) {
    super.addListener(listener, 'LevelData');
  }
}

export class LightMeterSensor extends SensorModuleBase {
  constructor() {
    super(LightMeterModule, 'LightMeterData');
  }

  addListener(listener: LightMeterListener) {
    super.addListener(listener, 'LightMeterData');
  }
}

export class CompassSensor extends SensorModuleBase {
  constructor() {
    super(CompassModule, 'CompassData');
  }

  addListener(listener: CompassListener) {
    super.addListener(listener, 'CompassData');
  }
}

export class SoundMeterSensor extends SensorModuleBase {
  constructor() {
    super(SoundMeterModule, 'SoundMeterData');
  }

  addListener(listener: SoundMeterListener) {
    super.addListener(listener, 'SoundMeterData');
  }

  async checkPermission(): Promise<boolean> {
    if (!this.module) {
      return false;
    }
    if (typeof this.module.checkPermission !== 'function') {
      return false;
    }
    try {
      return await this.module.checkPermission();
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}

export class ProximitySensor extends SensorModuleBase {
  constructor() {
    super(ProximityModule, 'ProximityData');
  }

  addListener(listener: ProximityListener) {
    super.addListener(listener, 'ProximityData');
  }
}

export class GravitySensor extends SensorModuleBase {
  constructor() {
    super(GravityModule, 'GravityData');
  }

  addListener(listener: GravityListener) {
    super.addListener(listener, 'GravityData');
  }
}

