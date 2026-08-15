# Excel analysis dump

Sheets: 30

## Dashboard
- state: `visible`
- size: 50 rows x 14 cols
- unique formulas:
  - `A3` (FarmNow Limited — Broiler Production Dashboard): `="Live KPI overview across all flocks  |  Report generated: "&TEXT(TODAY(),"dd mmm yyyy")`
  - `A6` (FarmNow Limited — Broiler Production Dashboard): `=IFERROR(SUMIFS(calc_KPI_Engine[CurrentBirds],calc_KPI_Engine[Status],"Active")/SUMIFS(calc_KPI_Engine[InitialBirds],calc_KPI_Engine[Status],"Active"),0)`
  - `C6` (None): `=IFERROR(AVERAGEIFS(calc_KPI_Engine[FCR],calc_KPI_Engine[Status],"Active"),0)`
  - `E6` (None): `=IFERROR(AVERAGEIFS(calc_KPI_Engine[ADG_g],calc_KPI_Engine[Status],"Active"),0)`
  - `G6` (None): `=1-IFERROR(SUMIFS(calc_KPI_Engine[CurrentBirds],calc_KPI_Engine[Status],"Active")/SUMIFS(calc_KPI_Engine[InitialBirds],calc_KPI_Engine[Status],"Active"),0)`
  - `I6` (None): `=IFERROR(AVERAGEIFS(calc_KPI_Engine[CostPerBird_ZMW],calc_KPI_Engine[Status],"Active"),0)`
  - `K6` (None): `=IFERROR(AVERAGEIFS(calc_KPI_Engine[CostPerKg_ZMW],calc_KPI_Engine[Status],"Active"),0)`
  - `A7` (FarmNow Limited — Broiler Production Dashboard): `="Target: "&TEXT(INDEX(mst_Settings[Value],MATCH("TargetLivabilityPct",mst_Settings[Parameter],0)),"0.0%")`
  - `C7` (None): `="Target: "&TEXT(INDEX(mst_Settings[Value],MATCH("TargetFCR",mst_Settings[Parameter],0)),"0.00")`
  - `G7` (None): `="Target: "&TEXT(INDEX(mst_Settings[Value],MATCH("MortalityAlertThresholdPct",mst_Settings[Parameter],0)),"0.00%")`
  - `A11` (FarmNow Limited — Broiler Production Dashboard): `=calc_KPI_Engine!A2`
  - `B11` (None): `=calc_KPI_Engine!B2`
  - `C11` (None): `=calc_KPI_Engine!C2`
  - `D11` (None): `=calc_KPI_Engine!E2`
  - `E11` (None): `=calc_KPI_Engine!F2`
  - `F11` (None): `=calc_KPI_Engine!J2`
  - `G11` (None): `=calc_KPI_Engine!O2`
  - `H11` (None): `=calc_KPI_Engine!P2`
  - `I11` (None): `=calc_KPI_Engine!U2`
  - `J11` (None): `=calc_KPI_Engine!V2`
  - `K11` (None): `=calc_KPI_Engine!W2`
  - `A12` (FarmNow Limited — Broiler Production Dashboard): `=calc_KPI_Engine!A3`
  - `B12` (None): `=calc_KPI_Engine!B3`
  - `C12` (None): `=calc_KPI_Engine!C3`
  - `D12` (None): `=calc_KPI_Engine!E3`
  - `E12` (None): `=calc_KPI_Engine!F3`
  - `F12` (None): `=calc_KPI_Engine!J3`
  - `G12` (None): `=calc_KPI_Engine!O3`
  - `H12` (None): `=calc_KPI_Engine!P3`
  - `I12` (None): `=calc_KPI_Engine!U3`
  - `J12` (None): `=calc_KPI_Engine!V3`
  - `K12` (None): `=calc_KPI_Engine!W3`
  - `A13` (FarmNow Limited — Broiler Production Dashboard): `=calc_KPI_Engine!A4`
  - `B13` (None): `=calc_KPI_Engine!B4`
  - `C13` (None): `=calc_KPI_Engine!C4`
  - `D13` (None): `=calc_KPI_Engine!E4`
  - `E13` (None): `=calc_KPI_Engine!F4`
  - `F13` (None): `=calc_KPI_Engine!J4`
  - `G13` (None): `=calc_KPI_Engine!O4`
  - `H13` (None): `=calc_KPI_Engine!P4`
- charts: [{'index': 0, 'type': 'BarChart', 'title': "<openpyxl.chart.title.Title object>\nParameters:\ntx=<openpyxl.chart.text.Text object>\nParameters:\nstrRef=None, rich=<openpyxl.chart.text.RichText object>\nParameters:\nbodyPr=<openpyxl.drawing.text.RichTextProperties object>\nParameters:\nrot=None, spcFirstLastPara=None, vertOverflow=None, horzOverflow=None, vert=None, wrap=None, lIns=None, tIns=None, rIns=None, bIns=None, numCol=None, spcCol=None, rtlCol=None, fromWordArt=None, anchor=None, anchorCtr=None, forceAA=None, upright=None, compatLnSpc=None, prstTxWarp=None, scene3d=None, noAutofit=False, normAutofit=False, spAutoFit=False, lstStyle=None, p=[<openpyxl.drawing.text.Paragraph object>\nParameters:\npPr=<openpyxl.drawing.text.ParagraphProperties object>\nParameters:\nmarL=None, marR=None, lvl=None, indent=None, algn=None, defTabSz=None, rtl=None, eaLnBrk=None, fontAlgn=None, latinLnBrk=None, hangingPunct=None, lnSpc=None, spcBef=None, spcAft=None, tabLst=None, defRPr=<openpyxl.drawing.text.CharacterProperties object>\nParameters:\nkumimoji=None, lang=None, altLang=None, sz=None, b=None, i=None, u=None, strike=None, kern=None, cap=None, spc=None, normalizeH=None, baseline=None, noProof=None, dirty=None, err=None, smtClean=None, smtId=None, bmk=None, ln=None, noFill=False, solidFill=None, gradFill=None, blipFill=None, pattFill=None, grpFill=False, effectLst=None, effectDag=None, highlight=None, uLnTx=False, uLn=None, uFillTx=False, uFill=False, latin=None, ea=None, cs=None, sym=None, hlinkClick=None, hlinkMouseOver=None, rtl=None, buClrTx=False, buClr=None, buSzTx=False, buSzPct=None, buSzPts=None, buFontTx=False, buFont=None, buNone=False, buAutoNum=False, buChar=None, buBlip=None, r=[<openpyxl.drawing.text.RegularTextRun object>\nParameters:\nrPr=None, t='FCR by Flock'], br=None, fld=None, endParaRPr=None], layout=None, overlay=None, spPr=None, txPr=None", 'anchor': '<openpyxl.drawing.spreadsheet_drawing.OneCellAnchor object>\nParameters:\ncontentPart=None, _from=<openpyxl.drawing.spreadsheet_drawing.AnchorMarker object>\nParameters:\ncol=0, colOff=0, row=17, rowOff=0, ext=<openpyxl.drawing.xdr.XDRPositiveSize2D object>\nParameters:\ncx=4320000, cy=2700000, sp=None, grpSp=None, graphicFrame=None, cxnSp=None, pic=None, contentPart=None, clientData=<openpyxl.drawing.spreadsheet_drawing.AnchorClientData object>\nParameters:\nfLocksWithSheet=None, fPrintsWithSheet=None'}, {'index': 1, 'type': 'BarChart', 'title': "<openpyxl.chart.title.Title object>\nParameters:\ntx=<openpyxl.chart.text.Text object>\nParameters:\nstrRef=None, rich=<openpyxl.chart.text.RichText object>\nParameters:\nbodyPr=<openpyxl.drawing.text.RichTextProperties object>\nParameters:\nrot=None, spcFirstLastPara=None, vertOverflow=None, horzOverflow=None, vert=None, wrap=None, lIns=None, tIns=None, rIns=None, bIns=None, numCol=None, spcCol=None, rtlCol=None, fromWordArt=None, anchor=None, anchorCtr=None, forceAA=None, upright=None, compatLnSpc=None, prstTxWarp=None, scene3d=None, noAutofit=False, normAutofit=False, spAutoFit=False, lstStyle=None, p=[<openpyxl.drawing.text.Paragraph object>\nParameters:\npPr=<openpyxl.drawing.text.ParagraphProperties object>\nParameters:\nmarL=None, marR=None, lvl=None, indent=None, algn=None, defTabSz=None, rtl=None, eaLnBrk=None, fontAlgn=None, latinLnBrk=None, hangingPunct=None, lnSpc=None, spcBef=None, spcAft=None, tabLst=None, defRPr=<openpyxl.drawing.text.CharacterProperties object>\nParameters:\nkumimoji=None, lang=None, altLang=None, sz=None, b=None, i=None, u=None, strike=None, kern=None, cap=None, spc=None, normalizeH=None, baseline=None, noProof=None, dirty=None, err=None, smtClean=None, smtId=None, bmk=None, ln=None, noFill=False, solidFill=None, gradFill=None, blipFill=None, pattFill=None, grpFill=False, effectLst=None, effectDag=None, highlight=None, uLnTx=False, uLn=None, uFillTx=False, uFill=False, latin=None, ea=None, cs=None, sym=None, hlinkClick=None, hlinkMouseOver=None, rtl=None, buClrTx=False, buClr=None, buSzTx=False, buSzPct=None, buSzPts=None, buFontTx=False, buFont=None, buNone=False, buAutoNum=False, buChar=None, buBlip=None, r=[<openpyxl.drawing.text.RegularTextRun object>\nParameters:\nrPr=None, t='Livability % by Flock'], br=None, fld=None, endParaRPr=None], layout=None, overlay=None, spPr=None, txPr=None", 'anchor': '<openpyxl.drawing.spreadsheet_drawing.OneCellAnchor object>\nParameters:\ncontentPart=None, _from=<openpyxl.drawing.spreadsheet_drawing.AnchorMarker object>\nParameters:\ncol=6, colOff=0, row=17, rowOff=0, ext=<openpyxl.drawing.xdr.XDRPositiveSize2D object>\nParameters:\ncx=4320000, cy=2700000, sp=None, grpSp=None, graphicFrame=None, cxnSp=None, pic=None, contentPart=None, clientData=<openpyxl.drawing.spreadsheet_drawing.AnchorClientData object>\nParameters:\nfLocksWithSheet=None, fPrintsWithSheet=None'}, {'index': 2, 'type': 'BarChart', 'title': "<openpyxl.chart.title.Title object>\nParameters:\ntx=<openpyxl.chart.text.Text object>\nParameters:\nstrRef=None, rich=<openpyxl.chart.text.RichText object>\nParameters:\nbodyPr=<openpyxl.drawing.text.RichTextProperties object>\nParameters:\nrot=None, spcFirstLastPara=None, vertOverflow=None, horzOverflow=None, vert=None, wrap=None, lIns=None, tIns=None, rIns=None, bIns=None, numCol=None, spcCol=None, rtlCol=None, fromWordArt=None, anchor=None, anchorCtr=None, forceAA=None, upright=None, compatLnSpc=None, prstTxWarp=None, scene3d=None, noAutofit=False, normAutofit=False, spAutoFit=False, lstStyle=None, p=[<openpyxl.drawing.text.Paragraph object>\nParameters:\npPr=<openpyxl.drawing.text.ParagraphProperties object>\nParameters:\nmarL=None, marR=None, lvl=None, indent=None, algn=None, defTabSz=None, rtl=None, eaLnBrk=None, fontAlgn=None, latinLnBrk=None, hangingPunct=None, lnSpc=None, spcBef=None, spcAft=None, tabLst=None, defRPr=<openpyxl.drawing.text.CharacterProperties object>\nParameters:\nkumimoji=None, lang=None, altLang=None, sz=None, b=None, i=None, u=None, strike=None, kern=None, cap=None, spc=None, normalizeH=None, baseline=None, noProof=None, dirty=None, err=None, smtClean=None, smtId=None, bmk=None, ln=None, noFill=False, solidFill=None, gradFill=None, blipFill=None, pattFill=None, grpFill=False, effectLst=None, effectDag=None, highlight=None, uLnTx=False, uLn=None, uFillTx=False, uFill=False, latin=None, ea=None, cs=None, sym=None, hlinkClick=None, hlinkMouseOver=None, rtl=None, buClrTx=False, buClr=None, buSzTx=False, buSzPct=None, buSzPts=None, buFontTx=False, buFont=None, buNone=False, buAutoNum=False, buChar=None, buBlip=None, r=[<openpyxl.drawing.text.RegularTextRun object>\nParameters:\nrPr=None, t='Cost per Bird (ZMW) by Flock'], br=None, fld=None, endParaRPr=None], layout=None, overlay=None, spPr=None, txPr=None", 'anchor': '<openpyxl.drawing.spreadsheet_drawing.OneCellAnchor object>\nParameters:\ncontentPart=None, _from=<openpyxl.drawing.spreadsheet_drawing.AnchorMarker object>\nParameters:\ncol=12, colOff=0, row=17, rowOff=0, ext=<openpyxl.drawing.xdr.XDRPositiveSize2D object>\nParameters:\ncx=4320000, cy=2700000, sp=None, grpSp=None, graphicFrame=None, cxnSp=None, pic=None, contentPart=None, clientData=<openpyxl.drawing.spreadsheet_drawing.AnchorClientData object>\nParameters:\nfLocksWithSheet=None, fPrintsWithSheet=None'}]

Sample:
  FarmNow Limited — Broiler Production Dashboard |  |  |  |  |  |  |  |  |  |  |  |  | 
  Livability % (Active Flocks) |  | Avg FCR (Active Flocks) |  | Avg Daily Gain (g/bird) |  | Mortality % (Active Flocks) |  | Avg Cost / Bird (ZMW) |  | Avg Cost / Kg Live Wt (ZMW) |  |  | 
  Flock Performance Comparison |  |  |  |  |  |  |  |  |  |  |  |  | 
  Flock | House | Breed | Status | Days On Farm | Livability % | FCR | ADG (g) | Cost/Bird (ZMW) | Cost/Kg (ZMW) | Est. Profit (ZMW) |  |  | 
  Trend & Comparison Charts |  |  |  |  |  |  |  |  |  |  |  |  | 
  Alerts |  |  |  |  |  |  |  |  |  |  |  |  | 
  Flock | Alert |  |  |  |  |  |  |  |  |  |  |  | 
  Inventory & Compliance Alerts |  |  |  |  |  |  |  |  |  |  |  |  | 

## Menu_Nav
- state: `visible`
- size: 34 rows x 4 cols

Sample:
  FarmNow Limited — System Navigation |  |  | 
  Go To | Sheet | Description | 
  Dashboard | Dashboard | Live KPI overview, flock comparison, charts and alerts | 
  New Flock Setup | reg_Flocks | Register a new flock/batch (house, breed, placement date) | 
  Daily Mortality Entry | reg_DailyMortality | Log daily bird deaths per flock | 
  Feed Consumption Entry | reg_FeedConsumption | Log daily/weekly feed usage per flock | 
  Weekly Weight Sampling | reg_WeeklyWeights | Log sample bird weights per flock | 
  Vaccination & Health Entry | reg_Vaccination_Health | Log vaccines/medication administered | 

## mst_Houses
- state: `visible`
- size: 5 rows x 5 cols
- table `mst_Houses` ref `A1:E5` cols: ['HouseID', 'HouseCode', 'Capacity', 'LocationZone', 'Status']

Sample:
  HouseID | HouseCode | Capacity | LocationZone | Status
  1 | H-01 | 5000 | Zone A | Active
  2 | H-02 | 5000 | Zone A | Active
  3 | H-03 | 4000 | Zone B | Active
  4 | H-04 | 4000 | Zone B | Inactive

## mst_Breeds
- state: `visible`
- size: 4 rows x 4 cols
- table `mst_Breeds` ref `A1:D4` cols: ['BreedID', 'BreedName', 'StandardFCR', 'StandardADG_g']

Sample:
  BreedID | BreedName | StandardFCR | StandardADG_g
  1 | Ross 308 | 1.65 | 62
  2 | Cobb 500 | 1.68 | 60
  3 | Arbor Acres | 1.7 | 58

## mst_FeedTypes
- state: `visible`
- size: 4 rows x 6 cols
- table `mst_FeedTypes` ref `A1:F4` cols: ['FeedID', 'FeedName', 'Stage', 'UnitCostPerKg_ZMW', 'StandardBagWeightKg', 'MinStockKg']

Sample:
  FeedID | FeedName | Stage | UnitCostPerKg_ZMW | StandardBagWeightKg | MinStockKg
  1 | Starter Mash | Starter | 12.5 | 50 | 300
  2 | Grower Mash | Grower | 11.8 | 50 | 400
  3 | Finisher Mash | Finisher | 11.2 | 50 | 400

## mst_Suppliers
- state: `visible`
- size: 5 rows x 6 cols
- table `mst_Suppliers` ref `A1:F5` cols: ['SupplierID', 'SupplierName', 'Contact', 'Email', 'Category', 'LeadTimeDays']

Sample:
  SupplierID | SupplierName | Contact | Email | Category | LeadTimeDays
  1 | Zamchick Hatchery | +260-97-111-2222 | sales@zamchick.example | Day-Old Chicks | 2
  2 | National Milling Co | +260-96-333-4444 | orders@natmill.example | Feed | 1
  3 | AgroVet Supplies Ltd | +260-95-555-6666 | info@agrovet.example | Veterinary | 3
  4 | Lusaka Wood Shavings Ltd | +260-97-888-1111 | sales@lusakawood.example | Bedding/Litter | 2

## mst_Customers
- state: `visible`
- size: 4 rows x 6 cols
- table `mst_Customers` ref `A1:F4` cols: ['CustomerID', 'CustomerName', 'Contact', 'Address', 'PriceTier', 'PaymentTerms']

Sample:
  CustomerID | CustomerName | Contact | Address | PriceTier | PaymentTerms
  1 | Shoprite Lusaka | +260-21-123-4567 | Cairo Road, Lusaka | Wholesale | 30 Days Credit
  2 | Melissa Poultry Traders | +260-97-777-8888 | Kabwata, Lusaka | Retail | Cash on Delivery
  3 | City Market Vendors Assoc | +260-96-222-3333 | City Market, Lusaka | Bulk | Cash on Delivery

## mst_Vaccines_Meds
- state: `visible`
- size: 5 rows x 5 cols
- table `mst_Vaccines_Meds` ref `A1:E5` cols: ['ProductID', 'ProductName', 'Type', 'DosageUnit', 'WithdrawalDays']

Sample:
  ProductID | ProductName | Type | DosageUnit | WithdrawalDays
  1 | Newcastle Disease Vaccine (Lasota) | Vaccine | ml/bird | 0
  2 | Gumboro Vaccine (IBD) | Vaccine | ml/bird | 0
  3 | Amoxicillin Oral Solution | Antibiotic | ml/L water | 7
  4 | Multivitamin Booster | Supplement | ml/L water | 0

## mst_Users
- state: `visible`
- size: 4 rows x 3 cols
- table `mst_Users` ref `A1:C4` cols: ['UserID', 'UserName', 'Role']

Sample:
  UserID | UserName | Role
  1 | A. Mwansa | Admin
  2 | B. Tembo | Supervisor
  3 | C. Banda | Entry Clerk

## mst_Settings
- state: `visible`
- size: 12 rows x 2 cols
- table `mst_Settings` ref `A1:B12` cols: ['Parameter', 'Value']

Sample:
  Parameter | Value
  CompanyName | FarmNow Limited
  Location | Lusaka, Zambia
  Phone | +260 000 000000
  Email | info@farmnow.example
  CurrencySymbol | K
  ReportCurrency | ZMW
  TargetFCR | 1.7

## mst_Lists
- state: `visible`
- size: 9 rows x 7 cols

Sample:
  PaymentMethod | LitterCondition | Ventilation | ExpenseCategory | YesNo | MortalityCause | VaccinationRoute
  Cash | Dry | Good | Day-Old Chicks | Yes | Normal Culling | Eye Drop
  Mobile Money | Damp | Fair | Bedding/Litter | No | Heat Stress | Drinking Water
  Bank Transfer | Wet | Poor | Utilities |  | Disease | Injection
  Cheque | Needs Changing |  | Labour |  | Predator | Spray
  Credit |  |  | Transport |  | Cold Stress | 
   |  |  | Veterinary |  | Other | 
   |  |  | Heater/Fuel |  |  | 

## reg_Flocks
- state: `visible`
- size: 5 rows x 8 cols
- table `reg_Flocks` ref `A1:H5` cols: ['FlockID', 'HouseID', 'BreedID', 'PlacedDate', 'InitialBirdCount', 'SupplierID', 'ExpectedDispatchDate', 'Status']

Sample:
  FlockID | HouseID | BreedID | PlacedDate | InitialBirdCount | SupplierID | ExpectedDispatchDate | Status
  FLK-001 | 1 | 1 | 2026-05-20T00:00:00 | 5000 | 1 | 2026-07-01T00:00:00 | Closed
  FLK-002 | 2 | 2 | 2026-06-25T00:00:00 | 5000 | 1 | 2026-08-06T00:00:00 | Active
  FLK-003 | 3 | 1 | 2026-07-15T00:00:00 | 4000 | 1 | 2026-08-26T00:00:00 | Active
  FLK-004 | 1 | 3 | 2026-08-01T00:00:00 | 5000 | 1 | 2026-09-12T00:00:00 | Active

## reg_DailyMortality
- state: `visible`
- size: 32 rows x 8 cols
- table `reg_DailyMortality` ref `A1:H32` cols: ['EntryID', 'FlockID', 'Date', 'MortalityCount', 'Cause', 'CumulativeMortality', 'EnteredBy', 'IsActive']
- unique formulas:
  - `F2` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B2,reg_DailyMortality[Date],"<="&$C2)`
  - `F3` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B3,reg_DailyMortality[Date],"<="&$C3)`
  - `F4` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B4,reg_DailyMortality[Date],"<="&$C4)`
  - `F5` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B5,reg_DailyMortality[Date],"<="&$C5)`
  - `F6` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B6,reg_DailyMortality[Date],"<="&$C6)`
  - `F7` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B7,reg_DailyMortality[Date],"<="&$C7)`
  - `F8` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B8,reg_DailyMortality[Date],"<="&$C8)`
  - `F9` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B9,reg_DailyMortality[Date],"<="&$C9)`
  - `F10` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B10,reg_DailyMortality[Date],"<="&$C10)`
  - `F11` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B11,reg_DailyMortality[Date],"<="&$C11)`
  - `F12` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B12,reg_DailyMortality[Date],"<="&$C12)`
  - `F13` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B13,reg_DailyMortality[Date],"<="&$C13)`
  - `F14` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B14,reg_DailyMortality[Date],"<="&$C14)`
  - `F15` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B15,reg_DailyMortality[Date],"<="&$C15)`
  - `F16` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B16,reg_DailyMortality[Date],"<="&$C16)`
  - `F17` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B17,reg_DailyMortality[Date],"<="&$C17)`
  - `F18` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B18,reg_DailyMortality[Date],"<="&$C18)`
  - `F19` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B19,reg_DailyMortality[Date],"<="&$C19)`
  - `F20` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B20,reg_DailyMortality[Date],"<="&$C20)`
  - `F21` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B21,reg_DailyMortality[Date],"<="&$C21)`
  - `F22` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B22,reg_DailyMortality[Date],"<="&$C22)`
  - `F23` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B23,reg_DailyMortality[Date],"<="&$C23)`
  - `F24` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B24,reg_DailyMortality[Date],"<="&$C24)`
  - `F25` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B25,reg_DailyMortality[Date],"<="&$C25)`
  - `F26` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B26,reg_DailyMortality[Date],"<="&$C26)`
  - `F27` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B27,reg_DailyMortality[Date],"<="&$C27)`
  - `F28` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B28,reg_DailyMortality[Date],"<="&$C28)`
  - `F29` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B29,reg_DailyMortality[Date],"<="&$C29)`
  - `F30` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B30,reg_DailyMortality[Date],"<="&$C30)`
  - `F31` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B31,reg_DailyMortality[Date],"<="&$C31)`
  - `F32` (CumulativeMortality): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B32,reg_DailyMortality[Date],"<="&$C32)`
- validations:
  - E2:E32: type=list f1==List_MortalityCause
  - B2:B82: type=list f1==FlockID_List

Sample:
  EntryID | FlockID | Date | MortalityCount | Cause | CumulativeMortality | EnteredBy | IsActive
  MORT-0001 | FLK-001 | 2026-05-20T00:00:00 | 8 | Normal Culling |  | C. Banda | Yes
  MORT-0002 | FLK-001 | 2026-05-24T00:00:00 | 7 | Heat Stress |  | B. Tembo | Yes
  MORT-0003 | FLK-001 | 2026-05-28T00:00:00 | 1 | Disease |  | C. Banda | Yes
  MORT-0004 | FLK-001 | 2026-06-01T00:00:00 | 3 | Normal Culling |  | C. Banda | Yes
  MORT-0005 | FLK-001 | 2026-06-05T00:00:00 | 2 | Normal Culling |  | B. Tembo | Yes
  MORT-0006 | FLK-001 | 2026-06-09T00:00:00 | 1 | Heat Stress |  | C. Banda | Yes
  MORT-0007 | FLK-001 | 2026-06-13T00:00:00 | 2 | Disease |  | C. Banda | Yes

## reg_FeedConsumption
- state: `visible`
- size: 28 rows x 9 cols
- table `reg_FeedConsumption` ref `A1:I28` cols: ['EntryID', 'FlockID', 'Date', 'FeedID', 'KgUsed', 'CostZMW', 'RunningTotalKg', 'EnteredBy', 'IsActive']
- unique formulas:
  - `F2` (CostZMW): `=ROUND($E2*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D2,mst_FeedTypes[FeedID],0)),2)`
  - `G2` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B2,reg_FeedConsumption[Date],"<="&$C2)`
  - `F3` (CostZMW): `=ROUND($E3*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D3,mst_FeedTypes[FeedID],0)),2)`
  - `G3` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B3,reg_FeedConsumption[Date],"<="&$C3)`
  - `F4` (CostZMW): `=ROUND($E4*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D4,mst_FeedTypes[FeedID],0)),2)`
  - `G4` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B4,reg_FeedConsumption[Date],"<="&$C4)`
  - `F5` (CostZMW): `=ROUND($E5*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D5,mst_FeedTypes[FeedID],0)),2)`
  - `G5` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B5,reg_FeedConsumption[Date],"<="&$C5)`
  - `F6` (CostZMW): `=ROUND($E6*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D6,mst_FeedTypes[FeedID],0)),2)`
  - `G6` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B6,reg_FeedConsumption[Date],"<="&$C6)`
  - `F7` (CostZMW): `=ROUND($E7*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D7,mst_FeedTypes[FeedID],0)),2)`
  - `G7` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B7,reg_FeedConsumption[Date],"<="&$C7)`
  - `F8` (CostZMW): `=ROUND($E8*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D8,mst_FeedTypes[FeedID],0)),2)`
  - `G8` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B8,reg_FeedConsumption[Date],"<="&$C8)`
  - `F9` (CostZMW): `=ROUND($E9*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D9,mst_FeedTypes[FeedID],0)),2)`
  - `G9` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B9,reg_FeedConsumption[Date],"<="&$C9)`
  - `F10` (CostZMW): `=ROUND($E10*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D10,mst_FeedTypes[FeedID],0)),2)`
  - `G10` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B10,reg_FeedConsumption[Date],"<="&$C10)`
  - `F11` (CostZMW): `=ROUND($E11*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D11,mst_FeedTypes[FeedID],0)),2)`
  - `G11` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B11,reg_FeedConsumption[Date],"<="&$C11)`
  - `F12` (CostZMW): `=ROUND($E12*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D12,mst_FeedTypes[FeedID],0)),2)`
  - `G12` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B12,reg_FeedConsumption[Date],"<="&$C12)`
  - `F13` (CostZMW): `=ROUND($E13*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D13,mst_FeedTypes[FeedID],0)),2)`
  - `G13` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B13,reg_FeedConsumption[Date],"<="&$C13)`
  - `F14` (CostZMW): `=ROUND($E14*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D14,mst_FeedTypes[FeedID],0)),2)`
  - `G14` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B14,reg_FeedConsumption[Date],"<="&$C14)`
  - `F15` (CostZMW): `=ROUND($E15*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D15,mst_FeedTypes[FeedID],0)),2)`
  - `G15` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B15,reg_FeedConsumption[Date],"<="&$C15)`
  - `F16` (CostZMW): `=ROUND($E16*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D16,mst_FeedTypes[FeedID],0)),2)`
  - `G16` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B16,reg_FeedConsumption[Date],"<="&$C16)`
  - `F17` (CostZMW): `=ROUND($E17*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D17,mst_FeedTypes[FeedID],0)),2)`
  - `G17` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B17,reg_FeedConsumption[Date],"<="&$C17)`
  - `F18` (CostZMW): `=ROUND($E18*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D18,mst_FeedTypes[FeedID],0)),2)`
  - `G18` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B18,reg_FeedConsumption[Date],"<="&$C18)`
  - `F19` (CostZMW): `=ROUND($E19*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D19,mst_FeedTypes[FeedID],0)),2)`
  - `G19` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B19,reg_FeedConsumption[Date],"<="&$C19)`
  - `F20` (CostZMW): `=ROUND($E20*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D20,mst_FeedTypes[FeedID],0)),2)`
  - `G20` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B20,reg_FeedConsumption[Date],"<="&$C20)`
  - `F21` (CostZMW): `=ROUND($E21*INDEX(mst_FeedTypes[UnitCostPerKg_ZMW],MATCH($D21,mst_FeedTypes[FeedID],0)),2)`
  - `G21` (RunningTotalKg): `=SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$B21,reg_FeedConsumption[Date],"<="&$C21)`
- validations:
  - D2:D78: type=list f1==FeedID_List
  - B2:B78: type=list f1==FlockID_List

Sample:
  EntryID | FlockID | Date | FeedID | KgUsed | CostZMW | RunningTotalKg | EnteredBy | IsActive
  FEED-0001 | FLK-001 | 2026-05-24T00:00:00 | 1 | 600 |  |  | B. Tembo | Yes
  FEED-0002 | FLK-001 | 2026-05-28T00:00:00 | 1 | 800 |  |  | C. Banda | Yes
  FEED-0003 | FLK-001 | 2026-06-01T00:00:00 | 2 | 1000 |  |  | C. Banda | Yes
  FEED-0004 | FLK-001 | 2026-06-05T00:00:00 | 2 | 1200 |  |  | B. Tembo | Yes
  FEED-0005 | FLK-001 | 2026-06-09T00:00:00 | 2 | 1400 |  |  | C. Banda | Yes
  FEED-0006 | FLK-001 | 2026-06-13T00:00:00 | 2 | 1600 |  |  | C. Banda | Yes
  FEED-0007 | FLK-001 | 2026-06-17T00:00:00 | 3 | 1800 |  |  | B. Tembo | Yes

## reg_WeeklyWeights
- state: `visible`
- size: 17 rows x 10 cols
- table `reg_WeeklyWeights` ref `A1:J17` cols: ['EntryID', 'FlockID', 'Date', 'WeekNo', 'SampleSize', 'AvgBodyWeightG', 'AgeDays', 'ADG_g', 'EnteredBy', 'IsActive']
- unique formulas:
  - `G2` (AgeDays): `=$C2-INDEX(reg_Flocks[PlacedDate],MATCH($B2,reg_Flocks[FlockID],0))`
  - `H2` (ADG_g): `=IFERROR($F2/$G2,0)`
  - `G3` (AgeDays): `=$C3-INDEX(reg_Flocks[PlacedDate],MATCH($B3,reg_Flocks[FlockID],0))`
  - `H3` (ADG_g): `=IFERROR($F3/$G3,0)`
  - `G4` (AgeDays): `=$C4-INDEX(reg_Flocks[PlacedDate],MATCH($B4,reg_Flocks[FlockID],0))`
  - `H4` (ADG_g): `=IFERROR($F4/$G4,0)`
  - `G5` (AgeDays): `=$C5-INDEX(reg_Flocks[PlacedDate],MATCH($B5,reg_Flocks[FlockID],0))`
  - `H5` (ADG_g): `=IFERROR($F5/$G5,0)`
  - `G6` (AgeDays): `=$C6-INDEX(reg_Flocks[PlacedDate],MATCH($B6,reg_Flocks[FlockID],0))`
  - `H6` (ADG_g): `=IFERROR($F6/$G6,0)`
  - `G7` (AgeDays): `=$C7-INDEX(reg_Flocks[PlacedDate],MATCH($B7,reg_Flocks[FlockID],0))`
  - `H7` (ADG_g): `=IFERROR($F7/$G7,0)`
  - `G8` (AgeDays): `=$C8-INDEX(reg_Flocks[PlacedDate],MATCH($B8,reg_Flocks[FlockID],0))`
  - `H8` (ADG_g): `=IFERROR($F8/$G8,0)`
  - `G9` (AgeDays): `=$C9-INDEX(reg_Flocks[PlacedDate],MATCH($B9,reg_Flocks[FlockID],0))`
  - `H9` (ADG_g): `=IFERROR($F9/$G9,0)`
  - `G10` (AgeDays): `=$C10-INDEX(reg_Flocks[PlacedDate],MATCH($B10,reg_Flocks[FlockID],0))`
  - `H10` (ADG_g): `=IFERROR($F10/$G10,0)`
  - `G11` (AgeDays): `=$C11-INDEX(reg_Flocks[PlacedDate],MATCH($B11,reg_Flocks[FlockID],0))`
  - `H11` (ADG_g): `=IFERROR($F11/$G11,0)`
  - `G12` (AgeDays): `=$C12-INDEX(reg_Flocks[PlacedDate],MATCH($B12,reg_Flocks[FlockID],0))`
  - `H12` (ADG_g): `=IFERROR($F12/$G12,0)`
  - `G13` (AgeDays): `=$C13-INDEX(reg_Flocks[PlacedDate],MATCH($B13,reg_Flocks[FlockID],0))`
  - `H13` (ADG_g): `=IFERROR($F13/$G13,0)`
  - `G14` (AgeDays): `=$C14-INDEX(reg_Flocks[PlacedDate],MATCH($B14,reg_Flocks[FlockID],0))`
  - `H14` (ADG_g): `=IFERROR($F14/$G14,0)`
  - `G15` (AgeDays): `=$C15-INDEX(reg_Flocks[PlacedDate],MATCH($B15,reg_Flocks[FlockID],0))`
  - `H15` (ADG_g): `=IFERROR($F15/$G15,0)`
  - `G16` (AgeDays): `=$C16-INDEX(reg_Flocks[PlacedDate],MATCH($B16,reg_Flocks[FlockID],0))`
  - `H16` (ADG_g): `=IFERROR($F16/$G16,0)`
  - `G17` (AgeDays): `=$C17-INDEX(reg_Flocks[PlacedDate],MATCH($B17,reg_Flocks[FlockID],0))`
  - `H17` (ADG_g): `=IFERROR($F17/$G17,0)`
- validations:
  - B2:B67: type=list f1==FlockID_List

Sample:
  EntryID | FlockID | Date | WeekNo | SampleSize | AvgBodyWeightG | AgeDays | ADG_g | EnteredBy | IsActive
  WGT-0001 | FLK-001 | 2026-05-27T00:00:00 | 1 | 50 | 180 |  |  | B. Tembo | Yes
  WGT-0002 | FLK-001 | 2026-06-03T00:00:00 | 2 | 50 | 430 |  |  | C. Banda | Yes
  WGT-0003 | FLK-001 | 2026-06-10T00:00:00 | 3 | 50 | 800 |  |  | C. Banda | Yes
  WGT-0004 | FLK-001 | 2026-06-17T00:00:00 | 4 | 50 | 1300 |  |  | B. Tembo | Yes
  WGT-0005 | FLK-001 | 2026-06-24T00:00:00 | 5 | 50 | 1850 |  |  | C. Banda | Yes
  WGT-0006 | FLK-001 | 2026-07-01T00:00:00 | 6 | 50 | 2400 |  |  | C. Banda | Yes
  WGT-0007 | FLK-002 | 2026-07-02T00:00:00 | 1 | 50 | 180 |  |  | B. Tembo | Yes

## reg_Vaccination_Health
- state: `visible`
- size: 13 rows x 10 cols
- table `reg_Vaccination_Health` ref `A1:J13` cols: ['EntryID', 'FlockID', 'Date', 'ProductID', 'DosageGiven', 'Route', 'AdministeredBy', 'IsActive', 'RankInFlock', 'CompositeKey']
- unique formulas:
  - `I2` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B2,reg_Vaccination_Health[EntryID],"<="&$A2)`
  - `J2` (CompositeKey): `=$B2&"-"&$I2`
  - `I3` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B3,reg_Vaccination_Health[EntryID],"<="&$A3)`
  - `J3` (CompositeKey): `=$B3&"-"&$I3`
  - `I4` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B4,reg_Vaccination_Health[EntryID],"<="&$A4)`
  - `J4` (CompositeKey): `=$B4&"-"&$I4`
  - `I5` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B5,reg_Vaccination_Health[EntryID],"<="&$A5)`
  - `J5` (CompositeKey): `=$B5&"-"&$I5`
  - `I6` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B6,reg_Vaccination_Health[EntryID],"<="&$A6)`
  - `J6` (CompositeKey): `=$B6&"-"&$I6`
  - `I7` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B7,reg_Vaccination_Health[EntryID],"<="&$A7)`
  - `J7` (CompositeKey): `=$B7&"-"&$I7`
  - `I8` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B8,reg_Vaccination_Health[EntryID],"<="&$A8)`
  - `J8` (CompositeKey): `=$B8&"-"&$I8`
  - `I9` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B9,reg_Vaccination_Health[EntryID],"<="&$A9)`
  - `J9` (CompositeKey): `=$B9&"-"&$I9`
  - `I10` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B10,reg_Vaccination_Health[EntryID],"<="&$A10)`
  - `J10` (CompositeKey): `=$B10&"-"&$I10`
  - `I11` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B11,reg_Vaccination_Health[EntryID],"<="&$A11)`
  - `J11` (CompositeKey): `=$B11&"-"&$I11`
  - `I12` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B12,reg_Vaccination_Health[EntryID],"<="&$A12)`
  - `J12` (CompositeKey): `=$B12&"-"&$I12`
  - `I13` (RankInFlock): `=COUNTIFS(reg_Vaccination_Health[FlockID],$B13,reg_Vaccination_Health[EntryID],"<="&$A13)`
  - `J13` (CompositeKey): `=$B13&"-"&$I13`
- validations:
  - D2:D63: type=list f1==ProductID_List
  - B2:B63: type=list f1==FlockID_List
  - F2:F63: type=list f1==List_VaccinationRoute

Sample:
  EntryID | FlockID | Date | ProductID | DosageGiven | Route | AdministeredBy | IsActive | RankInFlock | CompositeKey
  HLTH-0001 | FLK-001 | 2026-05-21T00:00:00 | 1 | 1 drop/bird | Eye Drop | B. Tembo | Yes |  | 
  HLTH-0002 | FLK-001 | 2026-06-03T00:00:00 | 2 | Per label / 1000 birds | Drinking Water | B. Tembo | Yes |  | 
  HLTH-0003 | FLK-001 | 2026-05-22T00:00:00 | 4 | 1 ml/L water | Drinking Water | B. Tembo | Yes |  | 
  HLTH-0004 | FLK-002 | 2026-06-26T00:00:00 | 1 | 1 drop/bird | Eye Drop | B. Tembo | Yes |  | 
  HLTH-0005 | FLK-002 | 2026-07-09T00:00:00 | 2 | Per label / 1000 birds | Drinking Water | B. Tembo | Yes |  | 
  HLTH-0006 | FLK-002 | 2026-07-15T00:00:00 | 3 | 2 ml/L water x 5 days | Drinking Water | B. Tembo | Yes |  | 
  HLTH-0007 | FLK-002 | 2026-06-27T00:00:00 | 4 | 1 ml/L water | Drinking Water | B. Tembo | Yes |  | 

## reg_Sales_Dispatch
- state: `visible`
- size: 3 rows x 15 cols
- table `reg_Sales_Dispatch` ref `A1:O3` cols: ['EntryID', 'FlockID', 'Date', 'CustomerID', 'BirdsDispatched', 'TotalLiveWeightKg', 'PricePerKg_ZMW', 'PricePerBird_ZMW', 'TransportCost_ZMW', 'TotalValue_ZMW', 'AmountPaid_ZMW', 'OutstandingBalance_ZMW', 'InvoiceNo', 'EnteredBy', 'IsActive']
- unique formulas:
  - `J2` (TotalValue_ZMW): `=ROUND(IF($H2>0,$E2*$H2,$F2*$G2)+$I2,2)`
  - `L2` (OutstandingBalance_ZMW): `=$J2-$K2`
  - `J3` (TotalValue_ZMW): `=ROUND(IF($H3>0,$E3*$H3,$F3*$G3)+$I3,2)`
  - `L3` (OutstandingBalance_ZMW): `=$J3-$K3`
- validations:
  - D2:D53: type=list f1==CustomerID_List
  - B2:B53: type=list f1==FlockID_List

Sample:
  EntryID | FlockID | Date | CustomerID | BirdsDispatched | TotalLiveWeightKg | PricePerKg_ZMW | PricePerBird_ZMW | TransportCost_ZMW | TotalValue_ZMW | AmountPaid_ZMW | OutstandingBalance_ZMW | InvoiceNo | EnteredBy | IsActive
  SALE-0001 | FLK-001 | 2026-07-01T00:00:00 | 1 | 3000 | 6750 | 42.5 | 0 | 350 |  | 287225 |  | INV-2026-0142 | A. Mwansa | Yes
  SALE-0002 | FLK-001 | 2026-07-01T00:00:00 | 3 | 1950 | 4387.5 | 41 | 0 | 300 |  | 150000 |  | INV-2026-0143 | A. Mwansa | Yes

## reg_Expenses
- state: `visible`
- size: 16 rows x 13 cols
- table `reg_Expenses` ref `A1:M16` cols: ['EntryID', 'FlockID', 'Date', 'ExpenseCategory', 'SupplierID', 'Quantity', 'UnitCost_ZMW', 'Amount_ZMW', 'PaymentMethod', 'PaymentRef', 'ApprovedBy', 'EnteredBy', 'IsActive']
- unique formulas:
  - `H2` (Amount_ZMW): `=ROUND($F2*$G2,2)`
  - `H3` (Amount_ZMW): `=ROUND($F3*$G3,2)`
  - `H4` (Amount_ZMW): `=ROUND($F4*$G4,2)`
  - `H5` (Amount_ZMW): `=ROUND($F5*$G5,2)`
  - `H6` (Amount_ZMW): `=ROUND($F6*$G6,2)`
  - `H7` (Amount_ZMW): `=ROUND($F7*$G7,2)`
  - `H8` (Amount_ZMW): `=ROUND($F8*$G8,2)`
  - `H9` (Amount_ZMW): `=ROUND($F9*$G9,2)`
  - `H10` (Amount_ZMW): `=ROUND($F10*$G10,2)`
  - `H11` (Amount_ZMW): `=ROUND($F11*$G11,2)`
  - `H12` (Amount_ZMW): `=ROUND($F12*$G12,2)`
  - `H13` (Amount_ZMW): `=ROUND($F13*$G13,2)`
  - `H14` (Amount_ZMW): `=ROUND($F14*$G14,2)`
  - `H15` (Amount_ZMW): `=ROUND($F15*$G15,2)`
  - `H16` (Amount_ZMW): `=ROUND($F16*$G16,2)`
- validations:
  - D2:D66: type=list f1==List_ExpenseCategory
  - E2:E66: type=list f1==SupplierID_List
  - I2:I66: type=list f1==List_PaymentMethod

Sample:
  EntryID | FlockID | Date | ExpenseCategory | SupplierID | Quantity | UnitCost_ZMW | Amount_ZMW | PaymentMethod | PaymentRef | ApprovedBy | EnteredBy | IsActive
  EXP-0001 | FLK-001 | 2026-05-19T00:00:00 | Bedding/Litter | 4 | 1 | 1800 |  | Mobile Money | PMT-1001 | A. Mwansa | A. Mwansa | Yes
  EXP-0002 | FLK-001 | 2026-05-20T00:00:00 | Day-Old Chicks | 1 | 5000 | 4.5 |  | Bank Transfer | PMT-1002 | A. Mwansa | A. Mwansa | Yes
  EXP-0003 | FLK-001 | 2026-06-10T00:00:00 | Veterinary | 3 | 1 | 950 |  | Cash | PMT-1005 | B. Tembo | B. Tembo | Yes
  EXP-0004 | FLK-001 | 2026-06-28T00:00:00 | Transport |  | 1 | 1200 |  | Cash | PMT-1009 | A. Mwansa | A. Mwansa | Yes
  EXP-0005 | FLK-001 | 2026-06-30T00:00:00 | Labour |  | 1 | 2400 |  | Mobile Money | PMT-1010 | A. Mwansa | A. Mwansa | Yes
  EXP-0006 | FLK-002 | 2026-06-24T00:00:00 | Bedding/Litter | 4 | 1 | 1800 |  | Mobile Money | PMT-1011 | A. Mwansa | A. Mwansa | Yes
  EXP-0007 | FLK-002 | 2026-06-25T00:00:00 | Day-Old Chicks | 1 | 5000 | 4.6 |  | Bank Transfer | PMT-1012 | A. Mwansa | A. Mwansa | Yes

## reg_EnvironmentReadings
- state: `visible`
- size: 26 rows x 9 cols
- table `reg_EnvironmentReadings` ref `A1:I26` cols: ['EntryID', 'HouseID', 'Date', 'Time', 'TemperatureC', 'HumidityPct', 'AmmoniaPPM', 'EnteredBy', 'IsActive']
- validations:
  - B2:B76: type=list f1==HouseID_List

Sample:
  EntryID | HouseID | Date | Time | TemperatureC | HumidityPct | AmmoniaPPM | EnteredBy | IsActive
  ENV-0001 | 1 | 2026-05-20T00:00:00 | 07:00 | 32 | 62 | 8 | C. Banda | Yes
  ENV-0002 | 1 | 2026-05-25T00:00:00 | 07:00 | 31.2 | 62 | 8 | C. Banda | Yes
  ENV-0003 | 1 | 2026-05-30T00:00:00 | 07:00 | 30.5 | 62 | 8 | C. Banda | Yes
  ENV-0004 | 1 | 2026-06-04T00:00:00 | 07:00 | 29.8 | 62 | 8 | C. Banda | Yes
  ENV-0005 | 1 | 2026-06-09T00:00:00 | 07:00 | 29 | 62 | 8 | C. Banda | Yes
  ENV-0006 | 1 | 2026-06-14T00:00:00 | 07:00 | 28.2 | 62 | 8 | C. Banda | Yes
  ENV-0007 | 1 | 2026-06-19T00:00:00 | 07:00 | 27.5 | 62 | 8 | C. Banda | Yes

## reg_OtherIncome
- state: `visible`
- size: 4 rows x 8 cols
- table `reg_OtherIncome` ref `A1:H4` cols: ['EntryID', 'Date', 'Source', 'Description', 'Amount_ZMW', 'PaymentMethod', 'ReceivedBy', 'IsActive']
- validations:
  - C2:C54: type=list f1=Manure Sales,Empty Bag Sales,Equipment Rental,Other
  - F2:F54: type=list f1==List_PaymentMethod

Sample:
  EntryID | Date | Source | Description | Amount_ZMW | PaymentMethod | ReceivedBy | IsActive
  INC-0001 | 2026-07-22T00:00:00 | Manure Sales | Sold manure from House 1 | 450 | Cash | G. Tembo | Yes
  INC-0002 | 2026-08-01T00:00:00 | Empty Bag Sales | Sold used feed bags | 120 | Cash | G. Tembo | Yes
  INC-0003 | 2026-08-05T00:00:00 | Manure Sales | Sold manure from House 2 | 380 | Mobile Money | G. Tembo | Yes

## calc_KPI_Engine
- state: `visible`
- size: 31 rows x 24 cols
- table `calc_KPI_Engine` ref `A1:X31` cols: ['FlockID', 'HouseCode', 'BreedName', 'PlacedDate', 'Status', 'DaysOnFarm', 'InitialBirds', 'TotalMortality', 'CurrentBirds', 'LivabilityPct', 'TotalFeedKg', 'TotalFeedCost_ZMW', 'LatestWeightDate', 'LatestAvgWeightG', 'FCR', 'ADG_g', 'TotalExpenses_ZMW', 'MedicineCost_ZMW', 'TotalSalesValue_ZMW', 'BirdsSold', 'CostPerBird_ZMW', 'CostPerKg_ZMW', 'EstimatedProfit_ZMW', 'BreakEvenPricePerBird_ZMW']
- unique formulas:
  - `A2` (FlockID): `=IFERROR(INDEX(reg_Flocks[FlockID],ROW()-1),"")`
  - `B2` (HouseCode): `=IF($A2="","",IFERROR(INDEX(mst_Houses[HouseCode],MATCH(INDEX(reg_Flocks[HouseID],MATCH($A2,reg_Flocks[FlockID],0)),mst_Houses[HouseID],0)),""))`
  - `C2` (BreedName): `=IF($A2="","",IFERROR(INDEX(mst_Breeds[BreedName],MATCH(INDEX(reg_Flocks[BreedID],MATCH($A2,reg_Flocks[FlockID],0)),mst_Breeds[BreedID],0)),""))`
  - `D2` (PlacedDate): `=IF($A2="","",INDEX(reg_Flocks[PlacedDate],MATCH($A2,reg_Flocks[FlockID],0)))`
  - `E2` (Status): `=IF($A2="","",INDEX(reg_Flocks[Status],MATCH($A2,reg_Flocks[FlockID],0)))`
  - `F2` (DaysOnFarm): `=IF($A2="","",TODAY()-$D2)`
  - `G2` (InitialBirds): `=IF($A2="","",INDEX(reg_Flocks[InitialBirdCount],MATCH($A2,reg_Flocks[FlockID],0)))`
  - `H2` (TotalMortality): `=IF($A2="","",SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$A2))`
  - `I2` (CurrentBirds): `=IF($A2="","",$G2-$H2)`
  - `J2` (LivabilityPct): `=IF($A2="","",IFERROR($I2/$G2,0))`
  - `K2` (TotalFeedKg): `=IF($A2="","",SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$A2))`
  - `L2` (TotalFeedCost_ZMW): `=IF($A2="","",SUMIFS(reg_FeedConsumption[CostZMW],reg_FeedConsumption[FlockID],$A2))`
  - `M2` (LatestWeightDate): `=IF($A2="","",IFERROR(_xlfn.MAXIFS(reg_WeeklyWeights[Date],reg_WeeklyWeights[FlockID],$A2),""))`
  - `N2` (LatestAvgWeightG): `=IF($A2="","",IFERROR(SUMIFS(reg_WeeklyWeights[AvgBodyWeightG],reg_WeeklyWeights[FlockID],$A2,reg_WeeklyWeights[Date],$M2),0))`
  - `O2` (FCR): `=IF($A2="","",IFERROR($K2/($I2*$N2/1000),0))`
  - `P2` (ADG_g): `=IF($A2="","",IFERROR($N2/$F2,0))`
  - `Q2` (TotalExpenses_ZMW): `=IF($A2="","",SUMIFS(reg_Expenses[Amount_ZMW],reg_Expenses[FlockID],$A2))`
  - `R2` (MedicineCost_ZMW): `=IF($A2="","",SUMIFS(reg_MedicineStock[TotalCost_ZMW],reg_MedicineStock[FlockID],$A2))`
  - `S2` (TotalSalesValue_ZMW): `=IF($A2="","",SUMIFS(reg_Sales_Dispatch[TotalValue_ZMW],reg_Sales_Dispatch[FlockID],$A2))`
  - `T2` (BirdsSold): `=IF($A2="","",SUMIFS(reg_Sales_Dispatch[BirdsDispatched],reg_Sales_Dispatch[FlockID],$A2))`
  - `U2` (CostPerBird_ZMW): `=IF($A2="","",IFERROR(($Q2+$L2+$R2)/$G2,0))`
  - `V2` (CostPerKg_ZMW): `=IF($A2="","",IFERROR(($Q2+$L2+$R2)/($I2*$N2/1000),0))`
  - `W2` (EstimatedProfit_ZMW): `=IF($A2="","",$S2-$Q2-$L2-$R2)`
  - `X2` (BreakEvenPricePerBird_ZMW): `=IF($A2="","",IFERROR(($Q2+$L2+$R2)/IF($T2>0,$T2,$G2),0))`
  - `B3` (HouseCode): `=IF($A3="","",IFERROR(INDEX(mst_Houses[HouseCode],MATCH(INDEX(reg_Flocks[HouseID],MATCH($A3,reg_Flocks[FlockID],0)),mst_Houses[HouseID],0)),""))`
  - `C3` (BreedName): `=IF($A3="","",IFERROR(INDEX(mst_Breeds[BreedName],MATCH(INDEX(reg_Flocks[BreedID],MATCH($A3,reg_Flocks[FlockID],0)),mst_Breeds[BreedID],0)),""))`
  - `D3` (PlacedDate): `=IF($A3="","",INDEX(reg_Flocks[PlacedDate],MATCH($A3,reg_Flocks[FlockID],0)))`
  - `E3` (Status): `=IF($A3="","",INDEX(reg_Flocks[Status],MATCH($A3,reg_Flocks[FlockID],0)))`
  - `F3` (DaysOnFarm): `=IF($A3="","",TODAY()-$D3)`
  - `G3` (InitialBirds): `=IF($A3="","",INDEX(reg_Flocks[InitialBirdCount],MATCH($A3,reg_Flocks[FlockID],0)))`
  - `H3` (TotalMortality): `=IF($A3="","",SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$A3))`
  - `I3` (CurrentBirds): `=IF($A3="","",$G3-$H3)`
  - `J3` (LivabilityPct): `=IF($A3="","",IFERROR($I3/$G3,0))`
  - `K3` (TotalFeedKg): `=IF($A3="","",SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FlockID],$A3))`
  - `L3` (TotalFeedCost_ZMW): `=IF($A3="","",SUMIFS(reg_FeedConsumption[CostZMW],reg_FeedConsumption[FlockID],$A3))`
  - `M3` (LatestWeightDate): `=IF($A3="","",IFERROR(_xlfn.MAXIFS(reg_WeeklyWeights[Date],reg_WeeklyWeights[FlockID],$A3),""))`
  - `N3` (LatestAvgWeightG): `=IF($A3="","",IFERROR(SUMIFS(reg_WeeklyWeights[AvgBodyWeightG],reg_WeeklyWeights[FlockID],$A3,reg_WeeklyWeights[Date],$M3),0))`
  - `O3` (FCR): `=IF($A3="","",IFERROR($K3/($I3*$N3/1000),0))`
  - `P3` (ADG_g): `=IF($A3="","",IFERROR($N3/$F3,0))`
  - `Q3` (TotalExpenses_ZMW): `=IF($A3="","",SUMIFS(reg_Expenses[Amount_ZMW],reg_Expenses[FlockID],$A3))`

Sample:
  FlockID | HouseCode | BreedName | PlacedDate | Status | DaysOnFarm | InitialBirds | TotalMortality | CurrentBirds | LivabilityPct | TotalFeedKg | TotalFeedCost_ZMW | LatestWeightDate | LatestAvgWeightG | FCR | ADG_g | TotalExpenses_ZMW | MedicineCost_ZMW

## Log_Audit
- state: `veryHidden`
- size: 2 rows x 9 cols
- table `Log_Audit` ref `A1:I2` cols: ['LogID', 'TableName', 'Action', 'RecordID', 'FieldChanged', 'OldValue', 'NewValue', 'UserName', 'Timestamp']

Sample:
  LogID | TableName | Action | RecordID | FieldChanged | OldValue | NewValue | UserName | Timestamp

## rpt_FlockPerformance
- state: `visible`
- size: 30 rows x 6 cols
- unique formulas:
  - `A4` (FarmNow Limited): `="Generated: "&TEXT(TODAY(),"dd mmm yyyy")&"   |   Prepared by: Farmnow Broiler Management System"`
  - `B9` (None): `=INDEX(calc_KPI_Engine[HouseCode],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B10` (None): `=INDEX(calc_KPI_Engine[BreedName],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B11` (None): `=INDEX(calc_KPI_Engine[PlacedDate],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B12` (None): `=INDEX(calc_KPI_Engine[Status],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B13` (None): `=INDEX(calc_KPI_Engine[DaysOnFarm],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B14` (None): `=INDEX(calc_KPI_Engine[InitialBirds],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B15` (None): `=INDEX(calc_KPI_Engine[TotalMortality],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B16` (None): `=INDEX(calc_KPI_Engine[CurrentBirds],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B17` (None): `=INDEX(calc_KPI_Engine[LivabilityPct],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B18` (None): `=INDEX(calc_KPI_Engine[TotalFeedKg],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B19` (None): `=INDEX(calc_KPI_Engine[LatestAvgWeightG],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B20` (None): `=INDEX(calc_KPI_Engine[FCR],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B21` (None): `=INDEX(calc_KPI_Engine[ADG_g],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B22` (None): `=INDEX(calc_KPI_Engine[TotalFeedCost_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B23` (None): `=INDEX(calc_KPI_Engine[MedicineCost_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B24` (None): `=INDEX(calc_KPI_Engine[TotalExpenses_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B25` (None): `=INDEX(calc_KPI_Engine[CostPerBird_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B26` (None): `=INDEX(calc_KPI_Engine[CostPerKg_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B27` (None): `=INDEX(calc_KPI_Engine[BreakEvenPricePerBird_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B28` (None): `=INDEX(calc_KPI_Engine[TotalSalesValue_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B29` (None): `=INDEX(calc_KPI_Engine[EstimatedProfit_ZMW],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B30` (None): `=INDEX(mst_Breeds[StandardFCR],MATCH(INDEX(reg_Flocks[BreedID],MATCH($B$6,reg_Flocks[FlockID],0)),mst_Breeds[BreedID],0))`
- validations:
  - B6: type=list f1==FlockID_List

Sample:
  FarmNow Limited |  |  |  |  | 
  Flock Performance Report |  |  |  |  | 
  Select Flock: | FLK-001 |  |  |  | 
  Metric | Value |  |  |  | 
  House |  |  |  |  | 
  Breed |  |  |  |  | 
  Placed Date |  |  |  |  | 
  Status |  |  |  |  | 

## rpt_FinancialSummary
- state: `visible`
- size: 11 rows x 10 cols
- unique formulas:
  - `A4` (FarmNow Limited): `="Generated: "&TEXT(TODAY(),"dd mmm yyyy")&"   |   Prepared by: Farmnow Broiler Management System"`
  - `A7` (FarmNow Limited): `=calc_KPI_Engine!A2`
  - `B7` (None): `=calc_KPI_Engine!E2`
  - `C7` (None): `=calc_KPI_Engine!L2`
  - `D7` (None): `=calc_KPI_Engine!R2`
  - `E7` (None): `=calc_KPI_Engine!Q2`
  - `F7` (None): `=calc_KPI_Engine!L2+calc_KPI_Engine!Q2+calc_KPI_Engine!R2`
  - `G7` (None): `=calc_KPI_Engine!S2`
  - `H7` (None): `=calc_KPI_Engine!W2`
  - `I7` (None): `=calc_KPI_Engine!U2`
  - `J7` (None): `=calc_KPI_Engine!X2`
  - `A8` (FarmNow Limited): `=calc_KPI_Engine!A3`
  - `B8` (None): `=calc_KPI_Engine!E3`
  - `C8` (None): `=calc_KPI_Engine!L3`
  - `D8` (None): `=calc_KPI_Engine!R3`
  - `E8` (None): `=calc_KPI_Engine!Q3`
  - `F8` (None): `=calc_KPI_Engine!L3+calc_KPI_Engine!Q3+calc_KPI_Engine!R3`
  - `G8` (None): `=calc_KPI_Engine!S3`
  - `H8` (None): `=calc_KPI_Engine!W3`
  - `I8` (None): `=calc_KPI_Engine!U3`
  - `J8` (None): `=calc_KPI_Engine!X3`
  - `A9` (FarmNow Limited): `=calc_KPI_Engine!A4`
  - `B9` (None): `=calc_KPI_Engine!E4`
  - `C9` (None): `=calc_KPI_Engine!L4`
  - `D9` (None): `=calc_KPI_Engine!R4`
  - `E9` (None): `=calc_KPI_Engine!Q4`
  - `F9` (None): `=calc_KPI_Engine!L4+calc_KPI_Engine!Q4+calc_KPI_Engine!R4`
  - `G9` (None): `=calc_KPI_Engine!S4`
  - `H9` (None): `=calc_KPI_Engine!W4`
  - `I9` (None): `=calc_KPI_Engine!U4`
  - `J9` (None): `=calc_KPI_Engine!X4`
  - `A10` (FarmNow Limited): `=calc_KPI_Engine!A5`
  - `B10` (None): `=calc_KPI_Engine!E5`
  - `C10` (None): `=calc_KPI_Engine!L5`
  - `D10` (None): `=calc_KPI_Engine!R5`
  - `E10` (None): `=calc_KPI_Engine!Q5`
  - `F10` (None): `=calc_KPI_Engine!L5+calc_KPI_Engine!Q5+calc_KPI_Engine!R5`
  - `G10` (None): `=calc_KPI_Engine!S5`
  - `H10` (None): `=calc_KPI_Engine!W5`
  - `I10` (None): `=calc_KPI_Engine!U5`

Sample:
  FarmNow Limited |  |  |  |  |  |  |  |  | 
  Financial Summary Report - All Flocks |  |  |  |  |  |  |  |  | 
  Flock | Status | Feed Cost (ZMW) | Medicine Cost (ZMW) | Other Expenses (ZMW) | Total Cost (ZMW) | Sales Value (ZMW) | Estimated Profit (ZMW) | Cost / Bird (ZMW) | Break-even Price/Bird (ZMW)
  TOTAL / AVERAGE |  |  |  |  |  |  |  |  | 

## rpt_MortalityTrend
- state: `visible`
- size: 30 rows x 6 cols
- unique formulas:
  - `A4` (FarmNow Limited): `="Generated: "&TEXT(TODAY(),"dd mmm yyyy")&"   |   Prepared by: Farmnow Broiler Management System"`
  - `B8` (None): `=INDEX(reg_Flocks[PlacedDate],MATCH($B$6,reg_Flocks[FlockID],0))`
  - `B9` (None): `=INDEX(calc_KPI_Engine[TotalMortality],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B10` (None): `=INDEX(calc_KPI_Engine[LivabilityPct],MATCH($B$6,calc_KPI_Engine[FlockID],0))`
  - `B13` (None): `=TEXT(($B$8+0),"dd mmm")&" - "&TEXT(($B$8+6),"dd mmm")`
  - `C13` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+0),reg_DailyMortality[Date],"<="&($B$8+6))`
  - `D13` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+6))`
  - `B14` (None): `=TEXT(($B$8+7),"dd mmm")&" - "&TEXT(($B$8+13),"dd mmm")`
  - `C14` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+7),reg_DailyMortality[Date],"<="&($B$8+13))`
  - `D14` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+13))`
  - `B15` (None): `=TEXT(($B$8+14),"dd mmm")&" - "&TEXT(($B$8+20),"dd mmm")`
  - `C15` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+14),reg_DailyMortality[Date],"<="&($B$8+20))`
  - `D15` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+20))`
  - `B16` (None): `=TEXT(($B$8+21),"dd mmm")&" - "&TEXT(($B$8+27),"dd mmm")`
  - `C16` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+21),reg_DailyMortality[Date],"<="&($B$8+27))`
  - `D16` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+27))`
  - `B17` (None): `=TEXT(($B$8+28),"dd mmm")&" - "&TEXT(($B$8+34),"dd mmm")`
  - `C17` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+28),reg_DailyMortality[Date],"<="&($B$8+34))`
  - `D17` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+34))`
  - `B18` (None): `=TEXT(($B$8+35),"dd mmm")&" - "&TEXT(($B$8+41),"dd mmm")`
  - `C18` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+35),reg_DailyMortality[Date],"<="&($B$8+41))`
  - `D18` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+41))`
  - `B19` (None): `=TEXT(($B$8+42),"dd mmm")&" - "&TEXT(($B$8+48),"dd mmm")`
  - `C19` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+42),reg_DailyMortality[Date],"<="&($B$8+48))`
  - `D19` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+48))`
  - `B20` (None): `=TEXT(($B$8+49),"dd mmm")&" - "&TEXT(($B$8+55),"dd mmm")`
  - `C20` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],">="&($B$8+49),reg_DailyMortality[Date],"<="&($B$8+55))`
  - `D20` (None): `=SUMIFS(reg_DailyMortality[MortalityCount],reg_DailyMortality[FlockID],$B$6,reg_DailyMortality[Date],"<="&($B$8+55))`
  - `A25` (FarmNow Limited): `=IFERROR(INDEX(reg_Vaccination_Health[Date],MATCH($B$6&"-"&1,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `B25` (None): `=IFERROR(INDEX(mst_Vaccines_Meds[ProductName],MATCH(INDEX(reg_Vaccination_Health[ProductID],MATCH($B$6&"-"&1,reg_Vaccination_Health[CompositeKey],0)),mst_Vaccines_Meds[ProductID],0)),"")`
  - `C25` (None): `=IFERROR(INDEX(reg_Vaccination_Health[DosageGiven],MATCH($B$6&"-"&1,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `D25` (None): `=IFERROR(INDEX(reg_Vaccination_Health[Route],MATCH($B$6&"-"&1,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `A26` (FarmNow Limited): `=IFERROR(INDEX(reg_Vaccination_Health[Date],MATCH($B$6&"-"&2,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `B26` (None): `=IFERROR(INDEX(mst_Vaccines_Meds[ProductName],MATCH(INDEX(reg_Vaccination_Health[ProductID],MATCH($B$6&"-"&2,reg_Vaccination_Health[CompositeKey],0)),mst_Vaccines_Meds[ProductID],0)),"")`
  - `C26` (None): `=IFERROR(INDEX(reg_Vaccination_Health[DosageGiven],MATCH($B$6&"-"&2,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `D26` (None): `=IFERROR(INDEX(reg_Vaccination_Health[Route],MATCH($B$6&"-"&2,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `A27` (FarmNow Limited): `=IFERROR(INDEX(reg_Vaccination_Health[Date],MATCH($B$6&"-"&3,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `B27` (None): `=IFERROR(INDEX(mst_Vaccines_Meds[ProductName],MATCH(INDEX(reg_Vaccination_Health[ProductID],MATCH($B$6&"-"&3,reg_Vaccination_Health[CompositeKey],0)),mst_Vaccines_Meds[ProductID],0)),"")`
  - `C27` (None): `=IFERROR(INDEX(reg_Vaccination_Health[DosageGiven],MATCH($B$6&"-"&3,reg_Vaccination_Health[CompositeKey],0)),"")`
  - `D27` (None): `=IFERROR(INDEX(reg_Vaccination_Health[Route],MATCH($B$6&"-"&3,reg_Vaccination_Health[CompositeKey],0)),"")`
- validations:
  - B6: type=list f1==FlockID_List

Sample:
  FarmNow Limited |  |  |  |  | 
  Mortality & Health Report |  |  |  |  | 
  Select Flock: | FLK-001 |  |  |  | 
  Placed Date: |  |  |  |  | 
  Total Mortality To Date: |  |  |  |  | 
  Livability %: |  |  |  |  | 
  Week | Date Range | Mortality This Week | Cumulative Mortality |  | 
  1 |  |  |  |  | 

## mst_Employees
- state: `visible`
- size: 6 rows x 8 cols
- table `mst_Employees` ref `A1:H6` cols: ['EmployeeID', 'EmployeeName', 'Position', 'ContactNumber', 'NRC', 'DateHired', 'SalaryZMW', 'Status']

Sample:
  EmployeeID | EmployeeName | Position | ContactNumber | NRC | DateHired | SalaryZMW | Status
  1 | D. Chanda | Farm Manager | +260-97-444-5555 | 111111/10/1 | 2024-03-01T00:00:00 | 6500 | Active
  2 | C. Banda | Entry Clerk | +260-96-222-1111 | 222222/10/1 | 2025-02-10T00:00:00 | 2800 | Active
  3 | B. Tembo | Supervisor | +260-95-333-2222 | 333333/10/1 | 2024-08-15T00:00:00 | 4200 | Active
  4 | E. Zulu | General Worker | +260-97-666-7777 | 444444/10/1 | 2025-05-01T00:00:00 | 2200 | Active
  5 | G. Tembo | General Worker | +260-96-777-8888 | 555555/10/1 | 2025-06-20T00:00:00 | 2200 | Active

## reg_DailyRoutine
- state: `visible`
- size: 43 rows x 14 cols
- table `reg_DailyRoutine` ref `A1:N43` cols: ['EntryID', 'FlockID', 'Date', 'TemperatureC', 'HumidityPct', 'WaterAvailable', 'FeedAvailable', 'DrinkersCleaned', 'LitterCondition', 'Ventilation', 'SickBirdsObserved', 'EmployeeID', 'Notes', 'IsActive']
- validations:
  - B2:B93: type=list f1==FlockID_List
  - F2:F93: type=list f1==List_YesNo
  - G2:G93: type=list f1==List_YesNo
  - H2:H93: type=list f1==List_YesNo
  - I2:I93: type=list f1==List_LitterCondition
  - J2:J93: type=list f1==List_Ventilation
  - L2:L93: type=list f1==EmployeeID_List

Sample:
  EntryID | FlockID | Date | TemperatureC | HumidityPct | WaterAvailable | FeedAvailable | DrinkersCleaned | LitterCondition | Ventilation | SickBirdsObserved | EmployeeID | Notes | IsActive
  RTN-0001 | FLK-001 | 2026-05-20T00:00:00 | 32 | 62 | Yes | Yes | No | Damp | Fair | 1 | 2 | Minor issue noted, resolved same day | Yes
  RTN-0002 | FLK-001 | 2026-05-23T00:00:00 | 31.6 | 60 | Yes | Yes | Yes | Dry | Good | 0 | 4 | All normal | Yes
  RTN-0003 | FLK-001 | 2026-05-26T00:00:00 | 31.1 | 62 | Yes | Yes | Yes | Dry | Good | 0 | 4 | All normal | Yes
  RTN-0004 | FLK-001 | 2026-05-29T00:00:00 | 30.6 | 60 | Yes | Yes | Yes | Dry | Good | 0 | 2 | All normal | Yes
  RTN-0005 | FLK-001 | 2026-06-01T00:00:00 | 30.2 | 62 | Yes | Yes | No | Dry | Good | 1 | 4 | Minor issue noted, resolved same day | Yes
  RTN-0006 | FLK-001 | 2026-06-04T00:00:00 | 29.8 | 60 | Yes | Yes | Yes | Damp | Good | 0 | 4 | All normal | Yes
  RTN-0007 | FLK-001 | 2026-06-07T00:00:00 | 29.3 | 62 | Yes | Yes | Yes | Dry | Fair | 0 | 2 | All normal | Yes

## reg_FeedPurchases
- state: `visible`
- size: 7 rows x 13 cols
- table `reg_FeedPurchases` ref `A1:M7` cols: ['EntryID', 'Date', 'SupplierID', 'FeedID', 'NumberOfBags', 'BagWeightKg', 'UnitCostPerBag_ZMW', 'TotalWeightKg', 'TotalCost_ZMW', 'InvoiceNo', 'PaymentMethod', 'EnteredBy', 'IsActive']
- unique formulas:
  - `H2` (TotalWeightKg): `=$E2*$F2`
  - `I2` (TotalCost_ZMW): `=ROUND($E2*$G2,2)`
  - `H3` (TotalWeightKg): `=$E3*$F3`
  - `I3` (TotalCost_ZMW): `=ROUND($E3*$G3,2)`
  - `H4` (TotalWeightKg): `=$E4*$F4`
  - `I4` (TotalCost_ZMW): `=ROUND($E4*$G4,2)`
  - `H5` (TotalWeightKg): `=$E5*$F5`
  - `I5` (TotalCost_ZMW): `=ROUND($E5*$G5,2)`
  - `H6` (TotalWeightKg): `=$E6*$F6`
  - `I6` (TotalCost_ZMW): `=ROUND($E6*$G6,2)`
  - `H7` (TotalWeightKg): `=$E7*$F7`
  - `I7` (TotalCost_ZMW): `=ROUND($E7*$G7,2)`
- validations:
  - C2:C57: type=list f1==SupplierID_List
  - D2:D57: type=list f1==FeedID_List
  - K2:K57: type=list f1==List_PaymentMethod

Sample:
  EntryID | Date | SupplierID | FeedID | NumberOfBags | BagWeightKg | UnitCostPerBag_ZMW | TotalWeightKg | TotalCost_ZMW | InvoiceNo | PaymentMethod | EnteredBy | IsActive
  FPO-0001 | 2026-05-21T00:00:00 | 2 | 1 | 64 | 50 | 625 |  |  | 2300801 | Bank Transfer | A. Mwansa | Yes
  FPO-0002 | 2026-05-29T00:00:00 | 2 | 2 | 207 | 50 | 590 |  |  | 2300803 | Bank Transfer | A. Mwansa | Yes
  FPO-0003 | 2026-06-02T00:00:00 | 2 | 1 | 43 | 50 | 625 |  |  | 2300802 | Bank Transfer | A. Mwansa | Yes
  FPO-0004 | 2026-06-10T00:00:00 | 2 | 2 | 138 | 50 | 590 |  |  | 2300804 | Bank Transfer | A. Mwansa | Yes
  FPO-0005 | 2026-06-14T00:00:00 | 2 | 3 | 255 | 50 | 560 |  |  | 2300805 | Bank Transfer | A. Mwansa | Yes
  FPO-0006 | 2026-06-26T00:00:00 | 2 | 3 | 170 | 50 | 560 |  |  | 2300806 | Bank Transfer | A. Mwansa | Yes

## calc_FeedStockSummary
- state: `visible`
- size: 4 rows x 8 cols
- table `calc_FeedStockSummary` ref `A1:H4` cols: ['FeedID', 'FeedType', 'OpeningStockKg', 'PurchasedKg', 'UsedKg', 'BalanceKg', 'MinStockKg', 'Alert']
- unique formulas:
  - `A2` (FeedID): `=IFERROR(INDEX(mst_FeedTypes[FeedID],ROW()-1),"")`
  - `B2` (FeedType): `=IF($A2="","",INDEX(mst_FeedTypes[FeedName],MATCH($A2,mst_FeedTypes[FeedID],0)))`
  - `C2` (OpeningStockKg): `=IF($A2="","",0)`
  - `D2` (PurchasedKg): `=IF($A2="","",SUMIFS(reg_FeedPurchases[TotalWeightKg],reg_FeedPurchases[FeedID],$A2))`
  - `E2` (UsedKg): `=IF($A2="","",SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FeedID],$A2))`
  - `F2` (BalanceKg): `=IF($A2="","",$C2+$D2-$E2)`
  - `G2` (MinStockKg): `=IF($A2="","",INDEX(mst_FeedTypes[MinStockKg],MATCH($A2,mst_FeedTypes[FeedID],0)))`
  - `H2` (Alert): `=IF($A2="","",IF($F2<$G2,"LOW STOCK","OK"))`
  - `B3` (FeedType): `=IF($A3="","",INDEX(mst_FeedTypes[FeedName],MATCH($A3,mst_FeedTypes[FeedID],0)))`
  - `C3` (OpeningStockKg): `=IF($A3="","",0)`
  - `D3` (PurchasedKg): `=IF($A3="","",SUMIFS(reg_FeedPurchases[TotalWeightKg],reg_FeedPurchases[FeedID],$A3))`
  - `E3` (UsedKg): `=IF($A3="","",SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FeedID],$A3))`
  - `F3` (BalanceKg): `=IF($A3="","",$C3+$D3-$E3)`
  - `G3` (MinStockKg): `=IF($A3="","",INDEX(mst_FeedTypes[MinStockKg],MATCH($A3,mst_FeedTypes[FeedID],0)))`
  - `H3` (Alert): `=IF($A3="","",IF($F3<$G3,"LOW STOCK","OK"))`
  - `B4` (FeedType): `=IF($A4="","",INDEX(mst_FeedTypes[FeedName],MATCH($A4,mst_FeedTypes[FeedID],0)))`
  - `C4` (OpeningStockKg): `=IF($A4="","",0)`
  - `D4` (PurchasedKg): `=IF($A4="","",SUMIFS(reg_FeedPurchases[TotalWeightKg],reg_FeedPurchases[FeedID],$A4))`
  - `E4` (UsedKg): `=IF($A4="","",SUMIFS(reg_FeedConsumption[KgUsed],reg_FeedConsumption[FeedID],$A4))`
  - `F4` (BalanceKg): `=IF($A4="","",$C4+$D4-$E4)`
  - `G4` (MinStockKg): `=IF($A4="","",INDEX(mst_FeedTypes[MinStockKg],MATCH($A4,mst_FeedTypes[FeedID],0)))`
  - `H4` (Alert): `=IF($A4="","",IF($F4<$G4,"LOW STOCK","OK"))`

Sample:
  FeedID | FeedType | OpeningStockKg | PurchasedKg | UsedKg | BalanceKg | MinStockKg | Alert

## reg_MedicineStock
- state: `visible`
- size: 7 rows x 14 cols
- table `reg_MedicineStock` ref `A1:N7` cols: ['EntryID', 'FlockID', 'ProductID', 'SupplierID', 'LotNumber', 'ExpiryDate', 'QuantityReceived', 'QuantityUsed', 'Balance', 'UnitCost_ZMW', 'TotalCost_ZMW', 'Status', 'EnteredBy', 'IsActive']
- unique formulas:
  - `I2` (Balance): `=$G2-$H2`
  - `K2` (TotalCost_ZMW): `=ROUND($G2*$J2,2)`
  - `L2` (Status): `=IF(TODAY()>$F2,"EXPIRED",IF($F2-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
  - `I3` (Balance): `=$G3-$H3`
  - `K3` (TotalCost_ZMW): `=ROUND($G3*$J3,2)`
  - `L3` (Status): `=IF(TODAY()>$F3,"EXPIRED",IF($F3-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
  - `I4` (Balance): `=$G4-$H4`
  - `K4` (TotalCost_ZMW): `=ROUND($G4*$J4,2)`
  - `L4` (Status): `=IF(TODAY()>$F4,"EXPIRED",IF($F4-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
  - `I5` (Balance): `=$G5-$H5`
  - `K5` (TotalCost_ZMW): `=ROUND($G5*$J5,2)`
  - `L5` (Status): `=IF(TODAY()>$F5,"EXPIRED",IF($F5-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
  - `I6` (Balance): `=$G6-$H6`
  - `K6` (TotalCost_ZMW): `=ROUND($G6*$J6,2)`
  - `L6` (Status): `=IF(TODAY()>$F6,"EXPIRED",IF($F6-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
  - `I7` (Balance): `=$G7-$H7`
  - `K7` (TotalCost_ZMW): `=ROUND($G7*$J7,2)`
  - `L7` (Status): `=IF(TODAY()>$F7,"EXPIRED",IF($F7-TODAY()<=INDEX(mst_Settings[Value],MATCH("MedicineExpiryWarningDays",mst_Settings[Parameter],0)),"EXPIRING SOON","OK"))`
- validations:
  - B2:B57: type=list f1==FlockID_List
  - C2:C57: type=list f1==ProductID_List
  - D2:D57: type=list f1==SupplierID_List

Sample:
  EntryID | FlockID | ProductID | SupplierID | LotNumber | ExpiryDate | QuantityReceived | QuantityUsed | Balance | UnitCost_ZMW | TotalCost_ZMW | Status | EnteredBy | IsActive
  MED-0001 | FLK-001 | 1 | 3 | MRK-2612 | 2027-03-01T00:00:00 | 600 | 600 |  | 0 |  |  | A. Mwansa | Yes
  MED-0002 | FLK-001 | 2 | 3 | NCD-2614 | 2027-01-20T00:00:00 | 500 | 500 |  | 1.2 |  |  | A. Mwansa | Yes
  MED-0003 | FLK-002 | 3 | 3 | AMX-0091 | 2026-12-15T00:00:00 | 1000 | 350 |  | 0.85 |  |  | B. Tembo | Yes
  MED-0004 | FLK-002 | 1 | 3 | MRK-2701 | 2027-06-10T00:00:00 | 600 | 0 |  | 0 |  |  | A. Mwansa | Yes
  MED-0005 | FLK-003 | 1 | 3 | MRK-2733 | 2027-07-20T00:00:00 | 500 | 500 |  | 0 |  |  | A. Mwansa | Yes
  MED-0006 | FLK-004 | 1 | 3 | MRK-2801 | 2027-08-15T00:00:00 | 600 | 600 |  | 0 |  |  | A. Mwansa | Yes
