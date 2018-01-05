import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatMenuModule,
  MatProgressSpinnerModule, MatSnackBarModule,
  MatToolbarModule, MatTabsModule, MatSelectModule, MatSidenavModule, MatExpansionModule, MatButtonToggleModule,
  MatTableModule, MatChipsModule, MatDialogModule, MatSlideToggleModule, MatSliderModule, MatDatepickerModule,
  MatPaginatorModule, MatSortModule, MatNativeDateModule, MatGridListModule, MatRadioModule, MatProgressBarModule,
  MatAutocompleteModule,MatTooltipModule
} from '@angular/material';
import {NgModule} from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';

const modules = [
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatTabsModule,
  MatSidenavModule,
  MatExpansionModule,
  MatButtonToggleModule,
  CdkTableModule,
  MatTableModule,
  MatChipsModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatTooltipModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {
}
