import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService, Endereco } from '../../services/perfil';

@Component({
  selector: 'app-perfil-enderecos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-enderecos.html',
  styleUrl: './perfil-enderecos.css',
})
export class PerfilEnderecosComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private fb = inject(FormBuilder);

  enderecos: Endereco[] = [];
  enderecoForm!: FormGroup;
  carregando = false;
  mensagem = '';
  mensagemTipo: 'sucesso' | 'erro' = 'sucesso';
  mostrarFormulario = false;
  enderecoEmEdicao: Endereco | null = null;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarEnderecos();
  }

  inicializarFormulario(): void {
    this.enderecoForm = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(8)]],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      principal: [false],
    });
  }

  carregarEnderecos(): void {
    this.carregando = true;
    this.perfilService.getEnderecos().subscribe({
      next: (enderecos) => {
        this.enderecos = enderecos;
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao carregar endereços', 'erro');
        this.carregando = false;
      },
    });
  }

  buscarCep(): void {
    const cep = this.enderecoForm.get('cep')?.value;
    if (!cep || cep.length < 8) {
      return;
    }

    this.carregando = true;
    this.perfilService.buscarCep(cep).subscribe({
      next: (dados) => {
        if (!dados.erro) {
          this.enderecoForm.patchValue({
            rua: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf,
          });
        } else {
          this.mostrarMensagem('CEP não encontrado', 'erro');
        }
        this.carregando = false;
      },
      error: () => {
        this.mostrarMensagem('Erro ao buscar CEP', 'erro');
        this.carregando = false;
      },
    });
  }

  novoEndereco(): void {
    this.enderecoEmEdicao = null;
    this.enderecoForm.reset();
    this.mostrarFormulario = true;
  }

  editarEndereco(endereco: Endereco): void {
    this.enderecoEmEdicao = endereco;
    this.enderecoForm.patchValue(endereco);
    this.mostrarFormulario = true;
  }

  salvarEndereco(): void {
    if (this.enderecoForm.invalid) {
      this.enderecoForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    const endereco = this.enderecoForm.value;

    if (this.enderecoEmEdicao && this.enderecoEmEdicao.id) {
      // Atualizar endereco existente
      this.perfilService.atualizarEndereco(this.enderecoEmEdicao.id, endereco).subscribe({
        next: () => {
          this.mostrarMensagem('Endereço atualizado com sucesso!', 'sucesso');
          this.carregarEnderecos();
          this.cancelarFormulario();
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao atualizar endereço', 'erro');
          this.carregando = false;
        },
      });
    } else {
      // Adicionar novo endereco
      this.perfilService.adicionarEndereco(endereco).subscribe({
        next: () => {
          this.mostrarMensagem('Endereço adicionado com sucesso!', 'sucesso');
          this.carregarEnderecos();
          this.cancelarFormulario();
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao adicionar endereço', 'erro');
          this.carregando = false;
        },
      });
    }
  }

  removerEndereco(endereco: Endereco): void {
    if (!endereco.id) return;

    if (!confirm('Deseja realmente remover este endereço?')) {
      return;
    }

    this.carregando = true;
    this.perfilService.removerEndereco(endereco.id).subscribe({
      next: () => {
        this.mostrarMensagem('Endereço removido com sucesso!', 'sucesso');
        this.carregarEnderecos();
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao remover endereço', 'erro');
        this.carregando = false;
      },
    });
  }

  definirPrincipal(endereco: Endereco): void {
    if (!endereco.id) return;

    this.carregando = true;
    this.perfilService.definirEnderecoPrincipal(endereco.id).subscribe({
      next: () => {
        this.mostrarMensagem('Endereço principal definido!', 'sucesso');
        this.carregarEnderecos();
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao definir endereço principal', 'erro');
        this.carregando = false;
      },
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.enderecoEmEdicao = null;
    this.enderecoForm.reset();
    this.carregando = false;
  }

  mostrarMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = texto;
    this.mensagemTipo = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  campoInvalido(campo: string): boolean {
    const control = this.enderecoForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
