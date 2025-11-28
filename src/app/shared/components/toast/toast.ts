import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" [class]="type" *ngIf="show">
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease-in-out;
      }
      .success {
        background: #28a745;
      }
      .error {
        background: #dc3545;
      }
      .warning {
        background: #ffc107;
        color: #333;
      }
      .info {
        background: #17a2b8;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() show: boolean = false;
}
