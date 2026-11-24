import { useRef, useState } from "react";
import {
  CONSEGNA, CONTATTI, LIMITI, MODELLI, OLTRE_MASSIMO, QUANTITA, SITO,
  calcolaRiepilogo, prezzoTesto, formatEuro, prezzoDa,
  type ModelloId, type Quantita,
} from "../shared/config.ts";
import { Illustrazione } from "./illustrations.tsx";

const FRECCIA = (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const FOTO = [
  "[FOTO: portachiavi con logo, in mano]",
  "[FOTO: tanti portachiavi appena stampati]",
  "[FOTO: portachiavi attaccato a un mazzo di chiavi]",
];

const PASSI = [
  { t: "Carichi il logo e ordini", d: "PDF, PNG o vettoriale: va bene tutto. Scegli quantità e colori." },
  { t: "Approvi la bozza 3D", d: `Arriva ${CONSEGNA.bozza}. Senza il tuo ok non parte nulla.` },
  { t: "Ricevi i portachiavi", d: `In ${CONSEGNA.giorniLavorativi} giorni lavorativi. Il modello resta in archivio: il riordino riparte subito.` },
];

const PUNTI = [
  { t: "Qualsiasi forma", d: "Il portachiavi segue il contorno esatto del tuo logo, anche con dettagli e rilievi." },
  { t: "Pronti in pochi giorni", d: `Senza stampo si parte il giorno in cui approvi la bozza: consegna in ${CONSEGNA.giorniLavorativi} giorni lavorativi.` },
  { t: "Due colori nel pezzo", d: "Il logo è stampato in rilievo con un colore diverso dalla base, non dipinto né adesivo: non si consuma." },
  { t: "Leggero e resistente", d: "In PLA, una plastica ottenuta da fonti vegetali: pochi grammi in tasca, robusto nell'uso di tutti i giorni." },
];

const vaiAOrdine = () => document.getElementById("ordina")?.scrollIntoView({ behavior: "smooth" });

function estensione(nome: string) {
  const i = nome.lastIndexOf(".");
  return i < 0 ? "" : nome.slice(i + 1).toLowerCase();
}

/** Controllo lato browser di un file; lo stesso controllo si rifà sul server (passo 2). */
function erroreFile(f: File | undefined, obbligatorio: boolean): string {
  if (!f) return obbligatorio ? "Carica il logo." : "";
  if (!LIMITI.logoEstensioni.includes(estensione(f.name)))
    return `Formato non accettato. Usa: ${LIMITI.logoEstensioni.filter((e) => e !== "jpeg").join(", ").toUpperCase()}.`;
  if (f.size > LIMITI.logoMaxMB * 1024 * 1024) return `Il file supera ${LIMITI.logoMaxMB} MB.`;
  return "";
}

export default function App() {
  const [qta, setQta] = useState<Quantita>(200);
  const [modelloId, setModelloId] = useState<ModelloId>("sagoma");
  const [erroreLogo, setErroreLogo] = useState("");
  const [erroreAllegati, setErroreAllegati] = useState("");
  const [esito, setEsito] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const sagoma = MODELLI[0];
  const hero = calcolaRiepilogo(sagoma.id, qta);
  const r = calcolaRiepilogo(modelloId, qta);

  const apriProgetto = () => dialogRef.current?.showModal();

  // PASSO 1: l'invio vero (database, file, email) arriva al passo 2.
  const invio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEsito("Anteprima: l'invio degli ordini non è ancora attivo.");
  };

  return (
    <div>
      <div className="hero">
        <header className="wrap top">
          <div className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <div className="logo-testo">
              <span className="logo-nome">{SITO.nome}</span>
              <span className="logo-sub">{SITO.poweredBy}</span>
            </div>
          </div>
          <a className="btn" href="#ordina">Ordina ora</a>
        </header>

        <section className="wrap hero-corpo">
          <span className="pill">Stampati in 3D in Italia · da {QUANTITA[0]} pezzi</span>
          <h1>Il tuo logo diventa un portachiavi.</h1>
          <p className="hero-lead">
            Con la sagoma del tuo marchio, consegnato in {CONSEGNA.giorniLavorativi} giorni lavorativi. Prima di produrre ti mandiamo la bozza 3D, gratis.
          </p>

          <span className="hero-chiedi">Quanti te ne servono? Tocca una quantità.</span>
          <div className="tiers">
            {QUANTITA.map((q) => {
              const x = calcolaRiepilogo(sagoma.id, q);
              return (
                <button key={q} type="button" className="tier-hero" aria-pressed={q === qta} onClick={() => setQta(q)}>
                  <span className="t-riga">{q} pezzi · {formatEuro(x.unitarioCent)} l'uno</span>
                  <span className="t-tot">{formatEuro(x.merceCent)}</span>
                  <span className="t-sped">
                    {x.spedizioneCent > 0 ? `+ ${formatEuro(x.spedizioneCent)} di spedizione` : "spedizione inclusa"}
                  </span>
                </button>
              );
            })}
          </div>
          <a className="btn btn-rosa" href="#ordina">
            <span>Ordina {hero.quantita} portachiavi a {prezzoTesto(hero.merceCent)}</span>
            {FRECCIA}
          </a>
          <span className="hero-nota">Anello incluso · bozza 3D gratuita</span>
          <div className="hero-oltre">
            <strong>{OLTRE_MASSIMO}</strong>
            <button type="button" className="btn btn-bordo-rosa" onClick={apriProgetto}>Chiedi un preventivo dedicato</button>
          </div>
        </section>
      </div>

      <section className="wrap foto" aria-label="Foto dei portachiavi">
        {FOTO.map((t) => (
          <div key={t} className="foto-box">{t}</div>
        ))}
      </section>

      <section className="wrap sezione">
        <h2 className="titolo">Come lavora la fabbrica</h2>
        <div className="passi">
          {PASSI.map((p, i) => (
            <div key={p.t} className="passo">
              <span className="passo-n">{i + 1}</span>
              <strong>{p.t}</strong>
              <span className="t">{p.d}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 56 }}>
        <div className="perche">
          <div>
            <h2>Perché stampati in 3D</h2>
            <p>Usiamo la stampa 3D a filamento (FDM): la macchina costruisce il portachiavi strato dopo strato, partendo direttamente dal file del tuo logo. Niente stampi, niente attrezzature da preparare.</p>
          </div>
          <div className="punti">
            {PUNTI.map((p) => (
              <div key={p.t} className="punto">
                <strong>{p.t}</strong>
                <span>{p.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sezione" style={{ paddingTop: 0, paddingBottom: 64 }}>
        <h2 className="titolo">Quattro modelli, un solo logo: il tuo</h2>
        <div className="modelli">
          {MODELLI.map((m, i) => (
            <button
              key={m.id}
              type="button"
              className="card"
              data-primo={i === 0}
              aria-pressed={m.id === modelloId}
              onClick={() => { setModelloId(m.id); vaiAOrdine(); }}
            >
              <span className="card-img"><Illustrazione id={m.id} /></span>
              <strong>{m.nome}</strong>
              <span className="d">{m.descrizione}</span>
              <span className="prezzo">da {prezzoTesto(prezzoDa(m))}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="progetto" className="wrap" style={{ paddingBottom: 64 }}>
        <div className="progetto">
          <div className="progetto-testo">
            <h2>Non hai trovato quello che cercavi?</h2>
            <p>Raccontaci il tuo progetto e lo realizzeremo insieme.</p>
          </div>
          <button type="button" className="btn btn-scuro" onClick={apriProgetto}>Raccontaci il tuo progetto {FRECCIA}</button>
        </div>
      </section>

      <section id="ordina" className="ordina">
        <div className="wrap ordina-griglia">
          <form className="form" onSubmit={invio} noValidate={false}>
            <h2>Metti in produzione i tuoi portachiavi</h2>

            <div className="campo">
              <label htmlFor="o-modello">Modello</label>
              <select id="o-modello" name="modello" value={modelloId} onChange={(e) => setModelloId(e.target.value as ModelloId)}>
                {MODELLI.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="o-logo">Il tuo logo</label>
              <input
                id="o-logo" name="logo" type="file" required
                accept={LIMITI.logoEstensioni.map((e) => "." + e).join(",")}
                onChange={(e) => setErroreLogo(erroreFile(e.target.files?.[0], true))}
              />
              <span className="aiuto">PDF, PNG, JPG, SVG o AI · massimo {LIMITI.logoMaxMB} MB</span>
              {erroreLogo && <span className="errore" role="alert">{erroreLogo}</span>}
            </div>

            <div className="campo">
              <label htmlFor="o-colori">Colori (fino a {LIMITI.coloriMax})</label>
              <input id="o-colori" name="colori" type="text" placeholder="[COLORI DISPONIBILI]" />
            </div>

            <div className="griglia2">
              <div className="campo"><label htmlFor="o-rs">Ragione sociale</label><input id="o-rs" name="ragioneSociale" type="text" required autoComplete="organization" /></div>
              <div className="campo"><label htmlFor="o-piva">Partita IVA</label><input id="o-piva" name="partitaIva" type="text" required inputMode="numeric" /></div>
              <div className="campo"><label htmlFor="o-sdi">Codice SDI o PEC</label><input id="o-sdi" name="sdiPec" type="text" required /></div>
              <div className="campo"><label htmlFor="o-mail">Email</label><input id="o-mail" name="email" type="email" required autoComplete="email" /></div>
              <div className="campo"><label htmlFor="o-tel">Telefono</label><input id="o-tel" name="telefono" type="tel" required autoComplete="tel" /></div>
            </div>

            <div className="campo">
              <label htmlFor="o-ind">Indirizzo di spedizione</label>
              <textarea id="o-ind" name="indirizzo" required autoComplete="street-address" />
            </div>
            <div className="campo">
              <label htmlFor="o-note">Note</label>
              <textarea id="o-note" name="note" />
            </div>

            <label className="consenso">
              <input type="checkbox" name="privacy" required />
              <span>Ho letto l'<a href="/privacy" target="_blank" rel="noopener">informativa privacy</a> e acconsento al trattamento dei dati per gestire l'ordine.</span>
            </label>

            <button type="submit" className="btn btn-scuro">Invia l'ordine</button>
            {esito && <p className="esito" role="status">{esito}</p>}
          </form>

          <aside className="riepilogo" aria-label="Riepilogo ordine">
            <span className="tit">Il tuo ordine</span>
            <div className="pills">
              {QUANTITA.map((q) => (
                <button key={q} type="button" className="tier-pill" aria-pressed={q === qta} onClick={() => setQta(q)}>{q}</button>
              ))}
            </div>
            <div className="riga"><span>{r.quantita} portachiavi {r.modello.nomeRiepilogo}</span><span>{formatEuro(r.unitarioCent)} l'uno</span></div>
            <div className="riga"><span>Bozza 3D</span><span>gratuita</span></div>
            <div className="riga"><span>Spedizione</span><span>{r.spedizioneCent > 0 ? formatEuro(r.spedizioneCent) : "inclusa"}</span></div>
            <div className="totale"><span className="l">Totale</span><span className="v">{prezzoTesto(r.totaleCent)}</span></div>
            <span className="nota">La produzione parte solo dopo che hai approvato la bozza. Consegna in {CONSEGNA.testo}.</span>
          </aside>
        </div>
      </section>

      <dialog ref={dialogRef} className="dlg" aria-labelledby="p-titolo">
        <form className="dlg-corpo" onSubmit={(e) => { e.preventDefault(); setEsito("Anteprima: l'invio delle richieste non è ancora attivo."); dialogRef.current?.close(); }}>
          <div className="dlg-testa">
            <h2 id="p-titolo">Raccontaci il tuo progetto</h2>
            <button type="button" className="dlg-chiudi" onClick={() => dialogRef.current?.close()}>Chiudi</button>
          </div>
          <div className="campo"><label htmlFor="p-nome">Nome</label><input id="p-nome" name="nome" type="text" required autoComplete="name" /></div>
          <div className="campo"><label htmlFor="p-az">Azienda</label><input id="p-az" name="azienda" type="text" required autoComplete="organization" /></div>
          <div className="griglia2">
            <div className="campo"><label htmlFor="p-mail">Email</label><input id="p-mail" name="email" type="email" required autoComplete="email" /></div>
            <div className="campo"><label htmlFor="p-tel">Telefono</label><input id="p-tel" name="telefono" type="tel" required autoComplete="tel" /></div>
          </div>
          <div className="campo"><label htmlFor="p-desc">Descrizione del progetto</label><textarea id="p-desc" name="descrizione" required /></div>
          <div className="campo"><label htmlFor="p-qta">Quantità indicativa</label><input id="p-qta" name="quantita" type="number" min="1" inputMode="numeric" required /></div>
          <div className="campo">
            <label htmlFor="p-all">Allegati (facoltativi)</label>
            <input
              id="p-all" name="allegati" type="file" multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > LIMITI.allegatiProgettoMax) return setErroreAllegati(`Massimo ${LIMITI.allegatiProgettoMax} file.`);
                const grande = files.find((f) => f.size > LIMITI.allegatoMaxMB * 1024 * 1024);
                setErroreAllegati(grande ? `"${grande.name}" supera ${LIMITI.allegatoMaxMB} MB.` : "");
              }}
            />
            <span className="aiuto">Fino a {LIMITI.allegatiProgettoMax} file, {LIMITI.allegatoMaxMB} MB ciascuno</span>
            {erroreAllegati && <span className="errore" role="alert">{erroreAllegati}</span>}
          </div>
          <label className="consenso">
            <input type="checkbox" name="privacy" required />
            <span>Ho letto l'<a href="/privacy" target="_blank" rel="noopener">informativa privacy</a> e acconsento al trattamento dei dati per rispondere alla richiesta.</span>
          </label>
          <button type="submit" className="btn btn-scuro">Invia la richiesta</button>
        </form>
      </dialog>

      <footer>
        <div className="wrap foot">
          <span>{SITO.nome} è un progetto Vir3D · {CONTATTI.citta} · {CONTATTI.partitaIva}</span>
          <span>{CONTATTI.emailTelefono}</span>
          <span className="foot-link"><a href="/privacy">Privacy</a><a href="/cookie">Cookie</a></span>
        </div>
      </footer>
    </div>
  );
}
