import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { areUrlsEqual } from '../utils/url-comparation';
import { tap } from 'rxjs/operators';

interface CachedResponse {
  response: HttpResponse<unknown>;
  addedTime: number;
}

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  constructor() { }

  private cache = new Map<string, CachedResponse>();

  // Definimos el tiempo de vida de la caché (ejemplo: 5 minutos en milisegundos)
  private readonly CACHE_TTL_MS = 5 * 60 * 1000;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Regla de oro: Solo cacheamos peticiones GET
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Buscamos en el Map usando el comparador de urls
    const cachedKey = Array.from(this.cache.keys()).find(key =>
      areUrlsEqual(key, request.urlWithParams)
    );

    if (cachedKey) {
      const cachedEntry = this.cache.get(cachedKey)!;
      const isExpired = (Date.now() - cachedEntry.addedTime) > this.CACHE_TTL_MS;

      if (isExpired) {
        // Si caducó la caché, limpiamos la basura y dejamos que la petición continúe a internet
        this.cache.delete(cachedKey);
      } else {
        // Devolvemos un CLON de la respuesta.
        // Siempre usar .clone() porque los HttpResponse en Angular son inmutables
        return of(cachedEntry.response.clone());
      }
    }

    // No está en caché o caducó, la petición sale a internet.
    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        // Solo guardamos cuando la respuesta HTTP es exitosa y completa
        if (event instanceof HttpResponse) {
          this.cache.set(request.urlWithParams, {
            response: event.clone(),
            addedTime: Date.now()
          });
        }
      })
    );
  }
}

