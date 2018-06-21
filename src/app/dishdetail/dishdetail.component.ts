import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchmap';

import { Comment } from '../shared/Comment';

import { FormGroup, Validators,FormBuilder } from '@angular/forms';

import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
animations: [
    trigger('visibility', [
        state('shown', style({
    transform: 'scale(1.0)',
            opacity: 1
        })),
    state('hidden', style({
    transform: 'scale(0.5)',
        opacity: 0
        })),
    transition('* => *', animate('0.5s ease-in-out'))
        ])
]
})
export class DishdetailComponent implements OnInit {
    
    dish: Dish;
    dishcopy = null;
    dishIds: number[];
    prev: number;
    next: number;
errMess: string;
    visibility = 'shown';
    
    ratingForm: FormGroup;
    ratings: Comment;
formErrors = {
    'author':'',
    'comment':''
};
validationMessages = {
    'author':{
      'required':'Name is required',
      'minlength':'minimum length should be 2',
      'maxlength':'maximun length should be 20'
    },
        'comment':{
          'required':'comment is required'
        }
    };
    
    constructor(private dishservice: DishService,
                private route: ActivatedRoute,
                private location: Location,
                private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) {
        this.createForm();
    }

    ngOnInit() { 
        this.dishservice.getDishIds()
            .subscribe(dishIds => this.dishIds = dishIds);

        this.route.params
            .switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
            .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
    }
    
    setPrevNext(dishId: number) {
        let index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }

    createForm() {
        this.ratingForm=this.fb.group({
      
            author: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],

            rating: 5,

            comment: ['',[Validators.required]]
        });
      
        this.ratingForm.valueChanges
            .subscribe(data => this.onValueChange(data));
  
        this.onValueChange();
    }

    onValueChange(data?: any) {
        if (!this.ratingForm) { return; }
        
        const form = this.ratingForm;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);

            if(control && control.dirty && !control.valid) {

                  const msg = this.validationMessages[field];
              for (const key in control.errors) {
                this.formErrors[field] += msg [key] + '';
              }
            }
        }
    }
    
    onSubmit() {
        this.ratings = this.ratingForm.value;
        this.ratings.date = new Date().toISOString();

        console.log(this.ratings);

        this.dishcopy.comments.push(this.ratings);
        this.dishcopy.save()
            .subscribe(dish => this.dish = dish);
        this.ratingForm.reset({
          name:'',
          rating:5,
          comment:''
        });
    }

    goBack(): void {
        this.location.back();
    }

}
