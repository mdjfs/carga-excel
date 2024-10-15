import { Schema, model, models, Model } from 'mongoose';

export interface IGroup {
  _id: string;
  name: string;
  quantity: number;
  medical_study_id: Schema.Types.ObjectId;
  tramit_id: Schema.Types.ObjectId;
  total: number;
}

const GroupSchema = new Schema<IGroup, Model<IGroup>>({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    medical_study_id: {
        type: Schema.Types.ObjectId,
        ref: 'MedicalStudies',
        required: true
    },
    tramit_id: {
        type: Schema.Types.ObjectId,
        ref: 'MedicalStudies',
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const Group: Model<IGroup> = models.Group || model<IGroup, Model<IGroup>>('Group', GroupSchema);

export default Group;