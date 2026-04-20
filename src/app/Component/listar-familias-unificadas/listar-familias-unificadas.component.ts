import { Component, OnInit } from '@angular/core';
import { FamiliasLingusticasUnificadasService } from 'src/app/Services/familias-lingusticas-unificadas.service';

@Component({
  selector: 'app-listar-familias-unificadas',
  templateUrl: './listar-familias-unificadas.component.html',
  styleUrls: ['./listar-familias-unificadas.component.css']
})
export class ListarFamiliasUnificadasComponent implements OnInit {

  listarFamilias: string[] = [];
  listaFiltrada: string[] = [];
  datosPaginados: string[] = [];

  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  filtro = '';

  constructor(private service: FamiliasLingusticasUnificadasService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.service.getFamiliasUnificadas().subscribe({
      next: (data: string[]) => {
        this.listarFamilias = data.map(x => x.trim());
        this.listaFiltrada = [...this.listarFamilias];
        this.calcularPaginacion();
      },
      error: (err) => console.error(err)
    });
  }

  filtrar(): void {
    const valor = this.filtro.toLowerCase();

    this.listaFiltrada = this.listarFamilias.filter(f =>
      f.toLowerCase().includes(valor)
    );

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.listaFiltrada.length / this.registrosPorPagina);
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.datosPaginados = this.listaFiltrada.slice(inicio, fin);
  }

  siguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
  }

  anterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }
}
