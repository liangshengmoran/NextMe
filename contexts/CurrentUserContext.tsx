'use client'

import { createContext, useContext, useState } from 'react'

type CurrentUser = {
  name?: string
  email?: string
}

const CurrentUserContext = createContext<[CurrentUser | null, (user: CurrentUser | null) => void]>([null, () => {}])

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  return (
    <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => useContext(CurrentUserContext)