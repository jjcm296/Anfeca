const premiumController = require('../../services/premiumService.js');
const bankService = require('../../services/bankService.js');
const questionService = require('../../services/questionService.js');

const idGuardian = "682383ab981d13ad269c861d"

let bankId ;



let bankName = "";

const questions = [
    {
        textQuestion: "¿Qué tipo de texto es una receta de cocina?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Narrativo", isCorrect: false },
            { textAnswer: "Descriptivo", isCorrect: false },
            { textAnswer: "Instructivo", isCorrect: true },
            { textAnswer: "Poético", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué signo va al final de una pregunta?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Punto", isCorrect: false },
            { textAnswer: "Signo de interrogación", isCorrect: true },
            { textAnswer: "Coma", isCorrect: false },
            { textAnswer: "Punto y coma", isCorrect: false },
        ],
    },
    {
        textQuestion: "En “Los pájaros vuelan alto, pues buscan el sol,” la conjunción “pues” significa:",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Consecuencia", isCorrect: false },
            { textAnswer: "Causa", isCorrect: true },
            { textAnswer: "Oposición", isCorrect: false },
            { textAnswer: "Condición", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿En qué tiempo está la forma verbal “habré cantado”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Pretérito perfecto simple", isCorrect: false },
            { textAnswer: "Condicional Simple", isCorrect: false },
            { textAnswer: "Pretérito imperfecto", isCorrect: false },
            { textAnswer: "Futuro perfecto", isCorrect: true },
        ],
    },
    {
        textQuestion: "En la palabra “murciélago”, la sílaba tónica es",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "mur", isCorrect: false },
            { textAnswer: "cié", isCorrect: true },
            { textAnswer: "la", isCorrect: false },
            { textAnswer: "go", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué signo ortográfico se emplea para indicar un inciso o aclaración breve?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Paréntesis", isCorrect: true },
            { textAnswer: "Comillas", isCorrect: false },
            { textAnswer: "Guion", isCorrect: false },
            { textAnswer: "Punto y coma", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Cuál es el sujeto en “Los pájaros cantan al amanecer”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Cantan", isCorrect: false },
            { textAnswer: "Al amanecer", isCorrect: false },
            { textAnswer: "Los pájaros", isCorrect: true },
            { textAnswer: "Pájaros", isCorrect: false },
        ],
    },
    {
        textQuestion: "Identifica la palabra esdrújula:",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Canción", isCorrect: false },
            { textAnswer: "Música", isCorrect: true },
            { textAnswer: "Café", isCorrect: false },
            { textAnswer: "Jardín", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué palabra es un adjetivo calificativo?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Rápido", isCorrect: true },
            { textAnswer: "Canto", isCorrect: false },
            { textAnswer: "Saltar", isCorrect: false },
            { textAnswer: "Felicidad", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Cuál es la forma correcta del comparativo de igualdad de “fiel”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Tan fiel", isCorrect: true },
            { textAnswer: "Más fiel", isCorrect: false },
            { textAnswer: "Menos fiel", isCorrect: false },
            { textAnswer: "Fiel más", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Cuál es el propósito principal de un mensaje publicitario?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Instruir", isCorrect: false },
            { textAnswer: "Persuadir", isCorrect: true },
            { textAnswer: "Narrar", isCorrect: false },
            { textAnswer: "Describir", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Cuál es el antónimo de “valiente”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Fuerte", isCorrect: false },
            { textAnswer: "Ruidoso", isCorrect: false },
            { textAnswer: "Alegre", isCorrect: false },
            { textAnswer: "Cobarde", isCorrect: true },
        ],
    },
    {
        textQuestion: "Elige el sinónimo adecuado de “desafío”:",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Oportunidad", isCorrect: false },
            { textAnswer: "Descanso", isCorrect: false },
            { textAnswer: "Relajo", isCorrect: false },
            { textAnswer: "Problema", isCorrect: true },
        ],
    },
    {
        textQuestion: "¿Qué figura retórica consiste en repetir sonidos iniciales?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Aliteración", isCorrect: true },
            { textAnswer: "Metonimia", isCorrect: false },
            { textAnswer: "Hipérbole", isCorrect: false },
            { textAnswer: "Oxímoron", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué género literario describe hechos reales y concretos?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Narrativo", isCorrect: false },
            { textAnswer: "Dramático", isCorrect: false },
            { textAnswer: "Ensayo", isCorrect: false },
            { textAnswer: "Expositivo", isCorrect: true },
        ],
    },
    {
        textQuestion: "¿Qué tipo de palabra es “aunque”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Adverbio", isCorrect: false },
            { textAnswer: "Conjunción", isCorrect: true },
            { textAnswer: "Preposición", isCorrect: false },
            { textAnswer: "Pronombre", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué signo se usa al inicio y al final de una exclamación?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "“”", isCorrect: false },
            { textAnswer: "¡!", isCorrect: true },
            { textAnswer: "()", isCorrect: false },
            { textAnswer: "–", isCorrect: false },
        ],
    },
    {
        textQuestion: "Identifica el tiempo verbal de “estaré estudiando”:",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Futuro simple", isCorrect: false },
            { textAnswer: "Condicional", isCorrect: false },
            { textAnswer: "Futuro continuo", isCorrect: true },
            { textAnswer: "Pretérito", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué indica la frase “antes de la fecha”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Modo", isCorrect: false },
            { textAnswer: "Tiempo", isCorrect: true },
            { textAnswer: "Lugar", isCorrect: false },
            { textAnswer: "Causa", isCorrect: false },
        ],
    },
    {
        textQuestion: "¿Qué tipo de oración compuesta es: “Si estudias, aprobarás el examen”?",
        priority: "media",
        bankId: "682464e3ed1a6f974c48b26d",
        answers: [
            { textAnswer: "Coordinada", isCorrect: false },
            { textAnswer: "Yuxtapuesta", isCorrect: false },
            { textAnswer: "Subordinada condicional", isCorrect: true },
            { textAnswer: "Subordinada concesiva", isCorrect: false },
        ],
    },
];



//await bankService.createBank({ name: bankName, guardianId: idGuardian });

await questionService.createMultipleQuestions(questions);
