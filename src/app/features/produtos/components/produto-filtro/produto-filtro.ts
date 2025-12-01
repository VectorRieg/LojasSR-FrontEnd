import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface FiltrosProduto {
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
  ordenarPor?: string;
  apenasPromocao?: boolean;
  apenasDisponiveis?: boolean;
}

@Component({
  selector: 'app-produto-filtro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto-filtro.html',
  styleUrl: './produto-filtro.css',
})
export class ProdutoFiltroComponent implements OnInit {
  @Output() filtrosChange = new EventEmitter<FiltrosProduto>();

  filtroForm!: FormGroup;
  categorias: string[] = [
    'Todos',
    'Eletrônicos',
    'Roupas',
    'Livros',
    'Casa e Decoração',
    'Esportes',
    'Beleza',
    'Alimentos',
  ];

  opcoesOrdenacao = [
    { value: 'relevancia', label: 'Mais Relevantes' },
    { value: 'menor-preco', label: 'Menor Preço' },
    { value: 'maior-preco', label: 'Maior Preço' },
    { value: 'nome-asc', label: 'Nome (A-Z)' },
    { value: 'nome-desc', label: 'Nome (Z-A)' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.observarMudancas();
  }

  inicializarFormulario(): void {
    this.filtroForm = this.fb.group({
      categoria: ['Todos'],
      precoMin: [null],
      precoMax: [null],
      busca: [''],
      ordenarPor: ['relevancia'],
      apenasPromocao: [false],
      apenasDisponiveis: [true],
    });
  }

  observarMudancas(): void {
    this.filtroForm.valueChanges.subscribe((valores) => {
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const filtros: FiltrosProduto = {};

    const categoria = this.filtroForm.get('categoria')?.value;
    if (categoria && categoria !== 'Todos') {
      filtros.categoria = categoria;
    }

    const precoMin = this.filtroForm.get('precoMin')?.value;
    if (precoMin !== null && precoMin !== '') {
      filtros.precoMin = Number(precoMin);
    }

    const precoMax = this.filtroForm.get('precoMax')?.value;
    if (precoMax !== null && precoMax !== '') {
      filtros.precoMax = Number(precoMax);
    }

    const busca = this.filtroForm.get('busca')?.value;
    if (busca && busca.trim()) {
      filtros.busca = busca.trim();
    }

    const ordenarPor = this.filtroForm.get('ordenarPor')?.value;
    if (ordenarPor) {
      filtros.ordenarPor = ordenarPor;
    }

    const apenasPromocao = this.filtroForm.get('apenasPromocao')?.value;
    if (apenasPromocao) {
      filtros.apenasPromocao = true;
    }

    const apenasDisponiveis = this.filtroForm.get('apenasDisponiveis')?.value;
    if (apenasDisponiveis) {
      filtros.apenasDisponiveis = true;
    }

    this.filtrosChange.emit(filtros);
  }

  limparFiltros(): void {
    this.filtroForm.patchValue({
      categoria: 'Todos',
      precoMin: null,
      precoMax: null,
      busca: '',
      ordenarPor: 'relevancia',
      apenasPromocao: false,
      apenasDisponiveis: true,
    });
  }
}
