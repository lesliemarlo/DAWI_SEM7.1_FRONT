import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'
import { AppMaterialModule } from '../../app.material.module';
import { MatDialog } from '@angular/material/dialog';
import { RevistaService } from '../../services/revisa.service';
import { TokenService } from '../../security/token.service';
import { CrudAlumnoAddComponent } from '../crud-alumno-add/crud-alumno-add.component';
import { CrudRevistaAddComponent } from '../crud-revista-add/crud-revista-add.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Revista } from '../../models/revista.model';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { CrudRevistaUpdateComponent } from '../crud-revista-update/crud-revista-update.component';

@Component({
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent],
  selector: 'app-crud-revista',
  templateUrl: './crud-revista.component.html',
  styleUrls: ['./crud-revista.component.css']
})
export class CrudRevistaComponent {

  //
  //Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera
  displayedColumns = ["idRevista","nombre","frecuencia","fechaCreacion","telefono","pais","tipo", "estado", "acciones"];

  //filtro de la consulta
  filtro: string = "";
  //-- usuario
  objUsuario: Usuario={};

  constructor(private dialogService: MatDialog,
              private revistaService : RevistaService,
              private tokenservice:TokenService
  ){

this.objUsuario.idUsuario =tokenservice.getUserId();
  }

  openDialog(){
        console.log(">>> openDialog  [ini]");
        const dialog = this.dialogService.open(CrudRevistaAddComponent);
        dialog.afterClosed().subscribe(

          x =>{
            if(x == 1){
              this.refreshTable();
            }
          }
        );


        console.log(">>> openDialog  [fin]");
  }

  //FILTRAR
  refreshTable(){
    console.log(">>> refreshTable [ini]");
    //si no escribo nada en el buscador muestra TODOS
    var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
    this.revistaService.consultarCrud(msgFiltro).subscribe(
          x => {
            this.dataSource = new MatTableDataSource<Revista>(x);
            this.dataSource.paginator = this.paginator
          }
    );

    console.log(">>> refreshTable [fin]");
}

//cambio de estado
actualizaEstado(obj : Revista){
  console.log(">>> actualizaEstado [ ini ]");

  obj.estado =  obj.estado == 1 ? 0 : 1;
  obj.usuarioActualiza =  this.objUsuario;
  this.revistaService.actualizarCrud(obj).subscribe();

  console.log(">>> actualizaEstado [ fin ]");
}

elimina(obj:Revista){
  Swal.fire({
    title: '¿Desea eliminar?',
    text: "Los cambios no se van a revertir",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, elimina',
    cancelButtonText: 'No, cancelar'
  }).then((result) => {
        if (result.isConfirmed) {
            this.revistaService.eliminarCrud(obj.idRevista || 0).subscribe(
                  x => {
                        this.refreshTable();
                        Swal.fire('Mensaje', x.mensaje, 'info');
                  }
            );
        }
  })   
}

//edit
openUpdateDialog(obj:Revista){
  console.log(">>> openUpdateDialog [ini]");
  const dialogo = this.dialogService.open(CrudRevistaUpdateComponent, {data:obj});
  dialogo.afterClosed().subscribe(
        x => {
             console.log(">>> x >> "  +  x); 
             if (x === 1){ //s leva 1 le doy refrescar a la tabla
                this.refreshTable();
             }
        }
  );
  console.log(">>> openUpdateDialog [fin]");
}

}
