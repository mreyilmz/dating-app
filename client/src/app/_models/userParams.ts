import { User } from './user';

// Why not just an interface? Well, a class gives us an opportunity to use a constructor, which means we can initialize some values inside the class when we use it.
export class UserParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 5;
  orderBy = 'lastActive';

  constructor(user: User) {
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
