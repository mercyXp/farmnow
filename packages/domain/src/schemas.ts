import { z } from "zod";

const dateLike = z.coerce.date();

export const flockStatusSchema = z.enum(["Active", "Closed"]);
export const houseStatusSchema = z.enum(["Active", "Inactive"]);
export const employeeStatusSchema = z.enum(["Active", "Inactive"]);

export const flockCreateSchema = z
  .object({
    houseId: z.string().uuid(),
    breedId: z.string().uuid(),
    supplierId: z.string().uuid(),
    placedDate: dateLike,
    initialBirdCount: z.number().int().min(1).max(1_000_000),
    expectedDispatchDate: dateLike,
  })
  .refine((v) => v.expectedDispatchDate >= v.placedDate, {
    message: "Expected dispatch date cannot be before placement date.",
    path: ["expectedDispatchDate"],
  });

export const mortalityCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  mortalityCount: z.number().int().min(1),
  cause: z.string().min(1),
});

export const feedConsumptionCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  feedTypeId: z.string().uuid(),
  kgUsed: z.number().min(0.1).max(100_000),
});

export const feedPurchaseCreateSchema = z.object({
  purchaseDate: dateLike,
  supplierId: z.string().uuid(),
  feedTypeId: z.string().uuid(),
  numberOfBags: z.number().int().min(1).max(100_000),
  bagWeightKg: z.number().positive(),
  unitCostPerBag: z.number().min(0),
  invoiceNo: z.string().min(1),
  paymentMethod: z.string().min(1),
});

export const weeklyWeightCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  weekNo: z.number().int().min(1).max(20),
  sampleSize: z.number().int().min(1),
  avgBodyWeightG: z.number().min(10).max(6000),
});

export const healthCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  productId: z.string().uuid(),
  dosageGiven: z.string().min(1),
  route: z.string().min(1),
});

export const medicineLotCreateSchema = z
  .object({
    flockId: z.string().uuid(),
    productId: z.string().uuid(),
    supplierId: z.string().uuid(),
    lotNumber: z.string().min(1),
    expiryDate: dateLike,
    quantityReceived: z.number().int().min(0),
    quantityUsed: z.number().int().min(0),
    unitCost: z.number().min(0),
  })
  .refine((v) => v.quantityUsed <= v.quantityReceived, {
    message: "Quantity used cannot exceed quantity received.",
    path: ["quantityUsed"],
  });

export const saleCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  customerId: z.string().uuid(),
  birdsDispatched: z.number().int().min(1),
  liveWeightKg: z.number().positive(),
  pricePerKg: z.number().min(0),
  pricePerBird: z.number().min(0),
  transportCost: z.number().min(0),
  amountPaid: z.number().min(0),
  invoiceNo: z.string().min(1),
});

export const expenseCreateSchema = z.object({
  flockId: z.string().uuid().nullable(),
  entryDate: dateLike,
  category: z.string().min(1),
  supplierId: z.string().uuid().nullable(),
  quantity: z.number().positive(),
  unitCost: z.number().min(0),
  paymentMethod: z.string().min(1),
  paymentRef: z.string().optional().default(""),
  approvedBy: z.string().optional().default(""),
});

export const otherIncomeCreateSchema = z.object({
  entryDate: dateLike,
  source: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().min(0.01).max(10_000_000),
  paymentMethod: z.string().min(1),
  receivedBy: z.string().min(1),
});

export const dailyRoutineCreateSchema = z.object({
  flockId: z.string().uuid(),
  entryDate: dateLike,
  temperatureC: z.number(),
  humidityPct: z.number().min(0).max(100),
  waterAvailable: z.enum(["Yes", "No"]),
  feedAvailable: z.enum(["Yes", "No"]),
  drinkersCleaned: z.enum(["Yes", "No"]),
  litterCondition: z.string().min(1),
  ventilation: z.string().min(1),
  sickBirdsObserved: z.number().int().min(0),
  employeeId: z.string().uuid().nullable(),
  notes: z.string().optional().default(""),
});

export const environmentCreateSchema = z.object({
  houseId: z.string().uuid(),
  entryDate: dateLike,
  readingTime: z.string().min(1),
  temperatureC: z.number(),
  humidityPct: z.number().min(0).max(100),
  ammoniaPpm: z.number().min(0),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
  password: z.string().min(8).max(72),
  role: appRoleSchema,
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2).max(120),
  role: appRoleSchema,
  isActive: z.boolean(),
  password: z.union([z.string().min(8).max(72), z.literal("")]).optional(),
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
