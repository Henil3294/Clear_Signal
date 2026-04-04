import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyzeService } from '../../core/analyze.service';
import { ResultCardComponent } from '../analyze/result-card/result-card.component';
import { Scan } from '../../core/models/scan.model';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterLink, ResultCardComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  scan: Scan | null = null;
  loading = true;
  error   = '';

  constructor(private route: ActivatedRoute, private analyzeService: AnalyzeService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.analyzeService.getScanById(id).subscribe({
      next: (data) => { this.scan = data; this.loading = false; },
      error: ()     => { this.error = 'Report not found.'; this.loading = false; }
    });
  }
}
