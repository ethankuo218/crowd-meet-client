import { ShellModel } from '../../shell/data-store';

export class ProfileModel extends ShellModel {
  image: string | undefined;
  name: string | undefined;
  role: string | undefined;
  description: string | undefined;
  email: string | undefined;
  provider: string | undefined;
  phoneNumber: string | undefined;

  constructor() {
    super();
  }
}
