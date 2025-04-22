export const formatLocalDate = (dateStr: string | undefined) => {
    if (!dateStr) return "inconnue";
  
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "invalide";
  
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  export const formatRelativeDate = (dateStr: string | undefined) => {
    if (!dateStr) return "inconnue";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "invalide";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `🟢 ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return `Hier à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    const isThisWeek = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24) < 7 && now.getDay() >= date.getDay();

    if (isThisWeek) {
      return `${date.toLocaleDateString("fr-FR", { weekday: "long" })} à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    return date.toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };