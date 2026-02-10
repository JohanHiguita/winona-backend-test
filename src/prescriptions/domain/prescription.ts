export type Prescription = {
  id: string;
  patientId: string;
  medicationName: string;
  dosage?: string | null;
  instructions?: string | null;
  createdAt: Date;
};

