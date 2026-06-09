import type { Messages } from "../types";
import { questionnaireEs } from "./questionnaire-es";

export const es: Messages = {
  lang: { translate: "Traducir" },
  nav: { home: "Inicio", assessment: "Evaluación" },
  footer: {
    rights: "Todos los derechos reservados para",
    tagline: "Desintoxicación Médica AcuActiv · Miami, FL ·",
  },
  home: {
    badge: "Programa de Desintoxicación Médica",
    title: "Descubra la Carga Tóxica de su Cuerpo",
    subtitle:
      "Puntuación profesional de síntomas, gráficos visuales y un plan de nutrición personalizado — guiado por el Dr. Shlomi Gavish DOM, AP.",
    features: [
      {
        title: "Evaluación con Emojis",
        description:
          "Califique cada síntoma con caras intuitivas 😊→😢 — 63 preguntas en 8 sistemas corporales.",
      },
      {
        title: "Gráficos y Puntuación Tóxica",
        description:
          "Gráficos de radar, circular y de barras más su porcentaje personalizado de carga tóxica.",
      },
      {
        title: "Plan de Dieta y Detox",
        description:
          "Listas personalizadas de alimentos permitidos/evitar, consejos de hidratación y alimentos para sus sistemas con mayor carga.",
      },
    ],
    systemsTitle: "8 Sistemas Corporales Evaluados",
    systemsSubtitle: "Evaluación completa de todas las vías principales de detox.",
    questions: "Preg.",
    cta: "Comencemos",
  },
  hero: {
    title: "Desafío Detox",
    startTest: "Iniciar Prueba",
    viewResults: "Ver resultados anteriores →",
    meta: "~15 min · 63 preguntas · 😊 a 😢",
    metaExtra: " · Gráficos y recomendaciones dietéticas",
  },
  video: {
    badge: "Hidratación y limpieza",
    title: "Fluya con el detox natural de su cuerpo",
    description:
      "Como agua purificadora en cada célula, el programa AcuActiv ayuda a eliminar toxinas, restaurar el equilibrio y guiarle con seguimiento por emojis, gráficos en vivo y una dieta basada en sus resultados.",
    cta: "Comenzar el desafío",
  },
  challenge: {
    step1: "Paso 1 de 2",
    personalTitle: "Información Personal",
    personalSubtitle:
      "Cuéntenos sobre usted antes de comenzar la evaluación de detox.",
    questionnaireTitle: "Cuestionario del Desafío Detox",
    questionnaireSubtitle:
      "Elija la cara que coincida con la frecuencia del síntoma 😊→😢",
    overallProgress: "Progreso general",
    back: "Atrás",
    next: "Siguiente",
    reviewAnswers: "Revisar respuestas",
    reviewTitle: "¿Listo para enviar?",
    reviewProgress: "Ha respondido {answered} de {total} preguntas.",
    answerMissed: "Responder pregunta omitida",
    answerMissedPlural: "Responder preguntas omitidas ({count})",
    reviewWarning:
      "Algunas preguntas no tienen respuesta. Vuelva atrás para completarlas y obtener resultados más precisos.",
    goToFirstMissed: "Ir a la primera pregunta omitida",
    backToQuestions: "Volver a las preguntas",
    submit: "Enviar y ver resultados",
    submitting: "Enviando…",
    categoryTest: "Prueba",
    startingSection: "Iniciando la siguiente sección",
    questionsInSection: "preguntas en esta sección",
    tapHowYouFeel: "Toque cómo se siente",
    best: "😊 Mejor",
    severity: "gravedad del síntoma →",
    worst: "😢 Peor",
  },
  form: {
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    phone: "Teléfono",
    dateOfBirth: "Fecha de nacimiento",
    testDate: "Fecha de prueba",
    measurementSystem: "Sistema de medición",
    imperial: "EE.UU. (Imperial)",
    metric: "Métrico",
    feet: "Pies",
    inches: "Pulgadas",
    pounds: "Libras",
    heightCm: "Altura (cm)",
    weightKg: "Peso (kg)",
    continue: "Continuar a la evaluación",
    errors: {
      firstName: "El nombre es obligatorio",
      lastName: "El apellido es obligatorio",
      email: "Se requiere un correo válido",
      phone: "Se requiere un número de teléfono",
      dateOfBirth: "La fecha de nacimiento es obligatoria",
      testDate: "La fecha de prueba es obligatoria",
    },
  },
  frequency: [
    {
      label: "Nunca o casi nunca tengo el síntoma",
      shortLabel: "Nunca",
    },
    {
      label: "Ocasionalmente lo tengo",
      shortLabel: "A veces",
    },
    {
      label: "Ocasionalmente lo tengo, el efecto es severo",
      shortLabel: "A veces (fuerte)",
    },
    {
      label: "Frecuentemente lo tengo, el efecto no es severo",
      shortLabel: "A menudo",
    },
    {
      label: "Frecuentemente lo tengo, el efecto es severo",
      shortLabel: "A menudo (severo)",
    },
  ],
  results: {
    noResults: "No se encontraron resultados",
    noResultsHint:
      "Complete el desafío detox para desbloquear gráficos y su plan de dieta.",
    startAssessment: "Iniciar evaluación",
    reportTitle: "Informe de Evaluación Detox",
    complete: "Evaluación completada",
    yourResults: "Sus Resultados Detox",
    grandTotal: "Total General",
    toxicBurden: "Carga Tóxica",
    low: "😊 Baja",
    high: "😢 Alta",
    systemBreakdown: "Desglose por Sistema",
    visualAnalytics: "📊 Análisis Visual",
    dietTitle: "🥗 Su Dieta Detox y Recomendaciones",
    disclaimerTitle: "Aviso médico",
    disclaimer:
      "Las sugerencias dietéticas son educativas y no reemplazan la atención del Dr. Shlomi Gavish DOM, AP. Los productos detox requieren una consulta previa.",
    home: "Inicio",
    savePdf: "Guardar / Imprimir PDF",
    retake: "Repetir",
  },
  toxicLevels: {
    low: "Carga tóxica baja",
    mild: "Carga tóxica leve",
    moderate: "Carga tóxica moderada",
    elevated: "Carga tóxica elevada",
    high: "Carga tóxica alta — se recomienda consulta",
  },
  categories: {
    emotions: "Emociones",
    skin: "Piel",
    ent: "Oído, Nariz y Garganta",
    brain: "Mente y Cerebro",
    digestive: "Digestivo",
    kidney: "Riñón",
    joints: "Articulaciones",
    metabolism: "Metabolismo",
  },
  banners: {
    skin: "Claridad de la piel, erupciones y signos dermatológicos",
    ent: "Síntomas de oído, nariz, garganta y respiratorios",
    joints: "Articulaciones, músculos y molestias de movilidad",
    kidney: "Salud urinaria y síntomas relacionados con los riñones",
    brain: "Concentración, memoria, sueño y claridad mental",
    digestive: "Salud intestinal, digestión y tolerancia alimentaria",
    emotions: "Estado de ánimo, ansiedad y bienestar emocional",
    metabolism: "Energía, peso, antojos y equilibrio metabólico",
    default: "Responda cada síntoma con honestidad",
  },
  questionnaire: questionnaireEs,
};
