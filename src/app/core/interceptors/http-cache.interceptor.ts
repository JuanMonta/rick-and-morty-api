import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../services/http-cache.service';


@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  constructor(
    private readonly cacheService: HttpCacheService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Regla de oro: Solo cacheamos peticiones GET
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cacheService.getCachedResponse(request.url, request.urlWithParams);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    // No está en caché o caducó, la petición sale a internet.
    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        // Solo guardamos cuando la respuesta HTTP es exitosa y completa
        if (event instanceof HttpResponse) {
          this.cacheService.addToCache(request.url, request.urlWithParams, event);
        }
      })
    );
  }

}

