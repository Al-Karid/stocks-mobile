# Liquid Glass Design System

Use these class names as default iOS component backgrounds for a translucent frosted glass effect.

## Default / Neutral State
```
border border-white/30 bg-gray-200/30 backdrop-blur-sm
```
Use for: cards, containers, buttons, inputs — anything that sits on a light background.

## Selected / Active State (colored translucent)
Use a tinted translucent background with matching border:
- Green (above/success):  `bg-green-300/30 border-2 border-green-300/30 backdrop-blur-sm`
- Red (below/danger):    `bg-red-300/30 border-2 border-red-300/30 backdrop-blur-sm`
- Blue (info/active):     `bg-blue-300/30 border-2 border-blue-300/30 backdrop-blur-sm`

## Text on Glass
- Primary text: `text-[#171717]` (dark, legible)
- Secondary text: `text-[#404040]` (medium grey)
- Muted text: `text-[#a3a3a3]` or `text-gray-400`
- Glass surface (dark): use white text with `text-white`

## Solid Dark State (enabled/pressed)
```
bg-black
```
Use for: toggle buttons in active/enabled state, contrasting against the glass surfaces.

## Border Radius
- Rounded containers: `rounded-2xl`
- Rounded buttons/circles: `rounded-full`
- Extra rounded cards: `rounded-3xl`

## Shadows (for elevation on glass)
```jsx
style={{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
}}
```
Apply only to active/selected glass elements to lift them above the frosted surface.

## Transition
```jsx
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
```
Call before state changes on interactive glass elements for smooth background/border transitions.