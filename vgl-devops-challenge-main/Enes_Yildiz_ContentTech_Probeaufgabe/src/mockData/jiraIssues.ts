import { JiraIssue } from '../types';

/**
 * Mock Jira issues for testing
 * These simulate real Jira issues with various statuses and assignees
 */
export const mockJiraIssues: JiraIssue[] = [
  {
    key: 'PLAN-1234',
    summary: 'Update product comparison for smartphones',
    status: 'In Progress',
    assignee: 'Max Mustermann',
    priority: 'High',
    created: '2025-09-15T10:00:00Z',
    statusChangedDate: '2025-10-01T14:30:00Z', // 28 days ago
  },
  {
    key: 'PLAN-1235',
    summary: 'Review SEO keywords for laptop category',
    status: 'In Progress',
    assignee: 'Max Mustermann',
    priority: 'Medium',
    created: '2025-09-20T09:00:00Z',
    statusChangedDate: '2025-10-05T11:00:00Z', // 24 days ago
  },
  {
    key: 'PLAN-1236',
    summary: 'Add new products to tablet comparison',
    status: 'In Progress',
    assignee: 'Max Mustermann',
    priority: 'Medium',
    created: '2025-10-01T08:00:00Z',
    statusChangedDate: '2025-10-10T16:00:00Z', // 19 days ago
  },
  {
    key: 'PLAN-1237',
    summary: 'Update pricing information',
    status: 'In Progress',
    assignee: 'Max Mustermann',
    priority: 'Low',
    created: '2025-10-05T10:00:00Z',
    statusChangedDate: '2025-10-12T09:00:00Z', // 17 days ago
  },
  {
    key: 'PLAN-1238',
    summary: 'Fix broken product links',
    status: 'In Progress',
    assignee: 'Max Mustermann',
    priority: 'High',
    created: '2025-10-08T11:00:00Z',
    statusChangedDate: '2025-10-14T10:00:00Z', // 15 days ago
  },
  {
    key: 'PLAN-2345',
    summary: 'Create new comparison for headphones',
    status: 'In Progress',
    assignee: 'Anna Schmidt',
    priority: 'High',
    created: '2025-09-18T09:00:00Z',
    statusChangedDate: '2025-10-04T13:00:00Z', // 25 days ago
  },
  {
    key: 'PLAN-2346',
    summary: 'Update editorial content for cameras',
    status: 'In Progress',
    assignee: 'Anna Schmidt',
    priority: 'Medium',
    created: '2025-09-25T10:00:00Z',
    statusChangedDate: '2025-10-08T14:00:00Z', // 21 days ago
  },
  {
    key: 'PLAN-2347',
    summary: 'Review competitor pricing',
    status: 'In Progress',
    assignee: 'Anna Schmidt',
    priority: 'Medium',
    created: '2025-10-02T11:00:00Z',
    statusChangedDate: '2025-10-09T15:00:00Z', // 20 days ago
  },
  {
    key: 'PLAN-2348',
    summary: 'Add FAQ section to product pages',
    status: 'In Progress',
    assignee: 'Anna Schmidt',
    priority: 'Low',
    created: '2025-10-10T09:00:00Z',
    statusChangedDate: '2025-10-13T10:00:00Z', // 16 days ago
  },
  {
    key: 'PLAN-3456',
    summary: 'Optimize images for better performance',
    status: 'In Progress',
    assignee: null, // Unassigned
    priority: 'Medium',
    created: '2025-09-28T10:00:00Z',
    statusChangedDate: '2025-10-07T12:00:00Z', // 22 days ago
  },
  {
    key: 'PLAN-3457',
    summary: 'Update meta descriptions',
    status: 'In Progress',
    assignee: null, // Unassigned
    priority: 'Low',
    created: '2025-10-05T11:00:00Z',
    statusChangedDate: '2025-10-11T13:00:00Z', // 18 days ago
  },
  {
    key: 'PLAN-3458',
    summary: 'Fix mobile responsive issues',
    status: 'In Progress',
    assignee: null, // Unassigned
    priority: 'High',
    created: '2025-10-12T09:00:00Z',
    statusChangedDate: '2025-10-15T14:00:00Z', // 14 days ago - should NOT be included
  },
  // Issues that should NOT be included (different status or too recent)
  {
    key: 'PLAN-4567',
    summary: 'New feature development',
    status: 'To Do',
    assignee: 'Max Mustermann',
    priority: 'High',
    created: '2025-10-20T10:00:00Z',
    statusChangedDate: '2025-10-20T10:00:00Z',
  },
  {
    key: 'PLAN-4568',
    summary: 'Recently started task',
    status: 'In Progress',
    assignee: 'Anna Schmidt',
    priority: 'Medium',
    created: '2025-10-25T09:00:00Z',
    statusChangedDate: '2025-10-25T09:00:00Z', // Only 4 days ago
  },
  {
    key: 'PLAN-4569',
    summary: 'Completed task',
    status: 'Done',
    assignee: 'Max Mustermann',
    priority: 'High',
    created: '2025-09-01T10:00:00Z',
    statusChangedDate: '2025-10-15T16:00:00Z',
  },
];
