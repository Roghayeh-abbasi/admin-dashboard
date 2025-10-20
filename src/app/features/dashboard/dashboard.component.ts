import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats$: Observable<any[]> | undefined;
  userCount = 0;
  productCount = 0;
  orderCount = 0;
  chartData = {
      labels: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه'],
      datasets: [{
      label: 'ثبت‌نام کاربران',
      data: [10, 20, 15, 30, 25],
      backgroundColor: '#40adff',
      borderColor: '#3399e6',
      borderWidth: 2,
      fill: false
    }]
  };
chartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const 
    },
    tooltip: { enabled: true }
  },
  scales: {
    y: { beginAtZero: true }
  }
};
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.stats$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(data => {
        this.userCount = data.length;
        this.productCount = 50;
        this.orderCount = 30;
      })
    );
  }
}