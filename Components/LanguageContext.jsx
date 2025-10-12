import React, { createContext, useContext, useState } from 'react'

const LangCtx = createContext(null)

const defaultTranslations = {
  navigation: 'Navigation',
  profileSettings: 'Profile Settings',
  manageYourProfileInfo: 'Manage your profile information',
  close: 'Close',
  user: 'User',
  admin: 'Admin',
  role: 'Role',
  agency: 'Agency',
  state: 'State',
  quickInfo: 'Quick Info',
  myAccount: 'My Account',
  logout: 'Log out',
  notifications: 'Notifications',
  noNewNotifications: 'No new notifications',
  systemOnline: 'System Online',
  language: 'Language',
  searchPlaceholder: 'Search projects, agencies, tasks...',
  dashboard: 'Dashboard',
  agencyRegistry: 'Agency Registry',
  projectsMap: 'Projects Map',
  projectsList: 'Projects List',
  fundFlow: 'Fund Flow',
  approvals: 'Approvals',
  taskBoard: 'Task Board',
  evidenceGallery: 'Evidence Gallery',
  communications: 'Communications',
  reports: 'Reports',
  help: 'Help',
  adminConsole: 'Admin Console'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')
  const [translations, setTranslations] = useState(defaultTranslations)

  const changeLanguage = async (lang) => {
    setLanguage(lang)
  }

  const t = (key) => translations[key] || key

  return (
    <LangCtx.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LangCtx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LangCtx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export default LanguageProvider