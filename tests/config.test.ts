import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MODELLI, QUANTITA, calcolaRiepilogo, formatEuro, conIva, prezzoDa, trovaModello,
} from "../shared/config.ts";

const n = (t: string) => t.replace(/\u00A0/g, " "); // spazi non divisibili -> spazi normali

// Listino ufficiale (€ al pezzo, + IVA): [100, 200, 500]
const LISTINO: Record<string, number[]> = {
  sagoma: [1.9, 1.6, 1.3],
  rotante: [2.5, 2.2, 1.9],
  nfc: [2.8, 2.5, 2.2],
  clicker: [2.8, 2.5, 2.2],
};

test("il listino in config coincide con il listino ufficiale", () => {
  for (const [id, prezzi] of Object.entries(LISTINO)) {
    QUANTITA.forEach((q, i) => {
      assert.equal(calcolaRiepilogo(id, q).unitarioCent, Math.round(prezzi[i] * 100), `${id} ${q}`);
    });
  }
  assert.equal(MODELLI.length, 4);
});

test("spedizione: 6 € a 100 pezzi, inclusa da 200", () => {
  assert.equal(calcolaRiepilogo("sagoma", 100).spedizioneCent, 600);
  assert.equal(calcolaRiepilogo("sagoma", 200).spedizioneCent, 0);
  assert.equal(calcolaRiepilogo("sagoma", 500).spedizioneCent, 0);
});

test("totali (merce + spedizione, IVA esclusa)", () => {
  assert.equal(calcolaRiepilogo("sagoma", 100).totaleCent, 19600);
  assert.equal(calcolaRiepilogo("sagoma", 200).totaleCent, 32000);
  assert.equal(calcolaRiepilogo("sagoma", 500).totaleCent, 65000);
  assert.equal(calcolaRiepilogo("nfc", 100).totaleCent, 28600);
});

test("input non validi vengono rifiutati", () => {
  assert.throws(() => calcolaRiepilogo("sagoma", 150));
  assert.throws(() => calcolaRiepilogo("inesistente", 100));
  assert.throws(() => calcolaRiepilogo("sagoma", 1000));
  assert.equal(trovaModello("x"), undefined);
});

test("formattazione italiana", () => {
  assert.equal(n(formatEuro(190)), "1,90 €");
  assert.equal(n(formatEuro(19000)), "190 €");
  assert.equal(n(formatEuro(600)), "6 €");
  assert.equal(n(conIva(130)), "1,30 € + IVA");
  assert.equal(n(conIva(prezzoDa(trovaModello("rotante")!))), "1,90 € + IVA");
});
