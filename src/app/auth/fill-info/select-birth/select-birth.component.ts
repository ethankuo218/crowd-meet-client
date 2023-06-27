import { FillInfoService } from './../fill-info.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-birth',
  templateUrl: './select-birth.component.html',
  styleUrls: ['./select-birth.component.scss']
})
export class SelectBirthComponent implements OnInit {
  birth: string | undefined;
  constructor(private fillInfoService: FillInfoService) {}

  ngOnInit() {}

  goNext() {
    console.log(this.birth);
  }
}
