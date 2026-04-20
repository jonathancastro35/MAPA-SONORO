import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasetnicasService {

  private basePath = 'assets/materialpoblacion/';
  private url = this.basePath + 'Familias.geojson';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todo el GeoJSON
  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // 🔹 Obtener solo features
  getFeatures(): Observable<any[]> {
    return this.getAll().pipe(
      map(data => data.features)
    );
  }

  // 🔹 Obtener familias únicas
  getFamilias(): Observable<string[]> {
    return this.getFeatures().pipe(
      map(features => {
        const familias = features.map(f => f.properties.Familia);
        return [...new Set(familias)];
      })
    );
  }

  // 🔹 Filtrar por familia
  getPorFamilia(nombre: string): Observable<any[]> {
    return this.getFeatures().pipe(
      map(features =>
        features.filter(f => f.properties.Familia === nombre)
      )
    );
  }

  // 🔥 NUEVO: obtener lenguas únicas por familia
  getLenguasPorFamilia(nombreFamilia: string): Observable<string[]> {

    return this.getFeatures().pipe(
      map(features => {

        const lenguas = features
          .filter(f =>
            f.properties?.Familia?.toLowerCase() === nombreFamilia.toLowerCase()
          )
          .map(f => f.properties?.Lenguas)
          .filter(l => l && l !== 'null' && l !== undefined);

        // 🔥 eliminar duplicados
        return [...new Set(lenguas)];
      })
    );
  }

  // 🔹 Buscar por lengua
  getPorLengua(lengua: string): Observable<any[]> {
    return this.getFeatures().pipe(
      map(features =>
        features.filter(f =>
          f.properties.Lenguas &&
          f.properties.Lenguas.toLowerCase().includes(lengua.toLowerCase())
        )
      )
    );
  }

  // 🔹 Devolver como FeatureCollection (ideal para mapas)
  getGeoJsonPorFamilia(nombre: string): Observable<any> {
    return this.getPorFamilia(nombre).pipe(
      map(features => ({
        type: "FeatureCollection",
        features
      }))
    );
  }
}