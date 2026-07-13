# Korkkis – huonekalujen jako v2

## Päivitys
1. Kopioi nykyisestä `config.js`-tiedostostasi Supabase URL ja publishable/anon key tämän paketin `config.js`:ään.
2. Avaa `setup_v2.sql`, korvaa kolme `VAIHDA_..._TUNNISTE`-kohtaa samoilla Kallen, Leilan ja adminin tunnisteilla, joita aiot käyttää linkeissä.
3. Suorita koko SQL Supabasen SQL Editorissa. **Se poistaa aiemmat testivastaukset.**
4. Lataa kaikki tämän kansion tiedostot ja `images`-kansio GitHub-repositoryn juureen.
5. Odota GitHub Pagesin julkaisua 1–3 minuuttia.

## Linkit
- `https://KÄYTTÄJÄ.github.io/REPO/?token=KALLEN_TUNNISTE`
- `https://KÄYTTÄJÄ.github.io/REPO/?token=LEILAN_TUNNISTE`
- `https://KÄYTTÄJÄ.github.io/REPO/admin.html?token=ADMIN_TUNNISTE`

## Ominaisuudet
- automaattinen tallennus
- oma yhteenveto ja eteneminen
- kuvien suurennus
- adminin tilastot, suodattimet ja tulostus
- lopullinen omistaja/päätös
- huonekalun lisääminen, muokkaaminen, kuvan vaihtaminen ja poistaminen

Administa lisättävä kuva tallennetaan tietokantaan. Pidä kuva alle 4 Mt; puhelimen alkuperäinen kuva kannattaa tarvittaessa pienentää ensin.
