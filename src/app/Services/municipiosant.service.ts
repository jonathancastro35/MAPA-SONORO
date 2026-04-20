import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosantService {

  private url = 'assets/data-ant/municipios.json';

  constructor(private http: HttpClient) {}

  // 🔹 1. Obtener JSON completo
  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // 🔹 2. Obtener solo lista de municipios
  getMunicipios(): Observable<any[]> {
    return this.getAll().pipe(
      map(data => data.Municipios || [])
    );
  }

  // 🔹 3. Buscar municipio por código DANE
  getPorCodigoDane(cod: number): Observable<any | undefined> {
    return this.getMunicipios().pipe(
      map(m =>
        m.find(x => x.Cod_mun === cod)
      )
    );
  }

  // 🔹 4. Filtrar por departamento (código)
  getPorDepartamento(codDep: number): Observable<any[]> {
    return this.getMunicipios().pipe(
      map(m =>
        m.filter(x => x.Cod_dep === codDep)
      )
    );
  }

  // 🔹 5. Filtrar por nombre de municipio (case-insensitive)
  getPorNombre(nombre: string): Observable<any[]> {
    return this.getMunicipios().pipe(
      map(m =>
        m.filter(x =>
          x.Nomb_mun &&
          x.Nomb_mun.toLowerCase().includes(nombre.toLowerCase())
        )
      )
    );
  }

  // 🔹 6. Obtener departamentos únicos
  getDepartamentos(): Observable<any[]> {
    return this.getMunicipios().pipe(
      map(m => {
        const deps = m.map(x => ({
          Cod_dep: x.Cod_dep,
          Nombre_dep: x.Nombre_dep
        }));

        // eliminar duplicados por Cod_dep
        return Array.from(
          new Map(deps.map(d => [d.Cod_dep, d])).values()
        );
      })
    );
  }

  // 🔹 7. Buscar municipio exacto por nombre (normalizado)
  getExacto(nombre: string): Observable<any | undefined> {
    return this.getMunicipios().pipe(
      map(m =>
        m.find(x =>
          x.Nomb_mun &&
          x.Nomb_mun.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') ===
          nombre.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        )
      )
    );
  }

  // 🔹 8. Obtener coordenadas (útil para Leaflet)
  getCoordenadas(): Observable<any[]> {
    return this.getMunicipios().pipe(
      map(m =>
        m.map(x => ({
          nombre: x.Nomb_mun,
          lat: x.Latitud,
          lng: x.Longitud
        }))
      )
    );
  }
}
