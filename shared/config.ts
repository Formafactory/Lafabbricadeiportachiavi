/**
 * CONFIGURAZIONE UNICA — listino, spedizione, consegna, suffisso IVA, contatti.
 *
 * Questo file è l'UNICA fonte per prezzi e testi commerciali: lo leggono sia la
 * pagina sia (dal passo 2) le funzioni lato server che ricalcolano il totale.
 * Tutti gli importi sono in centesimi di euro (interi) per evitare errori di
 * arrotondamento.
 *
 * Listino ufficiale: prezzi al pezzo.
 */

export const QUANTITA = [100, 200, 500] as const;
export type Quantita = (typeof QUANTITA)[number];

export type ModelloId = "sagoma" | "rotante" | "clicker" | "nfc";

export interface Modello {
  id: ModelloId;
  nome: string; // titolo della card e voce del modulo
  nomeRiepilogo: string; // "200 portachiavi <nomeRiepilogo>"
  descrizione: string;
  /** prezzo al pezzo in centesimi, per ogni quantità */
  prezzi: Record<Quantita, number>;
}

export const MODELLI: readonly Modello[] = [
  {
    id: "sagoma",
    nome: "Sagoma logo",
    nomeRiepilogo: "sagoma logo",
    descrizione: "Il marchio in rilievo, a due colori.",
    prezzi: { 100: 190, 200: 160, 500: 130 },
  },
  {
    id: "rotante",
    nome: "Rotante",
    nomeRiepilogo: "rotanti",
    descrizione: "Il logo gira al centro: si finisce per giocarci.",
    prezzi: { 100: 250, 200: 220, 500: 190 },
  },
  {
    id: "clicker",
    nome: "Clicker",
    nomeRiepilogo: "clicker",
    descrizione: "Un tasto antistress con il logo sopra.",
    prezzi: { 100: 280, 200: 250, 500: 220 },
  },
  {
    id: "nfc",
    nome: "Con chip NFC",
    nomeRiepilogo: "con chip NFC",
    descrizione: "Avvicini il telefono e si apre il tuo sito.",
    prezzi: { 100: 280, 200: 250, 500: 220 },
  },
];

/** Spedizione in centesimi per quantità: 6 € a 100 pezzi, inclusa da 200 in su. */
export const SPEDIZIONE: Record<Quantita, number> = { 100: 600, 200: 0, 500: 0 };

/** Oltre l'ultima quantità del listino si lavora solo su preventivo. */
export const OLTRE_MASSIMO = "Ti servono più di 500 pezzi?";

export const CONSEGNA = {
  giorniLavorativi: 5,
  /** testo completo, da usare dove serve la regola per intero */
  testo: "5 giorni lavorativi dall'approvazione della bozza",
  /** tempo di invio della bozza 3D dopo l'ordine */
  bozza: "entro un giorno lavorativo",
};

/**
 * IVA: oggi NESSUN suffisso. Si fattura in regime forfettario, quindi i prezzi
 * sono mostrati senza "+ IVA". Se in futuro serve di nuovo, basta mettere
 * suffisso: "+\u00A0IVA" (spazio non divisibile: non va a capo): lo aggiungono da soli
 * tutti i prezzi e i totali della pagina e, dal passo 2, delle email.
 */
export const IVA = {
  suffisso: "",
};

/** Limiti del modulo (usati anche dal server dal passo 2). */
export const LIMITI = {
  logoMaxMB: 10, // DA CONFERMARE
  logoEstensioni: ["pdf", "png", "jpg", "jpeg", "svg", "ai"],
  allegatiProgettoMax: 3,
  allegatoMaxMB: 10, // DA CONFERMARE
  coloriMax: 2,
};

/** Segnaposto da sostituire con i dati reali (vedi punto 11 del brief). */
export const CONTATTI = {
  partitaIva: "[PARTITA IVA]",
  emailTelefono: "[EMAIL E TELEFONO PER LE AZIENDE]",
  citta: "Napoli",
};

export const SITO = {
  nome: "La Fabbrica dei Portachiavi",
  poweredBy: "powered by Vir3D",
  dominio: "https://lafabbricaportachiavi.it",
};

/* ------------------------------------------------------------------ */
/* Calcoli: unica implementazione, riusata dal server nel passo 2.     */
/* ------------------------------------------------------------------ */

export function trovaModello(id: string): Modello | undefined {
  return MODELLI.find((m) => m.id === id);
}

export function quantitaValida(q: number): q is Quantita {
  return (QUANTITA as readonly number[]).includes(q);
}

export interface Riepilogo {
  modello: Modello;
  quantita: Quantita;
  unitarioCent: number;
  merceCent: number;
  spedizioneCent: number;
  totaleCent: number; // merce + spedizione
}

export function calcolaRiepilogo(modelloId: string, quantita: number): Riepilogo {
  const modello = trovaModello(modelloId);
  if (!modello) throw new Error(`Modello non valido: ${modelloId}`);
  if (!quantitaValida(quantita)) throw new Error(`Quantità non valida: ${quantita}`);
  const unitarioCent = modello.prezzi[quantita];
  const merceCent = unitarioCent * quantita;
  const spedizioneCent = SPEDIZIONE[quantita];
  return {
    modello,
    quantita,
    unitarioCent,
    merceCent,
    spedizioneCent,
    totaleCent: merceCent + spedizioneCent,
  };
}

/** Prezzo minimo al pezzo di un modello ("da X €"). */
export function prezzoDa(modello: Modello): number {
  return Math.min(...QUANTITA.map((q) => modello.prezzi[q]));
}

/** 190 -> "1,90 €"; 19000 -> "190 €" (niente decimali se l'importo è intero). */
export function formatEuro(cent: number): string {
  const intero = cent % 100 === 0;
  const s = (cent / 100).toLocaleString("it-IT", {
    minimumFractionDigits: intero ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${s}\u00A0€`;
}

/** Importo come lo vede il cliente: "190 €", oppure "190 € + IVA" se IVA.suffisso è valorizzato. */
export const prezzoTesto = (cent: number) =>
  IVA.suffisso ? `${formatEuro(cent)}\u00A0${IVA.suffisso}` : formatEuro(cent);
