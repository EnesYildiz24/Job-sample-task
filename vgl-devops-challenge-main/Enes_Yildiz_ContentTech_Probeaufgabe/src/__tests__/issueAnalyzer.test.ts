import { mockJiraIssues } from '../mockData/jiraIssues';
import { DEFAULT_REPORT_CONFIG, IssueAnalyzer } from '../services/issueAnalyzer';
import { JiraIssue } from '../types';

describe('IssueAnalyzer', () => {
  const referenceDate = new Date('2025-10-29T09:00:00Z');
  const analyzer = new IssueAnalyzer(DEFAULT_REPORT_CONFIG);

  it('creates the expected stale issues report', () => {
    const report = analyzer.analyze(mockJiraIssues, referenceDate);

    expect(report.totalStaleIssues).toBe(11);
    expect(report.statsByAssignee).toEqual([
      {
        assignee: 'Max Mustermann',
        issueCount: 5,
        averageDays: 20.6,
        issues: ['PLAN-1234', 'PLAN-1235', 'PLAN-1236', 'PLAN-1237', 'PLAN-1238'],
      },
      {
        assignee: 'Anna Schmidt',
        issueCount: 4,
        averageDays: 20.5,
        issues: ['PLAN-2345', 'PLAN-2346', 'PLAN-2347', 'PLAN-2348'],
      },
      {
        assignee: 'Unassigned',
        issueCount: 2,
        averageDays: 20,
        issues: ['PLAN-3456', 'PLAN-3457'],
      },
    ]);
    expect(report.oldestIssues.map((issue) => issue.key)).toEqual([
      'PLAN-1234',
      'PLAN-2345',
      'PLAN-1235',
    ]);
  });

  it('excludes issues that are exactly on the stale threshold', () => {
    const staleIssues = analyzer.filterStaleIssues(mockJiraIssues, referenceDate);
    const issueKeys = staleIssues.map((issue) => issue.key);

    expect(issueKeys).not.toContain('PLAN-3458');
  });

  it('throws on invalid input data', () => {
    const invalidIssue: JiraIssue = {
      ...mockJiraIssues[0],
      key: 'PLAN-9999',
      statusChangedDate: 'not-a-date',
    };

    expect(() => analyzer.analyze([invalidIssue], referenceDate)).toThrow(
      'Invalid date value: not-a-date',
    );
  });
});
