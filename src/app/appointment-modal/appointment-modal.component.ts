import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})
export class AppointmentModalComponent implements OnInit {
  @Input() selectedDate!: Date;
  @Input() appointment: Appointment | null = null;
  @Input() appointments: Appointment[] = [];
  @Output() addAppointment = new EventEmitter<Appointment>();
  @Output() deleteAppointment = new EventEmitter<Appointment>();
  @Output() closeModal = new EventEmitter<void>();
  appointmentForm!: FormGroup;
  isValidTime = true;
  isOutsideGMT = true;
  existingAppointment = false;
  hasOverlap = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const appointmentData = this.appointment
      ? {
          ...this.appointment,
          date: this.appointment.date,
          startTime: this.appointment.startTime,
          endTime: this.appointment.endTime,
        }
      : {
          title: '',
          description: '',
          date: this.selectedDate,
          startTime: '',
          endTime: '',
        };

    this.appointmentForm = this.formBuilder.group({
      title: [appointmentData.title, Validators.required],
      description: [appointmentData.description, Validators.required],
      date: [appointmentData.date, Validators.required],
      startTime: [appointmentData.startTime, Validators.required],
      endTime: [appointmentData.endTime, Validators.required],
    });
  }

  validateTime(): void {
    const selectedStartTime = this.appointmentForm.value.startTime;
    const selectedEndTime = this.appointmentForm.value.endTime;

    // Parse the start and end times
    const parsedStartTime = selectedStartTime.split(':');
    const parsedEndTime = selectedEndTime.split(':');
    const startHours = parseInt(parsedStartTime[0], 10);
    const startMinutes = parseInt(parsedStartTime[1], 10);
    const endHours = parseInt(parsedEndTime[0], 10);
    const endMinutes = parseInt(parsedEndTime[1], 10);

    // Convert selected times to GMT
    const selectedStartTimeGMT = new Date(this.appointmentForm.value.date);
    selectedStartTimeGMT.setUTCHours(startHours, startMinutes);
    const selectedEndTimeGMT = new Date(this.appointmentForm.value.date);
    selectedEndTimeGMT.setUTCHours(endHours, endMinutes);

    // Check if start time is between 8am (08:00) and 5pm (17:00) GMT
    const gmt8am = new Date(this.appointmentForm.value.date);
    gmt8am.setUTCHours(8, 0);
    const gmt5pm = new Date(this.appointmentForm.value.date);
    gmt5pm.setUTCHours(17, 0);

    // Check for overlapping appointments
    const hasOverlap = this.appointments.some((appointment) => {
      const appointmentStartTime = new Date(appointment.date);
      appointmentStartTime.setUTCHours(
        parseInt(appointment.startTime.split(':')[0], 10),
        parseInt(appointment.startTime.split(':')[1], 10)
      );

      const appointmentEndTime = new Date(appointment.date);
      appointmentEndTime.setUTCHours(
        parseInt(appointment.endTime.split(':')[0], 10),
        parseInt(appointment.endTime.split(':')[1], 10)
      );

      return (
        this.appointmentForm.value.date.toDateString() ===
          appointment.date.toDateString() &&
        ((selectedStartTimeGMT >= appointmentStartTime &&
          selectedStartTimeGMT < appointmentEndTime) ||
          (selectedEndTimeGMT > appointmentStartTime &&
            selectedEndTimeGMT <= appointmentEndTime) ||
          (selectedStartTimeGMT <= appointmentStartTime &&
            selectedEndTimeGMT >= appointmentEndTime))
      );
    });

    this.isOutsideGMT =
      selectedStartTimeGMT >= gmt8am &&
      selectedStartTimeGMT <= gmt5pm &&
      selectedEndTimeGMT >= gmt8am &&
      selectedEndTimeGMT <= gmt5pm;
    this.isValidTime = selectedEndTimeGMT > selectedStartTimeGMT;
    this.hasOverlap = hasOverlap;
  }

  submitAppointment(): void {
    if (this.appointmentForm.valid && this.isValidTime) {
      const newAppointment: Appointment = {
        ...this.appointmentForm.value,
        id: this.appointment?.id || new Date().getTime().toString(),
      };
      this.addAppointment.emit(newAppointment);
      this.closeModalTrigger();
    }
  }

  deleteAppointmentTrigger(): void {
    if (this.appointment) {
      this.deleteAppointment.emit(this.appointment);
      this.closeModalTrigger();
    }
  }

  closeModalTrigger(): void {
    this.closeModal.emit();
  }
}
