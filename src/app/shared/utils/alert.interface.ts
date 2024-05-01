import { EAlertType } from './alert-type.enum';

export interface IAlert {
  description: string;
  type: EAlertType;
}
