import { AlertData } from "@/types/alerts";
import { create } from "zustand";
import { useAlertRepository } from "@/data/repositories/alertRepository";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface AlertStore {
    alerts: AlertData[] | null;
    fetchAlerts: () => Promise<AlertData[]>;
    addAlert: (alert: AlertData) => void;
    removeAlert: (id: number) => void;
    toggleAlertState: (id: number) => void;
}

const { getAlerts, saveAlert, deleteAlert, updateAlert, findAlertById } = useAlertRepository();

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: null,
    fetchAlerts: async () => {
        const fetchedAlerts = await getAlerts();
        set({ alerts: fetchedAlerts });
        console.log("Fetched alerts:", fetchedAlerts);

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
    toggleAlertState: (id: number) => {
        findAlertById(id).then(async (alert) => {
            if (alert) {
                alert.enabled = !alert.enabled;
                updateAlert(alert);
                set({ alerts: await getAlerts() });
            }
        });
    }
}));