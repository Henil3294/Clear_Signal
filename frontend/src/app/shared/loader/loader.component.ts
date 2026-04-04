import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AnalysisStep {
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'done';
}

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() steps: AnalysisStep[] = [];
}
