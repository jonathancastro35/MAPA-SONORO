import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasLingusticasUnificadasService {

  // 🔹 rutas de datos
  private urlCaracterizacion = 'assets/materialpoblacion/Caracterizacionlenguasnativa.json';
  private urlGeoJson = 'assets/materialpoblacion/Familias.geojson';

  constructor(private http: HttpClient) {}

  // 🔹 normalizador (evita duplicados por tildes/case)
  private normalize(text: string): string {
    return text
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  // =========================================================
  // 🔵 1. Familias desde Caracterización (Column7)
  // =========================================================
  getFamiliasCaracterizacion(): Observable<string[]> {
    return this.http.get<any>(this.urlCaracterizacion).pipe(
      map(data => data.Caracterizacioneslenguas || []),
      map((rows: any[]) =>
        rows
          .map(r => r.Column7)
          .filter(Boolean)
          .map((f: string) => this.normalize(f))
      ),
      map(familias => Array.from(new Set(familias)).sort())
    );
  }

  // =========================================================
  // 🔵 2. Familias desde GeoJSON (properties.Familia)
  // =========================================================
  getFamiliasGeoJson(): Observable<string[]> {
    return this.http.get<any>(this.urlGeoJson).pipe(
      map(data => data.features || []),
      map((features: any[]) =>
        features
          .map(f => f?.properties?.Familia)
          .filter(Boolean)
          .map((f: string) => this.normalize(f))
      ),
      map(familias => Array.from(new Set(familias)).sort())
    );
  }

  // =========================================================
  // 🔥 3. UNIFICADAS (SIN DUPLICADOS)
  // =========================================================
  getFamiliasUnificadas(): Observable<string[]> {
    return forkJoin([
      this.getFamiliasCaracterizacion(),
      this.getFamiliasGeoJson()
    ]).pipe(
      map(([caracterizacion, geojson]) => {

        const todas = [...caracterizacion, ...geojson];

        // eliminar duplicados
        const unicas = Array.from(new Set(todas));

        return unicas.sort();
      })
    );
  }
}
