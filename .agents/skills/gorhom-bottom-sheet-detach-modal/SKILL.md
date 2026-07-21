---
name: gorhom-bottom-sheet-detach-modal
description: Create a floating/detached bottom sheet modal with margins on all sides using @gorhom/bottom-sheet v5
---

# gorhom-bottom-sheet-detach-modal

Create a **floating modal** that appears detached from the screen edges — a sheet with horizontal margins and elevated from the bottom like a card or dialog.

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `detached` | `boolean` | Set to `true` to enable detached mode |
| `bottomInset` | `number` | Space from the bottom edge (elevates the sheet) |
| `style` | `ViewStyle` | Apply `marginHorizontal` here for side spacing |

## Usage

```tsx
import React, { useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function DetachModalExample() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        bottomInset={46}    // elevate from bottom
        detached={true}      // enable detached mode
        style={styles.sheetContainer} // horizontal margins
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  sheetContainer: {
    marginHorizontal: 24, // space on left and right
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
```

## How it works

- `detached={true}` makes the sheet float instead of stretching edge-to-edge
- `bottomInset` pushes the sheet up from the bottom of the screen
- `style` with `marginHorizontal` (or `padding` on the container) adds breathing room on the sides
- Works with both `BottomSheet` and `BottomSheetModal`