const _projects = [
  {
    id: 'P-1',
    title: 'Model Village Development',
    component: 'Adarsh Gram',
    current_status: 'In Progress',
    district_name: 'Thane',
    state_name: 'Maharashtra',
    progress_percent: 45,
    budget_allocated: 10000000,
    coordinates: { lat: 19.2183, lng: 72.9781 }
  },
  {
    id: 'P-2',
    title: 'Girls Hostel Construction - Lucknow',
    component: 'Hostel',
    current_status: 'In Progress',
    district_name: 'Lucknow',
    state_name: 'Uttar Pradesh',
    progress_percent: 42,
    budget_allocated: 18000000,
    coordinates: { lat: 26.8467, lng: 80.9462 }
  },
  {
    id: 'P-3',
    title: 'Community Center Construction - Vadodara',
    component: 'Adarsh Gram',
    current_status: 'Approval Pending',
    district_name: 'Vadodara',
    state_name: 'Gujarat',
    progress_percent: 5,
    budget_allocated: 22000000,
    coordinates: { lat: 22.3072, lng: 73.1812 }
  },
  {
    id: 'P-4',
    title: 'Boys Hostel Renovation - Kolkata',
    component: 'Hostel',
    current_status: 'In Progress',
    district_name: 'Kolkata',
    state_name: 'West Bengal',
    progress_percent: 55,
    budget_allocated: 9000000,
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  {
    id: 'P-5',
    title: 'Hostel Complex - Coimbatore',
    component: 'Hostel',
    current_status: 'Completed',
    district_name: 'Coimbatore',
    state_name: 'Tamil Nadu',
    progress_percent: 100,
    budget_allocated: 15000000,
    coordinates: { lat: 11.0168, lng: 76.9558 }
  },
  {
    id: 'P-6',
    title: 'Adarsh Gram Development - Thane District',
    component: 'Adarsh Gram',
    current_status: 'In Progress',
    district_name: 'Mumbai',
    state_name: 'Maharashtra',
    progress_percent: 65,
    budget_allocated: 26000000,
    coordinates: { lat: 19.076, lng: 72.8777 }
  }
]

export const Project = {
  async list(orderBy = '-created_date', limit = 100) {
    return _projects
  },
  async create(obj) {
    const id = `P-${Date.now()}`
    const rec = { id, current_status: 'Planning', progress_percent: 0, ...obj }
    _projects.push(rec)
    return rec
  }
}

const _fundTx = [
  {
    id: 'TX-1',
    project_id: 'P-1',
    project_title: 'Model Village Development',
    reference_no: 'SAN/2024/001',
    transaction_type: 'Release',
    purpose: 'Initial grant release',
    amount: 2500000,
    transaction_date: new Date(Date.now() - 9*24*3600*1000).toISOString(),
    from_entity: 'Centre',
    to_entity: 'State',
    status: 'Released',
    approved_by: 'U-1',
    approved_by_name: 'Admin User',
    comments: 'Released as per approval A-1',
    ledger_entries: [
      { date: new Date(Date.now() - 9*24*3600*1000).toISOString(), description: 'Sanction order issued', amount: 2500000 },
      { date: new Date(Date.now() - 8*24*3600*1000).toISOString(), description: 'Amount credited to State', amount: 2500000 },
    ]
  },
  {
    id: 'TX-2',
    project_id: 'P-2',
    project_title: 'Girls Hostel Construction - Lucknow',
    reference_no: 'SAN/2024/045',
    transaction_type: 'Release',
    purpose: 'Milestone 1 completion',
    amount: 4000000,
    transaction_date: new Date(Date.now() - 5*24*3600*1000).toISOString(),
    from_entity: 'Centre',
    to_entity: 'State',
    status: 'Approved',
    approved_by: 'U-2',
    approved_by_name: 'Rajesh Kumar',
    comments: 'Approved by finance controller',
    ledger_entries: [
      { date: new Date(Date.now() - 6*24*3600*1000).toISOString(), description: 'Release requested', amount: 4000000 },
      { date: new Date(Date.now() - 5*24*3600*1000).toISOString(), description: 'Approval granted', amount: 4000000 },
    ]
  },
  {
    id: 'TX-3',
    project_id: 'P-3',
    project_title: 'Community Center Construction - Vadodara',
    reference_no: 'SAN/2024/078',
    transaction_type: 'Adjustment',
    purpose: 'Budget reallocation',
    amount: 750000,
    transaction_date: new Date(Date.now() - 2*24*3600*1000).toISOString(),
    from_entity: 'State',
    to_entity: 'District',
    status: 'Pending',
    approved_by_name: null,
    comments: 'Awaiting district confirmation',
    ledger_entries: [
      { date: new Date(Date.now() - 2*24*3600*1000).toISOString(), description: 'Adjustment proposed', amount: 750000 },
    ]
  },
  {
    id: 'TX-4',
    project_id: 'P-4',
    project_title: 'Boys Hostel Renovation - Kolkata',
    reference_no: 'SAN/2024/088',
    transaction_type: 'Refund',
    purpose: 'Unutilized funds returned',
    amount: 300000,
    transaction_date: new Date().toISOString(),
    from_entity: 'District',
    to_entity: 'State',
    status: 'On Hold',
    approved_by_name: 'Finance Auditor',
    comments: 'Under review due to discrepancy',
    ledger_entries: [
      { date: new Date().toISOString(), description: 'Refund initiated', amount: 300000 },
    ]
  },
]

export const FundTransaction = {
  async list(orderBy = '-created_date', limit = 100) {
    return _fundTx
  },
  async create(obj) {
    const id = `TX-${Date.now()}`
    const rec = { id, status: obj?.status || 'Released', transaction_date: new Date().toISOString(), ...obj }
    _fundTx.push(rec)
    return rec
  }
}

const _tasks = [
  { id: 'T-1', status: 'To Do', title: 'Review contractor bills', project_title: 'Model Village Development', priority: 'High', due_date: new Date().toISOString(), assigned_to_name: 'Admin User' },
  { id: 'T-2', status: 'In Progress', title: 'Complete architectural drawings', project_title: 'Adarsh Gram Phase 1 - Thane District', priority: 'High', due_date: new Date(Date.now()+5*86400000).toISOString(), assigned_to_name: 'Rajesh Kumar' },
  { id: 'T-3', status: 'In Progress', title: 'Coordinate with contractor', project_title: 'Hostel Expansion - Coimbatore', priority: 'Medium', due_date: new Date(Date.now()+9*86400000).toISOString(), assigned_to_name: 'Arjun Reddy' },
  { id: 'T-4', status: 'Review', title: 'Verify beneficiary documents', project_title: 'GIA Scholarship Program - Lucknow', priority: 'Medium', due_date: new Date(Date.now()+3*86400000).toISOString(), assigned_to_name: 'Vikram Singh' },
  { id: 'T-5', status: 'Review', title: 'Verify student enrollment', project_title: 'GIA Scholarship Distribution - Chennai', priority: 'High', due_date: new Date(Date.now()+12*86400000).toISOString(), assigned_to_name: 'Lakshmi Iyer' },
  { id: 'T-6', status: 'Completed', title: 'Update project timeline in portal', project_title: 'Adarsh Gram Phase 1 - Thane District', priority: 'Low', due_date: new Date(Date.now()-10*86400000).toISOString(), assigned_to_name: 'Rajesh Kumar' },
  { id: 'T-7', status: 'Completed', title: 'Conduct site survey and prepare DPR', project_title: 'Adarsh Gram Development - Thane District', priority: 'High', due_date: new Date(Date.now()-7*86400000).toISOString(), assigned_to_name: 'Amit Desai' },
  { id: 'T-8', status: 'To Do', title: 'Conduct soil testing', project_title: 'Hostel Construction - Mumbai Suburban', priority: 'Urgent', due_date: new Date(Date.now()+2*86400000).toISOString(), assigned_to_name: 'Amit Desai' },
  { id: 'T-9', status: 'To Do', title: 'Organize community consultation', project_title: 'Adarsh Gram Development – Thane District', priority: 'Medium', due_date: new Date(Date.now()+11*86400000).toISOString(), assigned_to_name: 'Amit Desai' },
]

export const Task = {
  async list() { return _tasks },
  async filter(query) {
    if (!query) return _tasks
    return _tasks.filter(t => Object.entries(query).every(([k,v]) => t[k] === v))
  },
  async update(id, patch) {
    const idx = _tasks.findIndex(t => t.id === id)
    if (idx >= 0) { _tasks[idx] = { ..._tasks[idx], ...patch } ; return _tasks[idx] }
    throw new Error('Task not found')
  }
}

const _approvals = [
  {
    id: 'A-1',
    project_id: 'P-1',
    project_title: 'Model Village Development',
    step_name: 'District Review',
    sla_deadline: new Date(Date.now() + 3*24*3600*1000).toISOString(),
    status: 'Pending',
    timestamp: new Date().toISOString(),
  }
]

export const Approval = {
  async list() { return _approvals },
  async filter(query) {
    if (!query) return _approvals
    return _approvals.filter(a => Object.entries(query).every(([k,v]) => a[k] === v))
  },
  async update(id, patch) {
    const idx = _approvals.findIndex(a => a.id === id)
    if (idx >= 0) { _approvals[idx] = { ..._approvals[idx], ...patch } ; return _approvals[idx] }
    throw new Error('Approval not found')
  }
}

const _states = [
  { id: 'AP', name: 'Andhra Pradesh' },
  { id: 'AR', name: 'Arunachal Pradesh' },
  { id: 'AS', name: 'Assam' },
  { id: 'BR', name: 'Bihar' },
  { id: 'CT', name: 'Chhattisgarh' },
  { id: 'GA', name: 'Goa' },
  { id: 'GJ', name: 'Gujarat' },
  { id: 'HR', name: 'Haryana' },
  { id: 'HP', name: 'Himachal Pradesh' },
  { id: 'JH', name: 'Jharkhand' },
  { id: 'KA', name: 'Karnataka' },
  { id: 'KL', name: 'Kerala' },
  { id: 'MP', name: 'Madhya Pradesh' },
  { id: 'MH', name: 'Maharashtra' },
  { id: 'MN', name: 'Manipur' },
  { id: 'ML', name: 'Meghalaya' },
  { id: 'MZ', name: 'Mizoram' },
  { id: 'NL', name: 'Nagaland' },
  { id: 'OR', name: 'Odisha' },
  { id: 'PB', name: 'Punjab' },
  { id: 'RJ', name: 'Rajasthan' },
  { id: 'SK', name: 'Sikkim' },
  { id: 'TN', name: 'Tamil Nadu' },
  { id: 'TG', name: 'Telangana' },
  { id: 'TR', name: 'Tripura' },
  { id: 'UP', name: 'Uttar Pradesh' },
  { id: 'UK', name: 'Uttarakhand' },
  { id: 'WB', name: 'West Bengal' },
  // Union Territories
  { id: 'AN', name: 'Andaman and Nicobar Islands' },
  { id: 'CH', name: 'Chandigarh' },
  { id: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { id: 'DL', name: 'Delhi' },
  { id: 'JK', name: 'Jammu and Kashmir' },
  { id: 'LA', name: 'Ladakh' },
  { id: 'LD', name: 'Lakshadweep' },
  { id: 'PY', name: 'Puducherry' },
]
const _districts = [
  { id: 'TH', state_id: 'MH', name: 'Thane' },
  { id: 'MB', state_id: 'MH', name: 'Mumbai' },
]
const _agencies = [
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
const _evidence = []

export const State = {
  async list() { return _states }
}
export const District = {
  async filter(query) {
    if (!query) return _districts
    return _districts.filter(d => Object.entries(query).every(([k,v]) => d[k] === v))
  }
}
export const Agency = {
  async list() { return _agencies },
  async create(obj) { const rec = { id: `AG-${Date.now()}`, status: 'Active', ...obj }; _agencies.push(rec); return rec }
}
export const PhotoEvidence = {
  async list(orderBy = '-timestamp') { return _evidence },
  async create(obj) { const rec = { id: `PE-${Date.now()}`, ...obj }; _evidence.push(rec); return rec }
}

export default { Project, FundTransaction, Task, Approval, State, Agency, District, PhotoEvidence }
