Creează un REST API pentru a lucra cu o colecție de contacte. Pentru a testa acest API, folosește Postman.

Citește cu atenție fișierul README din șablonul clonat, care descrie mecanismul de trimitere a temelor, după care poți trece și la îndeplinirea temei.

- Pasul 1
Creează branch-ul hw02-express din master.

Instalează toate modulele folosind comanda:

npm i
Următoarele module sunt deja în proiect:

express
morgan
cors

- Pasul 2
În app.js, un server web în Express, sunt adăugate modulele morgan și cors. Începe să configurezi rutarea pentru a lucra cu o colecția contacte.

REST API trebuie să suporte următoarele rute.

@ GET /api/contacts
Nu primește nimic.
Apelează funcția listContacts pentru a lucra cu fișierul json contacts.json.
Returnează o matrice cu toate contactele în format json cu status code 200.

@ GET /api/contacts/:id
Nu primește body.
Primește parametrul id.
Apelează funcția getById pentru a lucra cu fișierul json contacts.json.
Dacă există un astfel de id, se returnează obiectul contact în format json cu status code 200.
Dacă nu există un astfel de id, se returnează un json cu cheia "message": "Not found" și status code 404.

@ POST /api/contacts
Primește body în formatul {name, email, phone}, unde toate câmpurile sunt obligatorii.
Dacă în body nu există vreun câmp ce este obligatoriu, atunci se returnează un json cu cheia {"message": "missing required name field"} și status code 400.
Dacă toate datele din body sunt în regulă, atunci se adaugă un identificator unic la obiectul de contact.
Apelează funcția addContact(body) pentru a salva contactul în fișierul contacts.json.
Ca rezultat al funcției, se returnează un obiect cu un id: {id, name, email, phone} și status code 201.

@ DELETE /api/contacts/:id
Nu primește body.
Primește parametrul id.
Apelează funcția removeContact pentru a lucra cu fișierul json contacts.json.
Dacă există un astfel de id, se returnează un json în formatul {"message": "contact deleted"} și status code 200.
Dacă nu există un astfel de id, se returnează un json cu cheia "message": "Not found" și status code 404.

@ PUT /api/contacts/:id
Primește parametrul id.
Primește body în format json cu valoarea actualizată a oricăror dintre câmpurile name, email și phone.
Dacă body nu există, se returnează un json cu cheia {"message": "missing fields"} și status code 400.
Dacă datele din body sunt valide, apelează funcția updateContact(contactId, body) (scrie-o) pentru a actualiza contactele din fișierul contacts.json.
Ca rezultat al funcției, se returnează obiectul actualizat și status code 200. În caz contrar, se returnează un json cu cheia "message": "Not found" și status code 404.

- Pasul 3
Pentru rutele care acceptă date (POST și PUT), ia în considerare și validarea datelor primite. Pentru a face aceasta, folosește pachetul joi.

# Criterii de acceptare a temelor #2-6
Este creat un repository cu temele — REST API application.
La crearea repository-ului s-a folosit boilerplate.
Un pull-request (PR) cu tema corespunzătoare a fost trimisă mentorului pentru verificare (link către PR).
Codul corespunde cerințelor tehnice.
La execuția codului nu apar erori neprelucrate.
Numele variabilelor, proprietăților și metodelor încep cu o literă mică și sunt scrise cu CamelCase. Sunt folosite substantive în limba engleză.
Numele unei funcții sau metode conține un verb.
În cod nu există secțiuni comentate.
Proiectul funcționează corect în versiunea actuală LTS Node.
