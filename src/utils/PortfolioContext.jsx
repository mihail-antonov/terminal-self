import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { usePB } from '../hooks/usePB'

const PortfolioContext = createContext({})

export function PortfolioProvider({ children }) {
  const { data: contacts,   loading: loadingContacts }   = usePB('contacts')
  const { data: experience, loading: loadingExperience } = usePB('experience', { sort: '-created' })
  const { data: projects,   loading: loadingProjects }   = usePB('projects')

  return (
    <PortfolioContext.Provider value={{ contacts, experience, projects, loadingContacts, loadingExperience, loadingProjects }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)