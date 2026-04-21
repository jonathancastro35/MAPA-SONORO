import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { FamiliasetnicasService } from 'src/app/Services/familiasetnicas.service';
import { LenguaspoblacionetnicaService } from 'src/app/Services/lenguaspoblacionetnica.service';


@Component({
  selector: 'app-mapa-familias-etnicas',
  templateUrl: './mapa-familias-etnicas.component.html',
  styleUrls: ['./mapa-familias-etnicas.component.css']
})
export class MapaFamiliasEtnicasComponent implements AfterViewInit {

  private map!: L.Map;
  private layer = L.layerGroup();

  familiaSeleccionada = '';
  lenguasSeleccionadas: any[] = [];

  constructor(
    private familiasService: FamiliasetnicasService,
    private lenguasService: LenguaspoblacionetnicaService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.cargarFamilias();
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.5709, -74.2973], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.layer.addTo(this.map);
  }

  // 🎨 COLORES POR FAMILIA
  private colores: any = {
    'Chibcha': '#e74c3c',
    'Arawak': '#3498db',
    'Caribe': '#9b59b6',
    'Quechua': '#f1c40f',
    'Tucano': '#1abc9c',
    'Guahibo': '#e67e22',
    'Aislada': '#2ecc71',
    'Criolla': '#34495e'
  };

  private getColor(familia: string): string {
    return this.colores[familia] || '#95a5a6';
  }

  private cargarFamilias(): void {

    this.familiasService.getAll().subscribe(data => {

      const geoJsonLayer = L.geoJSON(data, {

        style: (feature) => {
          const familia = feature?.properties?.Familia;
          return {
            color: this.getColor(familia),
            weight: 2,
            fillOpacity: 0.4
          };
        },

        onEachFeature: (feature, layer) => {

          const familia = feature?.properties?.Familia ?? 'Sin familia';

          layer.bindPopup(`
            <div class="popup-card">
              <div class="popup-header">🌿 Familia lingüística</div>
              <div class="popup-title">${familia}</div>
              <button class="popup-btn">Ver pueblos</button>
            </div>
          `);

          layer.on('popupopen', (e: any) => {
            const popup = e.popup._contentNode;
            const btn = popup.querySelector('.popup-btn');

            if (btn) {
              btn.onclick = () => this.verLenguas(familia);
            }
          });
        }
      });

      geoJsonLayer.addTo(this.map);
      this.map.fitBounds(geoJsonLayer.getBounds());
    });
  }

  // 🔥 CLICK EN FAMILIA (SOLO LISTAR)
  verLenguas(familia: string): void {

    this.familiaSeleccionada = familia;

    this.lenguasService.getPorFamilia(familia)
      .subscribe(res => {

        this.lenguasSeleccionadas = res || [];

        this.map.closePopup();

        // limpiar cualquier marcador si existiera
        this.layer.clearLayers();
      });
  }

  cerrarPanel(): void {
    this.familiaSeleccionada = '';
    this.lenguasSeleccionadas = [];
    this.layer.clearLayers();
  }
}
