// In-memory mock agencies for local demo. Replace with API-backed implementation when available.
const mem = [
  {
    id: 'AG-1',
    name: 'Dsu improvement agency',
    type: 'Executing',
    state_name: 'Gujarat',
    district_name: 'Ahmedabad',
    head_name: 'Maduraa BS',
    head_contact: '+91-8904118566',
    head_email: 'gashwanth562@gmail.com',
    status: 'Active',
  },
  {
    id: 'AG-2',
    name: 'Gujarat Tribal Development Board',
    type: 'Implementing',
    state_name: 'Gujarat',
    district_name: 'Ahmedabad',
    head_name: 'Shri Bharat Joshi',
    head_contact: '+91-79-23250505',
    head_email: 'chairman@gtdb.gov.in',
    status: 'Active',
  },
  {
    id: 'AG-3',
    name: 'Tamil Nadu Adi Dravidar Welfare Department',
    type: 'Implementing',
    state_name: 'Tamil Nadu',
    district_name: 'Chennai',
    head_name: 'Ms. Kavitha Ramakrishnan',
    head_contact: '+91-44-25670123',
    head_email: 'secretary@tnadw.gov.in',
    status: 'Active',
  },
  {
    id: 'AG-4',
    name: 'Maharashtra Tribal Development Agency',
    type: 'Implementing',
    state_name: 'Maharashtra',
    district_name: 'Mumbai',
    head_name: 'Dr. Suresh Patil',
    head_contact: '+91-22-22883244',
    head_email: 'director@mhtda.gov.in',
    status: 'Active',
  },
  {
    id: 'AG-5',
    name: 'UP Rural Infrastructure Corporation',
    type: 'Executing',
    state_name: 'Uttar Pradesh',
    district_name: 'Lucknow',
    head_name: 'Shri Anil Verma',
    head_contact: '+91-522-2308900',
    head_email: 'ceo@upric.gov.in',
    status: 'Active',
  },
  {
    id: 'AG-6',
    name: 'West Bengal SC/ST Development Corporation',
    type: 'Executing',
    state_name: 'West Bengal',
    district_name: 'Kolkata',
    head_name: 'Dr. Tapas Chatterjee',
    head_contact: '+91-33-22904567',
    head_email: 'md@wbscstdc.gov.in',
    status: 'Active',
  },
]

export const Agency = {
  async list(orderBy = '-created_date') {
    return [...mem]
  },
  async create(obj) {
    const id = `AG-${Date.now()}`
    const rec = { id, status: 'Active', ...obj }
    mem.push(rec)
    return rec
  }
}

export default { Agency }
