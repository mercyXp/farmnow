import { z } from "zod";

const dateLike = z.coerce.date();
const num = z.coerce.number();
const emptyToNull = (value: unknown) => (value === "" || value === undefined ? null : value);
export const optionalUuid = z.preprocess(emptyToNull, z.string().uuid().nullable());

export const flockStatusSchema = z.enum(["Active", "Closed"]);
export const houseStatusSchema = z.enum(["Active", "Inactive"]);
export const employeeStatusSchema = z.enum(["Active", "Inactive"]);

export const flockCreateSchema = z
  .object({
    houseId: z.string().uuid(),
    breedId: z.string().uuid(),
    supplierId: z.string().uuid(),
    placedDate: dateLike,
    initialBirdCount: num.int().min(1).max(1_000_000),
    expectedDispatchDate: dateLike,
  })
  .refine((v) => v.expectedDispatchDate >= v.placedDate, {
    message: "Expected dispatch date cannot be before placement date.",
    path: ["expectedDispatchDate"],
  });

export const mortalityCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  mortalityCount: num.int().min(1),
  cause: z.string().min(1, "Select a cause."),
});

export const feedConsumptionCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  feedTypeId: z.string().uuid({ message: "Select a feed type." }),
  kgUsed: num.min(0.1).max(100_000),
});

export const feedPurchaseCreateSchema = z.object({
  purchaseDate: dateLike,
  supplierId: z.string().uuid({ message: "Select a supplier." }),
  feedTypeId: z.string().uuid({ message: "Select a feed type." }),
  numberOfBags: num.int().min(1).max(100_000),
  bagWeightKg: num.positive(),
  unitCostPerBag: num.min(0),
  invoiceNo: z.string().min(1, "Invoice number is required."),
  paymentMethod: z.string().min(1, "Select a payment method."),
});

export const weeklyWeightCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  weekNo: num.int().min(1).max(20),
  sampleSize: num.int().min(1),
  avgBodyWeightG: num.min(10).max(6000),
});

export const healthCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  productId: z.string().uuid({ message: "Select a product." }),
  dosageGiven: z.string().min(1),
  route: z.string().min(1),
});

export const medicineLotCreateSchema = z
  .object({
    flockId: z.string().uuid({ message: "Select a flock." }),
    productId: z.string().uuid({ message: "Select a product." }),
    supplierId: z.string().uuid({ message: "Select a supplier." }),
    lotNumber: z.string().min(1),
    expiryDate: dateLike,
    quantityReceived: num.int().min(0),
    quantityUsed: num.int().min(0),
    unitCost: num.min(0),
  })
  .refine((v) => v.quantityUsed <= v.quantityReceived, {
    message: "Quantity used cannot exceed quantity received.",
    path: ["quantityUsed"],
  });

export const saleCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  customerId: z.string().uuid({ message: "Select a customer." }),
  birdsDispatched: num.int().min(1),
  liveWeightKg: num.positive(),
  pricePerKg: num.min(0),
  pricePerBird: num.min(0),
  transportCost: num.min(0),
  amountPaid: num.min(0),
  invoiceNo: z.string().min(1),
});

export const expenseCreateSchema = z.object({
  flockId: optionalUuid,
  entryDate: dateLike,
  category: z.string().min(1),
  supplierId: optionalUuid,
  quantity: num.positive(),
  unitCost: num.min(0),
  paymentMethod: z.string().min(1),
  paymentRef: z.string().optional().default(""),
  approvedBy: z.string().optional().default(""),
});

export const otherIncomeCreateSchema = z.object({
  entryDate: dateLike,
  source: z.string().min(1),
  description: z.string().min(1),
  amount: num.min(0.01).max(10_000_000),
  paymentMethod: z.string().min(1),
  receivedBy: z.string().min(1),
});

export const dailyRoutineCreateSchema = z.object({
  flockId: z.string().uuid({ message: "Select a flock." }),
  entryDate: dateLike,
  temperatureC: num,
  humidityPct: num.min(0).max(100),
  waterAvailable: z.enum(["Yes", "No"]),
  feedAvailable: z.enum(["Yes", "No"]),
  drinkersCleaned: z.enum(["Yes", "No"]),
  litterCondition: z.string().min(1),
  ventilation: z.string().min(1),
  sickBirdsObserved: num.int().min(0),
  employeeId: optionalUuid,
  notes: z.string().optional().default(""),
});

export const environmentCreateSchema = z.object({
  houseId: z.string().uuid({ message: "Select a house." }),
  entryDate: dateLike,
  readingTime: z.string().min(1),
  temperatureC: num,
  humidityPct: num.min(0).max(100),
  ammoniaPpm: num.min(0),
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be at most 72 characters.");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

export const appRoleSchema = z.enum([
  "superadmin",
  "admin",
  "manager",
  "supervisor",
  "accountant",
  "entry_clerk",
]);

export const userCreateSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  password: passwordSchema,
  role: appRoleSchema,
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2).max(120),
  role: appRoleSchema,
  isActive: z.boolean(),
});

export const setTemporaryPasswordSchema = z
  .object({
    id: z.string().uuid(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const withId = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  schema.extend({ id: z.string().uuid() });

export const mortalityUpdateSchema = withId(mortalityCreateSchema);
export const feedConsumptionUpdateSchema = withId(feedConsumptionCreateSchema);
export const feedPurchaseUpdateSchema = withId(feedPurchaseCreateSchema);
export const weeklyWeightUpdateSchema = withId(weeklyWeightCreateSchema);
export const healthUpdateSchema = withId(healthCreateSchema);
export const medicineLotUpdateSchema = medicineLotCreateSchema.and(z.object({ id: z.string().uuid() }));
export const saleUpdateSchema = withId(saleCreateSchema);
export const expenseUpdateSchema = expenseCreateSchema.and(z.object({ id: z.string().uuid() }));
export const otherIncomeUpdateSchema = withId(otherIncomeCreateSchema);
export const dailyRoutineUpdateSchema = dailyRoutineCreateSchema.and(z.object({ id: z.string().uuid() }));
export const environmentUpdateSchema = withId(environmentCreateSchema);

export const reportTypeSchema = z.enum(["flock", "mortality", "financial"]);
export const deactivateEntrySchema = z.object({
  table: z.enum([
    "mortality_entries",
    "feed_consumption",
    "feed_purchases",
    "weekly_weights",
    "health_entries",
    "medicine_lots",
    "sales",
    "expenses",
    "other_income",
    "daily_routines",
    "environment_readings",
  ]),
  id: z.string().uuid(),
});

export type FlockCreate = z.infer<typeof flockCreateSchema>;
export type MortalityCreate = z.infer<typeof mortalityCreateSchema>;
export type FeedConsumptionCreate = z.infer<typeof feedConsumptionCreateSchema>;
export type FeedPurchaseCreate = z.infer<typeof feedPurchaseCreateSchema>;
export type WeeklyWeightCreate = z.infer<typeof weeklyWeightCreateSchema>;
export type HealthCreate = z.infer<typeof healthCreateSchema>;
export type MedicineLotCreate = z.infer<typeof medicineLotCreateSchema>;
export type SaleCreate = z.infer<typeof saleCreateSchema>;
export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
export type OtherIncomeCreate = z.infer<typeof otherIncomeCreateSchema>;
export type DailyRoutineCreate = z.infer<typeof dailyRoutineCreateSchema>;
export type EnvironmentCreate = z.infer<typeof environmentCreateSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type NewPassword = z.infer<typeof newPasswordSchema>;
export type SetTemporaryPassword = z.infer<typeof setTemporaryPasswordSchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type DeactivateEntry = z.infer<typeof deactivateEntrySchema>;
