import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCategoriesState } from './reference.selector';
import { storeReferenceState } from './reference.actions';
import { Category, Reference } from './reference.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReferenceStateFacade {
  constructor(private readonly store: Store<Reference>) {}

  storeReference(reference: Reference): void {
    this.store.dispatch(storeReferenceState({ reference }));
  }

  getCategories(): Observable<Category[]> {
    return this.store.select(getCategoriesState());
  }
}
