# LightLearn AI pentru calculator (Windows, Linux, macOS)

Aplicația pentru calculator e construită cu **Electron** (aceeași tehnologie ca Visual Studio Code, Discord sau Slack).

## Cum funcționează
- La pornire deschide aplicația online, `https://www.lightlearnai.com/app/`: cont, sincronizare între dispozitive, planuri, Lumi.
- **Fără internet** (sau dacă site-ul nu e încă publicat) deschide automat **copia offline** inclusă: toate cele 100 de lecții, exercițiile, recapitularea și atelierul de prompturi. Progresul offline se păstrează pe acel calculator.
- Din meniul **LightLearn AI** treci oricând între versiunea online și cea offline.
- Securitate: aplicația nu are acces la fișierele calculatorului, nu poate rula programe și refuză camera, microfonul și locația. Orice link spre alt site se deschide în browserul obișnuit. În fereastra aplicației se pot deschide doar paginile LightLearn AI și cele de conectare și plată (Google, Facebook, Apple, Steam, Stripe).

## Instalare

**Windows (10 și 11)**
- Instalatorul complet (`LightLearnAI-Windows-Setup.exe`) se construiește automat pe GitHub (vezi mai jos).
- Varianta portabilă (`LightLearnAI-1.0.0-Windows-portable.zip`): o dezarhivezi și pornești `LightLearn AI.exe`, fără instalare.
- La prima pornire, Windows poate afișa „Windows a protejat computerul”: apasă **Mai multe informații → Rulează oricum**. Mesajul dispare după ce aplicația e semnată digital (vezi mai jos).

**Linux**
- **AppImage** (orice distribuție): `chmod +x LightLearnAI-*.AppImage` și apoi dublu-clic sau `./LightLearnAI-*.AppImage`.
- **.deb** (Ubuntu, Debian, Mint, Kali): `sudo apt install ./LightLearnAI-*.deb`. Apare în meniul de aplicații, la Educație.

**Telefoane cu Linux** (PinePhone, PinePhone Pro, Librem 5, Mobian, postmarketOS cu Phosh sau Plasma Mobile, Droidian), procesor ARM64:
- **AppImage ARM64:** `chmod +x LightLearnAI-*-arm64.AppImage` și pornește-l. Pe ecrane mici, aplicația se deschide automat pe tot ecranul.
- **.deb ARM64** (Mobian, PureOS, Droidian): `sudo apt install ./LightLearnAI-*-arm64.deb`.
- **Ubuntu Touch și Sailfish OS** nu folosesc aceste pachete: acolo aplicația se deschide în browser și se adaugă pe ecranul principal.

**Windows Phone / Windows 10 Mobile:** Microsoft a oprit suportul în 2019, deci nu există o aplicație separată; se poate folosi versiunea din browser.

**macOS:** se construiește tot pe GitHub (`.dmg`). Ca să pornească fără avertismente, are nevoie de cont Apple Developer (99 $/an) pentru semnare și notarizare.

## Construirea instalatoarelor (automat, gratuit, pe GitHub)
1. Creează un repository pe GitHub, de exemplu `lightlearn-ai-desktop`, și urcă acest folder (fără `node_modules` și `dist`).
2. În `package.json`, la `repository`, pune adresa lui.
3. **Actions → Desktop builds → Run workflow** sau creează un tag: `git tag v1.0.0 && git push --tags`.
4. În câteva minute ai, la **Releases**, instalatoarele pentru Windows (`.exe`), Linux pe calculator și pe telefon (`.AppImage`, `.deb`, x64 și ARM64) și macOS (`.dmg`).
5. În `firebase.json` (pachetul site-ului) înlocuiește `CONTUL-TAU` cu numele contului tău GitHub, iar în `public/firebase-config.js` pune `LLAI_DOWNLOADS_READY = true`.
   Butoanele și codurile QR din secțiunea **Descarcă** folosesc linkuri fixe (`/download/windows`, `/download/linux`, `/download/linux-phone` …) care trimit mereu la cea mai nouă versiune. Codurile QR nu trebuie schimbate niciodată.

## Pe calculatorul tău (pentru dezvoltare)
```bash
npm install
npm start                 # pornește aplicația
npm run dist:linux        # AppImage + .deb
npm run dist:win          # instalator Windows (pe Windows sau cu Wine)
```

## Când modifici aplicația
Copia offline se reconstruiește din sursele aplicației:
```bash
cd ../1-aplicatie/surse
python3 -c "import build; build.build('backend-local.js', '../../desktop/app/offline/index.html')"
```
Apoi crești `version` în `package.json` și creezi un tag nou: utilizatorii descarcă noua versiune de pe site.

## Semnarea digitală (recomandat înainte de lansarea publică)
- **Windows:** un certificat de semnare a codului elimină avertismentul SmartScreen. Variante: Azure Trusted Signing (cel mai ieftin, lunar) sau un certificat de la un furnizor (Sectigo, DigiCert etc.).
- **macOS:** cont Apple Developer și notarizare.
