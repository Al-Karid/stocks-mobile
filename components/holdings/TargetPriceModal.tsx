import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Holding } from "@/types/portfolio";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/styles/colors";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

interface TargetPriceModalProps {
  visible: boolean;
  holding: Holding | null;
  onClose: () => void;
  onSave: (targetPrice: number | null, targetDate: string | null) => void;
  onClear: () => void;
}

export default function TargetPriceModal({
  visible,
  holding,
  onClose,
  onSave,
  onClear,
}: TargetPriceModalProps) {
  const { t } = useTranslation();
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (holding) {
      setTargetPrice(
        holding.targetPrice != null ? holding.targetPrice.toString() : ""
      );
      setTargetDate(
        holding.targetDate ? new Date(holding.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );
    }
  }, [holding, visible]);

  if (!holding) return null;

  const currentPrice = holding.currentPrice ?? 0;
  const targetPriceNum = targetPrice ? parseFloat(targetPrice) : null;
  const projectedReturn = targetPriceNum && currentPrice > 0
    ? ((targetPriceNum - currentPrice) / currentPrice) * 100
    : null;

  const daysToTarget = targetDate
    ? Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  const handleSave = () => {
    const priceNum = targetPrice ? parseFloat(targetPrice) : null;
    const dateStr = targetDate ? targetDate.toISOString() : null;
    onSave(
      priceNum && !isNaN(priceNum) ? priceNum : null,
      dateStr
    );
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View />
        </Pressable>

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleBar}>
            <View style={styles.handle} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{holding.name}</Text>
          <Text style={styles.subtitle}>{holding.symbol}</Text>

          {/* Current price info */}
          <View style={styles.currentInfo}>
            <Text style={styles.currentLabel}>{t("current-price")}</Text>
            <Text style={styles.currentValue}>
              {formatCurrency(currentPrice, 0)}
            </Text>
          </View>

          {/* Target price input */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("target-price")}</Text>
            <TextInput
              style={styles.input}
              value={targetPrice}
              onChangeText={setTargetPrice}
              placeholder={formatCurrency(currentPrice, 0)}
              placeholderTextColor="#ccc"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Target date picker */}
          <View style={styles.field}>
            <Text style={styles.label}>{t("target-date")}</Text>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={targetDate}
                mode="date"
                display="compact"
                minimumDate={new Date()}
                onChange={handleDateChange}
                style={styles.datePickerIOS}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDisplayDate(targetDate)}
                  </Text>
                  <Feather name="calendar" size={18} color={Colors.headerBlue} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={targetDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </>
            )}
          </View>

          {/* Projection preview */}
          {projectedReturn !== null && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>{t("projected-return")}</Text>
              <View style={styles.previewRow}>
                <Text
                  style={[
                    styles.previewValue,
                    { color: projectedReturn >= 0 ? "#22c55e" : "#ef4444" },
                  ]}
                >
                  {projectedReturn >= 0 ? "+" : ""}
                  {formatPercentage(projectedReturn, 2)}
                </Text>
                {daysToTarget != null && daysToTarget > 0 && (
                  <Text style={styles.previewDays}>
                    {t("in-days", { count: daysToTarget })}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            {holding.targetPrice != null && (
              <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                <Feather name="trash-2" size={16} color={Colors.error} />
                <Text style={styles.clearText}>{t("clear-target")}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{t("save")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 8,
  },
  handleBar: {
    alignItems: "center",
    marginBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  currentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  currentLabel: {
    fontSize: 14,
    color: "#666",
  },
  currentValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  datePickerIOS: {
    alignSelf: "flex-start",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  previewContainer: {
    backgroundColor: "#f0f9ff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.headerBlue,
  },
  previewLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  previewDays: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  clearText: {
    color: Colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.headerBlue,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});