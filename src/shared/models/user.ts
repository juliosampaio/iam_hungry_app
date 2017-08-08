import { Business } from './business';
import { Model } from './model';

export class User extends Model {
    name: string;
    email: string;
    password: string;
    businesses: Business[];
}