import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/models/appointment.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  currentMonth!: number;
  previousMonth!: number;
  previousYear!: number;
  currentYear!: number;
  daysInMonth!: number[];
  daysInPreviousMonth!: number[];
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  emptyDays: number[] = [];
  appointments: Appointment[] = [];
  selectedDate: Date | null = null;
  editingAppointmentId: string | null = null;

  constructor() {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth() + 1;
    this.previousMonth = this.currentMonth - 1;
    this.previousYear = this.currentYear - 1;
    this.currentYear = currentDate.getFullYear();
    this.updateCalendar();
  }

  updateCalendar(): void {
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysInPreviousMonth = this.getDaysInMonth(
      this.previousMonth,
      this.currentYear
    );

    // firstDay can determine whether the calendar starts at Sunday or Monday
    const firstDay = new Date(this.currentYear, this.currentMonth, 2).getDay();

    this.emptyDays = Array(firstDay === 0 ? 6 : firstDay - 1);

    // The loop should iterate over this.emptyDays and for each empty day, pop a day from this.daysInPreviousMonth and push it into this.emptyDays
    for (let i = 0; i < this.emptyDays.length; i++) {
      this.emptyDays[i] = this.daysInPreviousMonth.pop() || 0;
    }
    this.emptyDays.reverse();
  }

  openModalForEdit(appointment: Appointment): void {
    this.editingAppointmentId = appointment.id;
    this.selectedDate = new Date(appointment.date);
  }

  addOrEditAppointment(appointment: Appointment): void {
    if (this.editingAppointmentId) {
      const index = this.appointments.findIndex(
        (a) => a.id === this.editingAppointmentId
      );
      this.appointments[index] = appointment;
      this.editingAppointmentId = null;
    } else {
      this.appointments.push(appointment);
    }
    this.selectedDate = null;
  }

  getDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  }

  getDaysInMonth(month: number, year: number): number[] {
    const date = new Date(year, month);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  dateIsInvalid(year: number, month: number, day: number): boolean {
    const currentDate = new Date();
    const selectedDate = new Date(year, month, day + 1);
    return (
      selectedDate < currentDate ||
      selectedDate.getDay() === 0 ||
      selectedDate.getDay() === 1
    );
  }

  openModal(year: number, month: number, day: number): void {
    this.selectedDate = new Date(year, month, day);
  }

  closeModal(): void {
    this.selectedDate = null;
    this.editingAppointmentId = null;
  }

  addAppointment(appointment: Appointment): void {
    if (!this.appointments.some((a) => a.id === appointment.id)) {
      this.appointments.push(appointment);
    } else {
      const index = this.appointments.findIndex((a) => a.id === appointment.id);
      this.appointments[index] = appointment;
    }
    this.selectedDate = null;
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(
      (app) => app.date.toDateString() === date.toDateString()
    );
  }

  getEditingAppointment(): Appointment | null {
    if (this.editingAppointmentId) {
      const foundAppointment = this.appointments.find(
        (a) => a.id === this.editingAppointmentId
      );
      return foundAppointment || null;
    }
    return null;
  }

  deleteAppointment(appointment: Appointment): void {
    this.appointments = this.appointments.filter(
      (a) => a.id !== appointment.id
    );
  }

  changeMonth(direction: number): void {
    this.currentMonth += direction;
    this.previousMonth = this.previousMonth === 0 ? 11 : this.currentMonth - 1;
    if (this.currentMonth < 0) {
      this.currentYear--;
      this.currentMonth = 11;
      this.previousMonth = 10;
    } else if (this.currentMonth > 11) {
      this.currentYear++;
      this.currentMonth = 0;
      this.previousMonth = 11;
    }

    this.updateCalendar();
  }
}
