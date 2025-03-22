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
                id: '1',
                name: 'JordaIn',
                type: 'Tutor',
                image: 'path_to_image1',
                password: '246810',
                children: [
                    { id: '1-1', name: 'Niño 1', type: 'Niño', image: 'path_to_child_image1' },
                ],
            },
            {
                id: '2',
                name: 'María',
                type: 'Tutor',
                image: 'path_to_image2',
                password: '246810',
                children: [
                    { id: '2-1', name: 'Niño 3', type: 'Niño', image: 'path_to_child_image3' },
                ],
            },
        ];

    }

    getProfilesByTutor(tutorId) {
        const tutor = this.profiles.find(profile => profile.id === tutorId && profile.type === 'Tutor');
        if (!tutor) return [];
        return [tutor, ...tutor.children];
    }

    // Obtener un perfil por ID
    getProfileById(profileId) {
        return this.profiles.find(profile => profile.id === profileId);
    }

    // Agregar un nuevo perfil
    addProfile(name, image) {
        const newProfile = {
            id: (this.profiles.length + 1).toString(),
            name,
            image
        };
        this.profiles.push(newProfile);
        return newProfile;
    }

    // Eliminar un perfil por ID
    deleteProfile(profileId) {
        const index = this.profiles.findIndex(profile => profile.id === profileId);
        if (index !== -1) {
            this.profiles.splice(index, 1);
            return true;
        }
        return false;
    }

    // Obtener todas las categorías de preguntas
    getQuestionBanks() {
        return this.questionBanks;
    }

    // Obtener preguntas de una categoría específica
    getQuestionsByCategory(category) {
        return this.questionsList[category] || [];
    }

    // Obtener una pregunta específica por su ID
    getQuestionById(questionId) {
        for (const category in this.questionsList) {
            const question = this.questionsList[category].find(q => q.id === questionId);
            if (question) return question;
        }
        return null;
    }

    // Actualizar el texto y las respuestas de una pregunta
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
        return false; // Si no se encontró la pregunta
    }

    // Agregar una nueva pregunta con respuestas por defecto
    addQuestion(category, questionText) {
        if (!this.questionsList[category]) {
            this.questionsList[category] = [];
        }

        const newQuestion = {
            id: (this.questionsList[category].length + 1).toString(),
            questionNumber: this.questionsList[category].length + 1,
            questionText,
            answers: ["", "", "", ""] // Se agregan respuestas vacías para ser editadas luego
        };

        this.questionsList[category].push(newQuestion);
        return newQuestion;
    }

    // Agregar una nueva categoría de preguntas
    addQuestionBank(category, initialQuestions = 0) {
        const newBank = {
            id: (this.questionBanks.length + 1).toString(),
            category,
            questions: initialQuestions
        };

        this.questionBanks.push(newBank);
        this.questionsList[category] = []; // Crea una nueva categoría vacía
    }
}

// Exportamos la base de datos simulada
export default new FakeDataBase();
