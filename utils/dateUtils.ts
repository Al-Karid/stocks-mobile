export const formatLocalDate = (dateStr: string | undefined) => {
    if (!dateStr) return "inconnue";
  
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "invalide";
  
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };