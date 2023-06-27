import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FillInfoService {
  gender: string | undefined;
  birth: string | undefined;
  constructor() {}
}
