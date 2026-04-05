import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-badge.component.html',
  styleUrl: './score-badge.component.scss'
})
export class ScoreBadgeComponent implements OnChanges {
  @Input() score: number = 0;
  @Input() verdict: string = '';

  // Animated display value — counts up from 0 to score
  displayScore: number = 0;

  get colorClass(): string {
    if (this.score <= 30) return 'danger';
    if (this.score <= 60) return 'warn';
    if (this.score <= 80) return 'good';
    return 'great';
  }

  get circumference(): number {
    return 2 * Math.PI * 36; // radius = 36
  }

  get strokeDashoffset(): number {
    return this.circumference - (this.displayScore / 100) * this.circumference;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score'] && this.score !== undefined) {
      this.animateScore(this.score);
    }
  }

  private animateScore(target: number): void {
    this.displayScore = 0;
    const duration = 1200; // ms
    const steps = 60;
    const increment = target / steps;
    const intervalMs = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.displayScore = Math.round(target);
        clearInterval(timer);
      } else {
        this.displayScore = Math.round(current);
      }
    }, intervalMs);
  }
}
