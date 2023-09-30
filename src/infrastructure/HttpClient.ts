import axios from 'axios';
import { DrivenPortError } from './port/driven/DrivenPortError';

export interface IHttpClient {
    get<T>(url: string): Promise<T>;
}

export default class HttpClient {
    async get<T>(url: string): Promise<T> {
        const response = await axios.get<T>(url);
        if(response.status !== axios.HttpStatusCode.Ok){
            throw new DrivenPortError("Request status code was " + response.status);
        }

        return response.data;
    }
}
