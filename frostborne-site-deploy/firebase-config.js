window.__FROSTBORNE_FIREBASE_CONFIG__ = {
  apiKey: 'AIzaSyAHBvCMazcHJvajUC5MG4lyM5vGycMCPAE',
  authDomain: 'frostborne-1ca0b.firebaseapp.com',
  databaseURL: 'https://frostborne-1ca0b-default-rtdb.firebaseio.com',
  projectId: 'frostborne-1ca0b',
  storageBucket: 'frostborne-1ca0b.firebasestorage.app',
  messagingSenderId: '1097451279446',
  appId: '1:1097451279446:web:e31985e3b1d13b168a17f7',

  // D-04: uid владельца для модерации Эфира.
  // Как заполнить:
  //   1) Firebase Console -> Authentication -> Sign-in method -> включить Google
  //   2) Открыть Эфир, в профиле нажать «Вход для модератора», войти своим Google
  //   3) Узел покажет твой uid — вставить его сюда И в firebase-rules.json
  //      (заменить все __ADMIN_UID__), затем опубликовать правила заново
  // Пока пусто — кнопки удаления не появляются ни у кого.
  adminUid: '0yy61jOaF2gnqNH5gHl17Bc1QX63'
};
