import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Header Record (Data Code 1)',
    card: '1',
    type: 'Fixed 120 Byte',
    desc: 'Datei-Header. Felder: Data Code (1n, "1"=Header), Type Code (2n, 21=Sōfurikomi Credit Transfer, 11=Kōza-Furikae Direct Debit), Code Kubun (1n, Character-Code-Klassifikation 0=JIS, 1=EBCDIC-Katakana), Sender Bank Code (4n), Sender Branch Code (3n), Sender Name (40 char Half-Width Katakana), Transfer Date (MMDD), Sender Account Type (1n, 1=Futsū Ordinary, 2=Tōza Current), Sender Account Number (7n).',
  },
  {
    name: 'Data Record (Data Code 2)',
    card: '1..N',
    type: 'Fixed 120 Byte',
    desc: 'Einzel-Transaktion. Felder: Data Code (1n="2"), Receiver Bank Code (4n — z. B. 0005 MUFG, 0001 Mizuho, 0009 SMBC), Receiver Bank Name (15 char Katakana), Receiver Branch Code (3n), Receiver Branch Name (15 char Katakana), Exchange Office Code (4n, reserved), Account Type (1n, 1=Futsū, 2=Tōza, 4=Chochiku), Receiver Account Number (7n), Receiver Name (30 char Half-Width Katakana), Amount (10n, rechtsbündig zero-padded in JPY ohne Dezimalen), New Code (1n, 1=New, 2=Change, 3=Same), Customer Reference (20 char), Transfer Type (1n, 0=Credit, 1=Debit), Identification Code (1n, Y=EDI).',
  },
  {
    name: 'Trailer Record (Data Code 8)',
    card: '1',
    type: 'Fixed 120 Byte',
    desc: 'Kontroll-Trailer: Total Count (6n Anzahl Data Records), Total Amount (12n Summe in JPY). Zengin-Net-Zentrale validiert Count + Sum vor Weiterleitung an RDFI.',
  },
  {
    name: 'End Record (Data Code 9)',
    card: '1',
    type: 'Fixed 120 Byte',
    desc: 'Datei-Ende-Marker. Schließt File ab; weitere Records werden verworfen.',
  },
];

const migrations: Migration[] = [
  {
    label: 'Zengin → ISO 20022 Phase I (BOJ-NET 2022)',
    fromVersion: 'Zengin-Text (Shift-JIS)',
    toVersion: 'ISO 20022 pacs.008 High-Value via BOJ-NET',
    changes: [
      { field: 'Scope Phase I', oldValue: 'Alle Beträge via Zengin-Text', newValue: 'High-Value Interbank via BOJ-NET auf ISO 20022 (seit Oktober 2022)', type: 'new' },
      { field: 'Encoding', oldValue: 'Shift-JIS Half-Width Katakana (120 Byte Fixed)', newValue: 'UTF-8 XML pacs.008', type: 'changed' },
      { field: 'Bank Identification', oldValue: '4-Digit Bank Code + 3-Digit Branch Code', newValue: 'BIC + ClrSysMmbId (ClrSysId=JPZGN) für Legacy-Routing', type: 'changed' },
      { field: 'Receiver Name', oldValue: '30 Byte Half-Width Katakana', newValue: 'UTF-8 Kanji/Hiragana/Katakana bis 140 Zeichen Nm', type: 'changed' },
      { field: 'Retail-Batch', oldValue: 'Weiter Zengin-Text parallel', newValue: 'Retail-Migration Phase II ab 2027 geplant', type: 'new' },
    ],
  },
  {
    label: 'Zengin Full-Width Name Service (2024)',
    fromVersion: 'Half-Width Katakana only',
    toVersion: 'Optional Full-Width + Kanji Name',
    changes: [
      { field: 'Receiver Name Verification', oldValue: 'Nur Half-Width Katakana Match gegen RDFI-Stammdaten', newValue: 'Full-Width + Kanji Name zusätzlich, für Namensgleichheitsprüfung (seit 2024 schrittweise rolled out)', type: 'new' },
    ],
  },
];

registerFormat({
  formatName: 'Zengin Text',
  region: 'Japan',
  characterSet: 'jp-shift-jis',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations,
  featureDefs: [
    {
      match: /Half[- ]?Width\s*Katakana|ハンカク|Hankaku/i,
      name: 'Half-Width Katakana (ハンカク カタカナ)',
      what: 'Zengin-Text erlaubt im Namens-Feld nur Half-Width Katakana (JIS X 0201 Right-Half, 1 Byte per Zeichen), plus ASCII-Großbuchstaben, Ziffern und Sonderzeichen ( ) . / - Leerzeichen. Keine Hiragana, kein Kanji, keine Lowercase-ASCII. Umlaute/Dakuten (ガ, パ) zählen als 2 Bytes — oft Quelle von Längen-Overflow-Fehlern beim DMEE-Mapping.',
      tokens: ['Half-Width Katakana', 'JIS X 0201', 'Hankaku'],
    },
    {
      match: /Bank\s*Code|Branch\s*Code|4[- ]?digit/i,
      name: 'Bank-4-Digit + Branch-3-Digit',
      what: 'Zengin-eigenes Routing: 4-stelliger Bank Code (0001 Mizuho, 0005 MUFG, 0009 SMBC, 0010 Resona, 0033 Japan Post) + 3-stelliger Branch Code. Kein Prüfzifferalgorithmus — Validierung nur gegen Zenginkyo-Verzeichnis. Bei ISO 20022 Phase I mapped nach ClrSysMmbId/MmbId mit ClrSysId="JPZGN" statt direktem BIC.',
      tokens: ['Bank Code', 'Branch Code', 'JPZGN', 'Zenginkyo'],
    },
    {
      match: /Shift[- ]?JIS|encoding/i,
      name: 'Shift-JIS Encoding-Fallen',
      what: 'Zengin-Text-Dateien sind Shift-JIS encoded, nicht UTF-8. Häufige Fehler: BOM-Prefix zerstört Header-Record-Parser, Line-Endings CRLF vs LF (Zengin-Net akzeptiert beides, aber manche Bank-Gateways nur CRLF), 1-Byte-Half-Width vs 2-Byte-Full-Width-Mix im Namens-Feld sprengt die 30-Byte-Länge. SAP DMEE-Baum muss Code-Page 8000 (SJIS) explizit setzen, sonst liefert Unicode-Konvertierung Mojibake (文字化け).',
      tokens: ['Shift-JIS', 'SJIS', 'Code Page 8000', 'Mojibake'],
    },
    {
      match: /BOJ[- ]?NET|BOJNET/i,
      name: 'BOJ-NET vs Zengin-Net',
      what: 'BOJ-NET (Bank of Japan Financial Network) = RTGS für High-Value Interbank Settlement (JPY > ¥100 Mio. historisch, heute alle Interbank-Großbeträge). Zengin-Net = Retail-Batch-Netz für Commercial/Consumer Transfers. BOJ-NET läuft seit 2022 auf ISO 20022; Zengin-Net bleibt vorerst Zengin-Text, Phase-II-Migration auf ISO 20022 geplant ab 2027. Beide Netze betrieben von Japanese Banks Payment Clearing Network (Zenginkyo).',
      tokens: ['BOJ-NET', 'Zengin-Net', 'Zenginkyo', 'Phase II 2027'],
    },
    {
      match: /SAP\s*Localization\s*Japan|J1[-_]|CoA\s*JP/i,
      name: 'SAP Localization Japan — Zengin DMEE-Baum',
      what: 'SAP-Standard liefert Zengin-Format über Country Localization Japan aus. F110 mit Payment Method "Z" (Zengin) → DMEE-Baum ID "ZENGIN" → 120-Byte-Fixed-Width-Shift-JIS-File. Receiver-Name wird aus LFA1-NAME1 via automatischer Half-Width-Katakana-Transliteration (via Table T001K + Kana-Field LFB1-ZENGIN_KANA). Upload via SFTP an Firmenbank oder Zengin EDI Service (ZEDI).',
      tokens: ['Localization Japan', 'DMEE ZENGIN', 'ZEDI', 'LFB1'],
    },
  ],
});
