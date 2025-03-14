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
                { id: '1', questionNumber: 1, questionText: "¿Cuánto es 2+2?" },
                { id: '2', questionNumber: 2, questionText: "¿Cuánto es 5x3?" },
            ],
            Ciencias: [
                { id: '3', questionNumber: 1, questionText: "¿Cuál es la fórmula del agua?" },
                { id: '4', questionNumber: 2, questionText: "¿Qué planeta es el más grande?" },
            ],
            Historia: [
                { id: '5', questionNumber: 1, questionText: "¿Quién descubrió América?" },
                { id: '6', questionNumber: 2, questionText: "¿En qué año fue la Revolución Francesa?" },
            ],
            Geografía: [
                { id: '7', questionNumber: 1, questionText: "¿Cuál es el país más grande del mundo?" },
                { id: '8', questionNumber: 2, questionText: "¿Cuántos continentes existen?" },
            ],
            Deportes: [
                { id: '9', questionNumber: 1, questionText: "¿Cuántos jugadores tiene un equipo de fútbol?" },
                { id: '10', questionNumber: 2, questionText: "¿Quién ha ganado más mundiales de fútbol?" },
            ]
        };
    }

    // Método para obtener todas las categorías (bancos de preguntas)
    getQuestionBanks() {
        return this.questionBanks;
    }

    // Método para obtener preguntas de una categoría específica
    getQuestionsByCategory(category) {
        return this.questionsList[category] || [];
    }

    // Método para agregar una nueva pregunta a una categoría existente
    addQuestion(category, questionText) {
        const newQuestion = {
            id: (Object.keys(this.questionsList).length + 1).toString(),
            questionNumber: this.questionsList[category]?.length + 1 || 1,
            questionText
        };

        if (this.questionsList[category]) {
            this.questionsList[category].push(newQuestion);
        } else {
            this.questionsList[category] = [newQuestion];
            this.questionBanks.push({ id: (this.questionBanks.length + 1).toString(), category, questions: 1 });
        }

        return newQuestion;
    }

    // Método para agregar una nueva categoría de banco de preguntas
    addQuestionBank(category, initialQuestions = 0) {
        const newBank = {
            id: (this.questionBanks.length + 1).toString(),
            category,
            questions: initialQuestions
        };
        this.questionBanks.push(newBank);
        this.questionsList[category] = []; // Crea una nueva categoría vacía en la lista de preguntas
    }
}

// Exportamos la base de datos simulada para usarla en nuestras pantallas
export default new FakeDataBase();
