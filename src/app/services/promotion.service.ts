import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import { of } from 'rxjs/observable/of';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }
    
    getPromotions(): Observable<Promotion[]> {
            return of(PROMOTIONS).delay(2000);
    }
    
getPromotion(id: number): Observable<Promotion> {
        return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).delay(2000);  
}
    
getFeaturedPromotion(): Observable<Promotion> {
        return of(PROMOTIONS.filter((promo) => (promo.featured))[0]).delay(2000);
}
}
