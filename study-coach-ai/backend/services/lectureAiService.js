'use strict';

/**
 * lectureAiService.js
 *
 * Generates quizzes and study plans ENTIRELY from uploaded PDF text.
 * Every question, option, explanation, and recommendation is derived
 * from sentences actually present in the PDF — no templates, no generics.
 */

// ─── Stop words ──────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','must','shall',
  'can','to','of','in','for','on','with','at','by','from','as','into','through',
  'before','after','above','below','between','out','over','under','that','this',
  'these','those','then','than','so','if','or','and','but','not','no','nor','yet',
  'each','few','more','most','other','some','such','any','all','when','where',
  'how','what','which','who','it','its','we','us','our','they','them','their',
  'he','him','his','she','her','also','however','therefore','thus','because',
  'since','while','although','though','even','just','very','here','there','only',
  'about','up','first','second','third','one','two','three','four','five','six',
  'i','me','my','you','your','used','use','using','make','makes','well','often',
  'include','includes','many','different','various','way','ways','known','called',
  'both','same','like','new','need','needs','given','based','according','example',
  'figure','table','page','chapter','section','see','note','following','general',
  'specific','certain','another','refer','refers','per','etc','ie','eg','vs',
  'whether','without','within','among','along','around','against','during','upon',
  'still','already','always','never','ever','almost','quite','rather','however',
  'therefore','moreover','furthermore','additionally','consequently','thus',
  'hence','indeed','namely','particularly','especially','specifically','primarily',
]);

// ─── Utilities ────────────────────────────────────────────────────────────────

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, maxLen = 160) {
  if (!str) return '';
  return str.length <= maxLen ? str : str.substring(0, maxLen - 3) + '...';
}

// ─── Text Preprocessing ───────────────────────────────────────────────────────

function cleanText(rawText) {
  return rawText
    .replace(/\r\n|\r/g, '\n')
    .replace(/\f/g, '\n')           // form feeds (PDF page breaks)
    .replace(/\t/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (line.length < 3) return false;
      if (/^\d+$/.test(line)) return false;           // bare page numbers
      if (/^[.\-–—•*►▸]+$/.test(line)) return false; // bullet-only lines
      return true;
    })
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Score a sentence for how useful it is as a quiz source.
 * Higher = better quiz material.
 */
function scoreQuizWorthiness(sentence) {
  const lower = sentence.toLowerCase();
  const words = sentence.split(/\s+/);
  let score = 0;

  // Sweet-spot length
  if (words.length >= 8 && words.length <= 35) score += 2;
  else if (words.length > 35 && words.length <= 50) score += 1;

  // Definition / explanation patterns
  if (/\b(?:is|are)\s+defined\s+as\b/.test(lower)) score += 4;
  if (/\b(?:refers?\s+to|means?|describes?|consists?\s+of|involves?)\b/.test(lower)) score += 3;
  if (/\b(?:is|are)\s+(?:a|an|the)\s+\w/.test(lower)) score += 2;

  // Causal / relational patterns (high-value quiz content)
  if (/\b(?:causes?|produces?|results?\s+in|leads?\s+to|converts?|transforms?|enables?|creates?|forms?|generates?)\b/.test(lower)) score += 3;

  // Process / method patterns
  if (/\b(?:uses?|allows?|helps?|provides?|supports?|contains?|includes?)\b/.test(lower)) score += 2;

  // Contains capitalized non-start word (likely proper noun / technical term)
  const nonStartCaps = sentence.slice(3).match(/[A-Z][a-z]+/g);
  if (nonStartCaps && nonStartCaps.length >= 1) score += 1;

  // Penalise cross-reference and meta-text
  if (/\b(?:figure|table|see|chapter|section|page|appendix|refer\s+to|as\s+shown|above|below)\b/.test(lower)) score -= 4;
  if (/^(?:in|this|these|as|it|there|here|note|also|however|furthermore|moreover)/i.test(sentence)) score -= 1;
  if (/^(?:for example|e\.g\.|i\.e\.|such as)/i.test(lower)) score -= 2;

  // Require ≥50 % alphabetic characters
  const letters = (sentence.match(/[a-zA-Z]/g) || []).length;
  if (letters / sentence.length < 0.5) score -= 5;

  return score;
}

function extractSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => {
      const words = s.split(/\s+/);
      if (words.length < 6 || words.length > 60) return false;
      if (s.length < 25) return false;
      const letters = (s.match(/[a-zA-Z]/g) || []).length;
      return letters / s.length >= 0.5;
    });
}

// ─── Key Term Extraction ──────────────────────────────────────────────────────

function extractKeyTerms(text, topN = 30) {
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/);

  // Unigram frequency
  const freq = {};
  for (const word of words) {
    if (word.length < 4) continue;
    if (STOP_WORDS.has(word)) continue;
    if (!/^[a-z]+$/.test(word)) continue;
    freq[word] = (freq[word] || 0) + 1;
  }

  // Bigram frequency (2-word technical phrases like "machine learning")
  const bigramFreq = {};
  const filtered = words.filter(w => /^[a-z]{3,}$/.test(w));
  for (let i = 0; i < filtered.length - 1; i++) {
    const w1 = filtered[i], w2 = filtered[i + 1];
    if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && w1.length >= 4 && w2.length >= 4) {
      const bigram = `${w1} ${w2}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  }

  // Keep bigrams that appear ≥2 times and prefer them as they are more specific
  const goodBigrams = Object.entries(bigramFreq)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([bg]) => bg);

  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([w]) => w);

  return [...new Set([...goodBigrams, ...topWords])].slice(0, topN);
}

// ─── Definition Extraction ────────────────────────────────────────────────────

function extractDefinitions(text) {
  const definitions = [];

  const patterns = [
    // "X is defined as Y."
    { re: /\b([A-Za-z][\w\s]{2,40}?)\s+(?:is|are)\s+defined\s+as\s+([^.!?]{10,200})[.!?]/g, swap: false },
    // "X refers to Y."
    { re: /\b([A-Za-z][\w\s]{2,40}?)\s+refers?\s+to\s+([^.!?]{10,180})[.!?]/g, swap: false },
    // "X means Y."
    { re: /\b([A-Za-z][\w\s]{2,35}?)\s+means?\s+([^.!?]{8,160})[.!?]/g, swap: false },
    // "X is a/an [type of] Y."
    { re: /\b([A-Z][a-zA-Z\s]{2,35}?)\s+(?:is|are)\s+(?:a|an|the)\s+([^.!?]{10,160})[.!?]/g, swap: false },
    // "X is the process of Y."
    { re: /\b([A-Za-z][\w\s]{2,40}?)\s+is\s+the\s+(?:process|act|ability|study|field|branch|method|technique|concept|principle|theory)\s+of\s+([^.!?]{8,160})[.!?]/g, swap: false },
    // "X, which is/means Y."
    { re: /\b([A-Za-z][\w\s]{2,35}?),\s+which\s+(?:is|are|means?)\s+([^,.!?]{10,160})[,.!?]/g, swap: false },
    // "called X" / "known as X" → we get the term, use surrounding text as definition
    { re: /(?:called|known as|referred to as)\s+["']?([A-Za-z][\w\s]{2,40}?)["']?[,.\s]/g, termOnly: true },
  ];

  for (const { re, swap, termOnly } of patterns) {
    const local = new RegExp(re.source, re.flags);
    let match;
    while ((match = local.exec(text)) !== null) {
      if (termOnly) {
        const term = match[1]?.trim();
        if (term && term.split(/\s+/).length <= 5 && !STOP_WORDS.has(term.toLowerCase())) {
          if (!definitions.some(d => d.term.toLowerCase() === term.toLowerCase())) {
            definitions.push({ term, definition: `A concept discussed in this lecture`, sourceText: match[0] });
          }
        }
        continue;
      }

      let term = (swap ? match[2] : match[1])?.trim();
      let definition = (swap ? match[1] : match[2])?.trim();

      if (!term || !definition) continue;
      term = term.replace(/^(the|a|an)\s+/i, '').trim();

      if (
        term.split(/\s+/).length > 6 ||
        definition.split(/\s+/).length < 3 ||
        definition.split(/\s+/).length > 40 ||
        STOP_WORDS.has(term.toLowerCase())
      ) continue;

      definition = definition.replace(/[,;]$/, '').trim();

      if (!definitions.some(d => d.term.toLowerCase() === term.toLowerCase())) {
        definitions.push({ term, definition, sourceText: match[0].trim() });
      }
    }
  }

  return definitions.slice(0, 12);
}

// ─── Question type helpers ────────────────────────────────────────────────────

/**
 * Pick 3 distractor terms from the PDF — NOT appearing in the given sentence,
 * and NOT matching the correct answer.  Prefer different terms of similar length.
 */
function pickDistractors(correctTerm, sentence, keyTerms, count = 3) {
  const sentLower = sentence.toLowerCase();
  const correctLower = correctTerm.toLowerCase();

  return keyTerms
    .filter(t => {
      const tl = t.toLowerCase();
      if (tl === correctLower) return false;                       // not the answer
      if (sentLower.includes(tl)) return false;                    // not in this sentence
      return true;
    })
    .slice(0, count)
    .map(capitalize);
}

/**
 * Check whether a key term is genuinely present as a whole word in the sentence.
 */
function termInSentence(term, sentence) {
  const escaped = term.replace(/[-\s]/g, '[-\\s]').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(sentence);
}

// ─── Question generators ──────────────────────────────────────────────────────

/**
 * TYPE 1 — Fill-in-the-blank.
 * Take a high-value sentence that contains a key term → blank it out.
 * Wrong answers: other key terms from the PDF (NOT appearing in that sentence).
 */
function generateFillBlankQuestions(sentences, keyTerms, maxQ = 4) {
  const questions = [];
  const usedTerms = new Set();

  // Sort by quiz worthiness descending
  const ranked = sentences
    .map(s => ({ s, score: scoreQuizWorthiness(s) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ s }) => s);

  for (const sentence of ranked) {
    if (questions.length >= maxQ) break;

    const matchingTerm = keyTerms.find(
      term => !usedTerms.has(term) && termInSentence(term, sentence)
    );
    if (!matchingTerm) continue;

    const distractors = pickDistractors(matchingTerm, sentence, keyTerms, 3);
    if (distractors.length < 3) continue;

    const escaped = matchingTerm.replace(/[-\s]/g, '[-\\s]').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const blank = sentence.replace(new RegExp(`\\b${escaped}\\b`, 'i'), '______');
    if (blank === sentence) continue;

    const correctDisplay = capitalize(matchingTerm);
    const displayBlank = truncate(blank, 200);

    questions.push({
      question: `Fill in the blank from the lecture: "${displayBlank}"`,
      options: shuffleArray([correctDisplay, ...distractors]),
      correctAnswer: correctDisplay,
      explanation: `The lecture states: "${truncate(sentence, 220)}"`,
      sourceConcept: matchingTerm,
      sourceText: sentence,
    });

    usedTerms.add(matchingTerm);
  }

  return questions;
}

/**
 * TYPE 2 — Definition matching.
 * "According to the lecture, what is [term]?" or "Which term is defined as [definition]?"
 * Correct: the PDF's definition. Wrong: other PDF definitions or key terms.
 */
function generateDefinitionQuestions(definitions, keyTerms, maxQ = 3) {
  const questions = [];

  for (const { term, definition, sourceText } of definitions) {
    if (questions.length >= maxQ) break;
    if (definition === 'A concept discussed in this lecture') continue; // skip term-only matches

    // Build wrong options from OTHER definitions, then fall back to key terms
    const otherDefs = definitions
      .filter(d => d.term.toLowerCase() !== term.toLowerCase() && d.definition !== 'A concept discussed in this lecture')
      .map(d => capitalize(d.definition));

    const termDistractors = keyTerms
      .filter(t => t.toLowerCase() !== term.toLowerCase())
      .slice(0, 4)
      .map(capitalize);

    // "What is X?" → options are definition strings
    const wrongDefs = [...otherDefs, ...termDistractors]
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);

    if (wrongDefs.length < 3) continue;

    const correctDisplay = capitalize(definition);
    questions.push({
      question: `According to the lecture, what is "${term}"?`,
      options: shuffleArray([correctDisplay, ...wrongDefs.slice(0, 3)]),
      correctAnswer: correctDisplay,
      explanation: `The lecture defines "${term}" as: ${definition}`,
      sourceConcept: term,
      sourceText: sourceText || '',
    });
  }

  return questions;
}

/**
 * TYPE 3 — "Which statement is stated in the lecture?"
 * Take a real PDF sentence as the correct answer.
 * Wrong options: that same sentence with one key term swapped for a DIFFERENT PDF term.
 * This makes ALL four options topically coherent — only one is what the lecture actually says.
 */
function generateVerificationQuestions(sentences, keyTerms, maxQ = 3) {
  const questions = [];
  const usedSentences = new Set();

  const ranked = sentences
    .map(s => ({ s, score: scoreQuizWorthiness(s) }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score)
    .map(({ s }) => s)
    .filter(s => s.length >= 30 && s.length <= 220);

  for (const sentence of ranked) {
    if (questions.length >= maxQ) break;
    if (usedSentences.has(sentence)) continue;

    const termsInSentence = keyTerms.filter(t => termInSentence(t, sentence));
    if (termsInSentence.length === 0) continue;

    const termsNotInSentence = keyTerms.filter(t => !termInSentence(t, sentence));
    if (termsNotInSentence.length < 3) continue;

    // Pick the primary term to swap
    const targetTerm = termsInSentence[0];
    const escaped = targetTerm.replace(/[-\s]/g, '[-\\s]').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const swapRe = new RegExp(`\\b${escaped}\\b`, 'i');

    const wrongOptions = termsNotInSentence.slice(0, 4).map(wrongTerm => {
      const modified = sentence.replace(swapRe, wrongTerm);
      return modified !== sentence ? truncate(modified, 200) : null;
    }).filter(Boolean).slice(0, 3);

    if (wrongOptions.length < 3) continue;

    const correctDisplay = truncate(sentence, 200);

    questions.push({
      question: 'Which of the following statements is directly stated in the lecture?',
      options: shuffleArray([correctDisplay, ...wrongOptions]),
      correctAnswer: correctDisplay,
      explanation: `The lecture contains the exact statement: "${truncate(sentence, 220)}"`,
      sourceConcept: targetTerm,
      sourceText: sentence,
    });

    usedSentences.add(sentence);
  }

  return questions;
}

/**
 * TYPE 4 — Concept identification.
 * "Which concept from the lecture is described in: [sentence]?"
 * Correct: the key term found in that sentence.
 * Wrong: other key terms from the PDF.
 */
function generateConceptIdentificationQuestions(sentences, keyTerms, maxQ = 3) {
  const questions = [];
  const usedSentences = new Set();

  const ranked = sentences
    .map(s => ({ s, score: scoreQuizWorthiness(s) }))
    .filter(({ score }) => score >= 1)
    .sort((a, b) => b.score - a.score)
    .map(({ s }) => s);

  for (const sentence of ranked) {
    if (questions.length >= maxQ) break;
    if (usedSentences.has(sentence)) continue;

    const matchingTerm = keyTerms.find(t => termInSentence(t, sentence));
    if (!matchingTerm) continue;

    const wrongConcepts = pickDistractors(matchingTerm, sentence, keyTerms, 3);
    if (wrongConcepts.length < 3) continue;

    const displaySentence = truncate(sentence, 180);

    questions.push({
      question: `Which concept from the lecture is discussed in the following statement?\n"${displaySentence}"`,
      options: shuffleArray([capitalize(matchingTerm), ...wrongConcepts]),
      correctAnswer: capitalize(matchingTerm),
      explanation: `The statement is about "${matchingTerm}" as covered in this lecture.`,
      sourceConcept: matchingTerm,
      sourceText: sentence,
    });

    usedSentences.add(sentence);
  }

  return questions;
}

// ─── Main Export: generateQuizFromText ────────────────────────────────────────

const MINIMUM_WORDS   = 150;
const MINIMUM_TERMS   = 5;
const MINIMUM_SENTENCES = 5;
const MINIMUM_QUESTIONS = 3;

const generateQuizFromText = (text, lectureTitle = 'Lecture', numQuestions = 7) => {
  if (!text || text.trim().split(/\s+/).length < MINIMUM_WORDS) {
    throw new Error(
      'The uploaded PDF does not contain enough readable lecture text to generate a quiz. ' +
      'Please upload a clearer lecture PDF.'
    );
  }

  // Limit to first ~8 000 words so large PDFs don't slow things down
  const limitedText = text.split(/\s+/).slice(0, 8000).join(' ');
  const cleaned     = cleanText(limitedText);
  const sentences   = extractSentences(cleaned);
  const keyTerms    = extractKeyTerms(cleaned, 30);
  const definitions = extractDefinitions(cleaned);

  if (sentences.length < MINIMUM_SENTENCES) {
    throw new Error(
      'The uploaded PDF does not contain enough readable lecture text to generate a quiz. ' +
      'Please upload a clearer lecture PDF.'
    );
  }

  if (keyTerms.length < MINIMUM_TERMS) {
    throw new Error(
      'The uploaded PDF does not contain enough readable lecture text to generate a quiz. ' +
      'Please upload a clearer lecture PDF.'
    );
  }

  // Generate questions from all four strategies
  const defQ     = generateDefinitionQuestions(definitions, keyTerms, 3);
  const fillQ    = generateFillBlankQuestions(sentences, keyTerms, 4);
  const verifQ   = generateVerificationQuestions(sentences, keyTerms, 3);
  const conceptQ = generateConceptIdentificationQuestions(sentences, keyTerms, 3);

  // Merge and deduplicate by question text
  const seen = new Set();
  let allQ = [...defQ, ...fillQ, ...verifQ, ...conceptQ].filter(q => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });

  if (allQ.length < MINIMUM_QUESTIONS) {
    throw new Error(
      'The uploaded PDF does not contain enough structured lecture content to generate ' +
      'meaningful quiz questions. Please upload a clearer or more detailed lecture PDF.'
    );
  }

  // Interleave question types so different types appear throughout
  const interleaved = [];
  const queues = [defQ, fillQ, verifQ, conceptQ];
  const indices = queues.map(() => 0);
  let added = new Set();
  while (interleaved.length < numQuestions) {
    let anyAdded = false;
    for (let qi = 0; qi < queues.length; qi++) {
      if (interleaved.length >= numQuestions) break;
      while (indices[qi] < queues[qi].length) {
        const q = queues[qi][indices[qi]++];
        if (!added.has(q.question)) {
          interleaved.push(q);
          added.add(q.question);
          anyAdded = true;
          break;
        }
      }
    }
    if (!anyAdded) break;
  }

  return interleaved.length >= MINIMUM_QUESTIONS
    ? interleaved
    : shuffleArray(allQ).slice(0, numQuestions);
};

// ─── Main Export: extractSummaryAndConcepts ───────────────────────────────────

const extractSummaryAndConcepts = (text) => {
  const cleaned     = cleanText(text.split(/\s+/).slice(0, 8000).join(' '));
  const sentences   = extractSentences(cleaned);
  const keyTerms    = extractKeyTerms(cleaned, 15);
  const definitions = extractDefinitions(cleaned);

  // Use highest-scoring sentences as the summary
  const bestSentences = sentences
    .map(s => ({ s, score: scoreQuizWorthiness(s) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ s }) => s)
    .join(' ');

  const summary = bestSentences.substring(0, 500) ||
    sentences.slice(0, 3).join(' ').substring(0, 500) ||
    `This lecture covers: ${keyTerms.slice(0, 5).map(capitalize).join(', ')}.`;

  const keyConcepts = keyTerms.slice(0, 10).map(capitalize);

  // Learning objectives derived from the PDF's key concepts
  const learningObjectives = keyConcepts.slice(0, 6).map(
    c => `Understand and explain the concept of "${c}" as described in this lecture`
  );
  learningObjectives.push('Connect the key concepts and describe how they relate to each other');
  learningObjectives.push('Answer quiz questions about this material without looking at notes');

  // "What the student should learn" — grounded in definitions + concepts from the PDF
  const goodDefs = definitions.filter(d => d.definition !== 'A concept discussed in this lecture');
  const whatStudentShouldLearn = [];
  for (const { term, definition } of goodDefs.slice(0, 4)) {
    whatStudentShouldLearn.push(
      `Know the definition of "${term}": ${definition.length > 90 ? definition.substring(0, 90) + '…' : definition}`
    );
  }
  const remaining = 6 - whatStudentShouldLearn.length;
  for (const c of keyConcepts.slice(0, remaining)) {
    whatStudentShouldLearn.push(`Be able to explain "${c}" in your own words`);
  }
  whatStudentShouldLearn.push('Score at least 70 % on the quiz to confirm understanding of this material');

  return { summary, keyConcepts, learningObjectives, whatStudentShouldLearn };
};

// ─── Main Export: generateStudyPlanFromText ───────────────────────────────────

const generateStudyPlanFromText = (text, lectureTitle = 'Lecture', subjectName = '', topicTitle = '') => {
  if (!text || text.trim().split(/\s+/).length < MINIMUM_WORDS) {
    throw new Error(
      'The uploaded PDF does not contain enough readable lecture text to generate a study plan. ' +
      'Please upload a clearer lecture PDF.'
    );
  }

  const allWords      = text.split(/\s+/);
  const wordCount     = allWords.length;
  const limitedText   = allWords.slice(0, 8000).join(' ');
  const cleaned       = cleanText(limitedText);
  const sentences     = extractSentences(cleaned);
  const keyTerms      = extractKeyTerms(cleaned, 15);
  const definitions   = extractDefinitions(cleaned);
  const topConcepts   = keyTerms.slice(0, 10).map(capitalize);

  if (sentences.length < MINIMUM_SENTENCES || keyTerms.length < MINIMUM_TERMS) {
    throw new Error(
      'The uploaded PDF does not contain enough readable lecture text to generate a study plan. ' +
      'Please upload a clearer lecture PDF.'
    );
  }

  const estimatedReadTime = Math.ceil(wordCount / 200);
  const studyTime         = Math.max(estimatedReadTime * 3, 30);

  // Overview: use top-scored sentences that are actually informative
  const rankedSentences = sentences
    .map(s => ({ s, score: scoreQuizWorthiness(s) }))
    .sort((a, b) => b.score - a.score);

  const overviewSentences = rankedSentences
    .slice(0, 4)
    .map(({ s }) => s)
    .join(' ')
    .substring(0, 600);

  // Causal / process sentences from the PDF (high pedagogical value)
  const processPattern = /\b(?:causes?|produces?|results?\s+in|leads?\s+to|converts?|transforms?|enables?|creates?|forms?|consists?\s+of|involves?|requires?)\b/i;
  const processSentences = sentences
    .filter(s => processPattern.test(s) && scoreQuizWorthiness(s) > 0)
    .slice(0, 5);

  // Definitions section
  const goodDefs = definitions.filter(d => d.definition !== 'A concept discussed in this lecture');
  const defSection = goodDefs.length > 0
    ? goodDefs.slice(0, 6).map(d => `- **${d.term}**: ${d.definition}`).join('\n')
    : topConcepts.slice(0, 5).map(c => `- **${c}**: Review the lecture for the definition of this term.`).join('\n');

  // Learning objectives from actual PDF concepts
  const learningObjs = topConcepts.slice(0, 6).map((c, i) =>
    `${i + 1}. Explain the concept of **${c}** as described in this lecture`
  );
  learningObjs.push(`${learningObjs.length + 1}. Describe the relationships between the key concepts`);
  learningObjs.push(`${learningObjs.length + 1}. Answer quiz questions about this lecture without referring to notes`);

  // Self-check questions grounded in PDF content
  const selfCheck = [];
  for (const { term, definition } of goodDefs.slice(0, 4)) {
    selfCheck.push(`- What does the lecture say about **${term}**? (Answer: ${truncate(definition, 80)})`);
  }
  for (const c of topConcepts.slice(0, Math.max(0, 5 - selfCheck.length))) {
    selfCheck.push(`- Can you explain **${c}** in your own words based on the lecture?`);
  }
  selfCheck.push(`- How do the following concepts relate to each other: ${topConcepts.slice(0, 3).join(', ')}?`);

  // Review tasks grounded in PDF content
  const reviewTasks = topConcepts.slice(0, 5).map(c =>
    `- [ ] Be able to define and explain **${c}** without looking at notes`
  );
  if (processSentences.length > 0) {
    reviewTasks.push(`- [ ] Understand the processes and relationships described in the lecture`);
  }
  if (goodDefs.length > 0) {
    reviewTasks.push(`- [ ] Memorise all key definitions from the lecture`);
  }
  reviewTasks.push(`- [ ] Score ≥ 70 % on the auto-generated quiz before moving on`);

  // Practice tasks (content-driven)
  const practiceTasks = [
    `- Write a 5-sentence summary of the lecture using only these concepts: ${topConcepts.slice(0, 4).join(', ')}`,
    `- Create a diagram or mind-map showing how the key concepts connect to each other`,
    goodDefs.length > 0
      ? `- Create flashcards for these defined terms: ${goodDefs.slice(0, 4).map(d => d.term).join(', ')}`
      : `- Create flashcards for the top concepts: ${topConcepts.slice(0, 4).join(', ')}`,
    `- Take the auto-generated quiz without looking at the lecture; review every wrong answer`,
    `- Explain the most important idea from the lecture to someone who has not read it`,
  ];

  // Weak-area recommendations based on identified key concepts
  const recommendations = [
    `If you struggled with **${topConcepts[0] || 'any concept'}**, re-read the relevant section of the lecture before re-taking the quiz.`,
    `Focus extra attention on the definitions: ${goodDefs.slice(0, 3).map(d => d.term).join(', ') || topConcepts.slice(0, 3).join(', ')}.`,
    `Review the quiz results — each wrong answer includes the exact sentence from the lecture where the answer appears.`,
    `Use spaced repetition: review this material again in 2-3 days and 1 week to lock it into long-term memory.`,
    `Connect these concepts to what you already know${subjectName ? ` in ${subjectName}` : ''} — look for links between this lecture and previous material.`,
    `If more than 30 % of quiz answers were wrong, re-read the full lecture before attempting the quiz again.`,
  ];

  // Build the full plan string
  const plan = `# Study Plan: ${lectureTitle}
${subjectName ? `**Subject:** ${subjectName}  ` : ''}
${topicTitle ? `**Topic:** ${topicTitle}  ` : ''}
**Source:** Uploaded Lecture PDF
**Word Count:** ~${wordCount.toLocaleString()} words
**Estimated Read Time:** ${estimatedReadTime} min
**Recommended Total Study Time:** ${studyTime} min

---

## 1. Lecture Overview

${overviewSentences || `This lecture covers: ${topConcepts.join(', ')}.`}

---

## 2. Key Concepts

${topConcepts.map(c => `- **${c}**`).join('\n')}

---

## 3. Key Definitions from the Lecture

${defSection}

---

## 4. Learning Objectives

After studying this lecture you should be able to:

${learningObjs.join('\n')}

---

## 5. Step-by-Step Study Plan

### Step 1 – First Read-Through (${estimatedReadTime} min)
Read the entire lecture once without stopping. Your goal is to understand the overall structure and what topics are covered, not to memorise anything yet.

### Step 2 – Identify and Highlight Key Concepts (10 min)
Go back through the lecture and highlight or underline every occurrence of these concepts:
${topConcepts.slice(0, 6).map(c => `- ${c}`).join('\n')}

### Step 3 – Study the Definitions (10 min)
For each definition below, cover the answer and try to recall it from memory. Repeat until you can.
${goodDefs.slice(0, 5).map(d => `- **${d.term}**: ${d.definition}`).join('\n') || topConcepts.slice(0, 5).map(c => `- **${c}**: define this from the lecture`).join('\n')}

### Step 4 – Deep Understanding (${Math.ceil(studyTime * 0.35)} min)
For each key concept, write in your own words:
- What it means
- Why it is important
- How it connects to other concepts in this lecture

${processSentences.length > 0 ? `Pay special attention to these processes and relationships from the lecture:\n${processSentences.slice(0, 3).map(s => `> "${truncate(s, 160)}"`).join('\n')}` : ''}

### Step 5 – Practice Tasks

${practiceTasks.join('\n')}

### Step 6 – Self-Test with the Auto-Generated Quiz (15 min)
Take the quiz without looking at the lecture. After submitting, open each wrong answer and read the source sentence provided in the explanation.

### Step 7 – Targeted Review (10 min)
For every question you got wrong, find and re-read the relevant section of the lecture. Mark the sentence so you can find it quickly next time.

### Step 8 – Final Consolidation (10 min)
Write a paragraph (5–8 sentences) summarising the entire lecture in your own words. Include at least four of the key concepts by name.

---

## 6. Review Checklist

${reviewTasks.join('\n')}

---

## 7. Self-Check Questions

${selfCheck.join('\n')}

---

## 8. Weak-Area Recommendations

${recommendations.map(r => `- ${r}`).join('\n')}

---

## 9. Suggested Study Schedule

| Session | Duration | Focus |
|---------|----------|-------|
| Session 1 | ${estimatedReadTime + 10} min | First read + concept identification |
| Session 2 | ${Math.ceil(studyTime * 0.35)} min | Definitions + deep understanding |
| Session 3 | 20 min | Practice tasks + quiz |
| Session 4 | 15 min | Targeted review of wrong answers |
| Session 5 | 10 min | Final consolidation + self-check |`.trim();

  const summary =
    overviewSentences.substring(0, 400) ||
    sentences.slice(0, 3).join(' ').substring(0, 400) ||
    `This lecture covers ${lectureTitle}.`;

  return { plan, keyConcepts: topConcepts, summary, recommendations };
};

module.exports = { extractSummaryAndConcepts, generateQuizFromText, generateStudyPlanFromText };
