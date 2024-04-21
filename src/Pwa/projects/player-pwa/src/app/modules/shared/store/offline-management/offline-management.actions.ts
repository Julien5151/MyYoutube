import { createActionGroup, emptyProps } from '@ngrx/store';

export const OfflineManagementActions = createActionGroup({
  source: 'Offline Management',
  events: {
    Disconnected: emptyProps(),
    Connected: emptyProps(),
    'Persistence Pending': emptyProps(),
    'Persistence Completed': emptyProps(),
    'Persistence Failed': emptyProps(),
    'Toggle On Offline Mode': emptyProps(),
    'Toggle Off Offline Mode': emptyProps(),
  },
});
