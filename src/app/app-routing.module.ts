import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaFamiliasEtnicasComponent } from './Components/infopoblacion/mapa-familias-etnicas/mapa-familias-etnicas.component';
import { ListarPueblosUnificadosComponent } from './Component/listar-pueblos-unificados/listar-pueblos-unificados.component';
import { ListarFamiliasUnificadasComponent } from './Component/listar-familias-unificadas/listar-familias-unificadas.component';
import { ListarPueblosDetalleComponent } from './Component/listar-pueblos-detalle/listar-pueblos-detalle.component';


const routes: Routes = [
  { path:'', pathMatch: 'full', redirectTo: 'listadopueblos'},
  { path: 'mapafamiliasetnicaspoblacion', component:MapaFamiliasEtnicasComponent },
  { path: 'listadopueblos', component:ListarPueblosUnificadosComponent },
  { path: 'listadofamiliasunificadas', component:ListarFamiliasUnificadasComponent },
  { path: 'listadopueblosdetalles', component:ListarPueblosDetalleComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
