import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyzeService } from '../../core/analyze.service';
import { ScanHistoryItem } from '../../core/models/scan.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  allScans: ScanHistoryItem[] = [];
  filter   = 'all';
  loading  = true;

  constructor(private analyzeService: AnalyzeService) {}

  ngOnInit() {
    this.analyzeService.getHistory().subscribe({
      next: (data) => { this.allScans = data; this.loading = false; },
      error: ()     => { this.loading = false; }
    });
  }

  get filtered(): ScanHistoryItem[] {
    if (this.filter === 'fake')     return this.allScans.filter(s => s.credibilityScore <= 30);
    if (this.filter === 'mixed')    return this.allScans.filter(s => s.credibilityScore > 30 && s.credibilityScore <= 60);
    if (this.filter === 'credible') return this.allScans.filter(s => s.credibilityScore > 60);
    return this.allScans;
  }

  getScoreClass(score: number): string {
    if (score <= 30) return 'danger';
    if (score <= 60) return 'warn';
    return 'good';
  }

  truncate(text: string, len = 80): string {
    return text.length > len ? text.substring(0, len) + '...' : text;
  }
}
