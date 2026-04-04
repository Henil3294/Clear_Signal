import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyzeService } from '../../core/analyze.service';
import { AuthService } from '../../core/auth.service';
import { ScanHistoryItem } from '../../core/models/scan.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  history: ScanHistoryItem[] = [];
  loading = true;

  constructor(public auth: AuthService, private analyzeService: AnalyzeService) {}

  ngOnInit() {
    this.analyzeService.getHistory().subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  get totalScans()    { return this.history.length; }
  get fakeCount()     { return this.history.filter(s => s.credibilityScore <= 30).length; }
  get credibleCount() { return this.history.filter(s => s.credibilityScore > 60).length; }
  get avgScore() {
    if (!this.history.length) return 0;
    return Math.round(this.history.reduce((a, s) => a + s.credibilityScore, 0) / this.history.length);
  }

  getScoreClass(score: number): string {
    if (score <= 30) return 'danger';
    if (score <= 60) return 'warn';
    return 'good';
  }

  getScoreColor(score: number): string {
    if (score <= 30) return '#f72585';
    if (score <= 60) return '#a855f7';
    return '#00d4ff';
  }

  truncate(text: string, len = 60): string {
    return text.length > len ? text.substring(0, len) + '...' : text;
  }
}
