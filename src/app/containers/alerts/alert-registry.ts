import { Type } from '@angular/core';
import { SuccessAlert } from 'src/app/ui/alerts/success/success.alert';

export const ALERT_REGISTRY: Record<string, Type<object>> = {
  successAlert: SuccessAlert,
};
