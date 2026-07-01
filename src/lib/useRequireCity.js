import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Results pages receive their city + data through router navigation state,
 * which is wiped on a hard refresh or when someone opens a deep link. When
 * that happens `city` is undefined and the page would render a broken
 * "in undefined" empty state with no results. Send the user back to the search
 * screen to start over instead.
 *
 * Call this at the top of a results page, then `if (!city) return null` so
 * nothing flashes on screen while the redirect runs.
 */
export function useRequireCity(city) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!city) navigate('/guest', { replace: true })
  }, [city, navigate])
}
