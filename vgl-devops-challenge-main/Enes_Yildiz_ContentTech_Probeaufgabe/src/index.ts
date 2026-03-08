/**
 * Jira Stale Issues Reporter
 *
 * This bot analyzes Jira issues that have been in "In Progress" status
 * for more than 14 days and generates a report.
 */

import { mockJiraIssues } from './mockData/jiraIssues';
import { DEFAULT_REPORT_CONFIG, IssueAnalyzer } from './services/issueAnalyzer';
import { ReportGenerator } from './services/reportGenerator';
import { logger } from './utils/logger';

// IMPORTANT:
// Use this date for time comparisons instead of Date.now()
// It's important for the mock data to return the correct results
const today = new Date("2025-10-29T09:00:00Z");

function main(): void {
  logger.info('🚀 Starting Jira Stale Issues Reporter...');

  try {
    const issueAnalyzer = new IssueAnalyzer(DEFAULT_REPORT_CONFIG);
    const reportGenerator = new ReportGenerator();

    logger.info(`Loaded ${mockJiraIssues.length} issues`);
    logger.info(`Using fixed reference date: ${today.toISOString()}`);

    const report = issueAnalyzer.analyze(mockJiraIssues, today);
    reportGenerator.generateConsoleReport(report, DEFAULT_REPORT_CONFIG);

    logger.info('✅ Report completed successfully');
  } catch (error) {
    logger.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
