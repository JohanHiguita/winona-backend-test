export type Prescription = {
  id: number;
  patientId: number;
  medicationName: string;
  dosage?: string | null;
  instructions?: string | null;
  createdAt: Date;
};

