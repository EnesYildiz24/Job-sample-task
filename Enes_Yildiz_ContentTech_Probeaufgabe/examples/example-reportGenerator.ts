/**
 * Example: Report Generator Service
 * 
 * This is an example of how you could structure your report generator.
 * Feel free to use this as inspiration or create your own approach.
 */

import { StaleIssuesReport } from '../src/types';

export class ReportGenerator {
  /**
   * Example: Generate a formatted console report
   */
  generateConsoleReport(report: StaleIssuesReport): void {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STALE ISSUES REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // TODO: Implement report formatting
    // Hint: Use console.table() for nice tables
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Example: Format a number to fixed decimal places
   */
  formatNumber(num: number, decimals: number = 1): string {
    return num.toFixed(decimals);
  }
}
