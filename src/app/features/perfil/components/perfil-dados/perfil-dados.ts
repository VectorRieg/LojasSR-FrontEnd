import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../services/perfil';
import { Usuario } from '../../../../core/models/usuario';

@Component({
  selector: 'app-perfil-dados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-dados.html',
  styleUrl: './perfil-dados.css',
})
export class PerfilDadosComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private fb = inject(FormBuilder);

  dadosForm!: FormGroup;
  senhaForm!: FormGroup;
  usuario: Usuario | null = null;
  carregando = false;
  mensagem = '';
  mensagemTipo: 'sucesso' | 'erro' = 'sucesso';
  mostrarFormularioSenha = false;

  ngOnInit(): void {
    this.inicializarFormularios();
    this.carregarDados();
  }

  inicializarFormularios(): void {
    this.dadosForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      telefone: [''],
      cep: [''],
      rua: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
    });

    this.senhaForm = this.fb.group(
      {
        senhaAtual: ['', [Validators.required, Validators.minLength(6)]],
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.validarSenhas }
    );
  }

  validarSenhas(group: FormGroup): { [key: string]: boolean } | null {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return novaSenha === confirmarSenha ? null : { senhasNaoConferem: true };
  }

  carregarDados(): void {
    this.carregando = true;
    this.perfilService.getDados().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.dadosForm.patchValue(usuario);
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao carregar dados do perfil', 'erro');
        this.carregando = false;
      },
    });
  }

  salvarDados(): void {
    if (this.dadosForm.invalid) {
      this.dadosForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.perfilService.atualizarDados(this.dadosForm.value).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.mostrarMensagem('Dados atualizados com sucesso!', 'sucesso');
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao atualizar dados', 'erro');
        this.carregando = false;
      },
    });
  }

  alterarSenha(): void {
    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    const { senhaAtual, novaSenha } = this.senhaForm.value;

    this.perfilService.alterarSenha(senhaAtual, novaSenha).subscribe({
      next: () => {
        this.mostrarMensagem('Senha alterada com sucesso!', 'sucesso');
        this.senhaForm.reset();
        this.mostrarFormularioSenha = false;
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao alterar senha. Verifique a senha atual.', 'erro');
        this.carregando = false;
      },
    });
  }

  buscarCep(): void {
    const cep = this.dadosForm.get('cep')?.value;
    if (!cep || cep.length < 8) {
      return;
    }

    this.carregando = true;
    this.perfilService.buscarCep(cep).subscribe({
      next: (dados) => {
        if (!dados.erro) {
          this.dadosForm.patchValue({
            rua: dados.logradouro,
            bairro: dados.bairro,
            cidade: dados.localidade,
            estado: dados.uf,
          });
        }
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      },
    });
  }

  toggleFormularioSenha(): void {
    this.mostrarFormularioSenha = !this.mostrarFormularioSenha;
    if (!this.mostrarFormularioSenha) {
      this.senhaForm.reset();
    }
  }

  mostrarMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = texto;
    this.mensagemTipo = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const control = form.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
