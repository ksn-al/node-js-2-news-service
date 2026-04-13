# News Service

Новинний сервіс на Node.js + Express + TypeScript + PostgreSQL з React-клієнтом.

## Основні команди

```bash
npm install
npm --prefix client install
npm run lint
npm run build:server
npm run build:all
npm run server-dev
```

## Змінні середовища

Створіть `.env` на основі `.env.example`.

- Для локального PostgreSQL сервіс використовує `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
- Для хмарної БД можна передати один `DATABASE_URL`.
- Для продакшену обов'язково задайте `JWT_SECRET`.

## CI

GitHub Actions знаходиться у `.github/workflows/ci.yml` і запускається:

- на кожен push у `main`
- на кожен pull request у `main`

У pipeline є обов'язкові етапи:

- встановлення backend і frontend залежностей
- перевірка стилів через ESLint
- білд TypeScript у JavaScript

## CD на Render

Для деплою додано `render.yaml` у корінь репозиторію. Render автоматично підхоплює зміни з GitHub і передеплоює сервіс після push у головну гілку.

### Як підняти сервіс

1. Запушити репозиторій на GitHub.
2. Створити PostgreSQL у ElephantSQL або іншому хмарному провайдері та отримати `DATABASE_URL`.
3. У Render вибрати `New + Blueprint` і підключити цей репозиторій.
4. Підтвердити сервіс із `render.yaml`.
5. Додати змінні середовища:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - за потреби `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`
6. Дочекатися першого build/deploy.

Після цього Render буде автоматично оновлювати сервіс з репозиторію.
