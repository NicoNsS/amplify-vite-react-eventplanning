/** Schlüssel-Werte-Paar: <error-identifier> → <Hinweis-String> */
export const errorHints: Record<string, string> = {
  // ---------- GraphQL / Amplify ----------
  'NetworkError': 'Prüfe deine Internet‑Verbindung oder das API‑Endpoint‑CORS‑Setup.',
  'Unauthorized': 'Der aktuelle Nutzer hat keine Berechtigung. Stelle sicher, dass das @auth‑Rule‑Set korrekt ist.',
  'ValidationError': 'Ein Pflichtfeld fehlt oder hat das falsche Format. Öffne das Formular‑Debug‑Panel (F12).',
  'ConditionalCheckFailedException': 'DynamoDB‑Conditional‑Check schlug fehl – prüfe, ob das Item bereits existiert oder veraltet ist.',
  'ResourceNotFoundException': 'Ein referenziertes Objekt (z. B. Event‑ID) existiert nicht. Vielleicht wurde es bereits gelöscht?',

  // ---------- Lambda / Resolver ----------
  'UserNotFound': 'Der übergebene Cognito‑Sub existiert nicht – Initiiere ggf. ein User‑Provisioning‑Workflow.',
  'MissingTimezone': 'Zeitzonen‑Angabe fehlt. Füge ein gültiges IANA‑Timezone‑String (z. B. "Europe/Berlin") hinzu.',
  'InvalidDateRange': 'End‑Zeitpunkt liegt vor dem Start‑Zeitpunkt. Korrigiere das Datum im Formular.',

  // ---------- UI / Komponenten ----------
  'FormSubmitError': 'Das Absenden des Formulars schlug fehl. Prüfe die Browser‑Konsole für weitere Details.',
  'QRCheckInFailed': 'QR‑Code konnte nicht verifiziert werden – stelle sicher, dass das Gerät die Kamera‑Berechtigung hat.',
};
