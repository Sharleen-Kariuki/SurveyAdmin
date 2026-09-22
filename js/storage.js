const STORAGE_KEY = 'surveys_db';

export const defaultSurveys = [
  {
    id: '1',
    title: 'Hal Gibrah',
    description: 'Scientific Calculator & Computational Suite Usability Survey',
    responses: 245,
    status: 'Active',
    createdAt: '2024',
    updatedAt: '2026',
    questions: [
      {
        id: '101',
        text: 'How frequently do you use scientific calculation tools in your workflow?',
        type: 'radio',
        options: ['Daily', 'Several times a week', 'Once a month', 'Rarely'],
        required: true
      },
      {
        id: '102',
        text: 'Rate the interface responsiveness and calculation engine speed',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '103',
        text: 'Net Promoter Score: How likely are you to recommend our tool to a colleague? (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '104',
        text: 'Preferred floating-point decimal precision level',
        type: 'range',
        rangeMin: 2,
        rangeMax: 32,
        rangeStep: 2,
        required: true
      },
      {
        id: '105',
        text: 'Rate the matrix & linear algebra solver usability',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: false
      },
      {
        id: '106',
        text: 'Estimated weekly calculation workload (hours)',
        type: 'range',
        rangeMin: 1,
        rangeMax: 50,
        rangeStep: 1,
        required: false
      },
      {
        id: '107',
        text: 'Do you require automated LaTeX mathematical syntax export?',
        type: 'boolean',
        required: true
      },
      {
        id: '108',
        text: 'Which equation export formats do you actively utilize?',
        type: 'checkbox',
        options: ['LaTeX', 'MathML', 'Plain CSV', 'JSON Schema', 'SVG Render'],
        required: false
      },
      {
        id: '109',
        text: 'What additional scientific algorithms or functions would help your daily research?',
        type: 'textarea',
        required: false
      }
    ]
  },
  {
    id: '2',
    title: 'Cathy Terr',
    description: 'Municipal Waste Disposal & Environmental Sustainability Audit',
    responses: 312,
    status: 'Inactive',
    createdAt: '2023',
    updatedAt: '2025',
    questions: [
      {
        id: '201',
        text: 'Is recyclable waste collected on the designated schedule in your sector?',
        type: 'boolean',
        required: true
      },
      {
        id: '202',
        text: 'Rate overall municipal recycling efficiency and service responsiveness (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '203',
        text: 'Rate community compost and organic waste facility accessibility',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '204',
        text: 'Estimated percentage of household waste diverted from landfill',
        type: 'range',
        rangeMin: 0,
        rangeMax: 100,
        rangeStep: 5,
        required: false
      },
      {
        id: '205',
        text: 'Select all waste categories segregated at your residence',
        type: 'checkbox',
        options: ['Plastics', 'Glass', 'Paper & Cardboard', 'Electronic Waste', 'Hazardous Chemicals'],
        required: false
      },
      {
        id: '206',
        text: 'Neighborhood collection frequency preference (times per week)',
        type: 'range',
        rangeMin: 1,
        rangeMax: 7,
        rangeStep: 1,
        required: false
      },
      {
        id: '207',
        text: 'Upload an image of your local sorting station or container cleanliness',
        type: 'file',
        required: false
      }
    ]
  },
  {
    id: '3',
    title: 'Lou Minious',
    description: 'Smart Lighting & Energy Conservation Study',
    responses: 88,
    status: 'Pending',
    createdAt: '2024',
    updatedAt: '2026',
    questions: [
      {
        id: '301',
        text: 'Overall satisfaction with smart bulb brightness and color accuracy',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '302',
        text: 'Preferred evening indoor color temperature in Kelvin',
        type: 'range',
        rangeMin: 2000,
        rangeMax: 6500,
        rangeStep: 100,
        required: true
      },
      {
        id: '303',
        text: 'Likelihood of expanding smart illumination to additional rooms (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '304',
        text: 'Motion sensor auto-dimming timeout threshold (minutes)',
        type: 'range',
        rangeMin: 1,
        rangeMax: 60,
        rangeStep: 1,
        required: false
      },
      {
        id: '305',
        text: 'Does the ambient light sensor trigger reliably at sunset?',
        type: 'boolean',
        required: true
      },
      {
        id: '306',
        text: 'Primary smart home voice assistant ecosystem',
        type: 'select',
        options: ['Apple HomeKit', 'Google Home', 'Amazon Alexa', 'Home Assistant', 'None'],
        required: false
      }
    ]
  },
  {
    id: '4',
    title: 'Apex Velocity',
    description: 'Cloud Infrastructure & High-Frequency API Performance Benchmark',
    responses: 540,
    status: 'Active',
    createdAt: '2024',
    updatedAt: '2026',
    questions: [
      {
        id: '401',
        text: 'Rate global edge API response latency satisfaction (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '402',
        text: 'Overall platform uptime and failover reliability rating',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '403',
        text: 'Desired auto-scaling maximum container instances',
        type: 'range',
        rangeMin: 2,
        rangeMax: 100,
        rangeStep: 2,
        required: true
      },
      {
        id: '404',
        text: 'Target memory allocation buffer per microservice (GB)',
        type: 'range',
        rangeMin: 4,
        rangeMax: 128,
        rangeStep: 4,
        required: false
      },
      {
        id: '405',
        text: 'Is zero-downtime blue/green deployment mandatory for your production cluster?',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: '5',
    title: 'Nova Health',
    description: 'Workplace Ergonomics & Employee Wellness Index',
    responses: 1420,
    status: 'Active',
    createdAt: '2025',
    updatedAt: '2026',
    questions: [
      {
        id: '501',
        text: 'Daily physical activity or standing desk duration (minutes)',
        type: 'range',
        rangeMin: 15,
        rangeMax: 180,
        rangeStep: 15,
        required: true
      },
      {
        id: '502',
        text: 'Work-life balance and mental health satisfaction level',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '503',
        text: 'Likelihood to participate in weekly corporate wellness workshops (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '504',
        text: 'Preferred remote working days per work week',
        type: 'range',
        rangeMin: 0,
        rangeMax: 5,
        rangeStep: 1,
        required: false
      }
    ]
  },
  {
    id: '6',
    title: 'Pulse Retail',
    description: 'Omnichannel In-Store Shopping Experience Feedback',
    responses: 890,
    status: 'Inactive',
    createdAt: '2023',
    updatedAt: '2025',
    questions: [
      {
        id: '601',
        text: 'Speed and convenience of contactless self-checkout (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '602',
        text: 'Store product availability and aisle layout rating',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '603',
        text: 'Acceptable maximum promotional SMS / Email frequency per month',
        type: 'range',
        rangeMin: 1,
        rangeMax: 12,
        rangeStep: 1,
        required: false
      }
    ]
  },
  {
    id: '7',
    title: 'Zenith Fintech',
    description: 'Mobile Banking Security & Biometric UX Survey',
    responses: 3100,
    status: 'Active',
    createdAt: '2025',
    updatedAt: '2026',
    questions: [
      {
        id: '701',
        text: 'Ease of biometric face / fingerprint authentication',
        type: 'rating',
        rangeMin: 1,
        rangeMax: 5,
        rangeStep: 1,
        required: true
      },
      {
        id: '702',
        text: 'Confidence in multi-factor transaction security (1-10)',
        type: 'scale',
        rangeMin: 1,
        rangeMax: 10,
        rangeStep: 1,
        required: true
      },
      {
        id: '703',
        text: 'Instant push-notification threshold for single transaction ($)',
        type: 'range',
        rangeMin: 25,
        rangeMax: 1500,
        rangeStep: 25,
        required: true
      },
      {
        id: '704',
        text: 'Would you utilize AI-assisted recurring bill optimization?',
        type: 'boolean',
        required: false
      }
    ]
  }
];

export function getSurveys() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
    return defaultSurveys;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
      return defaultSurveys;
    }

    // Auto-enrich existing data if default surveys are missing rich question sets
    let needsUpdate = false;
    defaultSurveys.forEach((defSurvey) => {
      const existing = parsed.find((s) => s.id === defSurvey.id);
      if (!existing) {
        parsed.push(defSurvey);
        needsUpdate = true;
      } else if (!existing.questions || existing.questions.length < defSurvey.questions.length) {
        existing.questions = defSurvey.questions;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
    return defaultSurveys;
  }
}

export function saveSurveys(surveys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
}

export function deleteSurveyById(id) {
  const surveys = getSurveys().filter(s => s.id !== id);
  saveSurveys(surveys);
}

export function saveOrUpdateSurvey(surveyData) {
  const surveys = getSurveys();
  const currentYear = new Date().getFullYear().toString();

  if (surveyData.id) {
    // Edit existing
    const index = surveys.findIndex(s => s.id === surveyData.id);
    if (index !== -1) {
      surveys[index] = {
        ...surveys[index],
        title: surveyData.title,
        description: surveyData.description,
        status: surveyData.status,
        updatedAt: currentYear
      };
      saveSurveys(surveys);
      return surveyData.id;
    }
  }

  // Create new
  const newId = Date.now().toString();
  surveys.push({
    id: newId,
    title: surveyData.title,
    description: surveyData.description,
    status: surveyData.status,
    responses: 0,
    questions: [],
    createdAt: currentYear,
    updatedAt: currentYear
  });

  saveSurveys(surveys);
  return newId;
}

export function getSurveyById(id) {
  const surveys = getSurveys();
  return surveys.find((s) => s.id === id) || null;
}

export function saveQuestion(surveyId, questionData) {
  const surveys = getSurveys();
  const survey = surveys.find((s) => s.id === surveyId);
  if (!survey) return null;

  if (!survey.questions) {
    survey.questions = [];
  }

  const currentYear = new Date().getFullYear().toString();
  survey.updatedAt = currentYear;

  let savedId = questionData.id;
  if (questionData.id) {
    // Edit existing question
    const index = survey.questions.findIndex((q) => q.id === questionData.id);
    if (index !== -1) {
      survey.questions[index] = { ...survey.questions[index], ...questionData };
    }
  } else {
    // Add new question
    savedId = Date.now().toString();
    survey.questions.push({
      ...questionData,
      id: savedId,
    });
  }

  saveSurveys(surveys);
  return savedId;
}

export function deleteQuestion(surveyId, questionId) {
  const surveys = getSurveys();
  const survey = surveys.find((s) => s.id === surveyId);
  if (!survey || !survey.questions) return;

  const currentYear = new Date().getFullYear().toString();
  survey.updatedAt = currentYear;

  survey.questions = survey.questions.filter((q) => q.id !== questionId);
  saveSurveys(surveys);
}