export const User = {
  async me() {
    // Minimal mock user; replace with real auth later
    return { full_name: 'Admin User', email: 'admin@example.com', role: 'admin', agency_name: 'Sample Agency', state_name: 'Sample State' }
  },
  async logout() {
    return
  }
}

export { Project, FundTransaction, Task, Approval, State, Agency, District, PhotoEvidence } from './all.js'

export default { User }
