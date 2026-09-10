#!/usr/bin/env node
/**
 * 🔦 LATARNIK — pilnuje, żeby te same dane nie rozjechały się między miejscami,
 * w których je trzymamy.
 *
 * Po co: godziny otwarcia Café Martens żyją dziś w SZEŚCIU miejscach — w danych
 * strukturalnych JSON-LD, w bloku <noscript>, w trzech tablicach językowych
 * stopki (DE/PL/EN) i w Google Business Profile. Sześć kopii jednej prawdy
 * ZAWSZE w końcu się rozjeżdża, a rozjazd między stroną a mapą szkodzi
 * widoczności bardziej niż brak danych — Google traktuje niespójność jako
 * sygnał, że wpisowi nie można ufać.
 *
 * ⚠️ LATARNIK NIC NIE POPRAWIA SAM. Świeci na rozbieżność i mówi, w którym
 * pliku ją naprawić. Skrypt, który sam „naprawia" godziny otwarcia, potrafi
 * po cichu wpisać do sieci nieprawdę o tym, kiedy lokal jest czynny — a to
 * kosztuje realnych ludzi stojących pod zamkniętymi drzwiami.
 *
 * ⚠️ GOOGLE BUSINESS PROFILE CZYTAMY Z DEKLARACJI CZŁOWIEKA (latarnik-gbp.json),
 * nie ze scrapowania. Wpis GBP jest za logowaniem właściciela; udawanie, że
 * skrypt go „sprawdził", byłoby atrapą. Dopóki nikt nie potwierdzi, Latarnik
 * mówi wprost, że nie ma czego porównać.
 *
 * Uruchomienie:  npm run latarnik
 * Kod wyjścia:   0 = spójne, 1 = rozbieżności (nadaje się do CI / pre-commit)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const KORZEN = path.dirname(fileURLToPath(import.meta.url));
const P_INDEX = path.join(KORZEN, 'index.html');
const P_STOPKA = path.join(KORZEN, 'src', 'components', 'ContactFooter.tsx');
const P_GBP = path.join(KORZEN, 'latarnik-gbp.json');

/** Kolejność kanoniczna. Indeks 0 = poniedziałek — jeden porządek dla wszystkich źródeł. */
const DNI = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Nazwy dni w językach stopki → indeks kanoniczny. */
const DNI_JEZYKI = {
    Montag: 0, Dienstag: 1, Mittwoch: 2, Donnerstag: 3, Freitag: 4, Samstag: 5, Sonntag: 6,
    'Poniedziałek': 0, Wtorek: 1, 'Środa': 2, Czwartek: 3, 'Piątek': 4, Sobota: 5, Niedziela: 6,
    Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
};

/**
 * Sprowadza zapis godzin do jednej postaci: "09:00-17:00" albo null (nieczynne).
 *
 * ⚠️ Musi rozumieć WSZYSTKIE warianty, które realnie występują w kodzie, bo
 * inaczej zgłosi fałszywy rozjazd: "09:00 - 17:00" (DE/PL), "09:00 AM - 05:00 PM"
 * (EN), myślnik zwykły i półpauzę, oraz trzy różne słowa na „zamknięte".
 *
 * Zwraca undefined, gdy NIE UMIE odczytać — to co innego niż „nieczynne"
 * i musi trafić do uwag, a nie zostać po cichu uznane za zamknięty dzień.
 */
function normalizujGodziny(tekst) {
    if (tekst === null || tekst === undefined) return null;
    const t = String(tekst).trim();
    if (/geschlossen|zamkni|closed|nieczynne/i.test(t)) return null;

    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return undefined;

    const na24 = (g, poludnie) => {
        let h = parseInt(g, 10);
        if (poludnie) {
            const p = poludnie.toUpperCase();
            if (p === 'PM' && h !== 12) h += 12;
            if (p === 'AM' && h === 12) h = 0;
        }
        return String(h).padStart(2, '0');
    };
    return `${na24(m[1], m[3])}:${m[2]}-${na24(m[4], m[6])}:${m[5]}`;
}

/** Telefon do samych cyfr międzynarodowo: "02823 4191522" == "+49 2823 4191522". */
function normalizujTelefon(tekst) {
    if (!tekst) return null;
    let d = String(tekst).replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    else if (d.startsWith('0')) d = '49' + d.slice(1); // zero wiodące = numer krajowy DE
    return d || null;
}

/** Wczytuje plik albo zwraca null — brak pliku ma być komunikatem, nie wyjątkiem. */
function czytaj(p) {
    try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// ŹRÓDŁA
// ─────────────────────────────────────────────────────────────────────────────

/** 1. Dane strukturalne — jedyne, co z tej strony czyta mapa. Punkt odniesienia. */
function zJsonLd(html) {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!m) return { blad: 'brak bloku application/ld+json w index.html' };
    let j;
    try {
        j = JSON.parse(m[1]);
    } catch (e) {
        return { blad: `JSON-LD się nie parsuje (${e.message}) — Google pomija go po cichu` };
    }
    const godziny = Array(7).fill(null);
    for (const o of j.openingHoursSpecification ?? []) {
        const dni = Array.isArray(o.dayOfWeek) ? o.dayOfWeek : [o.dayOfWeek];
        for (const d of dni) {
            const i = DNI.indexOf(String(d).replace(/^https?:\/\/schema\.org\//, ''));
            if (i >= 0) godziny[i] = `${o.opens}-${o.closes}`;
        }
    }
    return {
        godziny,
        telefon: normalizujTelefon(j.telephone),
        email: j.email ?? null,
        ulica: j.address?.streetAddress ?? null,
        kod: j.address?.postalCode ?? null,
        miasto: j.address?.addressLocality ?? null,
    };
}

/** 2. Blok <noscript> — to, co widzi robot bez wykonania JS. */
function zNoscript(html) {
    const b = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
    if (!b) return { blad: 'brak bloku <noscript> w index.html' };
    const godziny = Array(7).fill(undefined);
    for (const li of b[1].matchAll(/<li>\s*([^:<]+?)\s*:\s*([^<]+)<\/li>/g)) {
        const i = DNI_JEZYKI[li[1].trim()];
        if (i !== undefined) godziny[i] = normalizujGodziny(li[2]);
    }
    const tel = b[1].match(/tel:([+\d\s]+)/);
    return {
        godziny,
        telefon: tel ? normalizujTelefon(tel[1]) : null,
        email: (b[1].match(/mailto:([^"']+)/) || [])[1] ?? null,
        ulica: /Markt 12/.test(b[1]) ? 'Markt 12' : null,
        kod: (b[1].match(/\b(\d{5})\b/) || [])[1] ?? null,
        miasto: /Goch/.test(b[1]) ? 'Goch' : null,
    };
}

/** 3. Stopka aplikacji — trzy tablice językowe, każda to osobna kopia prawdy. */
function zeStopki(tsx) {
    const wynik = {};
    for (const jezyk of ['De', 'Pl', 'En']) {
        const m = tsx.match(new RegExp(`const weekdays${jezyk}\\s*=\\s*\\[([\\s\\S]*?)\\];`));
        if (!m) { wynik[jezyk] = { blad: `nie znalazłem tablicy weekdays${jezyk}` }; continue; }
        const godziny = Array(7).fill(undefined);
        for (const w of m[1].matchAll(/days:\s*"([^"]+)"\s*,\s*hours:\s*"([^"]+)"/g)) {
            const i = DNI_JEZYKI[w[1].trim()];
            if (i !== undefined) godziny[i] = normalizujGodziny(w[2]);
        }
        wynik[jezyk] = { godziny };
    }
    wynik.telefon = normalizujTelefon((tsx.match(/tel:([+\d]+)/) || [])[1]);
    wynik.email = (tsx.match(/mailto:([^"']+)/) || [])[1] ?? null;
    wynik.ulica = /Markt 12/.test(tsx) ? 'Markt 12' : null;
    wynik.kod = (tsx.match(/\b(47574)\b/) || [])[1] ?? null;
    wynik.miasto = /Goch/.test(tsx) ? 'Goch' : null;
    return wynik;
}

// ─────────────────────────────────────────────────────────────────────────────
// PORÓWNANIE
// ─────────────────────────────────────────────────────────────────────────────

const pokaz = (g) => (g === null ? 'nieczynne' : g === undefined ? '??? (nie umiem odczytać)' : g);

function main() {
    const html = czytaj(P_INDEX);
    const tsx = czytaj(P_STOPKA);
    const rozjazdy = [];
    const uwagi = [];

    if (!html) { console.error('✖ Nie ma index.html — Latarnik nie ma czego pilnować.'); process.exit(1); }
    if (!tsx) { console.error('✖ Nie ma src/components/ContactFooter.tsx.'); process.exit(1); }

    const ld = zJsonLd(html);
    const ns = zNoscript(html);
    const st = zeStopki(tsx);

    for (const [nazwa, zrodlo] of [['JSON-LD', ld], ['<noscript>', ns]]) {
        if (zrodlo.blad) {
            rozjazdy.push({ co: `${nazwa} w index.html`, szczegol: zrodlo.blad, gdzie: 'index.html' });
        }
    }

    const odniesienie = ld.godziny;

    // ── Godziny: wszystko mierzymy do JSON-LD, bo to jego czyta mapa ──
    if (odniesienie) {
        const kandydaci = [
            ['<noscript> (index.html)', ns.godziny, 'index.html'],
            ['stopka DE (ContactFooter.tsx)', st.De?.godziny, 'src/components/ContactFooter.tsx'],
            ['stopka PL (ContactFooter.tsx)', st.Pl?.godziny, 'src/components/ContactFooter.tsx'],
            ['stopka EN (ContactFooter.tsx)', st.En?.godziny, 'src/components/ContactFooter.tsx'],
        ];
        for (const [nazwa, godziny, plik] of kandydaci) {
            if (!godziny) continue;
            for (let i = 0; i < 7; i++) {
                if (godziny[i] === undefined) {
                    uwagi.push(`${nazwa}: ${DNI[i]} — nie umiem odczytać zapisu godzin. Sprawdź ręcznie.`);
                } else if (godziny[i] !== odniesienie[i]) {
                    rozjazdy.push({
                        co: `${DNI[i]}: ${nazwa} mówi co innego niż dane strukturalne`,
                        szczegol: `JSON-LD: ${pokaz(odniesienie[i])}   ·   ${nazwa}: ${pokaz(godziny[i])}`,
                        gdzie: plik,
                    });
                }
            }
        }
    }

    // ── Telefon, e-mail, adres ──
    const S = 'src/components/ContactFooter.tsx';
    const pola = [
        ['telefon', ld.telefon, [['<noscript>', ns.telefon, 'index.html'], ['stopka', st.telefon, S]]],
        ['e-mail', ld.email, [['<noscript>', ns.email, 'index.html'], ['stopka', st.email, S]]],
        ['ulica', ld.ulica, [['<noscript>', ns.ulica, 'index.html'], ['stopka', st.ulica, S]]],
        ['kod pocztowy', ld.kod, [['<noscript>', ns.kod, 'index.html'], ['stopka', st.kod, S]]],
        ['miasto', ld.miasto, [['<noscript>', ns.miasto, 'index.html'], ['stopka', st.miasto, S]]],
    ];
    for (const [nazwa, wzorzec, gdzie] of pola) {
        for (const [zrodlo, wartosc, plik] of gdzie) {
            if (wartosc === null || wartosc === undefined) {
                uwagi.push(`${nazwa}: ${zrodlo} w ogóle go nie podaje.`);
                continue;
            }
            if (String(wartosc) !== String(wzorzec)) {
                rozjazdy.push({
                    co: `${nazwa}: ${zrodlo} mówi co innego niż dane strukturalne`,
                    szczegol: `JSON-LD: ${wzorzec}   ·   ${zrodlo}: ${wartosc}`,
                    gdzie: plik,
                });
            }
        }
    }

    // ── Google Business Profile: TYLKO z deklaracji człowieka ──
    const gbpRaw = czytaj(P_GBP);
    let gbp = null;
    if (gbpRaw) {
        try { gbp = JSON.parse(gbpRaw); } catch { uwagi.push('latarnik-gbp.json się nie parsuje.'); }
    }

    console.log('');
    console.log('🔦 LATARNIK — spójność danych Café Martens');
    console.log('   Świeci na rozbieżność. Niczego nie poprawia sam.');
    console.log('');
    console.log('   Godziny wg danych strukturalnych (to czyta mapa):');
    for (let i = 0; i < 7; i++) console.log(`     ${DNI[i].padEnd(10)} ${pokaz(odniesienie?.[i])}`);
    console.log('');

    if (!gbp || !gbp.potwierdzonoDnia) {
        console.log('   ⚠️  GOOGLE BUSINESS PROFILE: nikt nie potwierdził, co tam stoi.');
        console.log('       Wpis GBP jest za logowaniem właściciela — żaden skrypt go nie odczyta.');
        console.log('       Otwórz wizytówkę, przepisz stan do latarnik-gbp.json i wpisz datę.');
        console.log('       Do tego czasu Latarnik NIE MOŻE powiedzieć, czy strona zgadza się z mapą.');
    } else {
        const dni = Math.floor((Date.now() - Date.parse(gbp.potwierdzonoDnia)) / 86400000);
        console.log(`   GBP potwierdzony ${gbp.potwierdzonoDnia} (${dni} dni temu) przez: ${gbp.potwierdzil ?? '?'}`);
        if (dni > 90) uwagi.push(`Potwierdzenie GBP ma ${dni} dni — starsze niż 90. Zajrzyj do wizytówki jeszcze raz.`);
        for (let i = 0; i < 7; i++) {
            const g = normalizujGodziny(gbp.godziny?.[DNI[i]] ?? null);
            if (g !== odniesienie?.[i]) {
                rozjazdy.push({
                    co: `${DNI[i]}: Google Business Profile mówi co innego niż strona`,
                    szczegol: `strona: ${pokaz(odniesienie?.[i])}   ·   GBP: ${pokaz(g)}`,
                    gdzie: 'wizytówka Google (poprawia człowiek)',
                });
            }
        }
        const telG = normalizujTelefon(gbp.telefon);
        if (telG && telG !== ld.telefon) {
            rozjazdy.push({
                co: 'telefon: GBP mówi co innego niż strona',
                szczegol: `strona: ${ld.telefon}   ·   GBP: ${telG}`,
                gdzie: 'wizytówka Google',
            });
        }
        if (gbp.www && !/caffe-martens\.com/.test(gbp.www)) {
            rozjazdy.push({
                co: 'GBP nie wskazuje na własną domenę',
                szczegol: `GBP prowadzi do: ${gbp.www}`,
                gdzie: 'wizytówka Google',
            });
        }
        for (const d of gbp.duplikaty ?? []) {
            rozjazdy.push({
                co: `Duplikat wizytówki pod tym samym adresem: „${d.nazwa}"`,
                szczegol: `${d.uwaga ?? ''} Dwa wpisy pod jednym adresem dzielą sygnał na pół — `
                    + 'scalenie w GBP daje więcej niż cokolwiek w kodzie.',
                gdzie: 'wizytówka Google (scala człowiek)',
            });
        }
    }

    console.log('');
    if (rozjazdy.length === 0) {
        console.log('   ✅ ROZJAZDÓW BRAK. Wszystkie sprawdzone miejsca mówią to samo.');
    } else {
        console.log(`   ✖ ROZJAZDÓW: ${rozjazdy.length}`);
        for (const r of rozjazdy) {
            console.log('');
            console.log(`     • ${r.co}`);
            console.log(`       ${r.szczegol}`);
            console.log(`       → popraw w: ${r.gdzie}`);
        }
    }
    if (uwagi.length) {
        console.log('');
        console.log('   Uwagi:');
        for (const u of uwagi) console.log(`     · ${u}`);
    }

    // ── Gotowiec do wklejenia w GBP — tego skrypt za Ciebie nie zrobi ──
    console.log('');
    console.log('   ── Godziny do przepisania w wizytówce Google ──');
    for (let i = 0; i < 7; i++) {
        const g = odniesienie?.[i];
        console.log(`     ${DNI[i].padEnd(10)} ${g === null ? 'Zamknięte' : (g ?? '?').replace('-', ' – ')}`);
    }
    console.log('');

    process.exit(rozjazdy.length ? 1 : 0);
}

main();
