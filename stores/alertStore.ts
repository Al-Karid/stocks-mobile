import { AlertData } from "@/types/alerts";
import { create } from "zustand";

interface AlertStore {
    alerts: AlertData[] | null;
    fetchAlerts: () => Promise<AlertData[]>;
    addAlert: (alert: AlertData) => void;
    removeAlert: (id: number) => void;
    toggleAlertState: (id: number) => void;
}

const mokeAlerts: AlertData[] = [
    { id: 1, stock: 'SOGC', name: "Société de Gestion du Coton", type: 'above', value: 5800, enabled: true },
    { id: 2, stock: 'BOAS', name: "Bank of Africa Sénégal", type: 'below', value: 7500, enabled: false },
    { id: 3, stock: 'TTLC', name: "TOTAL Côte d'Ivoire", type: 'above', value: 4000, enabled: true },
]

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: null,
    fetchAlerts: async () => {
        // Replace with actual fetch logic
        const fetchedAlerts: AlertData[] = mokeAlerts;
        set({ alerts: fetchedAlerts });
        return fetchedAlerts;
    },
    addAlert: (alert: AlertData) => {
        set((state) => ({
            alerts: state.alerts ? [...state.alerts, alert] : [alert],
        }));
    },
    removeAlert: (id: number) => {
        set((state) => ({
            alerts: state.alerts ? state.alerts.filter((alert) => alert.id !== id) : null,
        }));
    },
    toggleAlertState: (id: number) => set((state) => ({
        alerts: state.alerts ? state.alerts.map((alert) => alert.id === id ? { ...alert, enabled: !alert.enabled } : alert) : null,
    }))
}));