class FakeDataBase {
    constructor() {
        this.questionBanks = [
            { id: '1', category: 'Matemáticas', questions: 5 },
            { id: '2', category: 'Ciencias', questions: 8 },
            { id: '3', category: 'Historia', questions: 10 },
            { id: '4', category: 'Geografía', questions: 6 },
            { id: '5', category: 'Deportes', questions: 3 }
        ];

        this.questionsList = {
            Matemáticas: [
                { id: '1', questionNumber: 1, questionText: "¿Cuánto es 2+2?", answers: ["4", "5", "3", "6"] },
                { id: '2', questionNumber: 2, questionText: "¿Cuánto es 5x3?", answers: ["15", "10", "20", "25"] },
            ],
            Ciencias: [
                { id: '3', questionNumber: 1, questionText: "¿Cuál es la fórmula del agua?", answers: ["H2O", "O2", "CO2", "H2"] },
                { id: '4', questionNumber: 2, questionText: "¿Qué planeta es el más grande?", answers: ["Júpiter", "Tierra", "Marte", "Saturno"] },
            ],
            Historia: [
                { id: '5', questionNumber: 1, questionText: "¿Quién descubrió América?", answers: ["Cristóbal Colón", "Hernán Cortés", "Simón Bolívar", "Napoleón"] },
                { id: '6', questionNumber: 2, questionText: "¿En qué año fue la Revolución Francesa?", answers: ["1789", "1804", "1492", "1917"] },
            ],
            Geografía: [
                { id: '7', questionNumber: 1, questionText: "¿Cuál es el país más grande del mundo?", answers: ["Rusia", "China", "EE.UU.", "Canadá"] },
                { id: '8', questionNumber: 2, questionText: "¿Cuántos continentes existen?", answers: ["7", "5", "6", "8"] },
            ],
            Deportes: [
                { id: '9', questionNumber: 1, questionText: "¿Cuántos jugadores tiene un equipo de fútbol?", answers: ["11", "9", "10", "12"] },
                { id: '10', questionNumber: 2, questionText: "¿Quién ha ganado más mundiales de fútbol?", answers: ["Brasil", "Alemania", "Argentina", "Italia"] },
            ]
        };

        this.profiles = [
            {
                idTutor: '1',
                name: 'JordaIn',
                lastName: 'González Pérez',
                type: 'Tutor',
                children: [
                    { id: '1-1', name: 'jordi', type: 'Niño' },
                ],
                idAccount: '1',
            },
            {
                idTutor: '2',
                name: 'Zuri Sadai',
                lastName: 'Santos Mazaba',
                type: 'Tutor',
                children: [
                    { id: '2-1', name: 'Z', type: 'Niño' },
                ],
                idAccount: '2',
            }
        ];

        this.accounts = [
            {
                idAccount: '1',
                email: 'jordan@gmail.com',
                password: '12345',
            },
            {
                idAccount: '2',
                email:'zuzi@gmail.com',
                password: '12345',
            }
        ];

        this.rewards = [
            { name: 'Comer helado', coins: 30, expiration: 10 },
            { name: 'Ver una película', coins: 50, expiration: 5 },
            { name: 'Jugar videojuegos', coins: 100, expiration: 3 },
            { name: 'Día de campo', coins: 200, expiration: 1 }
        ];

        this.verificationCode = '123456'; // Puedes cambiarlo después

        this.tempAccount = null;
    }

    // ------------------ PERFILES ------------------

    getProfilesByTutor(tutorId) {
        const tutor = this.profiles.find(profile => profile.idTutor === tutorId && profile.type === 'Tutor');
        if (!tutor) return [];
        return [tutor, ...tutor.children];
    }

    getProfileById(profileId) {
        return this.profiles.find(profile => profile.idTutor === profileId);
    }

    getProfileByAccountId(accountId) {
        return this.profiles.find(profile => profile.idAccount === accountId);
    }

    addProfile(name, image) {
        const newProfile = {
            id: (this.profiles.length + 1).toString(),
            name,
            image
        };
        this.profiles.push(newProfile);
        return newProfile;
    }

    deleteProfile(profileId) {
        const index = this.profiles.findIndex(profile => profile.idTutor === profileId);
        if (index !== -1) {
            this.profiles.splice(index, 1);
            return true;
        }
        return false;
    }

    addChildToTutor(tutorId, childName) {
        const tutor = this.profiles.find(profile => profile.idTutor === tutorId);
        if (!tutor) return null;

        const newChild = {
            id: `${tutorId}-${tutor.children.length + 1}`,
            name: childName,
            type: 'Niño'
        };

        tutor.children.push(newChild);
        return newChild;
    }

    deleteChild(tutorId, childId) {
        const tutor = this.profiles.find(profile => profile.idTutor === tutorId);
        if (!tutor) return false;

        const index = tutor.children.findIndex(child => child.id === childId);
        if (index !== -1) {
            tutor.children.splice(index, 1);
            return true;
        }

        return false;
    }

    // ------------------ CUENTAS ------------------

    getAccountByEmail(email) {
        return this.accounts.find(account => account.email === email);
    }

    // ------------------ BANCOS Y PREGUNTAS ------------------

    getQuestionBanks() {
        return this.questionBanks;
    }

    getQuestionsByCategory(category) {
        return this.questionsList[category] || [];
    }

    getQuestionById(questionId) {
        for (const category in this.questionsList) {
            const question = this.questionsList[category].find(q => q.id === questionId);
            if (question) return question;
        }
        return null;
    }

    getCategories() {
        return Object.keys(this.questionsList);
    }

    getRandomQuestion(category) {
        const list = this.questionsList[category];
        if (!list || list.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    addQuestion(category, questionText) {
        if (!this.questionsList[category]) {
            this.questionsList[category] = [];
        }

        const newQuestion = {
            id: (this.questionsList[category].length + 1).toString(),
            questionNumber: this.questionsList[category].length + 1,
            questionText,
            answers: ["", "", "", ""]
        };

        this.questionsList[category].push(newQuestion);
        return newQuestion;
    }

    updateQuestion(category, questionId, newQuestionText, newAnswers) {
        if (!this.questionsList[category]) return false;
        const questionIndex = this.questionsList[category].findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.questionsList[category][questionIndex].questionText = newQuestionText;
            this.questionsList[category][questionIndex].answers = newAnswers;
            return true;
        }
        return false;
    }

    deleteQuestion(questionId) {
        for (const category in this.questionsList) {
            const questionIndex = this.questionsList[category].findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                this.questionsList[category].splice(questionIndex, 1);
                return true;
            }
        }
        return false;
    }

    addQuestionBank(category, initialQuestions = 0) {
        const newBank = {
            id: (this.questionBanks.length + 1).toString(),
            category,
            questions: initialQuestions
        };

        this.questionBanks.push(newBank);
        this.questionsList[category] = [];
    }

    updateQuestionBank(bankId, newCategory, newQuestions) {
        const index = this.questionBanks.findIndex(bank => bank.id === bankId);
        if (index !== -1) {
            this.questionBanks[index].category = newCategory;
            this.questionBanks[index].questions = newQuestions;
            return true;
        }
        return false;
    }

    deleteQuestionBank(bankId) {
        const index = this.questionBanks.findIndex(bank => bank.id === bankId);
        if (index !== -1) {
            this.questionBanks.splice(index, 1);
            return true;
        }
        return false;
    }

    // ------------------ RECOMPENSAS ------------------

    getRewards() {
        return this.rewards;
    }

    getRewardByName(name) {
        return this.rewards.find(reward => reward.name === name);
    }

    getAvailableRewards(maxCoins) {
        return this.rewards.filter(reward => reward.coins <= maxCoins);
    }

    addReward(name, coins, expiration) {
        if (!name.trim() || coins <= 0) {
            throw new Error("Los valores de la recompensa no son válidos.");
        }

        const newReward = { name, coins, expiration };
        this.rewards.push(newReward);
        return newReward;
    }

    updateReward(id, updatedData) {
        const index = this.rewards.findIndex(reward => reward.id === id);
        if (index !== -1) {
            this.rewards[index] = { ...this.rewards[index], ...updatedData };
            console.log("Recompensa actualizada:", this.rewards[index]);
            return true;
        }
        return false;
    }

    deleteReward(id) {
        const index = this.rewards.findIndex(reward => reward.id === id);
        if (index !== -1) {
            this.rewards.splice(index, 1);
            console.log("Recompensa eliminada:", id);
            return true;
        }
        return false;
    }

    // Verificar si un correo ya existe
    emailExists(email) {
        return this.accounts.some(account => account.email === email);
    }

    // Generar ID
    generateId(collection) {
        return (this[collection].length + 1).toString();
    }

    // Guardar temporalmente datos antes de verificar
    saveTempAccount(data) {
        this.tempAccount = data;
    }

    // Verificar código
    verifyCode(code) {
        return code === this.verificationCode;
    }

    // Confirmar creación de cuenta
    confirmAccount(childName) {
        if (!this.tempAccount) return null;

        const idAccount = this.generateId('accounts');
        const idTutor = this.generateId('profiles');

        const account = {
            idAccount,
            email: this.tempAccount.email,
            password: this.tempAccount.password,
        };

        const profile = {
            idTutor,
            name: this.tempAccount.name,
            lastName: this.tempAccount.lastName,
            type: 'Tutor',
            idAccount,
            children: [
                {
                    id: `${idTutor}-1`,
                    name: childName,
                    type: 'Niño',
                }
            ]
        };

        this.accounts.push(account);
        this.profiles.push(profile);

        this.tempAccount = null;
        return { account, profile };
    }
}

// Exportamos la base de datos simulada
export default new FakeDataBase();
