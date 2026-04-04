import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Scan, ScanHistoryItem } from './models/scan.model';

@Injectable({ providedIn: 'root' })
export class AnalyzeService {
  constructor(private http: HttpClient) {}

  analyze(text: string) {
    return this.http.post<Scan>(`${environment.apiUrl}/analyze`, { text });
  }

  getHistory() {
    return this.http.get<ScanHistoryItem[]>(`${environment.apiUrl}/analyze/history`);
  }

  getScanById(id: string) {
    return this.http.get<Scan>(`${environment.apiUrl}/analyze/${id}`);
  }
}
