import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Appointment } from '../../models/appointment.model';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentMonth and currentYear', () => {
    const currentDate = new Date();
    expect(component.currentMonth).toBe(currentDate.getMonth());
    expect(component.currentYear).toBe(currentDate.getFullYear());
  });

  it('should correctly calculate daysInMonth and emptyDays', () => {
    component.currentMonth = 1;
    component.currentYear = 2021;
    component.updateCalendar();
    expect(component.daysInMonth.length).toBe(28);
  });

  it('should set editingAppointmentId and selectedDate', () => {
    const mockAppointment = { id: '123', date: new Date() } as Appointment;
    component.openModalForEdit(mockAppointment);
    expect(component.editingAppointmentId).toBe('123');
    expect(component.selectedDate).toEqual(new Date(mockAppointment.date));
  });

  it('should add or edit an appointment', () => {
    const newAppointment = { id: '1', date: new Date() } as Appointment;
    component.addOrEditAppointment(newAppointment);
    expect(component.appointments.length).toBe(1);
    expect(component.appointments[0]).toEqual(newAppointment);

    const editedAppointment = { ...newAppointment, date: new Date(2021, 1, 1) };
    component.editingAppointmentId = '1';
    component.addOrEditAppointment(editedAppointment);
    expect(component.appointments.length).toBe(1);
    expect(component.appointments[0]).toEqual(editedAppointment);
  });

  it('should delete an appointment', () => {
    const appointmentToDelete = { id: '1', date: new Date() } as Appointment;
    component.appointments.push(appointmentToDelete);
    component.deleteAppointment(appointmentToDelete);
    expect(component.appointments.find((a) => a.id === '1')).toBeUndefined();
  });

  it('should change month correctly', () => {
    component.currentMonth = 5;
    component.currentYear = 2021;

    component.changeMonth(1);
    expect(component.currentMonth).toBe(6);
    expect(component.currentYear).toBe(2021);

    component.changeMonth(-2);
    expect(component.currentMonth).toBe(4);
    expect(component.currentYear).toBe(2021);
  });
});
