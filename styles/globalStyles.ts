import { StyleSheet } from 'react-native';

export const globalCardStyles = StyleSheet.create({
    card: {
        width: "100%",
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: "#ffffff",
    },
    stockCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#ffffff",
      },
});

export const globalTextStyles = StyleSheet.create({
    label: {
        color: "#374151",
        fontSize: 14,
    },
    value: {
        fontWeight: "600",
        color: "#123456",
    },
    labelValueDetailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    labelValueDetailsContainer: {
        paddingTop: 10,
        gap: 6,
    },    
    labelValueDetailsContainerBTop: {
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 10,
        gap: 6,
    },
});