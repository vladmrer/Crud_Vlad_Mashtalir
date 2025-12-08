# Smart Todo – CRUD End‑to‑end (Wymaganie A)

##  Opis projektu
Smart Todo to prosta aplikacja CRUD do zarządzania zadaniami, złożona z:
- **Relacyjnej bazy danych (Supabase / PostgreSQL)**
- **REST API** (Supabase REST)
- **Frontend (HTML + JS)** – pełna obsługa CRUD: listowanie, dodawanie, edycja, usuwanie
- **Migracje SQL** – tabela `whattodoapp`

Projekt spełnia wymagania **A**: encja, API, UI, README oraz struktura repo.

---

##  Encja (Model + Tabela)
Nazwa tabeli: **whattodoapp**

| Pole       | Typ         | Opis |
|------------|-------------|------|
| `id`       | int (PK)    | Klucz główny, auto‑increment |
| `text`     | text        | Treść zadania |
| `opis`     | text        | Opis zadania |
| `deadline` | date        | Data wykonania |
| `priority` | text        | Priorytet (low/medium/high) |
| `status`   | text        | Stan zadania (not_done/done) |

### Migracja SQL
```sql
create table whattodoapp (
  id bigserial primary key,
  text text not null,
  opis text not null,
  deadline date not null,
  priority text default 'low',
  status text default 'not_done'
);
```

---

##  REST API – Endpointy

Supabase generuje pełne REST API do tabeli.

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/rest/v1/whattodoapp` | Lista wszystkich zadań |
| GET | `/rest/v1/whattodoapp?id=eq.X` | Pobiera jedno zadanie |
| POST | `/rest/v1/whattodoapp` | Dodaje zadanie |
| PATCH | `/rest/v1/whattodoapp?id=eq.X` | Edytuje zadanie |
| DELETE | `/rest/v1/whattodoapp?id=eq.X` | Usuwa zadanie |

Nagłówki wymagane:
```
apikey: <anon_key>
Authorization: Bearer <anon_key>
Content-Type: application/json
```

---

##  Frontend (HTML/JS)
Funkcjonalności UI:
✔ listowanie zadań  
✔ paginacja  
✔ dodawanie zadania  
✔ edycja z prompt  
✔ usuwanie  
✔ walidacja pól  
✔ Supabase + localStorage fallback  

``

---

##  Jak uruchomić projekt lokalnie

### 1️ Pobierz repo lub ZIP  
### 2️ Otwórz `index.html` w przeglądarce  
### 3️ Sprawdź poprawność kluczy w `index.html`  
```
const SUPABASE_URL = "...";
const SUPABASE_ANON_KEY = "...";
```

---

## ▶ Jak uruchomić projekt w labie
1. Skopiuj repo do katalogu użytkownika.  
2. Uruchom `index.html` w przeglądarce Chromium/Firefox.  
3. Upewnij się, że sieć nie blokuje zapytań HTTPS.  

---

##  Smoke-test A

- [x] Dodaje zadanie  
- [x] Edytuje zadanie  
- [x] Usuwa zadanie  
- [x] Lista działa  
- [x] Supabase działa (localStorage fallback)  

---

## Zrzut ekranu UI
<img width="1851" height="869" alt="image" src="https://github.com/user-attachments/assets/7592b8f9-4a73-4668-afa3-255145904f88" />

---

## Struktura repo
```
/encja-A
  index.html
  script.js
  styles.css
  README.md
```
