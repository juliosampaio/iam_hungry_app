import { Model } from './model';
import { Product } from './product';
import { User } from './user';

export class Business extends Model {
    name: string;
    coordinates: string;
    rating: number;
    products: Product;
    createdBy: User;
}