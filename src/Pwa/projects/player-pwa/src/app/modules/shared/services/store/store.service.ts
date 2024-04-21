import { Injectable, inject } from '@angular/core';
import type { Selector } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly store = inject(Store);

  /**
   * This method returns a slice of state synchronously based on provided selector.
   * Use it ONLY when no reactivity is required and that you only want a snapshot of state values
   * a the moment of the method invokation
   */
  public getStateSnapshot<State, StateSlice>(selector: Selector<State, StateSlice>): StateSlice {
    // We force affectation to be able to return the value outside of the subscribe
    let stateSlice = {} as StateSlice;
    this.store
      .select(selector)
      .pipe(take(1))
      .subscribe((slice) => {
        // Here we know that there is always a state available and that this subscribe will be executed synchronously (hence, before returning stateSlice)
        stateSlice = slice;
      });
    // So we can now return the selected slice of state which value was set in the subscribe
    return stateSlice;
  }
}
