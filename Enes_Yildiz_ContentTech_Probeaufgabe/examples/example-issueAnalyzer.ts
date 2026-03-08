/**
 * Example: Issue Analyzer Service
 * 
 * This is an example of how you could structure your issue analyzer.
 * Feel free to use this as inspiration or create your own approach.
 */

import { JiraIssue } from '../src/types';

export class IssueAnalyzer {
  /**
   * Example: Filter issues by status and days in status
   */
  filterStaleIssues(issues: JiraIssue[], daysThreshold: number): JiraIssue[] {
    // TODO: Implement filtering logic
    // Hint: Calculate days between statusChangedDate and now
    return [];
  }

  /**
   * Example: Calculate days between two dates
   */
  calculateDaysInStatus(statusChangedDate: string): number {
    // TODO: Implement date calculation
    // Hint: Use Date objects or moment.js
    return 0;
  }

  /**
   * Example: Group issues by assignee
   */
  groupByAssignee(issues: JiraIssue[]): Map<string, JiraIssue[]> {
    // TODO: Implement grouping logic
    // Hint: Use Map or reduce
    return new Map();
  }
}
