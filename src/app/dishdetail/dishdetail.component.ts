import { Component, OnInit } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import'rxjs/add/operator/switchmap';

import{ Comment } from '../shared/Comment';

import { FormGroup, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
    
    
    dish: Dish;
    dishIds: number[];
    prev: number;
    next: number;
    
    ratingForm:FormGroup;
  ratings:Comment;
  formErrors=
  {
  'author':'',
  'comment':''
  };
  validationMessages={
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
private fb:FormBuilder) {
    this.createForm();
   }

  ngOnInit() { 
      
    this.dishservice.getDishIds()
        .subscribe(dishIds => this.dishIds = dishIds);
      
    this.route.params
        .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id);});
      
      
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
      
    this.dish.comments.push(this.ratings);
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
