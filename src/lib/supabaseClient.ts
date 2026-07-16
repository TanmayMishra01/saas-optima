import { Subscription, Organization, Profile } from '../types';

// Mock/Fallback database for standard preview when Supabase is not yet configured.
const INITIAL_ORGS: Organization[] = [
  {
    id: 'org_enterprise_optima',
    name: 'Optima Enterprises Inc.',
    subdomain: 'optima',
    owner_id: 'user_admin_1',
    created_at: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'org_acme_corp',
    name: 'ACME Ventures Ltd.',
    subdomain: 'acme',
    owner_id: 'user_admin_2',
    created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user_admin_1',
    email: 'mishratanmay225@gmail.com',
    name: 'Tanmay Mishra',
    role: 'Admin',
    organization_id: 'org_enterprise_optima',
    created_at: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString()
  }
];

// Rich set of B2B subscription data demonstrating real inefficiencies
// (e.g. duplicate Zoom & Teams, Salesforce seat leakage, GitHub over-tiering)
const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_aws',
    organization_id: 'org_enterprise_optima',
    service_name: 'AWS Cloud Hosting',
    cost: 4850,
    billing_cycle: 'monthly',
    renewal_date: '2026-08-01',
    category: 'Infrastructure',
    active_seats: 120,
    total_seats: 120,
    status: 'Active'
  },
  {
    id: 'sub_salesforce',
    organization_id: 'org_enterprise_optima',
    service_name: 'Salesforce Enterprise CRM',
    cost: 3750, // 25 seats * $150
    billing_cycle: 'monthly',
    renewal_date: '2026-08-15',
    category: 'Sales & Marketing',
    active_seats: 11, // 14 seat leakage!
    total_seats: 25,
    status: 'Underused'
  },
  {
    id: 'sub_zoom',
    organization_id: 'org_enterprise_optima',
    service_name: 'Zoom Pro Video',
    cost: 749, // 50 licenses
    billing_cycle: 'monthly',
    renewal_date: '2026-07-28',
    category: 'Communication',
    active_seats: 48,
    total_seats: 50,
    status: 'Redundant' // Duplicates Microsoft Teams
  },
  {
    id: 'sub_msteams',
    organization_id: 'org_enterprise_optima',
    service_name: 'Microsoft Teams & 365',
    cost: 1250, // 100 seats
    billing_cycle: 'monthly',
    renewal_date: '2026-08-05',
    category: 'Communication',
    active_seats: 92,
    total_seats: 100,
    status: 'Active'
  },
  {
    id: 'sub_figma',
    organization_id: 'org_enterprise_optima',
    service_name: 'Figma Enterprise Design',
    cost: 1125, // 15 seats * $75
    billing_cycle: 'monthly',
    renewal_date: '2026-08-10',
    category: 'Productivity',
    active_seats: 6, // Inactive designers!
    total_seats: 15,
    status: 'Underused'
  },
  {
    id: 'sub_github',
    organization_id: 'org_enterprise_optima',
    service_name: 'GitHub Enterprise',
    cost: 840, // 40 seats * $21
    billing_cycle: 'annual',
    renewal_date: '2027-01-20',
    category: 'Collaboration',
    active_seats: 38,
    total_seats: 40,
    status: 'Active'
  },
  {
    id: 'sub_datadog',
    organization_id: 'org_enterprise_optima',
    service_name: 'Datadog APM & Logs',
    cost: 2150,
    billing_cycle: 'monthly',
    renewal_date: '2026-07-25',
    category: 'Security',
    active_seats: 8,
    total_seats: 10,
    status: 'Active'
  },
  {
    id: 'sub_slack',
    organization_id: 'org_enterprise_optima',
    service_name: 'Slack Business Pro',
    cost: 1250, // 100 seats
    billing_cycle: 'monthly',
    renewal_date: '2026-08-12',
    category: 'Communication',
    active_seats: 98,
    total_seats: 100,
    status: 'Active'
  }
];

class LocalDatabase {
  private subscriptions: Subscription[] = [];
  private organizations: Organization[] = [];
  private profiles: Profile[] = [];

  constructor() {
    // Load from local storage or initialize with rich realistic data
    const cachedSubs = localStorage.getItem('optima_subscriptions');
    const cachedOrgs = localStorage.getItem('optima_organizations');
    const cachedProfs = localStorage.getItem('optima_profiles');

    if (cachedSubs) {
      this.subscriptions = JSON.parse(cachedSubs);
    } else {
      this.subscriptions = [...INITIAL_SUBSCRIPTIONS];
      this.saveSubs();
    }

    if (cachedOrgs) {
      this.organizations = JSON.parse(cachedOrgs);
    } else {
      this.organizations = [...INITIAL_ORGS];
      this.saveOrgs();
    }

    if (cachedProfs) {
      this.profiles = JSON.parse(cachedProfs);
    } else {
      this.profiles = [...INITIAL_PROFILES];
      this.saveProfiles();
    }
  }

  private saveSubs() {
    localStorage.setItem('optima_subscriptions', JSON.stringify(this.subscriptions));
  }
  private saveOrgs() {
    localStorage.setItem('optima_organizations', JSON.stringify(this.organizations));
  }
  private saveProfiles() {
    localStorage.setItem('optima_profiles', JSON.stringify(this.profiles));
  }

  public getOrganizations() {
    return this.organizations;
  }

  public getProfiles() {
    return this.profiles;
  }

  public getSubscriptions(orgId: string): Subscription[] {
    return this.subscriptions.filter(s => s.organization_id === orgId);
  }

  public addSubscription(sub: Omit<Subscription, 'id'>): Subscription {
    const newSub: Subscription = {
      ...sub,
      id: `sub_${Math.random().toString(36).substr(2, 9)}`
    };
    this.subscriptions.push(newSub);
    this.saveSubs();
    return newSub;
  }

  public updateSubscription(id: string, updates: Partial<Subscription>): Subscription | null {
    const idx = this.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subscriptions[idx] = { ...this.subscriptions[idx], ...updates };
    this.saveSubs();
    return this.subscriptions[idx];
  }

  public deleteSubscription(id: string): boolean {
    const originalLen = this.subscriptions.length;
    this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    this.saveSubs();
    return this.subscriptions.length < originalLen;
  }

  public resetToDefault() {
    this.subscriptions = [...INITIAL_SUBSCRIPTIONS];
    this.organizations = [...INITIAL_ORGS];
    this.profiles = [...INITIAL_PROFILES];
    this.saveSubs();
    this.saveOrgs();
    this.saveProfiles();
  }
}

export const dbLocal = new LocalDatabase();

// Supabase Connection Settings Info & Verification
export const getSupabaseConfig = () => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return {
    isConfigured: !!(url && anonKey),
    url,
    anonKey
  };
};

// PostgreSQL DDL Script Export
export const POSTGRES_DDL_SCRIPT = `-- ==========================================
-- SaaS-Optima Multi-Tenant PostgreSQL Schema
-- Database: Supabase PostgreSQL
-- Features: Multi-Tenancy isolation with Row Level Security (RLS)
-- ==========================================

-- 1. Create EXTENSIONS (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create ORGANIZATIONS Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    owner_id UUID NOT NULL, -- points to auth.users in Supabase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create PROFILES Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Finance', 'Viewer')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create SUBSCRIPTIONS Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    cost DECIMAL(12, 2) NOT NULL CHECK (cost >= 0),
    billing_cycle VARCHAR(50) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    renewal_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN (
        'Infrastructure', 'Communication', 'Collaboration', 
        'Sales & Marketing', 'Productivity', 'Security', 'Analytics', 'Other'
    )),
    active_seats INTEGER NOT NULL DEFAULT 1 CHECK (active_seats >= 0),
    total_seats INTEGER NOT NULL DEFAULT 1 CHECK (total_seats >= 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Underused', 'Redundant', 'Cancelled')),
    CONSTRAINT check_seats_limit CHECK (active_seats <= total_seats)
);

-- 5. Create INVOICES_TEMP Table for OCR / Unstructured Parsing Cache
CREATE TABLE IF NOT EXISTS invoices_temp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    extracted_data JSONB, -- stores output from Gemini
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices_temp ENABLE ROW LEVEL SECURITY;

-- 1. ORGANIZATIONS Policies
CREATE POLICY "Users can view their own organization"
    ON organizations FOR SELECT
    USING (id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
    ));

CREATE POLICY "Organization owners can update organization settings"
    ON organizations FOR UPDATE
    USING (owner_id = auth.uid());

-- 2. PROFILES Policies
CREATE POLICY "Users can view profiles in their same organization"
    ON profiles FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
    ));

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

-- 3. SUBSCRIPTIONS Policies (Strict isolation)
CREATE POLICY "Users can SELECT subscriptions of their own organization"
    ON subscriptions FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
    ));

CREATE POLICY "Admin/Finance users can INSERT subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Finance')
        )
    );

CREATE POLICY "Admin/Finance users can UPDATE subscriptions"
    ON subscriptions FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Finance')
        )
    );

CREATE POLICY "Admin users can DELETE subscriptions"
    ON subscriptions FOR DELETE
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'Admin'
        )
    );

-- 4. INVOICES_TEMP Policies (Strict isolation)
CREATE POLICY "Users can SELECT invoices of their own organization"
    ON invoices_temp FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
    ));

CREATE POLICY "Admin/Finance users can INSERT and UPDATE invoices"
    ON invoices_temp FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Finance')
        )
    );
`;
