import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';

@NgModule({
  declarations: [AppComponent, CalendarComponent, AppointmentModalComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
