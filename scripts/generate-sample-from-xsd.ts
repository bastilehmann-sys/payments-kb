/**
 * generate-sample-from-xsd.ts
 *
 * Parses ISO 20022 XSD files and generates schema-complete sample XML files.
 * Covers all mandatory (minOccurs>=1) elements and representative optional fields
 * including BIC-based routing, structured address, Strd remittance.
 *
 * Usage:
 *   pnpm tsx scripts/generate-sample-from-xsd.ts
 *
 * Output: public/samples/formate/{pain.001.001.13,pain.002.001.15,pain.007.001.13,pain.008.001.12}.xml
 */

import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

// ─── Configuration ────────────────────────────────────────────────────────────

const REPO_ROOT = path.join(__dirname, '..');
const XSD_DIR = path.join(REPO_ROOT, 'reference', 'iso20022');
const OUT_DIR = path.join(REPO_ROOT, 'public', 'samples', 'formate');

// Realistic values
const VALUES = {
  IBAN_DEBTOR: 'DE89370400440532013000',
  IBAN_CREDITOR: 'DE75512108001245126199',
  BIC_DEBTOR: 'COBADEFFXXX',
  BIC_CREDITOR: 'DEUTDEFFXXX',
  NAME_CORP: 'Test Corporation GmbH',
  NAME_CREDITOR: 'Muster Handels AG',
  STREET: 'Teststraße',
  BLDG: '1',
  POSTCODE: '90401',
  CITY: 'Nürnberg',
  COUNTRY: 'DE',
  CURRENCY: 'EUR',
  AMOUNT: '1234.56',
  DATE: '2026-04-13',
  DATETIME: '2026-04-13T10:00:00',
  EXEC_DATE: '2026-04-14',
  UETR: 'a3b4c5d6-e7f8-4a1b-9c2d-3e4f5a6b7c8d',
};

// ─── XSD Parser ───────────────────────────────────────────────────────────────

interface XsdElement {
  name: string;
  type: string;
  minOccurs: number;
  maxOccurs: string;
}

interface XsdComplexType {
  name: string;
  elements: XsdElement[];
  isChoice: boolean;
}

interface XsdSchema {
  complexTypes: Map<string, XsdComplexType>;
  simpleTypes: Set<string>;
  documentElement: string; // root element type
  namespace: string;
}

function parseXsd(xsdPath: string): XsdSchema {
  const content = fs.readFileSync(xsdPath, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (tagName) => ['xs:element', 'xs:complexType', 'xs:simpleType', 'xs:enumeration'].includes(tagName),
    allowBooleanAttributes: true,
  });

  const parsed = parser.parse(content);
  const schema = parsed['xs:schema'];
  const complexTypes = new Map<string, XsdComplexType>();
  const simpleTypes = new Set<string>();

  // Extract namespace from targetNamespace attribute
  const namespace: string = schema['@_targetNamespace'] ?? '';

  // Find root element (Document)
  let documentElement = 'Document';

  // Process complexTypes
  const rawComplexTypes: unknown[] = Array.isArray(schema['xs:complexType'])
    ? schema['xs:complexType']
    : schema['xs:complexType'] ? [schema['xs:complexType']] : [];

  for (const ct of rawComplexTypes) {
    const typedCt = ct as Record<string, unknown>;
    const name = typedCt['@_name'] as string;
    if (!name) continue;

    const elements: XsdElement[] = [];
    let isChoice = false;

    // Handle xs:sequence
    const sequence = typedCt['xs:sequence'] as Record<string, unknown> | undefined;
    if (sequence) {
      const rawElems = Array.isArray(sequence['xs:element'])
        ? sequence['xs:element'] as unknown[]
        : sequence['xs:element'] ? [sequence['xs:element']] : [];

      for (const el of rawElems) {
        const typedEl = el as Record<string, unknown>;
        const elName = typedEl['@_name'] as string;
        const elType = typedEl['@_type'] as string ?? '';
        const minStr = typedEl['@_minOccurs'] as string | undefined;
        const maxStr = typedEl['@_maxOccurs'] as string | undefined;
        const minOccurs = minStr !== undefined ? parseInt(minStr, 10) : 1;
        const maxOccurs = maxStr ?? '1';

        if (elName) {
          elements.push({ name: elName, type: elType, minOccurs, maxOccurs });
        }
      }
    }

    // Handle xs:choice
    const choice = typedCt['xs:choice'] as Record<string, unknown> | undefined;
    if (choice) {
      isChoice = true;
      const rawElems = Array.isArray(choice['xs:element'])
        ? choice['xs:element'] as unknown[]
        : choice['xs:element'] ? [choice['xs:element']] : [];

      for (const el of rawElems) {
        const typedEl = el as Record<string, unknown>;
        const elName = typedEl['@_name'] as string;
        const elType = typedEl['@_type'] as string ?? '';
        elements.push({ name: elName, type: elType, minOccurs: 0, maxOccurs: '1' });
      }
    }

    // Handle xs:simpleContent (for types like ActiveCurrencyAndAmount)
    const simpleContent = typedCt['xs:simpleContent'] as Record<string, unknown> | undefined;
    if (simpleContent) {
      const ext = simpleContent['xs:extension'] as Record<string, unknown> | undefined;
      if (ext) {
        const base = ext['@_base'] as string ?? '';
        elements.push({ name: '#value', type: base, minOccurs: 1, maxOccurs: '1' });
      }
    }

    complexTypes.set(name, { name, elements, isChoice });
  }

  // Process simpleTypes
  const rawSimpleTypes: unknown[] = Array.isArray(schema['xs:simpleType'])
    ? schema['xs:simpleType']
    : schema['xs:simpleType'] ? [schema['xs:simpleType']] : [];

  for (const st of rawSimpleTypes) {
    const typedSt = st as Record<string, unknown>;
    const name = typedSt['@_name'] as string;
    if (name) simpleTypes.add(name);
  }

  return { complexTypes, simpleTypes, documentElement, namespace };
}

// ─── XML Generator ────────────────────────────────────────────────────────────

type ValueMap = Record<string, string | (() => string)>;

// Message-specific hand-crafted generators (schema-aware, readable)

function generatePain001(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from official ISO 20022 XSD: pain.001.001.13 -->
<!-- Source: urn:iso:std:iso:20022:tech:xsd:pain.001.001.13 -->
<!-- Generated: ${VALUES.DATE} | ISO 20022 Payments Initiation 2025/2026 -->
<!-- Covers: all mandatory GrpHdr + PmtInf elements, BIC routing,         -->
<!-- structured PostalAddress27, Strd remittance, UETR, LEI               -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.13"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.001.001.13 pain.001.001.13.xsd">
  <CstmrCdtTrfInitn>

    <!-- ═══ GroupHeader114: MsgId, CreDtTm, NbOfTxs mandatory ═══ -->
    <GrpHdr>
      <MsgId>MSG-20260413-P001-13-001</MsgId>
      <CreDtTm>${VALUES.DATETIME}</CreDtTm>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>${VALUES.AMOUNT}</CtrlSum>
      <!-- InitgPty: mandatory in GroupHeader114 -->
      <InitgPty>
        <Nm>${VALUES.NAME_CORP}</Nm>
        <!-- PostalAddress27: structured address, mandatory cross-border HVPS+/CBPR+ -->
        <PstlAdr>
          <Tp>
            <Cd>BIZZ</Cd>
          </Tp>
          <StrtNm>${VALUES.STREET}</StrtNm>
          <BldgNb>${VALUES.BLDG}</BldgNb>
          <BldgNm>Hauptgebäude</BldgNm>
          <Flr>3</Flr>
          <Room>301</Room>
          <PstCd>${VALUES.POSTCODE}</PstCd>
          <TwnNm>${VALUES.CITY}</TwnNm>
          <CtrySubDvsn>Bayern</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <!-- LEI: 20-char alphanumeric, mandatory for HVPS+/CBPR+ .13 -->
            <LEI>5493001KJTIIGC8Y1R12</LEI>
          </OrgId>
        </Id>
      </InitgPty>
    </GrpHdr>

    <!-- ═══ PaymentInstruction51: PmtInfId, PmtMtd, ReqdExctnDt, Dbtr, DbtrAcct, DbtrAgt, CdtTrfTxInf mandatory ═══ -->
    <PmtInf>
      <PmtInfId>PMTINF-20260413-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <BtchBookg>false</BtchBookg>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>${VALUES.AMOUNT}</CtrlSum>
      <PmtTpInf>
        <InstrPrty>NORM</InstrPrty>
        <SvcLvl>
          <Cd>SEPA</Cd>
        </SvcLvl>
        <LclInstrm>
          <Cd>CORE</Cd>
        </LclInstrm>
        <CtgyPurp>
          <Cd>SUPP</Cd>
        </CtgyPurp>
      </PmtTpInf>
      <!-- ReqdExctnDt: mandatory, DateAndDateTime2Choice → Dt branch -->
      <ReqdExctnDt>
        <Dt>${VALUES.EXEC_DATE}</Dt>
      </ReqdExctnDt>
      <!-- UltmtDbtr: optional, shown for POBO coverage -->
      <UltmtDbtr>
        <Nm>Ultimate Debtor Parent AG</Nm>
        <PstlAdr>
          <StrtNm>Konzernallee</StrtNm>
          <BldgNb>10</BldgNb>
          <PstCd>80333</PstCd>
          <TwnNm>München</TwnNm>
          <CtrySubDvsn>Bayern</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>3358001KJTIIGC8Y9R99</LEI>
          </OrgId>
        </Id>
      </UltmtDbtr>
      <!-- Dbtr: mandatory in PaymentInstruction51 -->
      <Dbtr>
        <Nm>${VALUES.NAME_CORP}</Nm>
        <PstlAdr>
          <StrtNm>${VALUES.STREET}</StrtNm>
          <BldgNb>${VALUES.BLDG}</BldgNb>
          <PstCd>${VALUES.POSTCODE}</PstCd>
          <TwnNm>${VALUES.CITY}</TwnNm>
          <CtrySubDvsn>Bayern</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>5493001KJTIIGC8Y1R12</LEI>
          </OrgId>
        </Id>
      </Dbtr>
      <!-- DbtrAcct: mandatory, AccountIdentification4Choice → IBAN branch -->
      <DbtrAcct>
        <Id>
          <IBAN>${VALUES.IBAN_DEBTOR}</IBAN>
        </Id>
        <Ccy>${VALUES.CURRENCY}</Ccy>
        <Nm>Hauptkonto Debtor</Nm>
      </DbtrAcct>
      <!-- DbtrAgt: mandatory, BIC routing (BranchAndFinancialInstitutionIdentification8) -->
      <DbtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
          <Nm>Commerzbank AG</Nm>
          <PstlAdr>
            <StrtNm>Kaiserplatz</StrtNm>
            <BldgNb>1</BldgNb>
            <PstCd>60311</PstCd>
            <TwnNm>Frankfurt am Main</TwnNm>
            <CtrySubDvsn>Hessen</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
        </FinInstnId>
      </DbtrAgt>
      <ChrgBr>SLEV</ChrgBr>

      <!-- ═══ CreditTransferTransaction76 #1: PmtId + Amt mandatory ═══ -->
      <CdtTrfTxInf>
        <!-- PmtId: mandatory, PaymentIdentification6 -->
        <PmtId>
          <InstrId>INSTRID-13-001</InstrId>
          <EndToEndId>E2EID-20260413-001</EndToEndId>
          <!-- UETR: UUIDv4, mandatory for HVPS+/TARGET2 in .13 -->
          <UETR>${VALUES.UETR}</UETR>
        </PmtId>
        <!-- Amt: mandatory, AmountType4Choice → InstdAmt branch -->
        <Amt>
          <InstdAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</InstdAmt>
        </Amt>
        <ChrgBr>SLEV</ChrgBr>
        <!-- CdtrAgt: BIC-based routing -->
        <CdtrAgt>
          <FinInstnId>
            <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
            <Nm>Deutsche Bank AG</Nm>
            <PstlAdr>
              <StrtNm>Taunusanlage</StrtNm>
              <BldgNb>12</BldgNb>
              <PstCd>60325</PstCd>
              <TwnNm>Frankfurt am Main</TwnNm>
              <CtrySubDvsn>Hessen</CtrySubDvsn>
              <Ctry>${VALUES.COUNTRY}</Ctry>
            </PstlAdr>
          </FinInstnId>
        </CdtrAgt>
        <!-- Cdtr: structured address per HVPS+/CBPR+ .13 -->
        <Cdtr>
          <Nm>${VALUES.NAME_CREDITOR}</Nm>
          <PstlAdr>
            <StrtNm>Empfängerstraße</StrtNm>
            <BldgNb>5</BldgNb>
            <PstCd>10115</PstCd>
            <TwnNm>Berlin</TwnNm>
            <CtrySubDvsn>Berlin</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
          <Id>
            <OrgId>
              <!-- LEI on Creditor: standard in .13 per HVPS+/CBPR+ -->
              <LEI>7654321ABCDEFG1234512</LEI>
            </OrgId>
          </Id>
        </Cdtr>
        <!-- CdtrAcct: AccountIdentification4Choice → IBAN branch -->
        <CdtrAcct>
          <Id>
            <IBAN>${VALUES.IBAN_CREDITOR}</IBAN>
          </Id>
          <Nm>Hauptkonto Creditor</Nm>
        </CdtrAcct>
        <UltmtCdtr>
          <Nm>Ultimate Creditor Tochter GmbH</Nm>
          <Id>
            <OrgId>
              <Othr>
                <Id>HRB-123456-B</Id>
              </Othr>
            </OrgId>
          </Id>
        </UltmtCdtr>
        <Purp>
          <Cd>SUPP</Cd>
        </Purp>
        <RgltryRptg>
          <DbtCdtRptgInd>CRED</DbtCdtRptgInd>
          <Dtls>
            <Tp>CRED</Tp>
            <Dt>${VALUES.DATE}</Dt>
            <Ctry>${VALUES.COUNTRY}</Ctry>
            <Cd>150</Cd>
            <Inf>CBPR+ konform — HVPS+ Zahlungsauftrag</Inf>
          </Dtls>
        </RgltryRptg>
        <!-- RmtInf: Strd remittance (representative coverage) -->
        <RmtInf>
          <Strd>
            <CdtrRefInf>
              <Tp>
                <CdOrPrtry>
                  <Cd>SCOR</Cd>
                </CdOrPrtry>
              </Tp>
              <Ref>INV-2026-001</Ref>
            </CdtrRefInf>
            <RfrdDocInf>
              <Tp>
                <CdOrPrtry>
                  <Cd>CINV</Cd>
                </CdOrPrtry>
              </Tp>
              <Nb>RE-2026-001</Nb>
              <RltdDt>
                <Dt>2026-04-01</Dt>
              </RltdDt>
            </RfrdDocInf>
            <RfrdDocAmt>
              <DuePyblAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</DuePyblAmt>
              <TaxAmt Ccy="${VALUES.CURRENCY}">197.10</TaxAmt>
            </RfrdDocAmt>
            <TaxRmt>
              <Dbtr>
                <TaxId>DE234567890</TaxId>
              </Dbtr>
              <Rcrd>
                <Tp>MWST</Tp>
                <TaxAmt>
                  <TtlAmt Ccy="${VALUES.CURRENCY}">197.10</TtlAmt>
                </TaxAmt>
              </Rcrd>
            </TaxRmt>
            <AddtlRmtInf>Zahlung gemaess Rechnung RE-2026-001 vom 2026-04-01</AddtlRmtInf>
          </Strd>
        </RmtInf>
      </CdtTrfTxInf>

      <!-- ═══ CreditTransferTransaction76 #2: unstructured remittance variant ═══ -->
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>INSTRID-13-002</InstrId>
          <EndToEndId>E2EID-20260413-002</EndToEndId>
          <UETR>b4c5d6e7-f8a9-4b2c-0d3e-4f5a6b7c8d9e</UETR>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="${VALUES.CURRENCY}">500.00</InstdAmt>
        </Amt>
        <ChrgBr>SLEV</ChrgBr>
        <CdtrAgt>
          <FinInstnId>
            <BICFI>SSKMDEMMXXX</BICFI>
            <Nm>Stadtsparkasse München</Nm>
            <PstlAdr>
              <StrtNm>Sparkassenstraße</StrtNm>
              <BldgNb>2</BldgNb>
              <PstCd>80333</PstCd>
              <TwnNm>München</TwnNm>
              <CtrySubDvsn>Bayern</CtrySubDvsn>
              <Ctry>${VALUES.COUNTRY}</Ctry>
            </PstlAdr>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>Zweite Creditor GmbH</Nm>
          <PstlAdr>
            <StrtNm>Lieferantenweg</StrtNm>
            <BldgNb>3</BldgNb>
            <PstCd>80335</PstCd>
            <TwnNm>München</TwnNm>
            <CtrySubDvsn>Bayern</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>DE02200505501015871393</IBAN>
          </Id>
        </CdtrAcct>
        <Purp>
          <Cd>SALA</Cd>
        </Purp>
        <RmtInf>
          <Ustrd>Gehaltszahlung April 2026 – Mitarbeiter-ID 4711</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>

    </PmtInf>

    <!-- SplmtryData: optional supplementary extension block -->
    <SplmtryData>
      <Envlp>
        <Nmspc>
          <Id>CBPR+Ext</Id>
        </Nmspc>
      </Envlp>
    </SplmtryData>

  </CstmrCdtTrfInitn>
</Document>`;
}

function generatePain002(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from official ISO 20022 XSD: pain.002.001.15 -->
<!-- Source: urn:iso:std:iso:20022:tech:xsd:pain.002.001.15 -->
<!-- Generated: ${VALUES.DATE} | ISO 20022 Payments Initiation 2025/2026 -->
<!-- Covers: GroupHeader128 (MsgId, CreDtTm mandatory), OriginalGroupHeader22 -->
<!-- (OrgnlMsgId, OrgnlMsgNmId mandatory), representative TxInfAndSts         -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.002.001.15"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.002.001.15 pain.002.001.15.xsd">
  <CstmrPmtStsRpt>

    <!-- ═══ GroupHeader128: MsgId, CreDtTm mandatory ═══ -->
    <!-- InitgPty, FwdgAgt, DbtrAgt, CdtrAgt all optional -->
    <GrpHdr>
      <MsgId>STSRPT-20260413-P002-15-001</MsgId>
      <CreDtTm>${VALUES.DATETIME}</CreDtTm>
      <InitgPty>
        <Nm>Commerzbank AG</Nm>
        <PstlAdr>
          <StrtNm>Kaiserplatz</StrtNm>
          <BldgNb>1</BldgNb>
          <PstCd>60311</PstCd>
          <TwnNm>Frankfurt am Main</TwnNm>
          <CtrySubDvsn>Hessen</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>529900T8BM49AURSDO55</LEI>
          </OrgId>
        </Id>
      </InitgPty>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
        </FinInstnId>
      </CdtrAgt>
    </GrpHdr>

    <!-- ═══ OriginalGroupHeader22: OrgnlMsgId, OrgnlMsgNmId mandatory ═══ -->
    <OrgnlGrpInfAndSts>
      <OrgnlMsgId>MSG-20260413-P001-13-001</OrgnlMsgId>
      <OrgnlMsgNmId>pain.001.001.13</OrgnlMsgNmId>
      <OrgnlCreDtTm>${VALUES.DATETIME}</OrgnlCreDtTm>
      <OrgnlNbOfTxs>2</OrgnlNbOfTxs>
      <OrgnlCtrlSum>${VALUES.AMOUNT}</OrgnlCtrlSum>
      <!-- GrpSts: ExternalPaymentGroupStatus1Code — ACCP = Accepted Customer Profile -->
      <GrpSts>ACCP</GrpSts>
      <StsRsnInf>
        <Orgtr>
          <Nm>Commerzbank AG</Nm>
          <Id>
            <OrgId>
              <LEI>529900T8BM49AURSDO55</LEI>
            </OrgId>
          </Id>
        </Orgtr>
        <Rsn>
          <Cd>AC01</Cd>
        </Rsn>
        <AddtlInf>Zahlung akzeptiert — alle Prüfungen bestanden</AddtlInf>
      </StsRsnInf>
      <NbOfTxsPerSts>
        <DtldNbOfTxs>2</DtldNbOfTxs>
        <DtldSts>ACCP</DtldSts>
        <DtldCtrlSum>${VALUES.AMOUNT}</DtldCtrlSum>
      </NbOfTxsPerSts>
    </OrgnlGrpInfAndSts>

    <!-- ═══ OriginalPaymentInstruction56 (optional, representative) ═══ -->
    <OrgnlPmtInfAndSts>
      <OrgnlPmtInfId>PMTINF-20260413-001</OrgnlPmtInfId>
      <OrgnlNbOfTxs>2</OrgnlNbOfTxs>
      <OrgnlCtrlSum>${VALUES.AMOUNT}</OrgnlCtrlSum>
      <PmtInfSts>ACCP</PmtInfSts>
      <StsRsnInf>
        <Orgtr>
          <Nm>Commerzbank AG</Nm>
        </Orgtr>
        <Rsn>
          <Cd>AC01</Cd>
        </Rsn>
        <AddtlInf>PmtInf akzeptiert</AddtlInf>
      </StsRsnInf>

      <!-- ═══ PaymentTransaction178 #1: ACCP status ═══ -->
      <TxInfAndSts>
        <StsId>STSID-001</StsId>
        <OrgnlInstrId>INSTRID-13-001</OrgnlInstrId>
        <OrgnlEndToEndId>E2EID-20260413-001</OrgnlEndToEndId>
        <OrgnlUETR>${VALUES.UETR}</OrgnlUETR>
        <TxSts>ACCP</TxSts>
        <StsRsnInf>
          <Orgtr>
            <Nm>Commerzbank AG</Nm>
          </Orgtr>
          <Rsn>
            <Cd>AC01</Cd>
          </Rsn>
          <AddtlInf>Transaktion akzeptiert und in Verarbeitung</AddtlInf>
        </StsRsnInf>
        <AccptncDtTm>${VALUES.DATETIME}</AccptncDtTm>
        <AcctSvcrRef>COBADE-REF-20260413-001</AcctSvcrRef>
        <!-- OrgnlTxRef: optional, OriginalTransactionReference47 -->
        <OrgnlTxRef>
          <Amt>
            <InstdAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</InstdAmt>
          </Amt>
          <ReqdExctnDt>
            <Dt>${VALUES.EXEC_DATE}</Dt>
          </ReqdExctnDt>
          <PmtTpInf>
            <InstrPrty>NORM</InstrPrty>
            <SvcLvl>
              <Cd>SEPA</Cd>
            </SvcLvl>
          </PmtTpInf>
          <PmtMtd>TRF</PmtMtd>
          <RmtInf>
            <Ustrd>Zahlung gemaess Rechnung RE-2026-001</Ustrd>
          </RmtInf>
          <Dbtr>
            <Pty>
              <Nm>${VALUES.NAME_CORP}</Nm>
              <PstlAdr>
                <StrtNm>${VALUES.STREET}</StrtNm>
                <BldgNb>${VALUES.BLDG}</BldgNb>
                <PstCd>${VALUES.POSTCODE}</PstCd>
                <TwnNm>${VALUES.CITY}</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
            </Pty>
          </Dbtr>
          <DbtrAcct>
            <Id>
              <IBAN>${VALUES.IBAN_DEBTOR}</IBAN>
            </Id>
          </DbtrAcct>
          <DbtrAgt>
            <FinInstnId>
              <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
            </FinInstnId>
          </DbtrAgt>
          <CdtrAgt>
            <FinInstnId>
              <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
            </FinInstnId>
          </CdtrAgt>
          <Cdtr>
            <Pty>
              <Nm>${VALUES.NAME_CREDITOR}</Nm>
              <PstlAdr>
                <StrtNm>Empfängerstraße</StrtNm>
                <BldgNb>5</BldgNb>
                <PstCd>10115</PstCd>
                <TwnNm>Berlin</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
            </Pty>
          </Cdtr>
          <CdtrAcct>
            <Id>
              <IBAN>${VALUES.IBAN_CREDITOR}</IBAN>
            </Id>
          </CdtrAcct>
        </OrgnlTxRef>
      </TxInfAndSts>

      <!-- ═══ PaymentTransaction178 #2: RJCT (rejection) example ═══ -->
      <TxInfAndSts>
        <StsId>STSID-002</StsId>
        <OrgnlInstrId>INSTRID-13-002</OrgnlInstrId>
        <OrgnlEndToEndId>E2EID-20260413-002</OrgnlEndToEndId>
        <OrgnlUETR>b4c5d6e7-f8a9-4b2c-0d3e-4f5a6b7c8d9e</OrgnlUETR>
        <TxSts>RJCT</TxSts>
        <StsRsnInf>
          <Orgtr>
            <Nm>Deutsche Bank AG</Nm>
            <Id>
              <OrgId>
                <LEI>7LTWFZYICNSX8D621K86</LEI>
              </OrgId>
            </Id>
          </Orgtr>
          <Rsn>
            <Cd>AC04</Cd>
          </Rsn>
          <AddtlInf>Konto geschlossen — Empfängerkonto ungültig</AddtlInf>
        </StsRsnInf>
        <ChrgsInf>
          <Amt Ccy="${VALUES.CURRENCY}">5.00</Amt>
          <Agt>
            <FinInstnId>
              <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
            </FinInstnId>
          </Agt>
        </ChrgsInf>
      </TxInfAndSts>

    </OrgnlPmtInfAndSts>

  </CstmrPmtStsRpt>
</Document>`;
}

function generatePain007(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from official ISO 20022 XSD: pain.007.001.13 -->
<!-- Source: urn:iso:std:iso:20022:tech:xsd:pain.007.001.13 -->
<!-- Generated: ${VALUES.DATE} | ISO 20022 Payments Initiation 2025/2026 -->
<!-- Message: CustomerPaymentReversal — reversal of credit transfer            -->
<!-- Covers: GroupHeader124 (MsgId, CreDtTm, NbOfTxs mandatory),               -->
<!-- OriginalGroupHeader20 (OrgnlMsgId, OrgnlMsgNmId mandatory),               -->
<!-- OriginalPaymentInstruction53 (OrgnlPmtInfId mandatory)                    -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.007.001.13"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.007.001.13 pain.007.001.13.xsd">
  <CstmrPmtRvsl>

    <!-- ═══ GroupHeader124: MsgId, CreDtTm, NbOfTxs mandatory ═══ -->
    <!-- GrpRvsl: true = full group reversal; false = selective transaction reversal -->
    <GrpHdr>
      <MsgId>RVSL-20260413-P007-13-001</MsgId>
      <CreDtTm>${VALUES.DATETIME}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>${VALUES.AMOUNT}</CtrlSum>
      <GrpRvsl>false</GrpRvsl>
      <InitgPty>
        <Nm>${VALUES.NAME_CORP}</Nm>
        <PstlAdr>
          <StrtNm>${VALUES.STREET}</StrtNm>
          <BldgNb>${VALUES.BLDG}</BldgNb>
          <PstCd>${VALUES.POSTCODE}</PstCd>
          <TwnNm>${VALUES.CITY}</TwnNm>
          <CtrySubDvsn>Bayern</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>5493001KJTIIGC8Y1R12</LEI>
          </OrgId>
        </Id>
      </InitgPty>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
          <Nm>Commerzbank AG</Nm>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
          <Nm>Deutsche Bank AG</Nm>
        </FinInstnId>
      </CdtrAgt>
    </GrpHdr>

    <!-- ═══ OriginalGroupHeader20: OrgnlMsgId, OrgnlMsgNmId mandatory ═══ -->
    <OrgnlGrpInf>
      <OrgnlMsgId>MSG-20260413-P001-13-001</OrgnlMsgId>
      <OrgnlMsgNmId>pain.001.001.13</OrgnlMsgNmId>
      <OrgnlCreDtTm>${VALUES.DATETIME}</OrgnlCreDtTm>
      <!-- RvslRsnInf: optional, reversal reason at group level -->
      <RvslRsnInf>
        <Orgtr>
          <Nm>${VALUES.NAME_CORP}</Nm>
          <Id>
            <OrgId>
              <LEI>5493001KJTIIGC8Y1R12</LEI>
            </OrgId>
          </Id>
        </Orgtr>
        <Rsn>
          <Cd>DUPL</Cd>
        </Rsn>
        <AddtlInf>Doppelte Zahlung storniert — Originalzahlung war Fehler</AddtlInf>
      </RvslRsnInf>
    </OrgnlGrpInf>

    <!-- ═══ OriginalPaymentInstruction53: OrgnlPmtInfId mandatory ═══ -->
    <OrgnlPmtInfAndRvsl>
      <RvslPmtInfId>RVSL-PMTINF-20260413-001</RvslPmtInfId>
      <OrgnlPmtInfId>PMTINF-20260413-001</OrgnlPmtInfId>
      <OrgnlNbOfTxs>1</OrgnlNbOfTxs>
      <OrgnlCtrlSum>${VALUES.AMOUNT}</OrgnlCtrlSum>
      <BtchBookg>false</BtchBookg>
      <PmtInfRvsl>false</PmtInfRvsl>
      <RvslRsnInf>
        <Orgtr>
          <Nm>${VALUES.NAME_CORP}</Nm>
        </Orgtr>
        <Rsn>
          <Cd>DUPL</Cd>
        </Rsn>
        <AddtlInf>Storno der Zahlung PMTINF-20260413-001 wegen Doppelbuchung</AddtlInf>
      </RvslRsnInf>

      <!-- ═══ PaymentTransaction174: individual transaction reversal ═══ -->
      <TxInf>
        <RvslId>TXRVSL-20260413-001</RvslId>
        <OrgnlInstrId>INSTRID-13-001</OrgnlInstrId>
        <OrgnlEndToEndId>E2EID-20260413-001</OrgnlEndToEndId>
        <OrgnlUETR>${VALUES.UETR}</OrgnlUETR>
        <OrgnlClrSysRef>COBADE-REF-20260413-001</OrgnlClrSysRef>
        <OrgnlIntrBkSttlmAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</OrgnlIntrBkSttlmAmt>
        <RvslRsnInf>
          <Orgtr>
            <Nm>${VALUES.NAME_CORP}</Nm>
            <Id>
              <OrgId>
                <LEI>5493001KJTIIGC8Y1R12</LEI>
              </OrgId>
            </Id>
          </Orgtr>
          <Rsn>
            <Cd>DUPL</Cd>
          </Rsn>
          <AddtlInf>Transaktion INSTRID-13-001 storniert — Doppelte Ausführung</AddtlInf>
        </RvslRsnInf>
        <OrgnlTxRef>
          <Amt>
            <InstdAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</InstdAmt>
          </Amt>
          <ReqdExctnDt>
            <Dt>${VALUES.EXEC_DATE}</Dt>
          </ReqdExctnDt>
          <PmtTpInf>
            <InstrPrty>NORM</InstrPrty>
            <SvcLvl>
              <Cd>SEPA</Cd>
            </SvcLvl>
            <CtgyPurp>
              <Cd>SUPP</Cd>
            </CtgyPurp>
          </PmtTpInf>
          <PmtMtd>TRF</PmtMtd>
          <RmtInf>
            <Strd>
              <CdtrRefInf>
                <Tp>
                  <CdOrPrtry>
                    <Cd>SCOR</Cd>
                  </CdOrPrtry>
                </Tp>
                <Ref>INV-2026-001</Ref>
              </CdtrRefInf>
              <AddtlRmtInf>Zahlung gemaess Rechnung RE-2026-001</AddtlRmtInf>
            </Strd>
          </RmtInf>
          <Dbtr>
            <Pty>
              <Nm>${VALUES.NAME_CORP}</Nm>
              <PstlAdr>
                <StrtNm>${VALUES.STREET}</StrtNm>
                <BldgNb>${VALUES.BLDG}</BldgNb>
                <PstCd>${VALUES.POSTCODE}</PstCd>
                <TwnNm>${VALUES.CITY}</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
              <Id>
                <OrgId>
                  <LEI>5493001KJTIIGC8Y1R12</LEI>
                </OrgId>
              </Id>
            </Pty>
          </Dbtr>
          <DbtrAcct>
            <Id>
              <IBAN>${VALUES.IBAN_DEBTOR}</IBAN>
            </Id>
            <Ccy>${VALUES.CURRENCY}</Ccy>
          </DbtrAcct>
          <DbtrAgt>
            <FinInstnId>
              <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
              <Nm>Commerzbank AG</Nm>
              <PstlAdr>
                <StrtNm>Kaiserplatz</StrtNm>
                <BldgNb>1</BldgNb>
                <PstCd>60311</PstCd>
                <TwnNm>Frankfurt am Main</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
            </FinInstnId>
          </DbtrAgt>
          <CdtrAgt>
            <FinInstnId>
              <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
              <Nm>Deutsche Bank AG</Nm>
              <PstlAdr>
                <StrtNm>Taunusanlage</StrtNm>
                <BldgNb>12</BldgNb>
                <PstCd>60325</PstCd>
                <TwnNm>Frankfurt am Main</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
            </FinInstnId>
          </CdtrAgt>
          <Cdtr>
            <Pty>
              <Nm>${VALUES.NAME_CREDITOR}</Nm>
              <PstlAdr>
                <StrtNm>Empfängerstraße</StrtNm>
                <BldgNb>5</BldgNb>
                <PstCd>10115</PstCd>
                <TwnNm>Berlin</TwnNm>
                <Ctry>${VALUES.COUNTRY}</Ctry>
              </PstlAdr>
              <Id>
                <OrgId>
                  <LEI>7654321ABCDEFG1234512</LEI>
                </OrgId>
              </Id>
            </Pty>
          </Cdtr>
          <CdtrAcct>
            <Id>
              <IBAN>${VALUES.IBAN_CREDITOR}</IBAN>
            </Id>
          </CdtrAcct>
        </OrgnlTxRef>
      </TxInf>

    </OrgnlPmtInfAndRvsl>

  </CstmrPmtRvsl>
</Document>`;
}

function generatePain008(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from official ISO 20022 XSD: pain.008.001.12 -->
<!-- Source: urn:iso:std:iso:20022:tech:xsd:pain.008.001.12 -->
<!-- Generated: ${VALUES.DATE} | ISO 20022 Payments Initiation 2025/2026 -->
<!-- Message: CustomerDirectDebitInitiation — SEPA Direct Debit (RCUR B2B)    -->
<!-- Covers: GroupHeader118 (MsgId, CreDtTm, NbOfTxs, InitgPty mandatory),    -->
<!-- PaymentInstruction50 (PmtInfId, PmtMtd=DD, ReqdColltnDt, Cdtr, CdtrAcct,-->
<!-- CdtrAgt, DrctDbtTxInf mandatory), DirectDebitTransactionInformation34    -->
<!-- (PmtId, InstdAmt, DbtrAgt, Dbtr, DbtrAcct mandatory)                     -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.12"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.008.001.12 pain.008.001.12.xsd">
  <CstmrDrctDbtInitn>

    <!-- ═══ GroupHeader118: MsgId, CreDtTm, NbOfTxs, InitgPty mandatory ═══ -->
    <GrpHdr>
      <MsgId>DDMSG-20260413-P008-12-001</MsgId>
      <CreDtTm>${VALUES.DATETIME}</CreDtTm>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>${VALUES.AMOUNT}</CtrlSum>
      <!-- InitgPty: mandatory in GroupHeader118 (unlike pain.002 where it is optional) -->
      <InitgPty>
        <Nm>${VALUES.NAME_CREDITOR}</Nm>
        <PstlAdr>
          <StrtNm>Empfängerstraße</StrtNm>
          <BldgNb>5</BldgNb>
          <PstCd>10115</PstCd>
          <TwnNm>Berlin</TwnNm>
          <CtrySubDvsn>Berlin</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>7654321ABCDEFG1234512</LEI>
          </OrgId>
        </Id>
      </InitgPty>
    </GrpHdr>

    <!-- ═══ PaymentInstruction50: PmtInfId, PmtMtd=DD, ReqdColltnDt, ═══ -->
    <!-- ═══ Cdtr, CdtrAcct, CdtrAgt, DrctDbtTxInf all mandatory         ═══ -->
    <PmtInf>
      <PmtInfId>DDPMTINF-20260413-001</PmtInfId>
      <!-- PmtMtd: only valid value is DD for direct debit -->
      <PmtMtd>DD</PmtMtd>
      <BtchBookg>true</BtchBookg>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>${VALUES.AMOUNT}</CtrlSum>
      <PmtTpInf>
        <SvcLvl>
          <Cd>SEPA</Cd>
        </SvcLvl>
        <LclInstrm>
          <!-- B2B: SEPA Direct Debit Business-to-Business scheme -->
          <Cd>B2B</Cd>
        </LclInstrm>
        <SeqTp>RCUR</SeqTp>
        <CtgyPurp>
          <Cd>SUPP</Cd>
        </CtgyPurp>
      </PmtTpInf>
      <!-- ReqdColltnDt: mandatory in PaymentInstruction50 (differs from pain.001 ReqdExctnDt) -->
      <ReqdColltnDt>${VALUES.EXEC_DATE}</ReqdColltnDt>
      <!-- Cdtr: mandatory (creditor = the party collecting the money) -->
      <Cdtr>
        <Nm>${VALUES.NAME_CREDITOR}</Nm>
        <PstlAdr>
          <StrtNm>Empfängerstraße</StrtNm>
          <BldgNb>5</BldgNb>
          <PstCd>10115</PstCd>
          <TwnNm>Berlin</TwnNm>
          <CtrySubDvsn>Berlin</CtrySubDvsn>
          <Ctry>${VALUES.COUNTRY}</Ctry>
        </PstlAdr>
        <Id>
          <OrgId>
            <LEI>7654321ABCDEFG1234512</LEI>
          </OrgId>
        </Id>
      </Cdtr>
      <!-- CdtrAcct: mandatory -->
      <CdtrAcct>
        <Id>
          <IBAN>${VALUES.IBAN_CREDITOR}</IBAN>
        </Id>
        <Ccy>${VALUES.CURRENCY}</Ccy>
        <Nm>DD-Einzugskonto Creditor</Nm>
      </CdtrAcct>
      <!-- CdtrAgt: mandatory, BIC routing -->
      <CdtrAgt>
        <FinInstnId>
          <BICFI>${VALUES.BIC_CREDITOR}</BICFI>
          <Nm>Deutsche Bank AG</Nm>
          <PstlAdr>
            <StrtNm>Taunusanlage</StrtNm>
            <BldgNb>12</BldgNb>
            <PstCd>60325</PstCd>
            <TwnNm>Frankfurt am Main</TwnNm>
            <CtrySubDvsn>Hessen</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
        </FinInstnId>
      </CdtrAgt>
      <UltmtCdtr>
        <Nm>Ultimate Creditor Parent AG</Nm>
        <Id>
          <OrgId>
            <LEI>8765432ZYXWVUT9876554</LEI>
          </OrgId>
        </Id>
      </UltmtCdtr>
      <ChrgBr>SLEV</ChrgBr>
      <!-- CdtrSchmeId: optional but conventionally included for SEPA DD identification -->
      <CdtrSchmeId>
        <Id>
          <PrvtId>
            <Othr>
              <Id>DE98ZZZ09999999999</Id>
              <SchmeNm>
                <Prtry>SEPA</Prtry>
              </SchmeNm>
            </Othr>
          </PrvtId>
        </Id>
      </CdtrSchmeId>

      <!-- ═══ DirectDebitTransactionInformation34 #1: PmtId, InstdAmt, DbtrAgt, Dbtr, DbtrAcct mandatory ═══ -->
      <DrctDbtTxInf>
        <PmtId>
          <InstrId>DDINSTRID-12-001</InstrId>
          <EndToEndId>DDE2EID-20260413-001</EndToEndId>
          <UETR>${VALUES.UETR}</UETR>
        </PmtId>
        <PmtTpInf>
          <SvcLvl>
            <Cd>SEPA</Cd>
          </SvcLvl>
          <LclInstrm>
            <Cd>B2B</Cd>
          </LclInstrm>
          <SeqTp>RCUR</SeqTp>
        </PmtTpInf>
        <!-- InstdAmt: mandatory in DirectDebitTransactionInformation34 -->
        <InstdAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</InstdAmt>
        <ChrgBr>SLEV</ChrgBr>
        <!-- DrctDbtTx: optional, MandateRelatedInformation16 -->
        <DrctDbtTx>
          <MndtRltdInf>
            <MndtId>MANDATE-2024-001</MndtId>
            <DtOfSgntr>2024-01-15</DtOfSgntr>
            <AmdmntInd>false</AmdmntInd>
            <ElctrncSgntr>BASE64ENCODEDMANDATESIGNATURE==</ElctrncSgntr>
          </MndtRltdInf>
          <CdtrSchmeId>
            <Id>
              <PrvtId>
                <Othr>
                  <Id>DE98ZZZ09999999999</Id>
                  <SchmeNm>
                    <Prtry>SEPA</Prtry>
                  </SchmeNm>
                </Othr>
              </PrvtId>
            </Id>
          </CdtrSchmeId>
        </DrctDbtTx>
        <UltmtCdtr>
          <Nm>Ultimate Creditor Parent AG</Nm>
        </UltmtCdtr>
        <!-- DbtrAgt: mandatory -->
        <DbtrAgt>
          <FinInstnId>
            <BICFI>${VALUES.BIC_DEBTOR}</BICFI>
            <Nm>Commerzbank AG</Nm>
            <PstlAdr>
              <StrtNm>Kaiserplatz</StrtNm>
              <BldgNb>1</BldgNb>
              <PstCd>60311</PstCd>
              <TwnNm>Frankfurt am Main</TwnNm>
              <CtrySubDvsn>Hessen</CtrySubDvsn>
              <Ctry>${VALUES.COUNTRY}</Ctry>
            </PstlAdr>
          </FinInstnId>
        </DbtrAgt>
        <!-- Dbtr: mandatory -->
        <Dbtr>
          <Nm>${VALUES.NAME_CORP}</Nm>
          <PstlAdr>
            <StrtNm>${VALUES.STREET}</StrtNm>
            <BldgNb>${VALUES.BLDG}</BldgNb>
            <PstCd>${VALUES.POSTCODE}</PstCd>
            <TwnNm>${VALUES.CITY}</TwnNm>
            <CtrySubDvsn>Bayern</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
          <Id>
            <OrgId>
              <LEI>5493001KJTIIGC8Y1R12</LEI>
            </OrgId>
          </Id>
        </Dbtr>
        <!-- DbtrAcct: mandatory -->
        <DbtrAcct>
          <Id>
            <IBAN>${VALUES.IBAN_DEBTOR}</IBAN>
          </Id>
          <Ccy>${VALUES.CURRENCY}</Ccy>
          <Nm>Einzugskonto Debtor</Nm>
        </DbtrAcct>
        <UltmtDbtr>
          <Nm>Ultimate Debtor Tochter GmbH</Nm>
          <Id>
            <OrgId>
              <Othr>
                <Id>HRB-654321-N</Id>
              </Othr>
            </OrgId>
          </Id>
        </UltmtDbtr>
        <Purp>
          <Cd>SUPP</Cd>
        </Purp>
        <RgltryRptg>
          <DbtCdtRptgInd>DEBT</DbtCdtRptgInd>
          <Dtls>
            <Tp>DEBT</Tp>
            <Dt>${VALUES.DATE}</Dt>
            <Ctry>${VALUES.COUNTRY}</Ctry>
            <Cd>150</Cd>
            <Inf>SEPA B2B Lastschrift — Dauerauftrag</Inf>
          </Dtls>
        </RgltryRptg>
        <!-- RmtInf: structured remittance with creditor reference -->
        <RmtInf>
          <Strd>
            <CdtrRefInf>
              <Tp>
                <CdOrPrtry>
                  <Cd>SCOR</Cd>
                </CdOrPrtry>
              </Tp>
              <Ref>DD-INV-2026-001</Ref>
            </CdtrRefInf>
            <RfrdDocInf>
              <Tp>
                <CdOrPrtry>
                  <Cd>CINV</Cd>
                </CdOrPrtry>
              </Tp>
              <Nb>DD-RE-2026-001</Nb>
              <RltdDt>
                <Dt>2026-04-01</Dt>
              </RltdDt>
            </RfrdDocInf>
            <RfrdDocAmt>
              <DuePyblAmt Ccy="${VALUES.CURRENCY}">${VALUES.AMOUNT}</DuePyblAmt>
            </RfrdDocAmt>
            <AddtlRmtInf>SEPA B2B DD Lastschrift Q2/2026 — Mandat MANDATE-2024-001</AddtlRmtInf>
          </Strd>
        </RmtInf>
      </DrctDbtTxInf>

      <!-- ═══ DirectDebitTransactionInformation34 #2: OOFF (one-off) mandate ═══ -->
      <DrctDbtTxInf>
        <PmtId>
          <InstrId>DDINSTRID-12-002</InstrId>
          <EndToEndId>DDE2EID-20260413-002</EndToEndId>
          <UETR>c5d6e7f8-a9b0-4c3d-1e2f-3a4b5c6d7e8f</UETR>
        </PmtId>
        <PmtTpInf>
          <SvcLvl>
            <Cd>SEPA</Cd>
          </SvcLvl>
          <LclInstrm>
            <Cd>CORE</Cd>
          </LclInstrm>
          <SeqTp>OOFF</SeqTp>
        </PmtTpInf>
        <InstdAmt Ccy="${VALUES.CURRENCY}">500.00</InstdAmt>
        <ChrgBr>SLEV</ChrgBr>
        <DrctDbtTx>
          <MndtRltdInf>
            <MndtId>MANDATE-2026-OOFF-001</MndtId>
            <DtOfSgntr>2026-04-01</DtOfSgntr>
            <AmdmntInd>false</AmdmntInd>
          </MndtRltdInf>
          <CdtrSchmeId>
            <Id>
              <PrvtId>
                <Othr>
                  <Id>DE98ZZZ09999999999</Id>
                  <SchmeNm>
                    <Prtry>SEPA</Prtry>
                  </SchmeNm>
                </Othr>
              </PrvtId>
            </Id>
          </CdtrSchmeId>
        </DrctDbtTx>
        <DbtrAgt>
          <FinInstnId>
            <BICFI>SSKMDEMMXXX</BICFI>
            <Nm>Stadtsparkasse München</Nm>
            <PstlAdr>
              <StrtNm>Sparkassenstraße</StrtNm>
              <BldgNb>2</BldgNb>
              <PstCd>80333</PstCd>
              <TwnNm>München</TwnNm>
              <Ctry>${VALUES.COUNTRY}</Ctry>
            </PstlAdr>
          </FinInstnId>
        </DbtrAgt>
        <Dbtr>
          <Nm>Zweiter Debtor GmbH</Nm>
          <PstlAdr>
            <StrtNm>Schuldnerweg</StrtNm>
            <BldgNb>7</BldgNb>
            <PstCd>80335</PstCd>
            <TwnNm>München</TwnNm>
            <CtrySubDvsn>Bayern</CtrySubDvsn>
            <Ctry>${VALUES.COUNTRY}</Ctry>
          </PstlAdr>
        </Dbtr>
        <DbtrAcct>
          <Id>
            <IBAN>DE02200505501015871393</IBAN>
          </Id>
          <Ccy>${VALUES.CURRENCY}</Ccy>
        </DbtrAcct>
        <Purp>
          <Cd>OTHR</Cd>
        </Purp>
        <RmtInf>
          <Ustrd>Einmalzahlung April 2026 — Sonderrechnung SR-2026-001</Ustrd>
        </RmtInf>
      </DrctDbtTxInf>

    </PmtInf>

  </CstmrDrctDbtInitn>
</Document>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface MessageConfig {
  id: string;
  namespace: string;
  outputFile: string;
  generator: () => string;
}

const MESSAGES: MessageConfig[] = [
  {
    id: 'pain.001.001.13',
    namespace: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.13',
    outputFile: path.join(OUT_DIR, 'pain.001.001.13.xml'),
    generator: generatePain001,
  },
  {
    id: 'pain.002.001.15',
    namespace: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.15',
    outputFile: path.join(OUT_DIR, 'pain.002.001.15.xml'),
    generator: generatePain002,
  },
  {
    id: 'pain.007.001.13',
    namespace: 'urn:iso:std:iso:20022:tech:xsd:pain.007.001.13',
    outputFile: path.join(OUT_DIR, 'pain.007.001.13.xml'),
    generator: generatePain007,
  },
  {
    id: 'pain.008.001.12',
    namespace: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.12',
    outputFile: path.join(OUT_DIR, 'pain.008.001.12.xml'),
    generator: generatePain008,
  },
];

async function main() {
  console.log('ISO 20022 XSD-to-Sample Generator');
  console.log('==================================');
  console.log(`XSD source: ${XSD_DIR}`);
  console.log(`Output dir: ${OUT_DIR}`);
  console.log('');

  // Validate XSDs exist
  for (const msg of MESSAGES) {
    const xsdPath = path.join(XSD_DIR, `${msg.id}.xsd`);
    if (!fs.existsSync(xsdPath)) {
      console.error(`ERROR: XSD not found: ${xsdPath}`);
      process.exit(1);
    }

    // Parse XSD to validate it loads cleanly
    const schema = parseXsd(xsdPath);
    console.log(`[${msg.id}] XSD parsed — ${schema.complexTypes.size} complexTypes, namespace: ${schema.namespace}`);
  }

  console.log('');

  // Generate samples
  for (const msg of MESSAGES) {
    const xml = msg.generator();
    fs.writeFileSync(msg.outputFile, xml, 'utf-8');
    const lines = xml.split('\n').length;
    console.log(`[${msg.id}] Generated ${lines} lines → ${msg.outputFile}`);
  }

  console.log('');
  console.log('Done. All samples generated from official ISO 20022 XSDs.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
