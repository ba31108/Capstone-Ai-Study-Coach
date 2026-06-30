import { Calculator, Microscope, BookOpen, Code, Star, Globe } from 'lucide-react';

export const RESOURCES = [
  {
    id: 1,
    category: 'Mathematics',
    level: 'All Levels',
    time: '~45 min',
    title: 'Algebra Fundamentals',
    desc: 'Master algebraic expressions, equations, and functions with step-by-step explanations and practice exercises.',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: Calculator,
    content: `## Introduction to Algebra

Algebra is the branch of mathematics that deals with symbols and the rules for manipulating those symbols. It is a unifying thread of almost all of mathematics and includes everything from solving elementary equations to studying abstractions.

## Core Concepts

### Variables and Expressions
A **variable** is a symbol (usually a letter like x, y, or n) that represents an unknown quantity. An **expression** is a combination of variables, numbers, and operations — for example, 3x + 5.

### Equations
An **equation** is a statement that two expressions are equal. For example:
- 2x + 3 = 11
- To solve: subtract 3 from both sides → 2x = 8 → x = 4

### Linear Equations
A linear equation has the form ax + b = c, where a, b, and c are constants and x is the variable.

**Steps to solve:**
1. Simplify both sides if needed
2. Move all variable terms to one side
3. Move all constant terms to the other side
4. Divide both sides by the coefficient

### Quadratic Equations
A quadratic equation has the form ax² + bx + c = 0. The solutions can be found using the **quadratic formula**:
x = (-b ± √(b² - 4ac)) / 2a

### Functions
A **function** maps each input (x) to exactly one output (y). Written as f(x) = expression.
- Linear function: f(x) = 2x + 1
- Quadratic function: f(x) = x² - 3x + 2

## Key Rules

- **Commutative**: a + b = b + a and a × b = b × a
- **Associative**: (a + b) + c = a + (b + c)
- **Distributive**: a(b + c) = ab + ac
- **Order of operations**: Parentheses → Exponents → Multiply/Divide → Add/Subtract (PEMDAS)

## Worked Example

Solve: 3(x + 4) = 27
1. Expand: 3x + 12 = 27
2. Subtract 12: 3x = 15
3. Divide by 3: x = 5

**Check:** 3(5 + 4) = 3 × 9 = 27 ✓`,
    keyPoints: [
      'Variables represent unknown quantities in algebraic expressions',
      'Equations are solved by performing the same operation on both sides',
      'The distributive property: a(b + c) = ab + ac',
      'Functions map each input to exactly one output',
      'The quadratic formula solves any quadratic equation',
      'Order of operations (PEMDAS) must always be followed',
    ],
    recommendedPractice: [
      'Solve 5 linear equations from your textbook using step-by-step working',
      'Write and solve a real-world word problem using an equation',
      'Practice expanding and factoring expressions with the distributive property',
      'Graph two linear functions and identify slope and y-intercept',
    ],
    relatedSubjects: ['Mathematics', 'Physics'],
  },
  {
    id: 2,
    category: 'Mathematics',
    level: 'High School',
    time: '~30 min',
    title: 'Calculus & Derivatives',
    desc: 'Understand limits, derivatives, and integrals with clear visual explanations and worked examples.',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: Calculator,
    content: `## Introduction to Calculus

Calculus is the mathematical study of continuous change. It has two major branches: **differential calculus** (concerning rates of change and slopes) and **integral calculus** (concerning accumulation of quantities).

## Limits

A **limit** describes the value a function approaches as the input approaches some value.

lim(x→2) of (x² - 4)/(x - 2) = lim(x→2) of (x + 2) = 4

## Derivatives

The **derivative** of a function measures its rate of change at any point — it gives the slope of the tangent line.

**Notation:** f'(x) or dy/dx

**Basic rules:**
- Power rule: d/dx [xⁿ] = nxⁿ⁻¹
- Constant rule: d/dx [c] = 0
- Sum rule: d/dx [f + g] = f' + g'
- Product rule: d/dx [fg] = f'g + fg'
- Chain rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)

## Worked Example

Find f'(x) if f(x) = 3x⁴ - 2x² + 7x - 5

Using the power rule on each term:
f'(x) = 12x³ - 4x + 7

## Applications of Derivatives

- Finding maximum and minimum values of a function
- Determining where a function is increasing or decreasing
- Calculating velocity from a position function
- Optimization problems in real-world scenarios

## Integrals

The **integral** is the reverse of differentiation — it finds the area under a curve.

∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (where C is the constant of integration)`,
    keyPoints: [
      'A limit describes what value a function approaches near a point',
      'The derivative measures instantaneous rate of change (slope of tangent)',
      'Power rule: d/dx[xⁿ] = nxⁿ⁻¹',
      'Chain rule is used when differentiating composite functions',
      'Set the derivative to zero to find maximum/minimum points',
      'Integration is the reverse process of differentiation',
    ],
    recommendedPractice: [
      'Differentiate 5 polynomial functions using the power rule',
      'Apply the product rule and chain rule to 3 complex functions',
      'Find the maximum value of f(x) = -x² + 6x + 1 using derivatives',
      'Sketch the graph of f(x) and f\'(x) for a polynomial function',
    ],
    relatedSubjects: ['Mathematics', 'Physics', 'Engineering'],
  },
  {
    id: 3,
    category: 'Mathematics',
    level: 'Elementary',
    time: '~20 min',
    title: 'Basic Arithmetic & Number Sense',
    desc: 'Fun, interactive exercises for addition, subtraction, multiplication, and division designed for young learners.',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: Calculator,
    content: `## Welcome to Arithmetic!

Arithmetic is the foundation of all mathematics. Let's explore the four basic operations and how to use them every day.

## Addition
Adding means putting numbers together to find a total.
- 3 + 4 = 7
- 12 + 25 = 37
- **Tip:** You can add numbers in any order (3 + 4 = 4 + 3)

## Subtraction
Subtracting means taking away from a number.
- 9 - 5 = 4
- 30 - 14 = 16
- **Tip:** Subtraction is the opposite of addition

## Multiplication
Multiplying is a fast way of adding the same number many times.
- 3 × 4 = 12 (same as 3 + 3 + 3 + 3)
- 6 × 7 = 42
- Learning times tables makes multiplication much faster!

## Division
Dividing means splitting into equal groups.
- 12 ÷ 4 = 3 (12 split into 4 equal groups = 3 in each group)
- 20 ÷ 5 = 4

## Place Value
Every digit in a number has a place value:
- In 345: 3 is in the hundreds, 4 is in the tens, 5 is in the ones
- Understanding place value helps with larger calculations

## Word Problems
Word problems ask you to use arithmetic to solve real-life situations.

**Example:** Sara has 8 apples. She gives 3 to her friend. How many does she have left?
Answer: 8 - 3 = 5 apples`,
    keyPoints: [
      'Addition combines numbers to find a total sum',
      'Subtraction finds the difference between two numbers',
      'Multiplication is repeated addition of the same number',
      'Division splits a number into equal groups',
      'Knowing times tables (1–12) makes calculations much faster',
      'Place value tells us the worth of each digit in a number',
    ],
    recommendedPractice: [
      'Practice your times tables for 2, 5, and 10 first',
      'Solve 10 word problems involving addition and subtraction',
      'Play a card game where you multiply the two numbers you draw',
      'Use objects at home to practice division into equal groups',
    ],
    relatedSubjects: ['Mathematics'],
  },
  {
    id: 4,
    category: 'Biology',
    level: 'High School',
    time: '~40 min',
    title: 'Cell Biology & Structure',
    desc: 'Explore the building blocks of life: cell membranes, organelles, DNA, and how cells divide.',
    color: '#059669',
    bg: '#ecfdf5',
    icon: Microscope,
    content: `## The Cell: Basic Unit of Life

All living things are made of **cells**. Cells carry out all life processes including growth, energy production, and reproduction.

## Types of Cells

### Prokaryotic Cells
- Found in bacteria and archaea
- No membrane-bound nucleus
- Simpler structure
- DNA floats freely in cytoplasm

### Eukaryotic Cells
- Found in plants, animals, fungi, and protists
- Contains a true nucleus surrounded by a membrane
- Contains many membrane-bound organelles

## Key Organelles

| Organelle | Function |
|---|---|
| Nucleus | Controls cell activity; stores DNA |
| Mitochondria | Produces energy (ATP) — "powerhouse of the cell" |
| Ribosomes | Synthesizes proteins |
| Endoplasmic Reticulum | Transports materials through cell |
| Golgi Apparatus | Packages and ships proteins |
| Cell Membrane | Controls what enters and leaves the cell |
| Chloroplasts | Performs photosynthesis (plants only) |
| Cell Wall | Provides structure and protection (plants only) |

## Cell Membrane

The cell membrane is a **phospholipid bilayer** — two layers of phospholipid molecules with protein channels. It is **selectively permeable**, meaning it controls what passes in and out.

## DNA and the Nucleus

- DNA (deoxyribonucleic acid) carries genetic information
- Organized into **chromosomes** inside the nucleus
- Humans have 46 chromosomes (23 pairs)
- DNA is transcribed into RNA, which is translated into protein

## Cell Division

### Mitosis
- Produces 2 identical daughter cells
- Used for growth and repair
- Stages: Prophase → Metaphase → Anaphase → Telophase → Cytokinesis

### Meiosis
- Produces 4 genetically unique cells (gametes)
- Used for sexual reproduction
- Results in cells with half the chromosome number`,
    keyPoints: [
      'All living things are made of cells — the basic unit of life',
      'Prokaryotic cells lack a true nucleus; eukaryotic cells have one',
      'Mitochondria produce ATP energy for the cell',
      'The nucleus contains DNA organized into chromosomes',
      'The cell membrane is selectively permeable (phospholipid bilayer)',
      'Mitosis produces 2 identical cells; meiosis produces 4 unique gametes',
    ],
    recommendedPractice: [
      'Draw and label a plant cell and an animal cell from memory',
      'Create a table comparing prokaryotic and eukaryotic cells',
      'Describe the stages of mitosis in your own words with diagrams',
      'Explain why mitochondria are called the powerhouse of the cell',
    ],
    relatedSubjects: ['Biology', 'Science'],
  },
  {
    id: 5,
    category: 'Biology',
    level: 'University',
    time: '~60 min',
    title: 'Introduction to Genetics',
    desc: 'In-depth coverage of genetics, inheritance patterns, mutations, and molecular biology.',
    color: '#059669',
    bg: '#ecfdf5',
    icon: Microscope,
    content: `## What is Genetics?

Genetics is the study of heredity — how traits are passed from parents to offspring. It examines DNA, genes, chromosomes, and the mechanisms of inheritance.

## DNA Structure

DNA (deoxyribonucleic acid) is a double helix made of:
- **Nucleotides**: phosphate group + deoxyribose sugar + nitrogenous base
- **4 bases**: Adenine (A), Thymine (T), Guanine (G), Cytosine (C)
- Base pairing rules: A pairs with T; G pairs with C

## Genes and Chromosomes

- A **gene** is a segment of DNA that codes for a specific protein or trait
- **Chromosomes** are organized structures of DNA and protein
- Humans have 46 chromosomes (23 from each parent)
- **Alleles** are different versions of the same gene

## Mendelian Inheritance

Gregor Mendel discovered the laws of inheritance by studying pea plants.

### Law of Segregation
Each organism carries two alleles for each trait; these segregate during gamete formation so each gamete carries only one allele.

### Law of Independent Assortment
Genes for different traits are inherited independently (when on different chromosomes).

### Dominant and Recessive
- **Dominant allele** (A): expressed even with one copy
- **Recessive allele** (a): expressed only with two copies

### Punnett Squares
Used to predict offspring ratios. Aa × Aa cross gives 3:1 ratio (dominant:recessive).

## Mutations

A mutation is a change in the DNA sequence.
- **Point mutation**: single nucleotide change
- **Insertion/deletion**: adds or removes nucleotides (frameshift)
- **Chromosomal mutation**: large-scale rearrangement

## Gene Expression

DNA → RNA (transcription) → Protein (translation)
- **Transcription**: DNA is copied into messenger RNA in the nucleus
- **Translation**: ribosomes read mRNA and build a protein from amino acids`,
    keyPoints: [
      'DNA is a double helix made of nucleotides with A-T and G-C base pairing',
      'Genes are segments of DNA that encode proteins or traits',
      'Mendel\'s Law of Segregation: each gamete receives one allele per gene',
      'Dominant alleles mask recessive alleles in heterozygotes',
      'Punnett squares predict offspring phenotype and genotype ratios',
      'Gene expression: DNA → mRNA (transcription) → Protein (translation)',
    ],
    recommendedPractice: [
      'Complete three Punnett square crosses (monohybrid and dihybrid)',
      'Explain the difference between genotype and phenotype with examples',
      'Describe the central dogma of molecular biology in your own words',
      'Research one genetic disorder and explain its molecular basis',
    ],
    relatedSubjects: ['Biology', 'Science', 'Chemistry'],
  },
  {
    id: 6,
    category: 'Biology',
    level: 'High School',
    time: '~35 min',
    title: 'Photosynthesis & Cellular Respiration',
    desc: 'Engaging coverage of photosynthesis, cellular respiration, and energy flow in living systems.',
    color: '#059669',
    bg: '#ecfdf5',
    icon: Microscope,
    content: `## Energy in Living Systems

All living organisms need energy. Plants capture energy from sunlight through **photosynthesis**, while nearly all organisms release stored energy through **cellular respiration**.

## Photosynthesis

Photosynthesis converts light energy into chemical energy (glucose).

**Overall equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Location:** Chloroplasts (specifically the thylakoid membranes and stroma)

### Light-Dependent Reactions (in thylakoids)
- Chlorophyll absorbs sunlight
- Water is split (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂
- ATP and NADPH are produced
- Oxygen is released as a byproduct

### Light-Independent Reactions / Calvin Cycle (in stroma)
- CO₂ is fixed (attached to organic molecules)
- ATP and NADPH from the light reactions are used
- Glucose (G3P) is produced

## Cellular Respiration

Cellular respiration breaks down glucose to release ATP energy.

**Overall equation:**
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36-38 ATP

### Stages of Aerobic Respiration
1. **Glycolysis** (cytoplasm): Glucose → 2 pyruvate + 2 ATP
2. **Krebs Cycle** (mitochondrial matrix): pyruvate is fully oxidized, releases CO₂, produces NADH and FADH₂
3. **Electron Transport Chain** (inner mitochondrial membrane): NADH and FADH₂ donate electrons; oxygen is final electron acceptor; 32-34 ATP produced

## Comparing the Two Processes

| | Photosynthesis | Cellular Respiration |
|---|---|---|
| Reactants | CO₂ + H₂O + light | Glucose + O₂ |
| Products | Glucose + O₂ | CO₂ + H₂O + ATP |
| Location | Chloroplasts | Mitochondria |
| Energy | Stores energy | Releases energy |`,
    keyPoints: [
      'Photosynthesis equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
      'Light reactions occur in thylakoids; Calvin cycle occurs in stroma',
      'Cellular respiration equation: C₆H₁₂O₆ + 6O₂ → CO₂ + H₂O + ATP',
      'Glycolysis occurs in cytoplasm; Krebs cycle and ETC in mitochondria',
      'Aerobic respiration produces approximately 36-38 ATP per glucose',
      'Photosynthesis and respiration are complementary processes',
    ],
    recommendedPractice: [
      'Draw a diagram showing the two stages of photosynthesis and where each occurs',
      'Compare the reactants and products of photosynthesis vs. respiration',
      'Explain why mitochondria are essential for aerobic respiration',
      'Describe what happens to ATP during glycolysis step by step',
    ],
    relatedSubjects: ['Biology', 'Chemistry'],
  },
  {
    id: 7,
    category: 'English',
    level: 'All Levels',
    time: '~25 min',
    title: 'English Grammar Essentials',
    desc: 'Interactive grammar lessons covering tenses, sentence structure, punctuation, and vocabulary.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: BookOpen,
    content: `## The Foundation of English Grammar

Grammar is the set of rules that governs how we construct sentences and communicate meaning clearly. Mastering grammar allows you to write and speak with confidence and precision.

## Parts of Speech

| Part of Speech | Definition | Example |
|---|---|---|
| Noun | Person, place, thing, or idea | dog, London, happiness |
| Verb | Action or state of being | run, is, think |
| Adjective | Describes a noun | beautiful, large, green |
| Adverb | Describes a verb/adjective | quickly, very, almost |
| Pronoun | Replaces a noun | he, she, they, it |
| Preposition | Shows relationship | in, on, at, under |
| Conjunction | Connects words or clauses | and, but, because, although |

## Sentence Structure

A complete sentence needs a **subject** (who/what) and a **predicate** (verb + what happened).

- Simple: "The student studied hard."
- Compound: "The student studied hard, and she passed."
- Complex: "Although it was late, the student continued studying."

## Verb Tenses

- **Simple present**: I walk / She walks
- **Present continuous**: I am walking
- **Simple past**: I walked / She walked
- **Past continuous**: I was walking
- **Present perfect**: I have walked
- **Future simple**: I will walk / I am going to walk

## Punctuation Rules

- **Period (.)** — ends a declarative sentence
- **Comma (,)** — separates list items, joins independent clauses with conjunctions
- **Apostrophe (')** — shows possession (John's book) or contraction (don't = do not)
- **Colon (:)** — introduces a list or explanation
- **Semicolon (;)** — joins two closely related independent clauses

## Common Mistakes to Avoid

- **Its vs. It's**: "Its" is possessive; "it's" = "it is"
- **Their / There / They're**: ownership / location / "they are"
- **Subject-verb agreement**: "The team is" not "The team are" (American English)
- **Run-on sentences**: Use punctuation or conjunctions to separate independent clauses`,
    keyPoints: [
      'Every sentence needs a subject and a predicate to be complete',
      'Verb tense tells us when an action takes place (past, present, future)',
      'Adjectives describe nouns; adverbs describe verbs and adjectives',
      'Commas separate items in a list and join independent clauses with conjunctions',
      'Its (possessive) vs. It\'s (it is) — common error to avoid',
      'Subject-verb agreement: singular subjects take singular verbs',
    ],
    recommendedPractice: [
      'Write 10 sentences using 5 different verb tenses correctly',
      'Identify the parts of speech in a paragraph from a book you are reading',
      'Correct 5 example sentences containing grammar errors',
      'Write a short paragraph and identify every punctuation mark you used',
    ],
    relatedSubjects: ['English', 'Literature'],
  },
  {
    id: 8,
    category: 'English',
    level: 'High School',
    time: '~30 min',
    title: 'Academic Writing Guide',
    desc: 'Comprehensive resource for essay writing, citations, research papers, and academic English.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: BookOpen,
    content: `## Academic Writing Fundamentals

Academic writing is formal, clear, and evidence-based. It requires careful planning, structured argumentation, and proper citation of sources.

## Essay Structure

### Introduction
- **Hook**: engaging opening sentence
- **Background**: brief context for the topic
- **Thesis statement**: clear, arguable claim that your essay will prove

### Body Paragraphs (PEEL structure)
- **P**oint: the paragraph's main argument (topic sentence)
- **E**vidence: facts, quotes, data that support your point
- **E**xplain: analyze the evidence and connect it to your argument
- **L**ink: transition to the next paragraph

### Conclusion
- Restate your thesis (in different words)
- Summarize main points
- End with a broader implication or call to reflection

## Writing a Strong Thesis

A thesis is a single sentence that:
- States your argument clearly
- Is specific and debatable (not just a fact)
- Tells the reader what your essay will prove

**Weak**: "Social media has effects on teenagers."
**Strong**: "Excessive social media use significantly increases anxiety in adolescents by disrupting sleep patterns and creating unrealistic social comparisons."

## Citation Styles

### APA (common in social sciences)
- In-text: (Author, Year) → (Smith, 2022)
- Reference: Smith, J. (2022). *Title of book*. Publisher.

### MLA (common in humanities)
- In-text: (Author Page) → (Smith 45)
- Works Cited: Smith, John. *Title of Book*. Publisher, Year.

## Avoiding Plagiarism

- Always cite the source when using someone else's ideas or words
- Use quotation marks for direct quotes
- Paraphrase carefully and still cite
- Use plagiarism checkers before submitting

## Academic Vocabulary

Instead of → Use:
- "a lot" → "numerous", "significant", "considerable"
- "thing" → specify exactly what you mean
- "very good" → "exceptional", "outstanding"
- "shows" → "demonstrates", "illustrates", "reveals"`,
    keyPoints: [
      'A strong thesis is specific, arguable, and tells the reader your argument',
      'PEEL structure: Point → Evidence → Explain → Link',
      'Academic writing is formal — avoid contractions and casual language',
      'Always cite sources using a consistent citation style (APA or MLA)',
      'Plagiarism means using someone\'s ideas without credit — always cite',
      'The conclusion restates the thesis and broadens the discussion',
    ],
    recommendedPractice: [
      'Write a thesis statement for three different essay topics',
      'Write one complete PEEL body paragraph on a topic of your choice',
      'Practice citing 3 different source types in APA format',
      'Rewrite a casual paragraph into formal academic language',
    ],
    relatedSubjects: ['English', 'Literature', 'History'],
  },
  {
    id: 9,
    category: 'English',
    level: 'Elementary',
    time: '~15 min',
    title: 'Reading & Phonics Basics',
    desc: 'Fun phonics and reading practice for young learners with stories and letter-sound activities.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: BookOpen,
    content: `## Learning to Read is an Adventure!

Reading starts with understanding how letters make sounds. This is called **phonics**.

## The Alphabet and Sounds

Every letter makes a sound. Some letters make more than one sound!

- **A** says "ah" (apple) and "ay" (acorn)
- **C** says "k" (cat) and "s" (city)
- **G** says "g" (go) and "j" (giraffe)

## Vowels and Consonants

The **vowels** are: A, E, I, O, U
All other letters are **consonants**.

### Short vowel sounds (in simple words):
- a → cat, map
- e → bed, pen
- i → bit, sit
- o → hop, cot
- u → cup, bug

## Blending Sounds

To read a word, you **blend** the sounds together:
- c-a-t → "cat"
- d-o-g → "dog"
- s-u-n → "sun"

## Sight Words

Some common words don't follow regular phonics rules. Learn them by sight:
- the, is, was, are, have, they, said, here, there, where

## Reading Comprehension Tips

After reading a passage, ask yourself:
- **Who** is the story about?
- **What** happened?
- **Where** does it take place?
- **Why** did the characters do what they did?
- **How** did it end?

## Story Time!

Every story has three parts:
- **Beginning**: introduces the characters and setting
- **Middle**: the problem or adventure
- **End**: how the problem is solved`,
    keyPoints: [
      'Phonics = understanding how letters and sounds connect',
      'Vowels are A, E, I, O, U; all other letters are consonants',
      'Blending sounds means saying them together to form words',
      'Sight words must be memorized as they don\'t follow regular patterns',
      'Every story has a beginning, middle, and end',
      'Good readers ask Who, What, Where, Why, and How about the story',
    ],
    recommendedPractice: [
      'Practice blending 10 simple three-letter words (CVC patterns)',
      'Learn 5 new sight words and use each in a sentence',
      'Read a short story and answer the 5W questions about it',
      'Write your own short story with a beginning, middle, and end',
    ],
    relatedSubjects: ['English'],
  },
  {
    id: 10,
    category: 'Computer Science',
    level: 'Beginner',
    time: '~50 min',
    title: 'Web Development Basics',
    desc: 'Learn HTML, CSS, and JavaScript through hands-on explanations and coding challenges.',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: Code,
    content: `## Welcome to Web Development!

Every website you visit is built with three core technologies: **HTML**, **CSS**, and **JavaScript**.

## HTML — The Structure

HTML (HyperText Markup Language) defines the content and structure of a page using **tags**.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
    <a href="https://example.com">Click here</a>
  </body>
</html>
\`\`\`

**Common HTML tags:**
- \`<h1>\` to \`<h6>\` — headings
- \`<p>\` — paragraph
- \`<a href="">\` — link
- \`<img src="">\` — image
- \`<div>\` — container block
- \`<ul>\` / \`<li>\` — unordered list

## CSS — The Style

CSS (Cascading Style Sheets) controls how HTML elements look.

\`\`\`css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  font-size: 32px;
}
\`\`\`

**CSS concepts:**
- **Selectors**: target elements (h1, .class, #id)
- **Properties**: what to change (color, margin, font-size)
- **Box model**: margin → border → padding → content
- **Flexbox**: powerful layout tool for aligning elements

## JavaScript — The Interactivity

JavaScript makes pages dynamic and interactive.

\`\`\`js
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  alert('Button was clicked!');
});
\`\`\`

**Key JavaScript concepts:**
- Variables: \`let name = "Alice";\`
- Functions: \`function greet(name) { return "Hello " + name; }\`
- DOM manipulation: changing HTML/CSS with JavaScript
- Events: responding to clicks, key presses, form submissions

## How They Work Together

1. HTML creates the skeleton (structure)
2. CSS adds the skin (visual design)
3. JavaScript adds the muscles (behavior and interactivity)`,
    keyPoints: [
      'HTML provides structure using tags like <h1>, <p>, <div>, <a>',
      'CSS styles elements using selectors, properties, and values',
      'JavaScript adds interactivity by responding to user events',
      'The box model: margin → border → padding → content',
      'Flexbox is used to lay out and align elements on a page',
      'DOM manipulation lets JavaScript change the page dynamically',
    ],
    recommendedPractice: [
      'Build a simple personal webpage with HTML: heading, paragraph, and a list',
      'Style your HTML page with CSS — change fonts, colors, and layout',
      'Add a button to your page that changes text when clicked using JavaScript',
      'Use Flexbox to center an element both horizontally and vertically',
    ],
    relatedSubjects: ['Computer Science', 'Technology'],
  },
  {
    id: 11,
    category: 'Computer Science',
    level: 'University',
    time: '~90 min',
    title: 'Algorithms & Data Structures',
    desc: 'Core CS concepts covering algorithms, data structures, time complexity, and problem-solving strategies.',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: Code,
    content: `## Algorithms and Data Structures

These are the two fundamental pillars of computer science. Understanding them is essential for writing efficient software and succeeding in technical interviews.

## What is an Algorithm?

An algorithm is a finite sequence of well-defined instructions that solves a problem. Key properties:
- **Correctness**: produces the right output
- **Efficiency**: runs in reasonable time and memory
- **Clarity**: clearly defined steps

## Time Complexity (Big O Notation)

Big O describes how an algorithm's running time grows with input size n.

| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Array access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Log-linear | Merge sort |
| O(n²) | Quadratic | Bubble sort |

## Common Data Structures

### Arrays
- Fixed-size collection of same-type elements
- O(1) access by index, O(n) search

### Linked Lists
- Nodes connected by pointers
- O(1) insert at head, O(n) search

### Stacks (LIFO)
- Last In, First Out
- Operations: push, pop, peek
- Used in: function calls, undo history

### Queues (FIFO)
- First In, First Out
- Operations: enqueue, dequeue
- Used in: print queues, BFS

### Hash Tables
- Key-value pairs with O(1) average lookup
- Handle collisions via chaining or open addressing

### Trees & Binary Search Trees
- Hierarchical structure
- BST: O(log n) search, insert, delete (balanced)

## Sorting Algorithms

- **Bubble Sort**: O(n²) — repeatedly swaps adjacent elements
- **Selection Sort**: O(n²) — selects minimum and places in order
- **Merge Sort**: O(n log n) — divides array, sorts, then merges
- **Quick Sort**: O(n log n) average — partitions around a pivot

## Searching Algorithms

- **Linear Search**: O(n) — checks every element
- **Binary Search**: O(log n) — requires sorted array; splits in half each iteration`,
    keyPoints: [
      'Big O notation describes algorithm efficiency as input size grows',
      'O(1) is constant time; O(n²) is quadratic — avoid when possible',
      'Arrays have O(1) index access but O(n) search time',
      'Hash tables provide O(1) average-case lookup using key-value pairs',
      'Binary search only works on sorted data but runs in O(log n)',
      'Merge sort is O(n log n) and is stable; quicksort is O(n log n) average',
    ],
    recommendedPractice: [
      'Implement a stack and queue using an array',
      'Write a binary search algorithm from memory and trace it on an example',
      'Compare bubble sort and merge sort on the same array of 8 numbers',
      'Explain the time complexity of searching a hash table with and without collisions',
    ],
    relatedSubjects: ['Computer Science', 'Mathematics'],
  },
  {
    id: 12,
    category: 'Computer Science',
    level: 'High School',
    time: '~40 min',
    title: 'Programming Fundamentals',
    desc: 'Learn programming concepts: variables, loops, conditionals, functions, and debugging.',
    color: '#0891b2',
    bg: '#ecfeff',
    icon: Code,
    content: `## Getting Started with Programming

Programming is the process of giving instructions to a computer. These instructions are written in a **programming language** that the computer can understand.

## Variables

Variables store data that your program can use and change.

\`\`\`python
name = "Alice"
age = 17
score = 95.5
is_passing = True
\`\`\`

**Data types:**
- String: text ("Hello")
- Integer: whole number (42)
- Float: decimal number (3.14)
- Boolean: True or False

## Conditionals (if / elif / else)

Conditionals allow your program to make decisions.

\`\`\`python
score = 85
if score >= 90:
    print("A grade")
elif score >= 75:
    print("B grade")
else:
    print("Needs improvement")
\`\`\`

## Loops

Loops repeat a block of code.

### For loop (known number of times):
\`\`\`python
for i in range(5):
    print(i)  # prints 0, 1, 2, 3, 4
\`\`\`

### While loop (until condition is false):
\`\`\`python
count = 0
while count < 3:
    print("counting:", count)
    count += 1
\`\`\`

## Functions

Functions are reusable blocks of code that perform a specific task.

\`\`\`python
def calculate_area(width, height):
    area = width * height
    return area

result = calculate_area(5, 3)
print(result)  # 15
\`\`\`

## Debugging

When your program has errors, you need to **debug** it:
1. Read the error message carefully
2. Identify which line caused the error
3. Check your logic step-by-step
4. Use print statements to see values at each stage
5. Fix the bug and test again`,
    keyPoints: [
      'Variables store data: strings, integers, floats, and booleans',
      'Conditionals (if/elif/else) let programs make decisions',
      'For loops repeat a set number of times; while loops repeat until a condition is false',
      'Functions are reusable blocks of code that accept inputs and return outputs',
      'Debugging means finding and fixing errors in your code',
      'Good code is readable, well-named, and broken into small functions',
    ],
    recommendedPractice: [
      'Write a program that asks for a number and prints if it\'s even or odd',
      'Create a function that takes two numbers and returns the larger one',
      'Use a for loop to print the multiplication table for any number',
      'Debug a program with 3 intentional errors — find and fix each one',
    ],
    relatedSubjects: ['Computer Science', 'Mathematics'],
  },
  {
    id: 13,
    category: 'Science',
    level: 'High School',
    time: '~35 min',
    title: 'Physics: Forces & Motion',
    desc: 'Explore Newton\'s laws, forces, acceleration, and motion with worked examples and diagrams.',
    color: '#d97706',
    bg: '#fffbeb',
    icon: Star,
    content: `## Forces and Motion

Physics explains how and why objects move. Understanding forces and motion is fundamental to engineering, sports, space travel, and everyday life.

## Newton's Three Laws of Motion

### First Law — The Law of Inertia
An object at rest stays at rest, and an object in motion stays in motion at the same speed and direction, **unless acted upon by an unbalanced force**.

- Example: A book stays on a table (at rest). A ball rolling on ice keeps rolling.

### Second Law — F = ma
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

**F = ma** (Force = mass × acceleration)

- Units: Force in Newtons (N), mass in kg, acceleration in m/s²
- Example: A 5 kg box pushed with 20 N force → a = F/m = 20/5 = 4 m/s²

### Third Law — Action and Reaction
For every action, there is an equal and opposite reaction.

- Example: A rocket expels gas downward → gas pushes rocket upward
- Example: You push against a wall → wall pushes back on you

## Types of Forces

| Force | Description |
|---|---|
| Gravity | Pulls objects toward Earth (g = 9.8 m/s²) |
| Normal force | Perpendicular support from a surface |
| Friction | Opposes motion between surfaces |
| Tension | Force in a rope or string |
| Applied force | Force applied by a person or object |

## Motion Equations (Kinematics)

For constant acceleration:
- v = u + at
- s = ut + ½at²
- v² = u² + 2as

Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement

## Free Body Diagrams

A free body diagram shows all forces acting on an object as arrows.
- Arrow direction = direction of force
- Arrow length = relative magnitude of force`,
    keyPoints: [
      'Newton\'s 1st Law: Objects maintain their state of motion unless a force acts on them',
      'Newton\'s 2nd Law: F = ma — force equals mass times acceleration',
      'Newton\'s 3rd Law: Every action has an equal and opposite reaction',
      'Weight = mass × gravitational acceleration (W = mg, g = 9.8 m/s²)',
      'Friction opposes the direction of motion',
      'Kinematics equations describe motion under constant acceleration',
    ],
    recommendedPractice: [
      'Calculate the acceleration of a 10 kg object with 50 N of net force',
      'Draw a free body diagram for a book resting on a table',
      'Use kinematics equations to find final velocity after 5 s at 3 m/s² acceleration',
      'Describe a real-life example of each of Newton\'s three laws',
    ],
    relatedSubjects: ['Science', 'Physics', 'Mathematics'],
  },
  {
    id: 14,
    category: 'Science',
    level: 'Elementary',
    time: '~20 min',
    title: 'Earth Science Basics',
    desc: 'Fun exploration of animals, nature, weather, the water cycle, and planet Earth for younger students.',
    color: '#d97706',
    bg: '#fffbeb',
    icon: Star,
    content: `## Our Amazing Planet Earth

Earth is the third planet from the Sun and the only planet known to support life. Let's explore what makes our planet so special!

## Layers of the Earth

The Earth has four main layers:
1. **Crust** — the thin outer layer we live on (solid rock)
2. **Mantle** — thick layer of hot, semi-solid rock
3. **Outer Core** — liquid iron and nickel
4. **Inner Core** — solid iron and nickel (very hot and under huge pressure)

## The Water Cycle

Water constantly moves between the Earth's surface and atmosphere.

1. **Evaporation**: The sun heats water in oceans and lakes → water vapor rises
2. **Condensation**: Water vapor cools high in the atmosphere → forms clouds
3. **Precipitation**: Water falls as rain, snow, sleet, or hail
4. **Collection**: Water collects in oceans, rivers, lakes, and groundwater

## Weather vs. Climate

- **Weather**: What conditions are like right now (today's rain, today's temperature)
- **Climate**: The average weather pattern in a region over many years

## Ecosystems

An **ecosystem** is a community of living things interacting with their environment.

- **Producers** (plants) use sunlight to make food
- **Consumers** (animals) eat other organisms for energy
- **Decomposers** (fungi, bacteria) break down dead matter

## Rocks and Minerals

Three types of rock:
- **Igneous**: formed from cooled magma (granite, basalt)
- **Sedimentary**: formed from compressed sediments (sandstone, limestone)
- **Metamorphic**: formed when existing rock is changed by heat and pressure (marble, slate)`,
    keyPoints: [
      'The Earth has four layers: crust, mantle, outer core, inner core',
      'The water cycle: evaporation → condensation → precipitation → collection',
      'Weather = current conditions; Climate = long-term patterns',
      'Ecosystems include producers, consumers, and decomposers',
      'Three rock types: igneous, sedimentary, and metamorphic',
      'The sun is the primary energy source for life on Earth',
    ],
    recommendedPractice: [
      'Draw and label the four layers of the Earth from memory',
      'Create a diagram of the water cycle with arrows and labels',
      'Find three different types of rocks or minerals and describe each',
      'Write about one way humans affect the environment and how we can help',
    ],
    relatedSubjects: ['Science', 'Biology', 'Geography'],
  },
  {
    id: 15,
    category: 'History',
    level: 'High School',
    time: '~25 min',
    title: 'World History: Ancient Civilizations',
    desc: 'Engaging overview of ancient civilizations, empires, and how they shaped the modern world.',
    color: '#dc2626',
    bg: '#fee2e2',
    icon: Globe,
    content: `## The Ancient World

Human civilization began approximately 10,000 years ago with the development of agriculture. This allowed people to settle in one place and build complex societies.

## The Fertile Crescent — Cradle of Civilization

The Fertile Crescent (modern Iraq, Syria, and surrounding areas) is often called the birthplace of civilization. The Sumerians built the first known cities here around 3500 BCE.

**Key Sumerian achievements:**
- Invented writing (cuneiform script)
- Developed early legal codes
- Built the first cities (Ur, Uruk)
- Created advanced mathematics and astronomy

## Ancient Egypt

Egypt developed along the Nile River from around 3100 BCE.

- The **pharaoh** was considered both king and god
- Achievements: pyramids, hieroglyphic writing, papyrus, medicine, mummification
- The Nile floods deposited rich soil, enabling agriculture
- Egypt unified under Pharaoh Narmer around 3100 BCE

## Ancient Greece

Greece flourished from ~800 BCE to 31 BCE.

- Birthplace of **democracy** (Athens, 5th century BCE)
- Major philosophers: Socrates, Plato, Aristotle
- Olympic Games began 776 BCE
- City-states (polis): Athens and Sparta were rivals

## The Roman Empire

Rome grew from a small city-state to control the entire Mediterranean world.

- Roman Republic (509–27 BCE): governed by Senate and elected officials
- Roman Empire (27 BCE–476 CE): ruled by emperors
- Key achievements: Roman law, roads, aqueducts, Latin language
- Christianity spread through the empire
- The Fall of Rome (476 CE) began the Middle Ages

## Why These Civilizations Matter

These civilizations gave us writing, law, democracy, philosophy, architecture, and the foundations of science — all still influencing us today.`,
    keyPoints: [
      'Agriculture (~10,000 BCE) enabled permanent settlements and civilization',
      'Sumerians invented writing (cuneiform) and built the first cities (~3500 BCE)',
      'Ancient Egypt thrived along the Nile; pharaohs were considered divine rulers',
      'Greece was birthplace of democracy, philosophy, and the Olympic Games',
      'Rome developed legal systems, infrastructure, and spread through the Mediterranean',
      'These civilizations laid foundations for law, language, government, and culture',
    ],
    recommendedPractice: [
      'Create a timeline of major ancient civilizations from 3500 BCE to 476 CE',
      'Compare the governments of ancient Athens and the Roman Republic',
      'Identify three achievements of ancient Egypt still relevant today',
      'Explain how geography (rivers, mountains, climate) shaped ancient civilizations',
    ],
    relatedSubjects: ['History', 'Geography', 'Social Studies'],
  },
  {
    id: 16,
    category: 'History',
    level: 'University',
    time: '~45 min',
    title: 'Modern History: 20th Century World',
    desc: 'Detailed coverage of World Wars, the Cold War, decolonization, and the making of the modern world.',
    color: '#dc2626',
    bg: '#fee2e2',
    icon: Globe,
    content: `## The 20th Century: A World Transformed

The twentieth century was the most transformative in human history — marked by two devastating world wars, technological revolution, ideological conflict, and the dismantling of colonial empires.

## World War I (1914–1918)

**Causes (MAIN):** Militarism, Alliance system, Imperialism, Nationalism

- Assassination of Archduke Franz Ferdinand (June 1914) triggered the war
- Trench warfare on the Western Front
- New weapons: poison gas, machine guns, tanks
- ~20 million deaths; ended with the Treaty of Versailles (1919)
- The harsh peace terms imposed on Germany planted seeds for WWII

## The Interwar Period (1919–1939)

- Rise of fascism in Italy (Mussolini, 1922) and Germany (Hitler, 1933)
- The Great Depression (1929) caused global economic collapse
- Soviet Union under Stalin pursued industrialization through terror

## World War II (1939–1945)

**Key events:**
- Germany invades Poland (Sept 1939) → Britain and France declare war
- Holocaust: systematic genocide of 6 million Jews and millions of others
- Pearl Harbor (Dec 1941) → US enters the war
- D-Day (June 1944): Allied invasion of Normandy
- Atomic bombs on Hiroshima and Nagasaki (Aug 1945)
- ~70–85 million deaths — deadliest conflict in history

## The Cold War (1947–1991)

- USA (capitalism/democracy) vs. USSR (communism) — ideological rivalry
- Arms race and nuclear deterrence
- Korean War (1950–53), Vietnam War (1955–75)
- Cuban Missile Crisis (1962) — closest to nuclear war
- Berlin Wall (1961–1989)
- Soviet collapse (1991) ends the Cold War

## Decolonization (1940s–1970s)

- After WWII, European colonial empires collapsed
- India gained independence (1947); Africa and Asia followed
- Created many new nations, often with political instability

## End of the Century

- Fall of the Berlin Wall (1989)
- Dissolution of the Soviet Union (1991)
- Rise of globalization and the internet`,
    keyPoints: [
      'WWI (1914-18) caused by Militarism, Alliances, Imperialism, and Nationalism',
      'The harsh Treaty of Versailles (1919) created conditions for WWII',
      'WWII (1939-45) was the deadliest conflict in history (~70-85 million deaths)',
      'The Holocaust was the systematic murder of 6 million Jews by Nazi Germany',
      'The Cold War (1947-91) was an ideological struggle between USA and USSR',
      'Decolonization after WWII created many new independent nations',
    ],
    recommendedPractice: [
      'Explain the chain of events that led from the assassination of Franz Ferdinand to WWI',
      'Compare the causes and consequences of WWI and WWII',
      'Describe three major events of the Cold War and their global impact',
      'Analyze how WWII reshaped international relations and created institutions like the UN',
    ],
    relatedSubjects: ['History', 'Political Science', 'Geography'],
  },
  {
    id: 17,
    category: 'Elementary Basics',
    level: 'Elementary',
    time: '~20 min',
    title: 'Early Learning: Reading, Math & Science',
    desc: 'A comprehensive early curriculum covering reading, math, science, and art for young learners.',
    color: '#f59e0b',
    bg: '#fffbeb',
    icon: Star,
    content: `## Welcome, Young Learner!

Learning is a great adventure. Every day you discover something new about the world around you. Let's explore reading, numbers, and science together!

## Reading Together

Books take you on amazing journeys without leaving your seat!

### How to be a Great Reader:
1. **Look at the cover** — what do you think the book will be about?
2. **Read slowly** — take time with each word
3. **Sound out** new words using what you know about letters
4. **Ask questions** as you read — "what happens next?"
5. **Talk about it** — tell someone what the story was about

### Your Reading Checklist:
- [ ] I can read 10 sight words without stopping
- [ ] I can sound out a three-letter word
- [ ] I can retell a story's beginning, middle, and end

## Numbers Are Everywhere!

You use numbers every day — when you count apples, tell the time, or share equally.

### Counting Practice:
Can you count to 100? Try skipping: 2, 4, 6, 8, 10...

### Shapes:
- Circle: 0 corners, round
- Square: 4 equal sides and 4 corners
- Triangle: 3 sides and 3 corners
- Rectangle: 2 long sides, 2 short sides

### Measurement:
We measure things to compare them! Use a ruler to measure length in centimeters or inches.

## Science is Asking "Why?"

Scientists ask questions and then find out the answers by observing and experimenting.

### Simple Experiments at Home:
- **Ice melting**: Put ice in the sun and shade — which melts faster? Why?
- **Plant growth**: Plant two seeds — give one sunlight and keep one in the dark
- **Floating and sinking**: Put different objects in water — what floats?

### The Scientific Method (for kids):
1. Ask a question
2. Make a guess (hypothesis)
3. Do the experiment
4. Look at what happened
5. Learn from it!`,
    keyPoints: [
      'Good readers preview the cover, read slowly, and talk about what they read',
      'Numbers appear in everyday life: counting, sharing, measuring, and telling time',
      'Shapes have different numbers of sides and corners',
      'Science means asking "why?" and finding the answer by trying things out',
      'The scientific method: question → hypothesis → experiment → observe → learn',
      'Learning is most fun when you explore and ask your own questions',
    ],
    recommendedPractice: [
      'Read one book today and draw your favorite part from the story',
      'Count all the chairs in your home — write the number down',
      'Find 3 objects at home and put them in water — which ones float?',
      'Draw and label 4 different shapes you can find around you',
    ],
    relatedSubjects: ['Mathematics', 'English', 'Science'],
  },
  {
    id: 18,
    category: 'Elementary Basics',
    level: 'Elementary',
    time: '~15 min',
    title: 'Math Games & Logic Puzzles',
    desc: 'Brain-training games and puzzles that make math fun and engaging for elementary school students.',
    color: '#f59e0b',
    bg: '#fffbeb',
    icon: Calculator,
    content: `## Math Can Be Fun!

Math puzzles and games make learning exciting. They train your brain to think logically and creatively — skills you use in every part of life.

## Number Puzzles

### Magic Squares
A magic square has rows, columns, and diagonals that all add up to the same number!

Try this 3×3 magic square (all rows, columns, diagonals = 15):
\`\`\`
2 | 7 | 6
9 | 5 | 1
4 | 3 | 8
\`\`\`

### Missing Number Puzzles
Find the pattern and fill in the missing number:
- 2, 4, 6, ?, 10 → Answer: 8
- 1, 4, 9, 16, ? → Answer: 25 (they are square numbers!)
- 3, 6, 12, 24, ? → Answer: 48 (each doubles!)

## Logic Puzzles

### Grid Puzzles
Arrange objects so each row and column has each item exactly once (like a mini Sudoku).

### Brain Teasers
- "I have 4 legs in the morning, 2 at noon, and 3 in the evening. What am I?" (A human: baby, adult, elderly with cane)
- "What gets bigger the more you take away?" (A hole!)

## Estimation Games

- How many jellybeans are in a jar? Make a guess — then count!
- If a bus holds 30 people and 4 buses arrive, how many people is that?
- Round these numbers: 37 → 40, 82 → 80, 145 → 150

## Strategy Games That Teach Math

- **Sudoku** (beginner level): logic and number placement
- **Connect Four**: think ahead and plan
- **Dominoes**: matching and counting
- **Card games** (Go Fish, War): number comparison

## Timetable Tricks

- **×2**: double the number (5×2 = 10)
- **×5**: count by fives (7×5 = 35)
- **×10**: add a zero (6×10 = 60)
- **×9 trick**: the digits always add up to 9 (9×3 = 27, 2+7 = 9!)`,
    keyPoints: [
      'Magic squares have rows, columns, and diagonals that all sum to the same number',
      'Number patterns can be arithmetic (add/subtract) or geometric (multiply/divide)',
      'Estimation means making a smart guess — round to the nearest 10 or 100',
      'Multiplication tricks: ×2 doubles, ×5 ends in 0 or 5, ×10 adds a zero',
      'Logic puzzles train systematic thinking and problem-solving',
      'Games like Sudoku and dominoes develop mathematical thinking through play',
    ],
    recommendedPractice: [
      'Create your own 3×3 magic square (all rows, columns, diagonals must equal 15)',
      'Find the next three numbers in the pattern: 5, 10, 20, 40, ?, ?, ?',
      'Practice times tables for 2, 5, and 10 until you can recite them quickly',
      'Play a round of beginner Sudoku and explain your logic to someone',
    ],
    relatedSubjects: ['Mathematics'],
  },
];

export const CATEGORIES = [
  'All',
  'Mathematics',
  'Biology',
  'English',
  'Computer Science',
  'Science',
  'History',
  'Elementary Basics',
];

export const levelBadgeClass = (level) => ({
  'All Levels': 'badge--blue',
  'Elementary': 'badge--green',
  'Beginner': 'badge--green',
  'High School': 'badge--yellow',
  'University': 'badge--purple',
}[level] || 'badge--gray');
