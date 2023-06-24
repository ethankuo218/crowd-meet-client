import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-tool-dialog',
  templateUrl: './tool-dialog.component.html',
  styleUrls: ['./tool-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatSliderModule]
})
export class ToolDialogComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
