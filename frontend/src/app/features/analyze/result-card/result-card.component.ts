import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreBadgeComponent } from '../../../shared/score-badge/score-badge.component';
import { Scan } from '../../../core/models/scan.model';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule, ScoreBadgeComponent],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss'
})
export class ResultCardComponent {
  @Input() scan!: Scan;

  getScoreClass(score: number): string {
    if (score <= 30) return 'danger';
    if (score <= 60) return 'warn';
    return 'good';
  }
}
