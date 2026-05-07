import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ApiMode = 'REST' | 'GRAPHQL'

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private apiModeSubject = new BehaviorSubject<ApiMode>('REST');
  apiMode$ = this.apiModeSubject.asObservable();

  constructor() { }

  get currentMode(): ApiMode {
    return this.apiModeSubject.getValue();
  }

  toggleApiMode(): void {
    const newModel = this.currentMode === 'REST' ? 'GRAPHQL' : 'REST';
    this.apiModeSubject.next(newModel);
  }

}
