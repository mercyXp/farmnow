"use client";

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
} from "@/features/transactions/actions";
import { DateField, Grid, ListField, SelectField, TextField, TxForm } from "@/features/transactions/form-kit";

type Named = { id: string; label: string };

export function MortalityForm({ flocks, causes }: { flocks: Named[]; causes: string[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createMortality({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          mortalityCount: Number(fd.get("mortalityCount")),
          cause: fd.get("cause"),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <TextField name="mortalityCount" label="Mortality count" type="number" min="1" />
        <ListField name="cause" label="Cause" values={causes} />
      </Grid>
    </TxForm>
  );
}

export function FeedUsageForm({ flocks, feed }: { flocks: Named[]; feed: Named[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createFeedConsumption({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          feedTypeId: fd.get("feedTypeId"),
          kgUsed: Number(fd.get("kgUsed")),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="feedTypeId" label="Feed type" options={feed} />
        <TextField name="kgUsed" label="Kg used" type="number" step="0.1" min="0.1" />
      </Grid>
    </TxForm>
  );
}

export function FeedPurchaseForm({
  suppliers,
  feed,
  methods,
}: {
  suppliers: Named[];
  feed: Named[];
  methods: string[];
}) {
  return (
    <TxForm
      onSave={async (fd) =>
        createFeedPurchase({
          purchaseDate: fd.get("purchaseDate"),
          supplierId: fd.get("supplierId"),
          feedTypeId: fd.get("feedTypeId"),
          numberOfBags: Number(fd.get("numberOfBags")),
          bagWeightKg: Number(fd.get("bagWeightKg")),
          unitCostPerBag: Number(fd.get("unitCostPerBag")),
          invoiceNo: fd.get("invoiceNo"),
          paymentMethod: fd.get("paymentMethod"),
        })
      }
    >
      <Grid>
        <DateField name="purchaseDate" label="Purchase date" />
        <SelectField name="supplierId" label="Supplier" options={suppliers} />
        <SelectField name="feedTypeId" label="Feed type" options={feed} />
        <TextField name="numberOfBags" label="Bags" type="number" min="1" />
        <TextField name="bagWeightKg" label="Bag weight kg" type="number" defaultValue="50" />
        <TextField name="unitCostPerBag" label="Cost per bag (ZMW)" type="number" step="0.01" />
        <TextField name="invoiceNo" label="Invoice no" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
      </Grid>
    </TxForm>
  );
}

export function WeightForm({ flocks }: { flocks: Named[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createWeeklyWeight({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          weekNo: Number(fd.get("weekNo")),
          sampleSize: Number(fd.get("sampleSize")),
          avgBodyWeightG: Number(fd.get("avgBodyWeightG")),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <TextField name="weekNo" label="Week no" type="number" min="1" />
        <TextField name="sampleSize" label="Sample size" type="number" min="1" />
        <TextField name="avgBodyWeightG" label="Avg body weight (g)" type="number" step="0.1" />
      </Grid>
    </TxForm>
  );
}

export function HealthForm({ flocks, products, routes }: { flocks: Named[]; products: Named[]; routes: string[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createHealth({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          productId: fd.get("productId"),
          dosageGiven: fd.get("dosageGiven"),
          route: fd.get("route"),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="productId" label="Product" options={products} />
        <TextField name="dosageGiven" label="Dosage" />
        <ListField name="route" label="Route" values={routes} />
      </Grid>
    </TxForm>
  );
}

export function MedicineLotForm({
  flocks,
  products,
  suppliers,
}: {
  flocks: Named[];
  products: Named[];
  suppliers: Named[];
}) {
  return (
    <TxForm
      onSave={async (fd) =>
        createMedicineLot({
          flockId: fd.get("flockId"),
          productId: fd.get("productId"),
          supplierId: fd.get("supplierId"),
          lotNumber: fd.get("lotNumber"),
          expiryDate: fd.get("expiryDate"),
          quantityReceived: Number(fd.get("quantityReceived")),
          quantityUsed: Number(fd.get("quantityUsed") || 0),
          unitCost: Number(fd.get("unitCost")),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <SelectField name="productId" label="Product" options={products} />
        <SelectField name="supplierId" label="Supplier" options={suppliers} />
        <TextField name="lotNumber" label="Lot number" />
        <TextField name="expiryDate" label="Expiry date" type="date" />
        <TextField name="quantityReceived" label="Qty received" type="number" min="0" />
        <TextField name="quantityUsed" label="Qty used" type="number" min="0" defaultValue="0" required={false} />
        <TextField name="unitCost" label="Unit cost (ZMW)" type="number" step="0.01" />
      </Grid>
    </TxForm>
  );
}

export function SaleForm({ flocks, customers }: { flocks: Named[]; customers: Named[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createSale({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          customerId: fd.get("customerId"),
          birdsDispatched: Number(fd.get("birdsDispatched")),
          liveWeightKg: Number(fd.get("liveWeightKg")),
          pricePerKg: Number(fd.get("pricePerKg")),
          pricePerBird: Number(fd.get("pricePerBird") || 0),
          transportCost: Number(fd.get("transportCost") || 0),
          amountPaid: Number(fd.get("amountPaid") || 0),
          invoiceNo: fd.get("invoiceNo"),
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock" options={flocks} />
        <DateField />
        <SelectField name="customerId" label="Customer" options={customers} />
        <TextField name="birdsDispatched" label="Birds dispatched" type="number" min="1" />
        <TextField name="liveWeightKg" label="Live weight kg" type="number" step="0.001" />
        <TextField name="pricePerKg" label="Price / kg (ZMW)" type="number" step="0.01" />
        <TextField name="pricePerBird" label="Price / bird (0 = by weight)" type="number" step="0.01" defaultValue="0" />
        <TextField name="transportCost" label="Transport (ZMW)" type="number" step="0.01" defaultValue="0" />
        <TextField name="amountPaid" label="Amount paid (ZMW)" type="number" step="0.01" defaultValue="0" />
        <TextField name="invoiceNo" label="Invoice no" />
      </Grid>
    </TxForm>
  );
}

export function ExpenseForm({
  flocks,
  suppliers,
  categories,
  methods,
}: {
  flocks: Named[];
  suppliers: Named[];
  categories: string[];
  methods: string[];
}) {
  return (
    <TxForm
      onSave={async (fd) =>
        createExpense({
          flockId: fd.get("flockId") || null,
          entryDate: fd.get("entryDate"),
          category: fd.get("category"),
          supplierId: fd.get("supplierId") || null,
          quantity: Number(fd.get("quantity")),
          unitCost: Number(fd.get("unitCost")),
          paymentMethod: fd.get("paymentMethod"),
          paymentRef: fd.get("paymentRef") || "",
          approvedBy: fd.get("approvedBy") || "",
        })
      }
    >
      <Grid>
        <SelectField name="flockId" label="Flock (blank = overhead)" options={flocks} required={false} />
        <DateField />
        <ListField name="category" label="Category" values={categories} />
        <SelectField name="supplierId" label="Supplier" options={suppliers} required={false} />
        <TextField name="quantity" label="Quantity" type="number" step="0.001" defaultValue="1" />
        <TextField name="unitCost" label="Unit cost (ZMW)" type="number" step="0.01" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
        <TextField name="paymentRef" label="Payment ref" required={false} />
        <TextField name="approvedBy" label="Approved by" required={false} />
      </Grid>
    </TxForm>
  );
}

export function IncomeForm({ sources, methods }: { sources: string[]; methods: string[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createOtherIncome({
          entryDate: fd.get("entryDate"),
          source: fd.get("source"),
          description: fd.get("description"),
          amount: Number(fd.get("amount")),
          paymentMethod: fd.get("paymentMethod"),
          receivedBy: fd.get("receivedBy"),
        })
      }
    >
      <Grid>
        <DateField />
        <ListField name="source" label="Source" values={sources} />
        <TextField name="description" label="Description" />
        <TextField name="amount" label="Amount (ZMW)" type="number" step="0.01" />
        <ListField name="paymentMethod" label="Payment method" values={methods} />
        <TextField name="receivedBy" label="Received by" />
      </Grid>
    </TxForm>
  );
}

export function RoutineForm({
  flocks,
  employees,
  litter,
  ventilation,
}: {
  flocks: Named[];
  employees: Named[];
  litter: string[];
  ventilation: string[];
}) {
  return (
    <TxForm
      onSave={async (fd) =>
        createRoutine({
          flockId: fd.get("flockId"),
          entryDate: fd.get("entryDate"),
          temperatureC: Number(fd.get("temperatureC")),
          humidityPct: Number(fd.get("humidityPct")),
          waterAvailable: fd.get("waterAvailable"),
          feedAvailable: fd.get("feedAvailable"),
          drinkersCleaned: fd.get("drinkersCleaned"),
          litterCondition: fd.get("litterCondition"),
          ventilation: fd.get("ventilation"),
          sickBirdsObserved: Number(fd.get("sickBirdsObserved") || 0),
          employeeId: fd.get("employeeId") || null,
          notes: fd.get("notes") || "",
        })
      }
    >
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
        <TextField name="sickBirdsObserved" label="Sick birds" type="number" min="0" defaultValue="0" />
        <SelectField name="employeeId" label="Employee" options={employees} required={false} />
        <TextField name="notes" label="Notes" required={false} />
      </Grid>
    </TxForm>
  );
}

export function EnvironmentForm({ houses }: { houses: Named[] }) {
  return (
    <TxForm
      onSave={async (fd) =>
        createEnvironment({
          houseId: fd.get("houseId"),
          entryDate: fd.get("entryDate"),
          readingTime: fd.get("readingTime"),
          temperatureC: Number(fd.get("temperatureC")),
          humidityPct: Number(fd.get("humidityPct")),
          ammoniaPpm: Number(fd.get("ammoniaPpm")),
        })
      }
    >
      <Grid>
        <SelectField name="houseId" label="House" options={houses} />
        <DateField />
        <TextField name="readingTime" label="Time" type="time" defaultValue="07:00" />
        <TextField name="temperatureC" label="Temperature °C" type="number" step="0.1" />
        <TextField name="humidityPct" label="Humidity %" type="number" step="0.1" />
        <TextField name="ammoniaPpm" label="Ammonia ppm" type="number" step="0.1" />
      </Grid>
    </TxForm>
  );
}
