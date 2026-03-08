import { IssueStats, ReportConfig, StaleIssuesReport } from '../types';

const REPORT_SEPARATOR = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
const NO_STALE_ISSUES_MESSAGE = 'No stale issues found.';

/**
 * Builds and prints a formatted console report from analyzed issue data.
 */
export class ReportGenerator {
  generateConsoleReport(report: StaleIssuesReport, config: ReportConfig): void {
    console.log(this.buildReport(report, config));
  }

  /**
   * Creates the full report output string.
   */
  buildReport(report: StaleIssuesReport, config: ReportConfig): string {
    const lines: string[] = [
      REPORT_SEPARATOR,
      '📊 STALE ISSUES REPORT',
      REPORT_SEPARATOR,
      '',
      `Total stale issues (>${config.staleDaysThreshold} days in "${config.statusFilter}"): ${report.totalStaleIssues}`,
      '',
      'Issues by Assignee:',
      ...this.buildAssigneeTable(report.statsByAssignee),
      '',
      `Top ${config.topIssuesCount} Oldest Issues:`,
      ...this.buildOldestIssuesList(report),
      '',
      REPORT_SEPARATOR,
    ];

    return lines.join('\n');
  }

  /**
   * Renders a fixed-width text table with dynamic column sizes.
   */
  private buildAssigneeTable(statsByAssignee: IssueStats[]): string[] {
    if (statsByAssignee.length === 0) {
      return [NO_STALE_ISSUES_MESSAGE];
    }

    const assigneeHeader = 'Assignee';
    const issueHeader = 'Issues';
    const avgHeader = 'Avg. Days';

    const assigneeWidth = Math.max(
      assigneeHeader.length,
      ...statsByAssignee.map((stats) => stats.assignee.length),
    );
    const issueWidth = Math.max(
      issueHeader.length,
      ...statsByAssignee.map((stats) => String(stats.issueCount).length),
    );
    const averageWidth = Math.max(
      avgHeader.length,
      ...statsByAssignee.map((stats) => this.formatAverageDays(stats.averageDays).length),
    );

    const topBorder = `┌${'─'.repeat(assigneeWidth + 2)}┬${'─'.repeat(issueWidth + 2)}┬${'─'.repeat(averageWidth + 2)}┐`;
    const headerRow = `│ ${assigneeHeader.padEnd(assigneeWidth)} │ ${issueHeader.padEnd(issueWidth)} │ ${avgHeader.padEnd(averageWidth)} │`;
    const middleBorder = `├${'─'.repeat(assigneeWidth + 2)}┼${'─'.repeat(issueWidth + 2)}┼${'─'.repeat(averageWidth + 2)}┤`;
    const rows = statsByAssignee.map((stats) => {
      const issueCount = String(stats.issueCount).padEnd(issueWidth);
      const averageDays = this.formatAverageDays(stats.averageDays).padEnd(averageWidth);

      return `│ ${stats.assignee.padEnd(assigneeWidth)} │ ${issueCount} │ ${averageDays} │`;
    });
    const bottomBorder = `└${'─'.repeat(assigneeWidth + 2)}┴${'─'.repeat(issueWidth + 2)}┴${'─'.repeat(averageWidth + 2)}┘`;

    return [topBorder, headerRow, middleBorder, ...rows, bottomBorder];
  }

  private buildOldestIssuesList(report: StaleIssuesReport): string[] {
    if (report.oldestIssues.length === 0) {
      return [NO_STALE_ISSUES_MESSAGE];
    }

    return report.oldestIssues.map((issue, index) => {
      return `${index + 1}. ${issue.key} - "${issue.summary}" (${issue.assignee}, ${issue.daysInStatus} days)`;
    });
  }

  private formatAverageDays(value: number): string {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
}
