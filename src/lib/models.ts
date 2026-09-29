import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// ── User Model ────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  interlinkLoginId: string;
  role: 'client' | 'translator' | 'admin';
  phone?: string;
  company?: string;
  location?: string;
  languages?: string[];
  bio?: string;
  skills?: string[];
  isActive: boolean;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, select: false },
  interlinkLoginId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['client', 'translator', 'admin'], default: 'client' },
  phone: String,
  company: String,
  location: String,
  languages: [String],
  bio: { type: String, maxlength: 2000 },
  skills: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return this.password ? bcrypt.compare(candidate, this.password) : Promise.resolve(false);
};

// ── Service Model ─────────────────────────────────────────────────────────────
const ServiceSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleSwahili: { type: String, required: true },
  description: { type: String, required: true },
  shortDesc: { type: String, required: true },
  icon: { type: String, default: 'FileText' },
  category: {
    type: String,
    enum: ['document','website','legal','medical','technical','audio_video','localization','interpretation'],
    required: true,
  },
  languages: [String],
  priceFrom: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  deliveryDays: { type: Number, default: 3 },
  features: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ── Quote Model ───────────────────────────────────────────────────────────────
const QuoteSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  serviceType: String,
  documentType: String,
  wordCount: Number,
  fileUrl: String,
  deadline: Date,
  notes: String,
  status: { type: String, enum: ['pending','reviewed','quoted','accepted','rejected'], default: 'pending' },
  estimatedPrice: Number,
}, { timestamps: true });

// ── Order Model ───────────────────────────────────────────────────────────────
const OrderSchema = new Schema({
  quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  service: { type: Schema.Types.ObjectId, ref: 'Service' },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  originalFileName: String,
  fileUrl: String,
  wordCount: Number,
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['pending','confirmed','in_progress','review','completed','delivered','cancelled'],
    default: 'pending',
  },
  deadline: Date,
  completedAt: Date,
  notes: String,
  translatorNotes: String,
}, { timestamps: true });

// ── Contact Model ─────────────────────────────────────────────────────────────
const ContactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread','read','replied'], default: 'unread' },
}, { timestamps: true });

// ── Export Models ─────────────────────────────────────────────────────────────
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const QuoteModel = mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const ContactModel = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

const ApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  freelancerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  coverLetter: { type: String, required: true, maxlength: 5000 },
  proposedAmount: { type: Number, required: true, min: 0 },
  estimatedDays: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'], default: 'pending' },
}, { timestamps: true });
ApplicationSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

const JobSchema = new Schema({
  posterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, required: true, maxlength: 12000 },
  category: { type: String, required: true },
  skills: [String],
  budgetMin: { type: Number, required: true, min: 0 },
  budgetMax: { type: Number, required: true, min: 0 },
  budgetCurrency: { type: String, enum: ['tITL'], default: 'tITL' },
  paymentType: { type: String, enum: ['fixed', 'hourly', 'milestone'], default: 'fixed' },
  deadline: Date,
  status: { type: String, enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'open', index: true },
  assignedFreelancerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  escrow: {
    status: { type: String, enum: ['not_funded', 'funded', 'released', 'refunded'], default: 'not_funded' },
    amount: Number,
    token: { type: String, default: 'tITL' },
    transactionHash: String,
  },
}, { timestamps: true });

export const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);
export const ApplicationModel = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
