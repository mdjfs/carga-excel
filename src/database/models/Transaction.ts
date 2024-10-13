import { Schema, model, models, Model } from 'mongoose';
import Operation from './Operation';

export interface ITransaction extends Document {
  _id: string;
  operation_id: Schema.Types.ObjectId;
  medical_study_id: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  date: Date;
  copay: number;
}

const transactionSchema = new Schema<ITransaction>({
  operation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Operation',
    required: true
  },
  medical_study_id: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalStudies',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  copay: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  }
});

const updateOperationTotal = async (operation_id: Schema.Types.ObjectId) => {
  const transactions = await Transaction.find({ operation_id });

  const total = transactions.reduce((acc, transaction) => acc + ((transaction.price * transaction.quantity) - transaction.copay), 0);

  await Operation.findByIdAndUpdate(operation_id, { total });
}

transactionSchema.post('save', async (doc) => await updateOperationTotal(doc.operation_id));

transactionSchema.post('findOneAndUpdate', async (doc) => doc && await updateOperationTotal(doc.operation_id));

transactionSchema.post('findOneAndDelete', async (doc) => doc && await updateOperationTotal(doc.operation_id));

const Transaction: Model<ITransaction> = (models.Transaction || model<ITransaction>('Transaction', transactionSchema));

export default Transaction;