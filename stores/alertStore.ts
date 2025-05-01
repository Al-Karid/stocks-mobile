import { AlertData } from "@/types/alerts";
import { create } from "zustand";
import { useAlertRepository } from "@/data/repositories/alertRepository";

interface AlertStore {
    alerts: AlertData[] | null;
    fetchAlerts: () => Promise<AlertData[]>;
    addAlert: (alert: AlertData) => void;
    removeAlert: (id: number) => void;
    updateAlert: (alert: AlertData) => void;
    toggleAlertState: (id: number) => void;
}

const { getAlerts, saveAlert, deleteAlert, updateAlert, findAlertById } = useAlertRepository();

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: null,
    fetchAlerts: async () => {
        const fetchedAlerts = await getAlerts();
        set({ alerts: fetchedAlerts });
        return fetchedAlerts;
    },
    addAlert: async (alert: AlertData) => {
        await saveAlert(alert).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    },
    removeAlert: (id: number) => {
        deleteAlert(id).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    },
    toggleAlertState: (id: number) => {
        findAlertById(id).then(async (alert) => {
            if (alert) {
                alert.enabled = !alert.enabled;
                updateAlert(alert);
                set({ alerts: await getAlerts() });
            }
        });
    },
    updateAlert: async (alert: AlertData) => {
        await updateAlert(alert).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    }
}));