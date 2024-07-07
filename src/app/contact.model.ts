export class Contact {
    constructor(
      public id: string,
      public name: string,
      public surname: string,
      public phone: string,
      public email: string,
      public favorites: boolean,
      public userId: string
    ){}


  }