import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component, currentRoute, currentState, nextState) => {
  if (component.editForm?.dirty) {
    return confirm(
      'Devam etmek istediğinize emin misiniz? Kaydedilmemiş değişiklikler yok olacaktır.'
    );
  }

  return true;
};
