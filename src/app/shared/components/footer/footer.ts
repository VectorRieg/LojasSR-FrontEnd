import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 Lojas SR. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: #333;
        color: white;
        padding: 2rem 0;
        margin-top: 3rem;
        text-align: center;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
    `,
  ],
})
export class FooterComponent {}
