import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppointmentModalComponent } from './appointment-modal.component';

describe('AppointmentModalComponent', () => {
  let component: AppointmentModalComponent;
  let fixture: ComponentFixture<AppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppointmentModalComponent],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentModalComponent);
    component = fixture.componentInstance;
    component.selectedDate = new Date();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the appointment form', () => {
    component.initializeForm();
    expect(component.appointmentForm).toBeTruthy();
    expect(component.appointmentForm.controls['title']).toBeTruthy();
    expect(component.appointmentForm.controls['description']).toBeTruthy();
    expect(component.appointmentForm.controls['date']).toBeTruthy();
    expect(component.appointmentForm.controls['startTime']).toBeTruthy();
    expect(component.appointmentForm.controls['endTime']).toBeTruthy();
  });

  it('should validate time correctly', () => {
    component.initializeForm();
    component.appointmentForm.setValue({
      title: 'Test',
      description: 'Test description',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
    });
    component.validateTime();
    expect(component.isValidTime).toBeTrue();
    expect(component.isOutsideGMT).toBeTrue();
    expect(component.hasOverlap).toBeFalse();
  });

  it('should emit addAppointment event', () => {
    spyOn(component.addAppointment, 'emit');
    component.initializeForm();
    component.appointmentForm.setValue({
      title: 'Test Appointment',
      description: 'Test Description',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
    });
    component.submitAppointment();
    expect(component.addAppointment.emit).toHaveBeenCalled();
  });

  it('should emit deleteAppointment event', () => {
    spyOn(component.deleteAppointment, 'emit');
    component.appointment = {
      id: '1',
      title: 'Test',
      description: 'Test',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
    };
    component.deleteAppointmentTrigger();
    expect(component.deleteAppointment.emit).toHaveBeenCalledWith(
      component.appointment
    );
  });

  it('should emit closeModal event', () => {
    spyOn(component.closeModal, 'emit');
    component.closeModalTrigger();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
