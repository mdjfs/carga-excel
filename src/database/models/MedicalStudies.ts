import { Schema, model, models, Model } from 'mongoose';

export interface IMedicalStudies extends Document{
  _id: string;
  name: string;
  code?: string;
}

const medicalStudiesSchema = new Schema<IMedicalStudies>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true
  }
});

const MedicalStudies: Model<IMedicalStudies> = models.MedicalStudies || model<IMedicalStudies>('MedicalStudies', medicalStudiesSchema);

export default MedicalStudies;