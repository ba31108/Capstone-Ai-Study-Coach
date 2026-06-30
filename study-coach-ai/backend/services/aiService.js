/**
 * AI Service - Study Coach AI
 * Currently generates structured study plans and quizzes using template logic.
 * Architecture is ready for OpenAI API integration in a future version.
 */

/**
 * Generate a personalized study plan for a given topic.
 */
const generateStudyPlan = (topic, subject, learningGoal, availableTime) => {
  const difficultyLabel = {
    easy: 'Beginner Level',
    medium: 'Intermediate Level',
    hard: 'Advanced Level',
  }[topic.difficulty] || 'Intermediate Level';

  const plan = `
# Study Plan: ${topic.title}

**Subject:** ${subject.name}
**Difficulty:** ${difficultyLabel}
**Available Study Time:** ${availableTime}
**Learning Goal:** ${learningGoal}

---

## 1. Introduction
Welcome to your personalized study session on "${topic.title}". This plan has been created to help you understand the topic systematically and achieve your learning goal within the time you have available.

${topic.description ? `**Topic Overview:** ${topic.description}` : ''}

---

## 2. Key Concepts to Master
Before diving into the material, make sure you understand these core ideas:

- The fundamental definition and meaning of ${topic.title}
- How ${topic.title} connects to the broader subject of ${subject.name}
- The main components or stages involved in ${topic.title}
- Real-world examples or applications of ${topic.title}
- Common misconceptions or mistakes to avoid

---

## 3. Step-by-Step Learning Plan

### Step 1 – Review and Activate Prior Knowledge (5 minutes)
Start by recalling what you already know about ${subject.name} and how ${topic.title} fits into it. Write down 3 things you remember, even if they are vague.

### Step 2 – Read and Understand (${availableTime ? Math.floor(parseInt(availableTime) * 0.4) || 15 : 15} minutes)
Read through your notes, textbook, or learning materials on ${topic.title}. Focus on understanding the main ideas rather than memorizing. Highlight or underline key sentences.

### Step 3 – Summarize in Your Own Words (10 minutes)
After reading, close your materials and write a short summary of ${topic.title} in your own words. This confirms how well you understood the material.

### Step 4 – Practice with Examples (10 minutes)
Work through 2–3 examples or exercises related to ${topic.title}. If your subject involves formulas or diagrams, draw them out. If it involves concepts, create a short explanation as if you were teaching it to a friend.

### Step 5 – Self-Check (5 minutes)
Answer these quick questions to test yourself:
1. Can you explain what ${topic.title} means in one sentence?
2. Can you describe at least two key facts about ${topic.title}?
3. Can you give a real example or application?

---

## 4. Review and Consolidation
At the end of your session:
- Go back and re-read only the parts you found difficult.
- Compare your summary with the original material.
- Take the practice quiz to test your knowledge objectively.

---

## 5. Tips for This Session
- Study in a quiet, distraction-free environment.
- Take a short break if you feel your focus dropping.
- Do not skip the self-check — it is the most important part of active learning.
- After completing this plan, mark the topic status as "In Progress" or "Completed" in your dashboard.
  `.trim();

  const recommendations = [
    `Focus on understanding the "why" behind ${topic.title}, not just the "what".`,
    `After this session, try explaining ${topic.title} to someone else — this deepens understanding.`,
    `Use diagrams or mind maps to visualize the structure of ${topic.title}.`,
    `Take the quiz after finishing this plan to identify any weak areas.`,
    `Review this topic again in 2–3 days using spaced repetition for better retention.`,
    `Connect ${topic.title} to other topics you have already learned in ${subject.name}.`,
  ];

  return { plan, recommendations };
};

/**
 * Generate a 5-question multiple-choice quiz for a given topic.
 */
const generateQuiz = (topic, subject) => {
  const t = topic.title;
  const s = subject.name;

  const questions = [
    {
      question: `What is the main purpose of studying "${t}" in the subject of ${s}?`,
      options: [
        `To understand the basic concept of ${t}`,
        `To complete unrelated assignments`,
        `To memorize random facts`,
        `To skip more advanced topics`,
      ],
      correctAnswer: `To understand the basic concept of ${t}`,
    },
    {
      question: `Why is "${t}" considered an important topic in ${s}?`,
      options: [
        `It is not important at all`,
        `Because it helps build knowledge in the subject`,
        `Because it is the easiest topic`,
        `It is only relevant outside of school`,
      ],
      correctAnswer: `Because it helps build knowledge in the subject`,
    },
    {
      question: `What is the best first step when starting to learn about "${t}"?`,
      options: [
        `Ignore it and move to the next topic`,
        `Start memorizing without understanding`,
        `Break the topic into smaller parts`,
        `Only rely on guessing`,
      ],
      correctAnswer: `Break the topic into smaller parts`,
    },
    {
      question: `Which learning strategy is most effective for mastering "${t}"?`,
      options: [
        `Read once and never review`,
        `Take a quiz and review mistakes`,
        `Skip practice exercises`,
        `Only study the night before a test`,
      ],
      correctAnswer: `Take a quiz and review mistakes`,
    },
    {
      question: `How can a student confirm they have truly understood "${t}"?`,
      options: [
        `By copying notes without reading them`,
        `By reviewing wrong answers`,
        `By avoiding all practice questions`,
        `By skipping the summary step`,
      ],
      correctAnswer: `By reviewing wrong answers`,
    },
  ];

  return questions;
};

module.exports = { generateStudyPlan, generateQuiz };
