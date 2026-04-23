import { Component, OnInit } from '@angular/core';
import { LenguasUnificadasService } from 'src/app/Services/lenguas-unificadas.service';

@Component({
  selector: 'app-listar-pueblos-unificados',
  templateUrl: './listar-pueblos-unificados.component.html',
  styleUrls: ['./listar-pueblos-unificados.component.css']
})
export class ListarPueblosUnificadosComponent implements OnInit {

  listarPueblos: string[] = [];
  listaFiltrada: string[] = [];
  datosPaginados: string[] = [];

  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  filtro = '';

  constructor(private service: LenguasUnificadasService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.service.getPueblosUnificados().subscribe({
      next: (data: string[]) => {
        this.listarPueblos = data.map(x => x.trim());
        this.listaFiltrada = [...this.listarPueblos];
        this.calcularPaginacion();
      },
      error: (err) => {
        console.error('❌ Error cargando pueblos unificados:', err);

        // evita pantalla vacía sin explicación
        this.listarPueblos = [];
        this.listaFiltrada = [];
        this.datosPaginados = [];
      }
    });
  }

  filtrar(): void {
    const valor = this.filtro.toLowerCase();

    this.listaFiltrada = this.listarPueblos.filter(p =>
      p.toLowerCase().includes(valor)
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
