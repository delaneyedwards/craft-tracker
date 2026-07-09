export const colors = {
  background: '#FAF8F3',
  surface: '#FFFFFF',
  surfaceMuted: '#F1EFE8',
  border: '#E4E1D6',
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  accent: '#0F6E56',
  accentBg: '#E1F5EE',
  urgent: '#D85A30',
  urgentBg: '#FAECE7',
};

export const statusColors: Record<string, { fg: string; bg: string }> = {
  idea: { fg: colors.textSecondary, bg: colors.surfaceMuted },
  researching: { fg: '#185FA5', bg: '#E6F1FB' },
  gathering: { fg: '#854F0B', bg: '#FAEEDA' },
  building: { fg: '#0F6E56', bg: '#E1F5EE' },
  faire_ready: { fg: '#3B6D11', bg: '#EAF3DE' },
  upgrade_later: { fg: '#993556', bg: '#FBEAF0' },
};
