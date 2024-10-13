import { Schema, model, models, Model } from 'mongoose';

export interface IOperation extends Document {
  _id: string;
  affiliate_id: Schema.Types.ObjectId;
  tramit_id: Schema.Types.ObjectId;
  total: number;
}

const operationSchema = new Schema<IOperation>({
  affiliate_id: {
    type: Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true
  },
  tramit_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tramit',
    required: true
  },
  total: {
    type: Number,
    default: 0
  }
});


const Operation: Model<IOperation> = (models.Operation || model<IOperation>('Operation', operationSchema));

export default Operation;