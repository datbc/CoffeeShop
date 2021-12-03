import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search = new FormControl();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value : string){
    this.router.navigateByUrl(`/search/${value}`);
  }

  // doSearch() {
  //   this.search.valueChanges.subscribe(   
  //     value => {
  //       this.router.navigateByUrl(`/search/${value}`);
  //     }
  //   )
  // }
}
