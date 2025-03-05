export enum BookingStatus {
  Pending = "Upcoming",
  Finished = "Finished",
  Cancelled = "Cancelled",
}

export interface Booking {
  id?: string;
  userId: string;
  serviceId: string;
  companyId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalBookingAmount?: number;
}
