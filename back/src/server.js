const { initializeApp } = require('./app');

initializeApp()
    .then(() => {
        console.log('App initialized successfully');
    })
    .catch((error) => {
        console.error('Failed to initialize app:', error);
    });
