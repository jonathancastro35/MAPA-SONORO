import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencianacionaldetierraService {

  private url = '/assets/data-ant/prueba.json';

  constructor(private http: HttpClient) {}

  // 🔹 1. Obtener todo el GeoJSON
  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // 🔹 2. Obtener solo features
  getFeatures(): Observable<any[]> {
    return this.getAll().pipe(
      map(data => data.features || [])
    );
  }

  // 🔹 3. Obtener solo resguardos con propiedades
  getResguardos(): Observable<any[]> {
    return this.getFeatures().pipe(
      map(features =>
        features
          .filter(f => f?.properties)
          .map(f => ({
            id: f.properties.OBJECTID,
            nombre: f.properties.NOMBRE,
            pueblo: f.properties.PUEBLO,
            departamento: f.properties.DEPARTAMENTO,
            municipio: f.properties.MUNICIPIO,
            area_total: f.properties.AREA_TOTAL_ACTOS_ADMIN,
            geometry: f.geometry
          }))
      )
    );
  }

  // 🔹 4. Filtrar por pueblo (SIN tildes / case-insensitive)
  getPorPueblo(pueblo: string): Observable<any[]> {
    return this.getResguardos().pipe(
      map(resguardos =>
        resguardos.filter(r =>
          r.pueblo &&
          r.pueblo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
          pueblo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
      )
    );
  }

  // 🔹 5. Filtrar por departamento
  getPorDepartamento(departamento: string): Observable<any[]> {
    return this.getResguardos().pipe(
      map(resguardos =>
        resguardos.filter(r =>
          r.departamento &&
          r.departamento === departamento
        )
      )
    );
  }

  // 🔹 6. Obtener nombres únicos de pueblos
  getPueblos(): Observable<string[]> {
    return this.getResguardos().pipe(
      map(resguardos => {
        const pueblos = resguardos.map(r => r.pueblo);
        return [...new Set(pueblos)];
      })
    );
  }

  // 🔹 7. Obtener nombres únicos de departamentos
  getDepartamentos(): Observable<string[]> {
    return this.getResguardos().pipe(
      map(resguardos => {
        const deps = resguardos.map(r => r.departamento);
        return [...new Set(deps)];
      })
    );
  }

    // 🔹 8. Obtener resumen básico (PUEBLO, DEPARTAMENTO, MUNICIPIO)
  getResumenUbicacion(): Observable<any[]> {
    return this.getFeatures().pipe(
      map(features =>
        features
          .filter(f => f?.properties)
          .map(f => ({
            pueblo: f.properties.PUEBLO,
            departamento: f.properties.DEPARTAMENTO,
            municipio: f.properties.MUNICIPIO
          }))
      )
    );
  }

  getPueblosNormalizados(): Observable<string[]> {
  return this.getResguardos().pipe(
    map(resguardos => {

      const normalize = (text: string) =>
        text
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .trim();

      const pueblos = resguardos
        .map(r => r.pueblo)
        .filter(Boolean)
        .map((p: string) => normalize(p));

      // eliminar duplicados
      const unicos = Array.from(new Set(pueblos));

      // opcional: ordenar
      return unicos.sort();
    })
  );
}
}
