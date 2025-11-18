# React 19 Project

## Требования

-   **Node.js** версии **20** или выше\
-   **React** версии **19**

## Установка

1.  Установите зависимости:

    ``` bash
    npm install
    ```

2.  Создайте файл **.env** в корне проекта и заполните его ключами
    Firebase:

        REACT_APP_FIREBASE_API_KEY=REACT_APP_FIREBASE_API_KEY
        REACT_APP_FIREBASE_AUTH_DOMAIN=REACT_APP_FIREBASE_AUTH_DOMAIN
        REACT_APP_FIREBASE_URL=REACT_APP_FIREBASE_URL
        REACT_APP_FIREBASE_PROJECT_ID=REACT_APP_FIREBASE_PROJECT_ID
        REACT_APP_FIREBASE_STORAGE_BUCKET=REACT_APP_FIREBASE_STORAGE_BUCKET
        REACT_APP_FIREBASE_SENDER_ID=REACT_APP_FIREBASE_SENDER_ID
        REACT_APP_FIREBASE_APP_ID=REACT_APP_FIREBASE_APP_ID
        REACT_APP_FIREBASE_MEASUREMENT_ID=REACT_APP_FIREBASE_MEASUREMENT_ID
        REACT_APP_SECRET_KEY=REACT_APP_SECRET_KEY
        NODE_ENV=development

3.  Перезапустите проект:

    ``` bash
    npm start
    ```

## Описание

Проект использует Firebase для авторизации и хранения данных. Все ключи
подключаются через `.env` файл.
