const DB_NAME = 'prosim_telemetry_v1';
const STORE_NAME = 'events';
const DB_VERSION = 1;

export type TelemetryEventType = 
  | 'DECISION_START' 
  | 'DECISION_COMMIT' 
  | 'TAB_SWITCH' 
  | 'APP_OPEN' 
  | 'HOVER_ACTION';

export interface TelemetryEvent {
  id?: number;
  sessionId: string;
  type: TelemetryEventType;
  timestamp: number;
  turn: number;
  metadata: Record<string, any>;
}

class TelemetryService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('[Telemetry] IndexedDB initialized.');
        resolve();
      };

      request.onerror = (event) => {
        console.error('[Telemetry] DB initialization failed:', request.error);
        reject(request.error);
      };
    });
  }

  async logEvent(event: Omit<TelemetryEvent, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) {
      console.warn('[Telemetry] DB not ready. Retrying...');
      await this.init();
    }

    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(fullEvent);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllEvents(): Promise<TelemetryEvent[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const telemetry = new TelemetryService();
