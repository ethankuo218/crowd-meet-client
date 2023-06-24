import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule]
})
export class AlertDialogComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
