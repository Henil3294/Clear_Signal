import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-badge.component.html',
  styleUrl: './score-badge.component.scss'
})
export class ScoreBadgeComponent {
  @Input() score: number = 0;
  @Input() verdict: string = '';

  get colorClass(): string {
    if (this.score <= 30) return 'danger';
    if (this.score <= 60) return 'warn';
    if (this.score <= 80) return 'good';
    return 'great';
  }

  get circumference(): number { return 2 * Math.PI * 36; }

  get strokeDashoffset(): number {
    return this.circumference - (this.score / 100) * this.circumference;
  }
}
