import { conf } from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {

    client = new Client()
    account;

    constructor() {
        this.client.setEndpoint(conf.appwriteURL)
        .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}) {
        try {
           const userAccount = await this.account.create(
                ID.unique(),  //userId
                email, password, name
            )
            if(userAccount) {
                //direct login ho id user exist
                return this.login({email, password})
            } else {
                return userAccount;
            }
        } catch(error) {
            throw error;
        }
    }

    async login({email, password}) {
        try{
            return await this.account.createEmailPasswordSession(email, password)
        }catch(error) { 
            console.log("Appwrite error : login : error ", error)
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions()
        } catch(error) {
            console.log("Appwrite error : logout : error ", error)
        }
    }

    async getCurrentUser() {
        try{
            return await this.account.get();            
        } catch(error) {
           console.log("Appwrite error : getCurrentUser : error ", error)
        }
    }

}

const authService = new AuthService()
export default authService




