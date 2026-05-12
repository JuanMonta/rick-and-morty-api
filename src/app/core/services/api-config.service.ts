import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';



export type ApiMode = 'REST' | 'GRAPHQL'
const API_MODE_KEY = "API_MODE_SELECTED"

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private apiModeSubject: BehaviorSubject<ApiMode>;
  apiMode$: Observable<ApiMode>;

  constructor(
    private readonly _localStorageService: LocalStorageService
  ) {
    const savedMode: string | null = this._localStorageService.getItem(API_MODE_KEY);
    const mode: ApiMode = (savedMode === 'REST' || savedMode === 'GRAPHQL') ? savedMode : 'REST';

    this.apiModeSubject = new BehaviorSubject<ApiMode>(mode);
    this.apiMode$ = this.apiModeSubject.asObservable();
  }

  get currentMode(): ApiMode {
    return this.apiModeSubject.getValue();
  }

  toggleApiMode(): void {
    const newModel = this.currentMode === 'REST' ? 'GRAPHQL' : 'REST';
    this._localStorageService.setItem(API_MODE_KEY, newModel);
    this.apiModeSubject.next(newModel);
  }

}
