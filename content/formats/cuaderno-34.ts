import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Bloque I — Registro de Cabecera del Ordenante (Header)',
    card: '1',
    type: 'Fixed 162 char (Cuaderno 34.14) / 80 char (34.1 legacy)',
    desc: 'Auftraggeber-Header. Felder: Código de Registro (03), NIF/CIF Ordenante (9 char), Código de Sufijo, Fecha Confección (DDMMAA), Fecha Ejecución, Código CCC Ordenante (20 digits legacy) bzw. IBAN + Nombre Ordenante (70x).',
  },
  {
    name: 'Bloque II — Registro Individual (Detail)',
    card: '1..N',
    type: 'Fixed 162 char',
    desc: 'Einzelzahlung / Domiciliación. Felder: Código de Registro (06), Clave Proceso (56), NIF Beneficiario, Nombre Beneficiario (40x), Domicilio, Concepto Pago (Código AEB), Importe (11n in Cent), CCC/IBAN Beneficiario, Referencia para el beneficiario.',
    children: [
      { name: 'Subregistro 56 — Domicilio beneficiario', card: '0..1', type: 'Fixed 162 char', desc: 'Postadresse (Dirección, Población, Provincia, Código Postal).' },
      { name: 'Subregistro 59 — Concepto de la transferencia', card: '0..N', type: 'Fixed 162 char', desc: 'Verwendungszweck-Text (max 4×64 char).' },
      { name: 'Subregistro 70 — Información adicional', card: '0..1', type: 'Fixed 162 char', desc: 'Zusatzinformationen für den Begünstigten (Rechnung, Referenz).' },
    ],
  },
  {
    name: 'Bloque III — Registro Total (Footer)',
    card: '1',
    type: 'Fixed 162 char',
    desc: 'Kontroll-Trailer. Felder: Código de Registro (08), Importe Total (17n), Número de Registros, Número de Ordenantes.',
  },
];

registerFormat({
  formatName: 'Cuaderno 34',
  region: 'Spanien (abgelöst durch SEPA)',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'Cuaderno 34 → SEPA SCT (pain.001)',
      fromVersion: 'AEB 34.14',
      toVersion: 'pain.001.001.03 (Spanien 01.02.2014)',
      changes: [
        { field: 'Format', oldValue: 'AEB Cuaderno 34.14 Flat-File', newValue: 'ISO 20022 XML pain.001.001.03', type: 'changed' },
        { field: 'Kontoidentifikation', oldValue: 'CCC Código Cuenta Cliente (20 digits)', newValue: 'IBAN ES + BIC (bis 2016 BIC-Pflicht, danach IBAN-only im Inland)', type: 'changed' },
        { field: 'Identificación Ordenante', oldValue: 'NIF/CIF 9 char (AEB-Standard)', newValue: 'Organisation Id → Other/Id Schema "NIF" + Creditor Scheme ID bei SDD', type: 'changed' },
        { field: 'Concepto de Pago', oldValue: 'AEB-Konzept-Codes (01-99)', newValue: 'ISO Purpose Code + CategoryPurpose (SALA, SUPP, TAXS...)', type: 'changed' },
        { field: 'Verwendungszweck', oldValue: '4×64 char Freitext (Subregistro 59)', newValue: 'Ustrd 0..N × 140 char oder Strd mit Referenzen', type: 'changed' },
      ],
    },
    {
      label: 'Cuaderno 19 (Domiciliación/DD) → SEPA SDD (pain.008)',
      fromVersion: 'AEB 19.14',
      toVersion: 'pain.008.001.02',
      changes: [
        { field: 'Mandat', oldValue: 'Autorización bancaria papel, keine eindeutige Referenz', newValue: 'Unique MandateIdentification + DateOfSignature + Creditor Scheme ID (SpanishID)', type: 'new' },
        { field: 'Secuencia', oldValue: 'Standard-Lastschrift ohne Sequence-Type', newValue: 'SequenceType FRST/RCUR/OOFF/FNAL Pflicht', type: 'new' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /CCC|Código\s*Cuenta/i,
      name: 'CCC → IBAN Migration',
      what: 'Der 20-stellige CCC (Banco 4n + Sucursal 4n + DC 2n + Cuenta 10n) wurde algorithmisch in die spanische IBAN umgewandelt (ES + 2 Prüfziffern + CCC). SAP-Mandanten-Migration via Report /PF1/IBAN_CONV_ES oder Bank-Service.',
      tokens: ['CCC', 'IBAN ES', 'Código Cuenta Cliente'],
    },
    {
      match: /NIF|CIF|DNI/i,
      name: 'NIF/CIF/DNI-Validierung',
      what: 'Spanische Steuernummer (NIF natürliche Person, CIF juristische Person, DNI Bürger) ist in Cuaderno 34 Pflichtfeld mit Prüfziffer. Bei SEPA-Migration wandert die Nummer in OrganisationIdentification/Other/Id mit SchemeName "SpanishCIF" bzw. PrivateId/NationalRegistrationNumber.',
      tokens: ['NIF', 'CIF', 'DNI', 'SpanishCIF'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum ES_C34 / ES_C19',
      what: 'SAP-Standard-DMEE-Bäume ES_C34 (Credit) und ES_C19 (Direct Debit) existieren bis heute im System, sind aber seit 01.02.2014 ohne Clearing-Anbindung. Ablöse durch SEPA_CT / SEPA_DD Bäume.',
      tokens: ['DMEE', 'ES_C34', 'ES_C19'],
    },
    {
      match: /Concepto|Purpose/i,
      name: 'Concepto-Code-Mapping',
      what: 'AEB Concepto-Codes (z.B. 01 Salario, 02 Pensión, 07 Alquiler) müssen bei SEPA-Migration auf ISO-Purpose-Codes gemappt werden (SALA, PENS, RENT). Custom Mapping-Tabelle in SAP T042ZL oder Customer-Z-Table empfohlen.',
      tokens: ['Concepto', 'Purpose Code', 'SALA', 'PENS'],
    },
  ],
});
