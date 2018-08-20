import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PlacesComponent } from './places/places.component';
import { HttpModule } from '@angular/http';
import { PlacesService } from './places.service';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './places/details/details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const ROUTES = [
  {
    path: '',
    pathMatch: 'full',
    component: AppComponent
  },

  {
    path: 'places',
    component: PlacesComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent,
    DetailsComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [PlacesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
