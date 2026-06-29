// Admin session: token + bankname in localStorage, with client-side expiry.
const KEY = 'pranaraksha_admin'

function decodeExp(token) {
  try {
    const body = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(body + '='.repeat((4 - (body.length % 4)) % 4))
    return JSON.parse(json).exp || 0
  } catch {
    return 0
  }
}

export function saveSession({ token, bankname }) {
  localStorage.setItem(KEY, JSON.stringify({ token, bankname, exp: decodeExp(token) }))
}

export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (!s?.token) return null
    if (s.exp && s.exp * 1000 < Date.now()) {
      clearSession()
      return null
    }
    return s
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export function authHeader() {
  const s = getSession()
  return s?.token ? { Authorization: `Bearer ${s.token}` } : {}
}
