export type RelatedAsset = {
  id: string;
  relationshipType: 'Connects To' | 'Depends On' | 'Contains' | 'Related To';
};

export type Asset = {
  id: string;
  name: string;
  type: 'Server' | 'Application' | 'Database' | 'Endpoint' | 'Software Feature';
  owner: string;
  classification: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Inactive' | 'Decommissioned';
  compliance: number;
  tags?: string[];
  relatedAssets?: RelatedAsset[];
};

export const assets: Asset[] = [
  { id: 'ASSET-001', name: 'Production Web Server', type: 'Server', owner: 'Alice Johnson', classification: 'Critical', status: 'Active', compliance: 85, tags: ['backend', 'critical-infra'] },
  { id: 'ASSET-002', name: 'Customer Database', type: 'Database', owner: 'Bob Williams', classification: 'Critical', status: 'Active', compliance: 92, tags: ['pii', 'critical-infra'] },
  { id: 'ASSET-003', name: 'CRM Application', type: 'Application', owner: 'Charlie Brown', classification: 'High', status: 'Active', compliance: 78, tags: ['sales', 'customer-data'] },
  { id: 'ASSET-004', name: 'Marketing Website', type: 'Application', owner: 'Diana Prince', classification: 'Medium', status: 'Active', compliance: 95, tags: ['frontend', 'public-facing'] },
  { id: 'ASSET-005', name: 'Development Server', type: 'Server', owner: 'Eve Adams', classification: 'Low', status: 'Inactive', compliance: 60, tags: ['dev-env'] },
  { id: 'ASSET-006', name: 'Employee Laptop', type: 'Endpoint', owner: 'Frank White', classification: 'Medium', status: 'Active', compliance: 99, tags: ['employee-device'] },
];

export type Control = {
  id: string;
  name: string;
  framework: 'ISO 27001' | 'NIST' | 'CIS' | 'Custom';
  category: string;
  type: 'Preventive' | 'Detective' | 'Corrective';
  description: string;
  status: 'Implemented' | 'In Progress' | 'Not Implemented'
};

export const controls: Control[] = [
  { id: 'ISO-A.12.1.2', name: 'Protection against Malware', framework: 'ISO 27001', category: 'Operations Security', type: 'Preventive', description: 'Implement anti-malware controls to protect against malicious software.', status: 'Implemented' },
  { id: 'NIST-AC-1', name: 'Access Control Policy and Procedures', framework: 'NIST', category: 'Access Control', type: 'Preventive', description: 'Develop, document, and disseminate an access control policy.', status: 'Implemented' },
  { id: 'CIS-3.1', name: 'Establish and Maintain a Data Management Process', framework: 'CIS', category: 'Data Protection', type: 'Preventive', description: 'Establish and maintain a data management process.', status: 'In Progress' },
  { id: 'ISO-A.9.4.1', name: 'Limitation of access to information', framework: 'ISO 27001', category: 'Access Control', type: 'Preventive', description: 'Access to information and application system functions should be restricted.', status: 'Implemented' },
  { id: 'NIST-SI-4', name: 'Information System Monitoring', framework: 'NIST', category: 'System and Information Integrity', type: 'Detective', description: 'Monitor, analyze, and protect the information system from unauthorized access.', status: 'Implemented' },
  { id: 'CUST-001', name: 'Quarterly Vulnerability Scanning', framework: 'Custom', category: 'Vulnerability Management', type: 'Detective', description: 'Perform internal and external vulnerability scans at least quarterly.', status: 'Not Implemented' },
];

export type AuditLog = {
  id: string;
  date: string;
  user: string;
  userAvatar: string;
  action: string;
  details: string;
};

export const auditLogs: AuditLog[] = [
  { id: 'LOG-001', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), user: 'Alice Johnson', userAvatar: 'https://picsum.photos/seed/10/40/40', action: 'Update Control', details: 'Updated control ISO-A.12.1.2 to "Implemented"' },
  { id: 'LOG-002', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), user: 'Bob Williams', userAvatar: 'https://picsum.photos/seed/11/40/40', action: 'Add Asset', details: 'Added new asset ASSET-006: Employee Laptop' },
  { id: 'LOG-003', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user: 'Admin', userAvatar: 'https://picsum.photos/seed/12/40/40', action: 'Assign Control', details: 'Assigned control NIST-AC-1 to asset ASSET-002' },
  { id: 'LOG-004', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), user: 'Charlie Brown', userAvatar: 'https://picsum.photos/seed/13/40/40', action: 'Upload Evidence', details: 'Uploaded evidence for control CIS-3.1 on ASSET-003' },
  { id: 'LOG-005', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user: 'Alice Johnson', userAvatar: 'https://picsum.photos/seed/10/40/40', action: 'Change Status', details: 'Asset ASSET-005 status changed to "Inactive"' },
];

export type ControlAssignment = {
  id: string;
  controlId: string;
  assetId: string;
  assignedBy: string;
  assignedAt: string;
};

export const userRoles = ['Admin', 'Control Owner', 'Auditor', 'Viewer'];

export const relationshipTypes = ['Connects To', 'Depends On', 'Contains', 'Related To'] as const;
