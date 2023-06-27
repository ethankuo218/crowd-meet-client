import { FillInfoService } from './../fill-info.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-gender',
  templateUrl: './select-gender.component.html',
  styleUrls: ['./select-gender.component.scss']
})
export class SelectGenderComponent implements OnInit {
  constructor(private fillInfoService: FillInfoService) {}

  ngOnInit() {}

  selectGender(gender: string) {
    this.fillInfoService.gender = gender;
  }

  get gender() {
    return this.fillInfoService.gender;
  }
}
