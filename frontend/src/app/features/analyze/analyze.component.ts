import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyzeService } from '../../core/analyze.service';
import { LoaderComponent, AnalysisStep } from '../../shared/loader/loader.component';
import { ResultCardComponent } from './result-card/result-card.component';
import { Scan } from '../../core/models/scan.model';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, ResultCardComponent],
  templateUrl: './analyze.component.html',
  styleUrl: './analyze.component.scss'
})
export class AnalyzeComponent {
  inputText = '';
  isLoading = false;
  error     = '';
  percentage = 0;
  result: Scan | null = null;
  private progressInterval: any;

  steps: AnalysisStep[] = [
    { label: 'Extracting claims',   detail: 'Identifying key claims and named entities via Gemini...', status: 'pending' },
    { label: 'Gathering evidence',  detail: 'Querying Google, Wikipedia in parallel...',               status: 'pending' },
    { label: 'Deep analysis',       detail: 'Comparing claims against sources with Gemini...',         status: 'pending' },
    { label: 'Building report',     detail: 'Saving result and generating your report card...',        status: 'pending' }
  ];

  constructor(private analyzeService: AnalyzeService, private router: Router) {}

  get charCount() { return this.inputText.length; }

  onAnalyze() {
    if (!this.inputText.trim()) { this.error = 'Please paste an article or headline.'; return; }
    if (this.inputText.length < 20) { this.error = 'Input too short. Please provide more text.'; return; }

    this.isLoading = true;
    this.error     = '';
    this.result    = null;
    this.percentage = 0;
    this.resetSteps();
    this.runStepAnimation();
    this.startSmoothProgress();

    this.analyzeService.analyze(this.inputText).subscribe({
      next: (data) => {
        this.finishSteps();
        setTimeout(() => { this.result = data; this.isLoading = false; }, 400);
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = err.error?.error || '';
        
        // Map technical quota errors and safety blocks to Cyberpunk-friendly messages
        if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota')) {
          this.error = '🛸 Neural Link Busy: The AI is currently processing multiple requests. Please wait 15 seconds and try again.';
        } else if (errMsg.includes('blocked') || errMsg.includes('SAFETY')) {
          this.error = '⚠️ Safety Limitation: The AI model has flagged this content as potentially violating safety guidelines. Please try a different topic.';
        } else {
          this.error = '⚠️ Link Interrupted: The deep analysis was unable to complete. Please try again.';
        }
        
        this.resetSteps();
      }
    });
  }

  viewFullReport() {
    if (this.result) this.router.navigate(['/report', this.result._id]);
  }

  private resetSteps() {
    this.steps.forEach(s => s.status = 'pending');
  }

  private runStepAnimation() {
    // Simulate stage progression — real stages run on backend
    const delays = [0, 1800, 4000, 6500];
    delays.forEach((delay, i) => {
      setTimeout(() => {
        if (!this.isLoading && i > 0) return;
        this.steps[i].status = 'active';
        if (i > 0) this.steps[i - 1].status = 'done';
      }, delay);
    });
  }

  private startSmoothProgress() {
    this.progressInterval = setInterval(() => {
      if (this.percentage < 98) {
        const increment = this.percentage < 80 ? 1 : 0.2;
        this.percentage = parseFloat((this.percentage + increment).toFixed(1));
      }
    }, 100);
  }

  private finishSteps() {
    clearInterval(this.progressInterval);
    this.percentage = 100;
    this.steps.forEach(s => s.status = 'done');
  }
}
