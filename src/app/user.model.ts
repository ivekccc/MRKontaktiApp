export class User{
    constructor(public id:string ,public email:string,private _token:string,private tokenExpirationDate:Date){}

    getToken(){
        if(!this.tokenExpirationDate || new Date() > this.tokenExpirationDate){
            return null;
        }
        return this._token;
    }


}