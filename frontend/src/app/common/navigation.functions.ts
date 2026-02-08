import {Location} from '@angular/common';

/*
 * If the editor was called via a direct URL invocation the location state's navigationId would be '1'.
 * So if it is greater than '1', we can assume there is a previous application page when navigating back.
 */
export function currentLocationWasReachedNavigatingTheApplication(location: Location): boolean {
  const state = location.getState() as { navigationId?: number };
  return (state?.navigationId ?? 0) > 1;
}
