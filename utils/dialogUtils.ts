// dialogUtils.ts
export const handleCloseDialog = (setVisible: (value: boolean) => void) => {
  setTimeout(() => setVisible(false), 160);
};
