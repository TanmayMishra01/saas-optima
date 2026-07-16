export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Finance' | 'Viewer';
  organization_id: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  owner_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  service_name: string;
  cost: number; // monthly cost or total cost
  billing_cycle: 'monthly' | 'annual';
  renewal_date: string;
  category: 'Infrastructure' | 'Communication' | 'Collaboration' | 'Sales & Marketing' | 'Productivity' | 'Security' | 'Analytics' | 'Other';
  active_seats: number;
  total_seats: number;
  status: 'Active' | 'Underused' | 'Redundant' | 'Cancelled';
}

export interface InvoiceTemp {
  id: string;
  organization_id: string;
  file_name: string;
  raw_text: string;
  status: 'pending' | 'processed' | 'failed';
  extracted_data: string | null; // JSON String
  created_at: string;
}

export interface AuditInsight {
  tool: string;
  issue: string;
  potential_savings: number;
  action_item: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AuditResponse {
  insights: AuditInsight[];
  summary: {
    total_spend: number;
    potential_savings: number;
    audit_date: string;
    organization_id: string;
  };
}
