export const de = {
  common: {
    welcome: 'Willkommen zu EventPlanner 🎉',
    loading: 'Warte kurz… wir holen deine Daten.',
    error: '⚠️ Oops! Etwas hat nicht geklappt. Prüfe, ob alle Pflichtfelder ausgefüllt sind.',
    success: '✔ Erledigt!',
    save: 'Speichern',
    cancel: 'Abbrechen',
  },
  dashboard: {
    heroTitle: 'Willkommen zurück!',
    heroSubtitle: 'Lass uns etwas Großes planen!',
    createEvent: '+ Neues Event starten',
    emptyEvents: 'Du hast noch keine Events – klicke auf das 🎈-Symbol, um dein erstes Abenteuer zu planen.',
    publicEventsTitle: '🔍 Entdecker-Spirit',
    publicEventsSubtitle: 'Neugierig? Hier sind die heißesten Public-Events in deiner Nähe.',
    upcomingTitle: 'Deine Events',
    pendingTitle: 'Ausstehend',
    pendingEmpty: 'Keine ausstehenden Einladungen.',
  },
  eventWizard: {
    step1Title: 'Die Basis 🐻',
    step1Hint: 'Der frühe Vogel fängt die besten Slots!',
    step2Title: 'Zeit & Ort 🐱',
    step2Hint: 'Wähle ein Zeitfenster, das für alle Zeitzonen passt – der Kalender schlägt dir gleich 3 Optionen vor.',
    step3Title: 'Gäste & Details 🤝',
    step3Hint: 'Einladungen sind so leicht wie ein Klick!',
    placeholderEmails: 'Gib hier die E-Mails deiner Lieblingsmenschen ein – Komma getrennt.',
    launchSuccess: '🎉 Dein Event ist jetzt live! Viel Spaß beim Feiern.',
  },
  calendar: {
    funFact: 'Wusstest du? Dieses Event hat bereits 8 Zusage-Herzen erhalten!',
    filterPrivate: 'Zeig mir nur private Events',
  },
  rsvp: {
    confirmed: '👍 Super, {name} hat zugesagt! Wir zählen jetzt die Plätze.',
    checkIn: 'Einfach scannen – deine Gäste sind sofort registriert.',
  },
  notifications: {
    reminder24h: '🔔 Dein Event startet in 24 Stunden – Zeit, die Gästeliste noch einmal zu prüfen.',
    bobAccepted: '👍 Bob hat zugesagt – Super! Sende ihm gleich einen Kaffee-Gutschein.',
  }
};

export type Translations = typeof de;
