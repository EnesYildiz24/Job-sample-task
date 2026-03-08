import {
  IssueStats,
  JiraIssue,
  OldestIssueEntry,
  ReportConfig,
  StaleIssuesReport,
} from '../types';
import { differenceInUtcDays, parseDateInput } from '../utils/dateHelper';

const UNASSIGNED_LABEL = 'Unassigned';

type IssueAccumulator = {
  issueCount: number;
  totalDays: number;
  issues: string[];
};

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  staleDaysThreshold: 14,
  topIssuesCount: 3,
  statusFilter: 'In Progress',
};

/**
 * Contains the core business logic for stale issue analysis.
 */
export class IssueAnalyzer {
  constructor(private readonly config: ReportConfig = DEFAULT_REPORT_CONFIG) {}

  /**
   * Runs the full analysis pipeline and returns a normalized report object.
   */
  analyze(issues: JiraIssue[], referenceDate: Date): StaleIssuesReport {
    this.validateInputs(issues, referenceDate);

    const staleIssues = this.filterStaleIssues(issues, referenceDate);
    const statsByAssignee = this.buildStatsByAssignee(staleIssues, referenceDate);
    const oldestIssues = this.getOldestIssues(staleIssues, referenceDate, this.config.topIssuesCount);

    return {
      totalStaleIssues: staleIssues.length,
      statsByAssignee,
      oldestIssues,
    };
  }

  /**
   * Returns only issues matching the configured status and stale threshold.
   */
  public filterStaleIssues(issues: JiraIssue[], referenceDate: Date): JiraIssue[] {
    return issues.filter((issue) => {
      const daysInCurrentStatus = this.getDaysInCurrentStatus(issue, referenceDate);

      return (
        issue.status === this.config.statusFilter &&
        daysInCurrentStatus > this.config.staleDaysThreshold
      );
    });
  }

  getDaysInCurrentStatus(issue: JiraIssue, referenceDate: Date): number {
    return differenceInUtcDays(issue.statusChangedDate, referenceDate);
  }

  /**
   * Groups stale issues by assignee and computes count, average days, and keys.
   */
  private buildStatsByAssignee(issues: JiraIssue[], referenceDate: Date): IssueStats[] {
    const groupedIssues = issues.reduce<Map<string, IssueAccumulator>>((accumulator, issue) => {
      const assignee = issue.assignee ?? UNASSIGNED_LABEL;
      const daysInCurrentStatus = this.getDaysInCurrentStatus(issue, referenceDate);
      const currentGroup = accumulator.get(assignee) ?? {
        issueCount: 0,
        totalDays: 0,
        issues: [],
      };

      currentGroup.issueCount += 1;
      currentGroup.totalDays += daysInCurrentStatus;
      currentGroup.issues.push(issue.key);
      accumulator.set(assignee, currentGroup);

      return accumulator;
    }, new Map<string, IssueAccumulator>());

    return Array.from(groupedIssues.entries())
      .map(([assignee, stats]) => ({
        assignee,
        issueCount: stats.issueCount,
        averageDays: Number((stats.totalDays / stats.issueCount).toFixed(1)),
        issues: stats.issues,
      }))
      .sort((a, b) => b.issueCount - a.issueCount || a.assignee.localeCompare(b.assignee));
  }

  /**
   * Sorts stale issues by age in status and returns the configured top N items.
   */
  private getOldestIssues(
    issues: JiraIssue[],
    referenceDate: Date,
    topIssuesCount: number,
  ): OldestIssueEntry[] {
    const normalizedTopCount = Math.max(0, topIssuesCount);

    return issues
      .map((issue) => ({
        key: issue.key,
        summary: issue.summary,
        assignee: issue.assignee ?? UNASSIGNED_LABEL,
        daysInStatus: this.getDaysInCurrentStatus(issue, referenceDate),
      }))
      .sort((a, b) => b.daysInStatus - a.daysInStatus || a.key.localeCompare(b.key))
      .slice(0, normalizedTopCount);
  }

  private validateInputs(issues: JiraIssue[], referenceDate: Date): void {
    if (!Array.isArray(issues)) {
      throw new Error('Issues input must be an array.');
    }

    if (!(referenceDate instanceof Date) || Number.isNaN(referenceDate.getTime())) {
      throw new Error('Reference date must be a valid Date instance.');
    }

    issues.forEach((issue, index) => this.validateIssue(issue, index));
  }

  private validateIssue(issue: JiraIssue, index: number): void {
    if (!issue || typeof issue !== 'object') {
      throw new Error(`Issue at index ${index} is not a valid object.`);
    }

    if (!issue.key || !issue.summary || !issue.status) {
      throw new Error(`Issue at index ${index} is missing required fields.`);
    }

    if (typeof issue.statusChangedDate !== 'string') {
      throw new Error(`Issue "${issue.key}" has an invalid statusChangedDate type.`);
    }

    parseDateInput(issue.statusChangedDate);
  }
}
