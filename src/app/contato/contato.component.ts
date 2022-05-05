import { MatDialog } from '@angular/material/dialog';
import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { Contato } from './contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ContatoDetalhesComponent } from '../contato-detalhes/contato-detalhes.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup
  contato: Contato;
  contatos: Contato[] = [];
  coluna = ['foto','id','nome','email','favorito']
  totalElementos = 0;
  pagina = 0;
  tamanho = 5;
  pageSizeOptions: number[] = [5];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.montarFormulario()
    this.listarContatos(this.pagina, this.tamanho)
  }

  montarFormulario(){
    this.formulario = this.fb.group({
      nome: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]]
    })
  }

  listarContatos(pagina = 0, tamanhoPagina = 10){
    this.service.listarContatos(pagina, tamanhoPagina)
      .subscribe(response => {
        this.contatos = response.content;
        this.totalElementos = response.totalElements;
        this.pagina = response.number;
      })
  }

  favoritar(contato: Contato){
    this.service.favoritarContato(contato).subscribe(respota =>{
      contato.favorito = !contato.favorito
    })
  }


  onSubmit(){

    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.service.salvarContato(contato)
      .subscribe(response => {
          this.listarContatos();
          this.snackBar.open('Contato foi adicionado!','Sucesso',{
            duration: 2000
          })
          this.formulario.reset()
      })
  }

  uploadFoto(event, contato){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append('foto',foto);
      this.service
        .uploadFoto(contato,formData)
        .subscribe(response => {
          this.listarContatos();
        })
    }
  }

  visualizarContato(contato: Contato){
    this.dialog.open(ContatoDetalhesComponent,{
      width: '440px',
      height:  '450px',
      data: contato
    })
  }

  paginar(event: PageEvent){
    this.pagina = event.pageIndex
    this.listarContatos(this.pagina, this.tamanho)
  }

}
