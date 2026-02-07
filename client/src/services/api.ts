import axios from 'axios';

const BASE_URL = "http://localhost:8000";

export interface GameState {
  health: number;
  morale: number;
  trust: number;
  revenue: number;
  traffic: number;
  conversion_rate: number;
  average_order_value: number;
  current_level: number;
  status: 'ACTIVE' | 'VICTORY' | 'GAME_OVER' | 'REVIEW' | string;
  termination_details: { cause?: string; notes?: string };
  strategy_archetype: string;
  product_sense_score: number;
  last_prediction_results: any | null;
  tutorial_complete: boolean;
  player_name: string;
  job_title: string;
  history: any[];
  active_users: number;
}

export interface ContentOption {
  label: string;
  action_id: string;
  impact_hint: string;
  requires_prediction?: boolean;
}

export interface InboxItem {
  id: string;
  type: string;
  sender: string;
  subject: string;
  body: string;
  options: ContentOption[];
}

export interface AnalyticsData {
  funnel: Record<string, number>;
  sources: Record<string, number>;
  retention: number[][];
  history: { month: string; revenue: number; traffic: number; churn: number }[];
  time_series?: any[];
}

export interface Intervention {
  id: string;
  label: string;
  category: string;
  description: string;
  cost: Record<string, number>;
  efficacy: Record<string, number>;
}

const api = {
  startNewGame: async (name?: string) => {
    try {
      console.log("Calling /new-game...");
      const response = await axios.post(`${BASE_URL}/new-game`, { name });
      return response.data;
    } catch (error) {
      console.error("Error starting new game:", error);
      throw error;
    }
  },

  getState: async (sessionId: string): Promise<GameState> => {
    try {
      const response = await axios.get(`${BASE_URL}/state`, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting state:", error);
      throw error;
    }
  },
  
  executeTurn: async (sessionId: string, actionId: string, prediction?: Record<string, string>): Promise<GameState> => {
    try {
      const response = await axios.post(`${BASE_URL}/turn`, 
        { action_id: actionId, prediction },
        { headers: { 'X-Session-ID': sessionId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error executing turn:", error);
      throw error;
    }
  },

  getInbox: async (sessionId: string): Promise<InboxItem[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/inbox`, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting inbox:", error);
      throw error;
    }
  },

  getChats: async (sessionId: string): Promise<InboxItem[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/chats`, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting chats:", error);
      throw error;
    }
  },

  getAnalytics: async (sessionId: string): Promise<AnalyticsData> => {
    try {
      const response = await axios.get(`${BASE_URL}/analytics`, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting analytics:", error);
      throw error;
    }
  },

  getInterventions: async (sessionId: string): Promise<Intervention[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/interventions`, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error getting interventions:", error);
      throw error;
    }
  },

  executeIntervention: async (sessionId: string, actionId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/intervention`, 
        { action_id: actionId },
        { headers: { 'X-Session-ID': sessionId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error executing intervention:", error);
      throw error;
    }
  },

  nextLevel: async (sessionId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/next-level`, {}, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error advancing level:", error);
      throw error;
    }
  },

  commitStrategy: async (sessionId: string, focusId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/commit-strategy`, 
        { focus_id: focusId },
        { headers: { 'X-Session-ID': sessionId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error committing strategy:", error);
      throw error;
    }
  },

  resignGame: async (sessionId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/resign`, {}, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error resigning game:", error);
      throw error;
    }
  },

  completeTutorial: async (sessionId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/tutorial-complete`, {}, {
        headers: { 'X-Session-ID': sessionId }
      });
      return response.data;
    } catch (error) {
      console.error("Error completing tutorial:", error);
      throw error;
    }
  },

  makeDecision: async (sessionId: string, actionId: string, prediction?: Record<string, string>): Promise<GameState> => {
    return await api.executeTurn(sessionId, actionId, prediction);
  }
};

export default api;