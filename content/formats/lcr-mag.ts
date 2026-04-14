import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Enregistrement 03 — En-tête de remise (Header)',
    card: '1',
    type: 'Fixed 160 char',
    desc: 'Remise-Header. Felder: Code enregistrement (03), Code opération (60=LCR à acceptation, 62=LCR sans acceptation, 10=BOR Billet à Ordre), Numéro de remise, Date de création (JJMMAA), Code devise (EUR), RIB du tireur (Cédant — 5n Banque + 5n Guichet + 11x Compte + 2n Clé RIB = 23 char), Raison sociale du cédant (24x).',
  },
  {
    name: 'Enregistrement 06 — Détail d\'effet (Detail)',
    card: '1..N',
    type: 'Fixed 160 char',
    desc: 'Einzelne LCR (Wechsel). Felder: Code enregistrement (06), Référence tiré (10x), Nom du tiré (24x), RIB du tiré (23 char), Montant (12n in Cent), Date d\'échéance (JJMMAA), Numéro de la LCR (7n), Référence interne du créancier (10x), Code acceptation (1=acceptée, 2=non acceptée).',
    children: [
      { name: 'Code opération 60', card: '0..N', type: '2n', desc: 'LCR à acceptation — akzeptierter Wechsel, vom Schuldner unterschrieben.' },
      { name: 'Code opération 62', card: '0..N', type: '2n', desc: 'LCR sans acceptation — nicht akzeptierter Wechsel (Standard im B2B).' },
      { name: 'Code opération 10', card: '0..N', type: '2n', desc: 'BOR — Billet à Ordre (Solawechsel, vom Schuldner ausgestellt).' },
    ],
  },
  {
    name: 'Enregistrement 08 — Total de remise (Trailer)',
    card: '1',
    type: 'Fixed 160 char',
    desc: 'Kontroll-Trailer. Felder: Code enregistrement (08), Nombre d\'effets (7n), Montant total (12n), Numéro de remise, Date.',
  },
];

registerFormat({
  formatName: 'LCR-MAG',
  region: 'Frankreich',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'LCR-MAG → SEPA SDD (teilweise, nur für Forderungseinzug)',
      fromVersion: 'CFONB 160 LCR-MAG',
      toVersion: 'pain.008.001.02 SEPA SDD B2B',
      changes: [
        { field: 'Instrument', oldValue: 'Lettre de Change Relevé (Handelswechsel)', newValue: 'SEPA Direct Debit B2B (kein Wechsel, reine Einzugsermächtigung)', type: 'changed' },
        { field: 'Kontoidentifikation', oldValue: 'RIB 23 char (Banque+Guichet+Compte+Clé)', newValue: 'IBAN FR (27 char, Prüfziffer MOD-97-10)', type: 'changed' },
        { field: 'Akzept / Unterschrift', oldValue: 'LCR à acceptation verlangt Unterschrift des Tiré', newValue: 'Keine Akzept-Unterschrift — Mandat (Mandat SDD B2B) mit DateOfSignature ersetzt das Instrument', type: 'changed' },
        { field: 'Rechtsnatur', oldValue: 'Handelswechsel (Code de commerce L511-1 ff) — diskontierbar, protestfähig', newValue: 'Lastschrift-Forderung — nicht diskontierbar; Dailly-Abtretung als Ersatz für Vorfinanzierung', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /LCR\s*à\s*acceptation/i,
      name: 'LCR à acceptation vs. sans acceptation',
      what: 'LCR à acceptation (Code 60): Schuldner unterschreibt, Rechtsstellung wie Wechsel — protestfähig, diskontierbar. LCR sans acceptation (Code 62): Forderungsbestand ohne Unterschrift — im B2B-Einzug üblich, rechtlich schwächer, aber günstiger. CFONB-160 unterscheidet beides über den Code opération.',
      tokens: ['LCR', 'acceptation', 'Tiré', 'Cédant'],
    },
    {
      match: /RIB|IBAN/i,
      name: 'RIB → IBAN Umrechnung',
      what: 'Französischer RIB 23 char (5n Banque + 5n Guichet + 11x Compte + 2n Clé RIB) wird nach Algorithmus in IBAN FR (27 char) umgerechnet: "FR" + 2 Prüfziffern + RIB. Clé RIB Prüfung via (Banque×89 + Guichet×15 + Compte×3) mod 97. SAP: Report /PF1/IBAN_CONV_FR oder CFONB-Tools.',
      tokens: ['RIB', 'IBAN FR', 'Clé RIB', 'CFONB'],
    },
    {
      match: /Dailly|Escompte|Discount/i,
      name: 'Escompte LCR / Dailly-Abtretung',
      what: 'Klassische Vorfinanzierung: Bank diskontiert LCR-MAG bei Einreichung ("Escompte"). Bei Ausfall Regressrecht gegen Cédant (Tireur). SEPA kennt kein Pendant — stattdessen Factoring oder Dailly-Cession (Loi Dailly 1981): Forderungsabtretung an Bank via CFONB-320.',
      tokens: ['Escompte', 'Dailly', 'Factoring', 'Tireur'],
    },
    {
      match: /CFONB\s*160|Norme\s*160/i,
      name: 'CFONB 160 Norm',
      what: 'Comité Français d\'Organisation et de Normalisation Bancaires (CFONB) Standard 160 definiert Layout für LCR-MAG, BOR und Domiciliation. 160 char fixed ASCII. Parallel existieren CFONB 120 (Kontoauszug → heute camt.053), CFONB 240 (Virement → heute pain.001), CFONB 320 (Dailly).',
      tokens: ['CFONB', 'Norme 160', 'Norme 240'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum LCR / Custom-Tree',
      what: 'SAP liefert keinen Standard-DMEE-Baum für LCR-MAG. Französische SAP-Implementierungen nutzen Custom-DMEE-Bäume (Kopie Norme FR LCR) oder Bills-of-Exchange-Programme (RFFOF__L). Aufruf via F110 mit Zahlweg "L" (Lettre de change). Einreichung über EBICS oder ETEBAC-Nachfolger.',
      tokens: ['DMEE', 'RFFOF__L', 'EBICS', 'ETEBAC'],
    },
  ],
});
