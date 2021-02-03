import React from 'react';
import styles from './App.module.less';

console.error(process.env.TRTC_APP_ID);
console.error(process.env.TRTC_SECRET_KEY);

const App = () => <div className={styles.App}>React App</div>;

export default App;
