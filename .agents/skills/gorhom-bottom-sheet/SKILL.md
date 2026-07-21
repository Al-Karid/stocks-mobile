---
name: gorhom-bottom-sheet
description: Build native bottom sheet modals with @gorhom/bottom-sheet v5 — snap points, detached modals, scrollables, keyboard handling, and Reanimated animation configs
---

# @gorhom/bottom-sheet v5 Skills

Comprehensive reference for building bottom sheets with `@gorhom/bottom-sheet` v5 + `react-native-reanimated` + `react-native-gesture-handler`.

## Installation

Do not run these commands if the packages are already installed.

```bash
npx expo install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
npx expo prebuild
```

Wrap your root component:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {/* your app */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

## Core Component: BottomSheet

```tsx
import { useRef, useMemo, useCallback } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function MySheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Snap index:', index);
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      enableDynamicSizing={false}
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        {/* content */}
      </BottomSheetView>
    </BottomSheet>
  );
}
```

## Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `snapPoints` | `(number \| string)[]` | required | Sorted bottom→top. Accepts pixels or `'25%'` strings |
| `index` | `number` | `0` | Initial snap index. Use `-1` to start closed |
| `detached` | `boolean` | `false` | Float the sheet (not edge-to-edge). Add `bottomInset` + `marginHorizontal` on `style` |
| `enableDynamicSizing` | `boolean` | `true` | Auto-size to content. Adds a dynamic snap point |
| `enablePanDownToClose` | `boolean` | `false` | Swipe down to dismiss |
| `enableOverDrag` | `boolean` | `true` | Allow over-dragging past max snap |
| `overDragResistanceFactor` | `number` | `2.5` | Resistance when over-dragging |
| `enableContentPanningGesture` | `boolean` | `true` | Allow scrolling content with gesture |
| `enableHandlePanningGesture` | `boolean` | `true` | Allow dragging the handle with gesture |
| `animateOnMount` | `boolean` | `true` | Animate to initial snap point on mount |
| `handleHeight` | `number` | `24` | Handle height (px). Auto-calculated if `handleComponent` is set |
| `topInset` | `number` | `0` | Safe area top inset |
| `bottomInset` | `number` | `0` | Safe area bottom inset (used in detached mode) |
| `containerHeight` | `number` | `0` | Explicit container height (avoids extra render) |
| `contentHeight` | `number \| SharedValue<number>` | - | Content height for dynamic sizing |
| `maxDynamicContentSize` | `number` | container height | Cap dynamic sizing height |
| `containerOffset` | `SharedValue<Insets>` | - | Container offset for accurate positioning |
| `overrideReduceMotion` | `ReduceMotion` | `.System` | Override system reduce-motion: `System \| Always \| Never` |

## Style Props

| Prop | Type | Description |
|------|------|-------------|
| `style` | `ViewStyle \| AnimatedStyle` | Sheet container (use `marginHorizontal` for detached) |
| `backgroundStyle` | `ViewStyle` | Background component |
| `handleStyle` | `ViewStyle` | Handle component |
| `handleIndicatorStyle` | `ViewStyle` | Handle indicator bar |

## Keyboard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyboardBehavior` | `'extend' \| 'fillParent' \| 'interactive'` | `'interactive'` | How the sheet reacts to keyboard |
| `keyboardBlurBehavior` | `'none' \| 'restore'` | `'none'` | What happens on keyboard dismiss |
| `enableBlurKeyboardOnGesture` | `boolean` | `false` | Dismiss keyboard when dragging |
| `android_keyboardInputMode` | `'adjustPan' \| 'adjustResize'` | `'adjustPan'` | Android keyboard mode |

## useBottomSheet() Hook

Access sheet controls from any component rendered inside the sheet:

```tsx
import { useBottomSheet } from '@gorhom/bottom-sheet';

function SheetContent() {
  const sheet = useBottomSheet();

  return (
    <View>
      <Button onPress={() => sheet.expand()} title="Expand" />
      <Button onPress={() => sheet.collapse()} title="Collapse" />
      <Button onPress={() => sheet.close()} title="Close" />
      <Button onPress={() => sheet.snapToIndex(2)} title="Snap to 90%" />
      <Button onPress={() => sheet.snapToPosition(400)} title="Snap to 400px" />
      <Button onPress={() => sheet.forceClose()} title="Force Close" />
    </View>
  );
}
```

### All hook methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `expand` | `(animationConfigs?) => void` | Snap to max point |
| `collapse` | `(animationConfigs?) => void` | Snap to min point |
| `close` | `(animationConfigs?) => void` | Dismiss the sheet |
| `forceClose` | `(animationConfigs?) => void` | Force dismiss (uninterruptible) |
| `snapToIndex` | `(index: number, animationConfigs?) => void` | Snap to snap point index |
| `snapToPosition` | `(position: number, animationConfigs?) => void` | Snap to pixel position |
| `animatedIndex` | `SharedValue<number>` | Current snap index |
| `animatedPosition` | `SharedValue<number>` | Current position in px |

## Ref (Imperative) API

```tsx
const sheetRef = useRef<BottomSheet>(null);

sheetRef.current?.expand();
sheetRef.current?.close();
sheetRef.current?.forceClose();
sheetRef.current?.snapToIndex(2);
sheetRef.current?.collapse();
sheetRef.current?.snapToPosition(400);
```

Same methods as the hook, called imperatively.

## Scrollable Subcomponents

Always use these inside the sheet for proper gesture coordination:

| Component | Use Instead Of |
|-----------|---------------|
| `BottomSheetView` | `View` |
| `BottomSheetScrollView` | `ScrollView` |
| `BottomSheetTextInput` | `TextInput` |
| `BottomSheetVirtualizedList` | `FlatList` / `VirtualizedList` |

## Animation Config Hooks

### Spring (default)
```tsx
import { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

const animationConfigs = useBottomSheetSpringConfigs({
  damping: 80,
  stiffness: 500,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
});

<BottomSheet animationConfigs={animationConfigs} ... />
```

### Timing
```tsx
import { useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

const animationConfigs = useBottomSheetTimingConfigs({
  duration: 250,
  easing: Easing.exp,
});

<BottomSheet animationConfigs={animationConfigs} ... />
```

## Third-Party List Integration

Use `useBottomSheetScrollableCreator` for LegendList, FlashList, etc:

```tsx
import { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { LegendList } from '@legendapp/list';

const BottomSheetLegendList = useBottomSheetScrollableCreator();

<BottomSheet>
  <LegendList renderScrollComponent={BottomSheetLegendList} ... />
</BottomSheet>
```

## BottomSheetModal

Requires `<BottomSheetModalProvider>`. Has backdrop overlay:

```tsx
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';

const modalRef = useRef<BottomSheetModal>(null);

// Present programmatically:
modalRef.current?.present();

// Or via hook:
const { dismiss, dismissAll } = useBottomSheetModal();

// JSX:
<BottomSheetModal ref={modalRef} snapPoints={['50%', '75%']}>
  <BottomSheetView style={{ flex: 1 }}>
    <Button onPress={() => modalRef.current?.dismiss()} title="Close" />
  </BottomSheetView>
</BottomSheetModal>
```

## Architecture Rules

1. Always use `BottomSheetView` / `BottomSheetScrollView` inside sheets (never plain RN Views)
2. `BottomSheetModal` requires `<BottomSheetModalProvider>` ancestor
3. Use `enableDynamicSizing={false}` with explicit `snapPoints` for predictable layout
4. Access sheet methods via `useBottomSheet()` from any child, or `ref` from parent
5. `index={-1}` pre-loads the sheet closed; animate in later via `snapToIndex(0)`
6. For detached (floating) modals: set `detached={true}`, `bottomInset`, and `marginHorizontal` on `style`