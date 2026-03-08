/**
 * Type definitions for the Jira Stale Issues Reporter
 */

export interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  assignee: string | null;
  priority: 'High' | 'Medium' | 'Low';
  created: string; // ISO date string
  statusChangedDate: string; // ISO date string
  description?: string;
}

export interface IssueStats {
  assignee: string;
  issueCount: number;
  averageDays: number;
  issues: string[]; // Array of issue keys
}

export interface OldestIssueEntry {
  key: string;
  summary: string;
  assignee: string;
  daysInStatus: number;
}

export interface StaleIssuesReport {
  totalStaleIssues: number;
  statsByAssignee: IssueStats[];
  oldestIssues: OldestIssueEntry[];
}

export interface ReportConfig {
  staleDaysThreshold: number;
  topIssuesCount: number;
  statusFilter: string;
}
