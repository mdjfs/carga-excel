import { Schema, model, models, Model } from 'mongoose';

export interface IAffiliate {
  _id: string;
  name: string;
  identifier: string;
}

const affiliateSchema = new Schema<IAffiliate, Model<IAffiliate>>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  identifier: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 10
  }
});

const Affiliate: Model<IAffiliate> = models.Affiliate || model<IAffiliate, Model<IAffiliate>>('Affiliate', affiliateSchema);

export default Affiliate;