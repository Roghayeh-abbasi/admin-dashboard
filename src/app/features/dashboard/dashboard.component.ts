import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class DashboardComponent implements OnInit, AfterViewInit {
  stats$: Observable<any[]> | undefined;
  userCount = 0;
  productCount = 0;
  orderCount = 0;
  chartData = {
    labels: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه'],
    datasets: [{
      label: 'ثبت‌نام کاربران',
      data: [10, 20, 15, 30, 25, 35, 40],
      backgroundColor: 'rgba(64, 173, 255, 0.2)',
      borderColor: '#40adff',
      borderWidth: 2,
      fill: false,
      tension: 0.4
    }]
  };
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#1f2937'
        }
      },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        title: { display: true, text: 'ماه', color: '#1f2937' },
        ticks: { color: '#1f2937' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'تعداد کاربران', color: '#1f2937' },
        ticks: { color: '#1f2937' }
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
    this.updateChartForTheme();
    console.log('Chart Data onInit:', this.chartData);
  }

  ngAfterViewInit() {
    console.log('Chart Data after view init:', this.chartData);
    if (!document.querySelector('canvas')) {
      console.warn('Canvas element not found in DOM.');
    } else if (!this.chartData || !this.chartData.datasets || this.chartData.datasets.length === 0) {
      console.warn('No chart data available for rendering.');
    } else {
      console.log('Canvas and data are ready.');
    }
  }

  loadStats() {
    this.stats$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(data => {
        this.userCount = data.length;
        this.productCount = 50;
        this.orderCount = 30;
      })
    );
    this.stats$.subscribe(
      () => console.log('Stats loaded:', { userCount: this.userCount, productCount: this.productCount, orderCount: this.orderCount }),
      error => console.error('Error loading stats:', error)
    );
  }

  private updateChartForTheme() {
    if (document.body.classList.contains('dark-theme')) {
     
      this.chartData = {
        ...this.chartData,
        datasets: this.chartData.datasets.map(dataset => ({
          ...dataset,
          borderColor: '#ffffff', 
          backgroundColor: 'rgba(255, 255, 255, 0.2)' 
        }))
      };


      this.chartOptions = {
        ...this.chartOptions,
        plugins: this.chartOptions?.plugins
          ? {
              ...this.chartOptions.plugins,
              legend: {
                ...this.chartOptions.plugins.legend,
                labels: { color: '#ffffff' }
              }
            }
          : { legend: { position: 'top', labels: { color: '#ffffff' } } },
        scales: this.chartOptions?.scales
          ? {
              x: {
                ...this.chartOptions.scales['x'],
                title: {
                  ...this.chartOptions.scales['x']?.title,
                  color: '#ffffff'
                },
                ticks: { color: '#ffffff' }
              },
              y: {
                ...this.chartOptions.scales['y'],
                title: {
                  ...this.chartOptions.scales['y']?.title,
                  color: '#ffffff'
                },
                ticks: { color: '#ffffff' }
              }
            }
          : {
              x: { title: { display: true, text: 'ماه', color: '#ffffff' }, ticks: { color: '#ffffff' } },
              y: { beginAtZero: true, title: { display: true, text: 'تعداد کاربران', color: '#ffffff' }, ticks: { color: '#ffffff' } }
            }
      };
    }
  }
}