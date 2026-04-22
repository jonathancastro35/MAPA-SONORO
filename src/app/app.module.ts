import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { LenguaspoblacionetnicaService } from './Services/lenguaspoblacionetnica.service';
import { MapaFamiliasEtnicasComponent } from './Components/infopoblacion/mapa-familias-etnicas/mapa-familias-etnicas.component';
import { ListarPueblosUnificadosComponent } from './Component/listar-pueblos-unificados/listar-pueblos-unificados.component';
import { ListarFamiliasUnificadasComponent } from './Component/listar-familias-unificadas/listar-familias-unificadas.component';
import { ListarPueblosDetalleComponent } from './Component/listar-pueblos-detalle/listar-pueblos-detalle.component';
//import { MultimediaComponent } from './Component/multimedia/multimedia.component';
import { MultimediaComponent } from './Component/multimedia/multimedia.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';



@NgModule({
  declarations: [
    AppComponent,
    MapaFamiliasEtnicasComponent,
    ListarPueblosUnificadosComponent,
    ListarFamiliasUnificadasComponent,
    ListarPueblosDetalleComponent,
    MultimediaComponent,
    SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [LenguaspoblacionetnicaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
