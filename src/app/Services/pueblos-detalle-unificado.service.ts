import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { LenguasUnificadasService } from './lenguas-unificadas.service';
import { CaracterizacionLenguaService } from './caracterizacion-lengua.service';
import { LenguaspoblacionetnicaService } from './lenguaspoblacionetnica.service';

export interface PuebloDetalle {
  pueblo: string;
  denominacion_lengua: string | null;
  autodenominacion_de_la_lengua: string | null;
  familia_linguistica: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PueblosDetalleUnificadoService {

  constructor(
    private lenguasService: LenguasUnificadasService,
    private caracterizacionService: CaracterizacionLenguaService,
    private lenguasEtnicasService: LenguaspoblacionetnicaService
  ) {}

  // 🔥 MÉTODO PRINCIPAL
  getPueblosConDetalle(): Observable<PuebloDetalle[]> {

    return this.lenguasService.getPueblosUnificados().pipe(

      switchMap((pueblos: string[]) => {

        const peticiones = pueblos.map(pueblo =>

          this.caracterizacionService.getInfoByPueblo(pueblo).pipe(

            switchMap(info => {

              // ✅ 1. SI ENCUENTRA EN CARACTERIZACIÓN
              if (info) {
                return of({
                  pueblo,
                  denominacion_lengua: info.denominacion_lengua,
                  autodenominacion_de_la_lengua: info.autodenominacion_de_la_lengua,
                  familia_linguistica: info.familia_linguistica
                });
              }

              // ❌ 2. SI NO ENCUENTRA → BUSCAR EN Lenguas.json
              return this.lenguasEtnicasService.getPorNombre(pueblo).pipe(

                map((resultados: any[]) => {

                  if (resultados.length > 0) {
                    return {
                      pueblo,
                      denominacion_lengua: null,
                      autodenominacion_de_la_lengua: null,
                      familia_linguistica: resultados[0].familia ?? null
                    };
                  }

                  // ❌ 3. SI NO ENCUENTRA EN NINGUNO
                  return {
                    pueblo,
                    denominacion_lengua: null,
                    autodenominacion_de_la_lengua: null,
                    familia_linguistica: null
                  };
                })

              );

            })

          )

        );

        return forkJoin(peticiones);

      })

    );
  }
}
