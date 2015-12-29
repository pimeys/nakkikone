# Nakkikone

Tästä tulee superhieno uusi nakkikone teknoklubeille.

## Kehitysympäristön asennus

1. Forkkaa ja kloonaa projekti itsellesi (lue Githubin ohjeet, jos et tiedä
   miten)
2. Asenna rvm kotihakemistoosi ```curl -L https://get.rvm.io | bash -s stable --ruby```, 
   skripti tulostaa ohjeet konfigurointiin
3. Kun rvm toimii, asenna nakkikoneen käyttämä ruby ```rvm install 1.9.3-p194```
4. Asenna MySQL
5. Kopioi malliasetukset tietokantayhteyttä varten ```cp config/database.yml.sample config/database.yml``` ja muokkaa tarvittaessa
6. Asenna projektin käyttämät kirjastot ```bundle install```
7. Käynnistä kehityspalvelin ```rails s``` ja avaa selaimella osoite ``localhost:3000```

## Kontribuointi

Tee tästä projektista Githubissa oma forkki ja luo tekemääsi ominaisuutta varten
oma branch. Kun koet olevasi valmis, lähetä minulle pull request.

## Testaaminen

Kirjoitetaan mahdollisimman kattavat yksikkötestit. Noottia tulee, jos testit
puuttuvat.

Projekti käyttää CI-ohjelmana travisia, jonka voi ja joka myös kannattaa
virittää omaan forkiin käyttöön. Pitäisi onnistua helposti osoitteessa
http://travis-ci.org.

Masterin travis build löytyy täältä:

http://travis-ci.org/#!/pimeys/nakkikone

Testien tila:

[![Testien tila](https://secure.travis-ci.org/pimeys/nakkikone.png?branch=master)](http://travis-ci.org/pimeys/nakkikone)

## Deployaaminen

Nakkikoneen deploymaamiseen on kaytossa capistrano. Konfiguroi `entropy-host` ssh-alias että deployment koneelta on yhteys hostille ja aja rootissa `cap deploy` deployaaksesi uusin `master`in versio liveksi. 