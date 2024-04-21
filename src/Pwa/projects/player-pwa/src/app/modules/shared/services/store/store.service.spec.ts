import { TestBed } from '@angular/core/testing';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StoreService } from './store.service';

interface Fighter {
  name: string;
  warCry: string;
}

interface FakeState {
  fighter: Fighter;
}

describe('StoreService', () => {
  // Arrange
  let service: StoreService;
  let store: MockStore;
  const selectFighter = (state: FakeState): Fighter => state.fighter;
  const selectFighterName = createSelector(selectFighter, (fighter: Fighter) => fighter.name);
  const selectFighterWarCry = createSelector(selectFighter, (fighter: Fighter) => fighter.warCry);
  const initialState: FakeState = {
    fighter: {
      name: 'Alex',
      warCry: 'Philippe !',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return snapshot of initial state', () => {
    // Act
    const name = service.getStateSnapshot(selectFighterName);
    const warCry = service.getStateSnapshot(selectFighterWarCry);
    // Assert
    expect(name).toBe(initialState.fighter.name);
    expect(warCry).toBe(initialState.fighter.warCry);
  });

  it('should return snapshot of updated state', () => {
    // Arrange
    const newFighter = {
      name: 'Fabrice',
      warCry: 'Surf for ever !',
    };
    store.setState({
      fighter: newFighter,
    });
    // Act
    const name = service.getStateSnapshot(selectFighterName);
    const warCry = service.getStateSnapshot(selectFighterWarCry);
    // Assert
    expect(name).toBe(newFighter.name);
    expect(warCry).toBe(newFighter.warCry);
  });
});
