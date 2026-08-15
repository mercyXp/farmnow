"use client";

import {
  dailyRoutineCreateSchema,
  dailyRoutineUpdateSchema,
  environmentCreateSchema,
  environmentUpdateSchema,
  expenseCreateSchema,
  expenseUpdateSchema,
  feedConsumptionCreateSchema,
  feedConsumptionUpdateSchema,
  feedPurchaseCreateSchema,
  feedPurchaseUpdateSchema,
  healthCreateSchema,
  healthUpdateSchema,
  medicineLotCreateSchema,
  medicineLotUpdateSchema,
  mortalityCreateSchema,
  mortalityUpdateSchema,
  otherIncomeCreateSchema,
  otherIncomeUpdateSchema,
  saleCreateSchema,
  saleUpdateSchema,
  weeklyWeightCreateSchema,
  weeklyWeightUpdateSchema,
} from "@farmnow/domain";
import {
  createEnvironment,
  createExpense,
  createFeedConsumption,
  createFeedPurchase,
  createHealth,
  createMedicineLot,
  createMortality,
  createOtherIncome,
  createRoutine,
  createSale,
  createWeeklyWeight,
  updateEnvironment,
  updateExpense,
  updateFeedConsumption,
  updateFeedPurchase,
  updateHealth,
  updateMedicineLot,
  updateMortality,
  updateOtherIncome,
  updateRoutine,
  updateSale,
  updateWeeklyWeight,
} from "@/features/transactions/actions";
import {
  DateField,
  Grid,
  HiddenId,
  ListField,
  SelectField,
  TextField,
  ZodForm,
  todayIso,
} from "@/features/transactions/form-kit";
import { useInitial } from "@/features/transactions/workbench";

type Named = { id: string; label: string };

export function MortalityForm({
  flocks,
  causes,
  initial,
}: {
  flocks: Named[];
  causes: string[];
  initial?: { id: string; flockId: string; entryDate: string; mortalityCount: number; cause: string };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? mortalityUpdateSchema : mortalityCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        mortalityCount: record?.mortalityCount,
        cause: record?.cause ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateMortality(values) : createMortality(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <TextField name="mortalityCount" label="Mortality count" type="number" min="1" />
        <ListField name="cause" label="Cause" values={causes} />
      </Grid>
    </ZodForm>
  );
}

export function FeedUsageForm({
  flocks,
  feed,
  initial,
}: {
  flocks: Named[];
  feed: Named[];
  initial?: { id: string; flockId: string; entryDate: string; feedTypeId: string; kgUsed: number };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? feedConsumptionUpdateSchema : feedConsumptionCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        feedTypeId: record?.feedTypeId ?? "",
        kgUsed: record?.kgUsed,
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateFeedConsumption(values) : createFeedConsumption(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="feedTypeId" label="Feed type" options={feed} />
        <TextField name="kgUsed" label="Kg used" type="number" step="0.1" min="0.1" />
      </Grid>
    </ZodForm>
  );
}

export function FeedPurchaseForm({
  suppliers,
  feed,
  methods,
  initial,
}: {
  suppliers: Named[];
  feed: Named[];
  methods: string[];
  initial?: {
    id: string;
    purchaseDate: string;
    supplierId: string;
    feedTypeId: string;
    numberOfBags: number;
    bagWeightKg: number;
    unitCostPerBag: number;
    invoiceNo: string;
    paymentMethod: string;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? feedPurchaseUpdateSchema : feedPurchaseCreateSchema}
      defaultValues={{
        purchaseDate: record?.purchaseDate ?? todayIso(),
        supplierId: record?.supplierId ?? "",
        feedTypeId: record?.feedTypeId ?? "",
        numberOfBags: record?.numberOfBags,
        bagWeightKg: record?.bagWeightKg ?? 50,
        unitCostPerBag: record?.unitCostPerBag,
        invoiceNo: record?.invoiceNo ?? "",
        paymentMethod: record?.paymentMethod ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateFeedPurchase(values) : createFeedPurchase(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <DateField name="purchaseDate" label="Purchase date" />
        <SelectField name="supplierId" label="Supplier" options={suppliers} />
        <SelectField name="feedTypeId" label="Feed type" options={feed} />
        <TextField name="numberOfBags" label="Bags" type="number" min="1" />
        <TextField name="bagWeightKg" label="Bag weight kg" type="number" />
        <TextField name="unitCostPerBag" label="Cost per bag (ZMW)" type="number" step="0.01" />
        <TextField name="invoiceNo" label="Invoice no" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
      </Grid>
    </ZodForm>
  );
}

export function WeightForm({
  flocks,
  initial,
}: {
  flocks: Named[];
  initial?: { id: string; flockId: string; entryDate: string; weekNo: number; sampleSize: number; avgBodyWeightG: number };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? weeklyWeightUpdateSchema : weeklyWeightCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        weekNo: record?.weekNo,
        sampleSize: record?.sampleSize,
        avgBodyWeightG: record?.avgBodyWeightG,
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateWeeklyWeight(values) : createWeeklyWeight(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <TextField name="weekNo" label="Week no" type="number" min="1" />
        <TextField name="sampleSize" label="Sample size" type="number" min="1" />
        <TextField name="avgBodyWeightG" label="Avg body weight (g)" type="number" step="0.1" />
      </Grid>
    </ZodForm>
  );
}

export function HealthForm({
  flocks,
  products,
  routes,
  initial,
}: {
  flocks: Named[];
  products: Named[];
  routes: string[];
  initial?: { id: string; flockId: string; entryDate: string; productId: string; dosageGiven: string; route: string };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? healthUpdateSchema : healthCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        productId: record?.productId ?? "",
        dosageGiven: record?.dosageGiven ?? "",
        route: record?.route ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateHealth(values) : createHealth(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="productId" label="Product" options={products} />
        <TextField name="dosageGiven" label="Dosage" />
        <ListField name="route" label="Route" values={routes} />
      </Grid>
    </ZodForm>
  );
}

export function MedicineLotForm({
  flocks,
  products,
  suppliers,
  initial,
}: {
  flocks: Named[];
  products: Named[];
  suppliers: Named[];
  initial?: {
    id: string;
    flockId: string;
    productId: string;
    supplierId: string;
    lotNumber: string;
    expiryDate: string;
    quantityReceived: number;
    quantityUsed: number;
    unitCost: number;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? medicineLotUpdateSchema : medicineLotCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        productId: record?.productId ?? "",
        supplierId: record?.supplierId ?? "",
        lotNumber: record?.lotNumber ?? "",
        expiryDate: record?.expiryDate ?? todayIso(),
        quantityReceived: record?.quantityReceived,
        quantityUsed: record?.quantityUsed ?? 0,
        unitCost: record?.unitCost,
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateMedicineLot(values) : createMedicineLot(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <SelectField name="productId" label="Product" options={products} />
        <SelectField name="supplierId" label="Supplier" options={suppliers} />
        <TextField name="lotNumber" label="Lot number" />
        <TextField name="expiryDate" label="Expiry date" type="date" />
        <TextField name="quantityReceived" label="Qty received" type="number" min="0" />
        <TextField name="quantityUsed" label="Qty used" type="number" min="0" />
        <TextField name="unitCost" label="Unit cost (ZMW)" type="number" step="0.01" />
      </Grid>
    </ZodForm>
  );
}

export function SaleForm({
  flocks,
  customers,
  initial,
}: {
  flocks: Named[];
  customers: Named[];
  initial?: {
    id: string;
    flockId: string;
    entryDate: string;
    customerId: string;
    birdsDispatched: number;
    liveWeightKg: number;
    pricePerKg: number;
    pricePerBird: number;
    transportCost: number;
    amountPaid: number;
    invoiceNo: string;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? saleUpdateSchema : saleCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        customerId: record?.customerId ?? "",
        birdsDispatched: record?.birdsDispatched,
        liveWeightKg: record?.liveWeightKg,
        pricePerKg: record?.pricePerKg,
        pricePerBird: record?.pricePerBird ?? 0,
        transportCost: record?.transportCost ?? 0,
        amountPaid: record?.amountPaid ?? 0,
        invoiceNo: record?.invoiceNo ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateSale(values) : createSale(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="customerId" label="Customer" options={customers} />
        <TextField name="birdsDispatched" label="Birds dispatched" type="number" min="1" />
        <TextField name="liveWeightKg" label="Live weight kg" type="number" step="0.001" />
        <TextField name="pricePerKg" label="Price / kg (ZMW)" type="number" step="0.01" />
        <TextField name="pricePerBird" label="Price / bird (0 = by weight)" type="number" step="0.01" />
        <TextField name="transportCost" label="Transport (ZMW)" type="number" step="0.01" />
        <TextField name="amountPaid" label="Amount paid (ZMW)" type="number" step="0.01" />
        <TextField name="invoiceNo" label="Invoice no" />
      </Grid>
    </ZodForm>
  );
}

export function ExpenseForm({
  flocks,
  suppliers,
  categories,
  methods,
  initial,
}: {
  flocks: Named[];
  suppliers: Named[];
  categories: string[];
  methods: string[];
  initial?: {
    id: string;
    flockId: string | null;
    entryDate: string;
    category: string;
    supplierId: string | null;
    quantity: number;
    unitCost: number;
    paymentMethod: string;
    paymentRef: string;
    approvedBy: string;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? expenseUpdateSchema : expenseCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        category: record?.category ?? "",
        supplierId: record?.supplierId ?? "",
        quantity: record?.quantity ?? 1,
        unitCost: record?.unitCost,
        paymentMethod: record?.paymentMethod ?? "",
        paymentRef: record?.paymentRef ?? "",
        approvedBy: record?.approvedBy ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateExpense(values) : createExpense(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock (blank = overhead)" options={flocks} allowEmpty emptyLabel="Overhead" />
        <DateField />
        <ListField name="category" label="Category" values={categories} />
        <SelectField name="supplierId" label="Supplier" options={suppliers} allowEmpty />
        <TextField name="quantity" label="Quantity" type="number" step="0.001" />
        <TextField name="unitCost" label="Unit cost (ZMW)" type="number" step="0.01" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
        <TextField name="paymentRef" label="Payment ref" />
        <TextField name="approvedBy" label="Approved by" />
      </Grid>
    </ZodForm>
  );
}

export function IncomeForm({
  sources,
  methods,
  initial,
}: {
  sources: string[];
  methods: string[];
  initial?: {
    id: string;
    entryDate: string;
    source: string;
    description: string;
    amount: number;
    paymentMethod: string;
    receivedBy: string;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? otherIncomeUpdateSchema : otherIncomeCreateSchema}
      defaultValues={{
        entryDate: record?.entryDate ?? todayIso(),
        source: record?.source ?? "",
        description: record?.description ?? "",
        amount: record?.amount,
        paymentMethod: record?.paymentMethod ?? "",
        receivedBy: record?.receivedBy ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateOtherIncome(values) : createOtherIncome(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <DateField />
        <ListField name="source" label="Source" values={sources} />
        <TextField name="description" label="Description" />
        <TextField name="amount" label="Amount (ZMW)" type="number" step="0.01" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
        <TextField name="receivedBy" label="Received by" />
      </Grid>
    </ZodForm>
  );
}

export function RoutineForm({
  flocks,
  employees,
  litter,
  ventilation,
  initial,
}: {
  flocks: Named[];
  employees: Named[];
  litter: string[];
  ventilation: string[];
  initial?: {
    id: string;
    flockId: string;
    entryDate: string;
    temperatureC: number;
    humidityPct: number;
    waterAvailable: "Yes" | "No";
    feedAvailable: "Yes" | "No";
    drinkersCleaned: "Yes" | "No";
    litterCondition: string;
    ventilation: string;
    sickBirdsObserved: number;
    employeeId: string | null;
    notes: string;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? dailyRoutineUpdateSchema : dailyRoutineCreateSchema}
      defaultValues={{
        flockId: record?.flockId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        temperatureC: record?.temperatureC,
        humidityPct: record?.humidityPct,
        waterAvailable: record?.waterAvailable ?? "Yes",
        feedAvailable: record?.feedAvailable ?? "Yes",
        drinkersCleaned: record?.drinkersCleaned ?? "Yes",
        litterCondition: record?.litterCondition ?? "",
        ventilation: record?.ventilation ?? "",
        sickBirdsObserved: record?.sickBirdsObserved ?? 0,
        employeeId: record?.employeeId ?? "",
        notes: record?.notes ?? "",
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateRoutine(values) : createRoutine(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <TextField name="temperatureC" label="Temperature °C" type="number" step="0.1" />
        <TextField name="humidityPct" label="Humidity %" type="number" step="0.1" />
        <ListField name="waterAvailable" label="Water available" values={["Yes", "No"]} />
        <ListField name="feedAvailable" label="Feed available" values={["Yes", "No"]} />
        <ListField name="drinkersCleaned" label="Drinkers cleaned" values={["Yes", "No"]} />
        <ListField name="litterCondition" label="Litter" values={litter} />
        <ListField name="ventilation" label="Ventilation" values={ventilation} />
        <TextField name="sickBirdsObserved" label="Sick birds" type="number" min="0" />
        <SelectField name="employeeId" label="Employee" options={employees} allowEmpty />
        <TextField name="notes" label="Notes" />
      </Grid>
    </ZodForm>
  );
}

export function EnvironmentForm({
  houses,
  initial,
}: {
  houses: Named[];
  initial?: {
    id: string;
    houseId: string;
    entryDate: string;
    readingTime: string;
    temperatureC: number;
    humidityPct: number;
    ammoniaPpm: number;
  };
}) {
  const record = useInitial(initial);
  const editing = Boolean(record?.id);
  return (
    <ZodForm
      schema={editing ? environmentUpdateSchema : environmentCreateSchema}
      defaultValues={{
        houseId: record?.houseId ?? "",
        entryDate: record?.entryDate ?? todayIso(),
        readingTime: record?.readingTime ?? "07:00",
        temperatureC: record?.temperatureC,
        humidityPct: record?.humidityPct,
        ammoniaPpm: record?.ammoniaPpm,
        ...(editing ? { id: record!.id } : {}),
      }}
      onSubmit={(values) => (editing ? updateEnvironment(values) : createEnvironment(values))}
      submitLabel={editing ? "Update" : "Save"}
    >
      {editing ? <HiddenId /> : null}
      <Grid>
        <SelectField name="houseId" label="House" options={houses} />
        <DateField />
        <TextField name="readingTime" label="Time" type="time" />
        <TextField name="temperatureC" label="Temperature °C" type="number" step="0.1" />
        <TextField name="humidityPct" label="Humidity %" type="number" step="0.1" />
        <TextField name="ammoniaPpm" label="Ammonia ppm" type="number" step="0.1" />
      </Grid>
    </ZodForm>
  );
}
