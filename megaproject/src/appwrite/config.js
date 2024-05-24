import { conf } from "../conf/conf";
import {Client, ID, Databases, Query, Storage} from 'appwrite'

export class Service {

    client = new Client()
    database;
    bucket;

    constructor() {
        this.client.setEndpoint(conf.appwriteURL).setProject(conf.appwriteProjectId)
        this.database = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({title, content, slug, featuredImage, status, userId}){
        try {   
            return await this.database.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, 
            {title, content, featuredImage, status, userId})
        } catch(error) {
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}) {
        try {
           return await this.database.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug,
            {title, content, featuredImage, status})
        } catch(error) {
            console.log("Appwrite error : updatepost error :", error)
        }
    }

    async deletePost(slug) {
        try{
            await this.database.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
            return true;
        }catch(error) {
            console.log("Appwrite error : deletePost error :", error)
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.database.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug)
        } catch(error) {
            console.log("Appwrite error : getPost error :", error)
            return false;
        }
    }

    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.database.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, queries)
        } catch(error) {
            console.log("Appwrite error : getPosts error :", error)
        }
    }

    //file uploading
    async uploadFile(file) {
        try{
            return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file)
        } catch(error) {
            console.log("Appwrite error : uploadFile error :", error)
            return false
        }
    }

    async deleteFile(fileId) {
        try{
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
            return true
        } catch(error) {
            console.log("Appwrite error : deleteFile error :", error)
            return false
        }
    }

    filePreview(fileId) {
       return this.bucket.getFilePreview(conf.appwriteBucketId, fileId)
    }

}

const service = new Service()
export default service;

