import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface BannerItem {
  id: number;
  titulo: string;
  subtitulo: string;
  imagem: string;
  link?: string;
  textoBotao?: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class BannerComponent implements OnInit, OnDestroy {
  banners: BannerItem[] = [
    {
      id: 1,
      titulo: 'Bem-vindo à Lojas SR',
      subtitulo: 'Os melhores produtos com os melhores preços',
      imagem: 'assets/images/banner1.jpg',
      link: '/produtos',
      textoBotao: 'Ver Produtos',
    },
    {
      id: 2,
      titulo: 'Ofertas Especiais',
      subtitulo: 'Até 50% de desconto em produtos selecionados',
      imagem: 'assets/images/banner2.jpg',
      link: '/produtos?promocao=true',
      textoBotao: 'Ver Ofertas',
    },
    {
      id: 3,
      titulo: 'Lançamentos',
      subtitulo: 'Confira os produtos que acabaram de chegar',
      imagem: 'assets/images/banner3.jpg',
      link: '/produtos?ordenar=mais-recentes',
      textoBotao: 'Ver Lançamentos',
    },
  ];

  bannerAtual = 0;
  private intervalo: any;

  ngOnInit(): void {
    this.iniciarCarousel();
  }

  ngOnDestroy(): void {
    this.pararCarousel();
  }

  iniciarCarousel(): void {
    this.intervalo = setInterval(() => {
      this.proximoBanner();
    }, 5000);
  }

  pararCarousel(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  proximoBanner(): void {
    this.bannerAtual = (this.bannerAtual + 1) % this.banners.length;
  }

  bannerAnterior(): void {
    this.bannerAtual =
      this.bannerAtual === 0 ? this.banners.length - 1 : this.bannerAtual - 1;
  }

  irParaBanner(index: number): void {
    this.bannerAtual = index;
    this.pararCarousel();
    this.iniciarCarousel();
  }
}
