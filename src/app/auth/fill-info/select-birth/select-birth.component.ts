import { FillInfoService } from './../fill-info.service';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-select-birth',
  templateUrl: './select-birth.component.html',
  styleUrls: ['./select-birth.component.scss']
})
export class SelectBirthComponent implements OnInit {
  private fillInfoService = inject(FillInfoService);

  birth: string | undefined;

  ngOnInit() {}

  goNext() {
    this.fillInfoService.birth = this.birth;
  }
}
