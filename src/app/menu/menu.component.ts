import { Storage } from '@ionic/storage-angular';
import { UserStateFacade } from '../core/+states/user-state/user.state.facade';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private storage = inject(Storage);
  user$ = inject(UserStateFacade).getUser();
  isDarkMode: boolean = document.body.classList.contains('dark');

  changeMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.storage.set('isDarkMode', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  private dialog = inject(MatDialog);
  testDialog() {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Test Title',
        content: 'This use for test'
      },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
