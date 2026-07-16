import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Text, Pressable } from "react-native";
import { Stock } from "@/types/stock";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useTranslation } from "react-i18next";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

export type StockSelectorRef = {
  open: () => void;
};

type Props = {
  onSelectStock: (stock: Stock) => void;
};

const StockSelector = forwardRef<StockSelectorRef, Props>(
  ({ onSelectStock }, ref) => {
    const { t } = useTranslation();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const { fetchStocks } = useStockRepository();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetModalRef.current?.present();
      },
    }));

    useEffect(() => {
      const loadStocks = async () => {
        const result = await fetchStocks();
        setStocks(result);
      };
      loadStocks();
    }, []);

    const handleSelect = useCallback(
      (stock: Stock) => {
        bottomSheetModalRef.current?.dismiss();
        onSelectStock(stock);
      },
      [onSelectStock],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%", "70%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableOverDrag={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.5}
          />
        )}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-lg font-semibold mb-3">{t("choose-a-stock")}</Text>
          {stocks.map((item) => (
            <Pressable
              key={item.symbol}
              onPress={() => handleSelect(item)}
              className="py-3 border-b border-gray-100"
            >
              <Text className="text-base">{item.title}</Text>
            </Pressable>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

export default StockSelector;