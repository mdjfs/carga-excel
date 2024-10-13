import { Schema, model, models, Model, Document } from 'mongoose';

interface ITramit extends Document {
  _id: string;
  name: string;
  total: number;
  complete: boolean;
}

const tramitSchema = new Schema<ITramit>({
  name: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  }
});

const Tramit: Model<ITramit> = (models.Tramit || model<ITramit>('Tramit', tramitSchema));

export default Tramit;
