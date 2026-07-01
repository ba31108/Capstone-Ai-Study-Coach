'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Resource = require('../models/Resource');

if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in backend/.env');
  process.exit(1);
}

// ─── Resource Data ────────────────────────────────────────────────────────────

const resources = [

  // ── MATHEMATICS ──────────────────────────────────────────────────────────────

  {
    title: 'Introduction to Algebra',
    category: 'Mathematics',
    level: 'High School',
    estimatedReadingTime: '~25 min',
    description: 'Master the foundations of algebra — variables, expressions, equations, and how to solve them step by step.',
    content: `## What is Algebra?

Algebra is the branch of mathematics that uses symbols (usually letters) to represent numbers and quantities in formulas and equations. It allows us to solve problems where one or more values are unknown.

## Variables and Expressions

A **variable** is a letter that stands for an unknown number, such as x, y, or n.

An **expression** is a combination of numbers, variables, and operations:
- 3x + 5
- 2y - 7
- a² + b²

An **equation** is an expression with an equals sign, stating that two things are equal:
- 2x + 3 = 11

## Solving Linear Equations

The goal is to isolate the variable on one side.

**Example:** Solve 2x + 3 = 11

Step 1: Subtract 3 from both sides → 2x = 8
Step 2: Divide both sides by 2 → x = 4
Step 3: Check: 2(4) + 3 = 11 ✓

**Golden rule:** Whatever you do to one side of the equation, you must do to the other side.

## Order of Operations (PEMDAS)

Always solve in this order:
1. **P**arentheses
2. **E**xponents
3. **M**ultiplication and **D**ivision (left to right)
4. **A**ddition and **S**ubtraction (left to right)

**Example:** 3 + 2 × (4 - 1)² = 3 + 2 × 9 = 3 + 18 = 21

## Combining Like Terms

Like terms have the same variable and exponent.

- 3x + 5x = 8x ✓ (same variable)
- 3x + 5y = 3x + 5y ✗ (different variables, cannot combine)

**Example:** Simplify 4x + 3y - 2x + 7y
= (4x - 2x) + (3y + 7y)
= 2x + 10y

## Inequalities

Inequalities show that two expressions are not equal:
- > greater than
- < less than
- ≥ greater than or equal to
- ≤ less than or equal to

**Example:** Solve 3x - 6 > 9
→ 3x > 15
→ x > 5

**Note:** When multiplying or dividing by a negative number, flip the inequality sign.`,
    keyPoints: [
      'A variable is a letter representing an unknown number; an equation sets two expressions equal',
      'To solve an equation, isolate the variable by performing the same operation on both sides',
      'PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction',
      'Like terms have the same variable and exponent and can be combined',
      'When multiplying or dividing an inequality by a negative number, flip the inequality sign',
    ],
    recommendedPractice: [
      'Solve 10 linear equations such as 3x + 7 = 22 and check your answers by substituting back',
      'Simplify five algebraic expressions by combining like terms',
      'Practice the order of operations with mixed expressions like 4 + 3 × (2² - 1)',
      'Write your own word problem and translate it into an algebraic equation',
    ],
  },

  {
    title: 'Geometry: Shapes, Angles, and Area',
    category: 'Mathematics',
    level: 'High School',
    estimatedReadingTime: '~20 min',
    description: 'Explore the world of geometry — lines, angles, polygons, circles, and how to calculate perimeter and area.',
    content: `## What is Geometry?

Geometry is the branch of mathematics that studies shapes, sizes, positions, and properties of figures and spaces.

## Lines and Angles

- **Point:** A location in space with no size.
- **Line:** A straight path extending infinitely in both directions.
- **Line segment:** A part of a line with two endpoints.
- **Ray:** A line with one endpoint that extends infinitely in one direction.

**Types of angles:**
- Acute: less than 90°
- Right: exactly 90°
- Obtuse: between 90° and 180°
- Straight: exactly 180°

**Complementary angles** add up to 90°. **Supplementary angles** add up to 180°.

## Triangles

A triangle has 3 sides and 3 angles. The sum of interior angles always equals **180°**.

**Types by sides:**
- Equilateral: all sides equal
- Isosceles: two sides equal
- Scalene: no sides equal

**Types by angles:**
- Acute triangle: all angles < 90°
- Right triangle: one angle = 90°
- Obtuse triangle: one angle > 90°

**Pythagorean Theorem** (right triangles): a² + b² = c²
where c is the hypotenuse (longest side).

## Quadrilaterals

A quadrilateral has 4 sides. Interior angles sum to **360°**.

- Square: 4 equal sides, 4 right angles
- Rectangle: opposite sides equal, 4 right angles
- Parallelogram: opposite sides parallel and equal
- Trapezoid: one pair of parallel sides

## Area Formulas

| Shape | Formula |
|-------|---------|
| Rectangle | A = length × width |
| Triangle | A = ½ × base × height |
| Circle | A = π × r² |
| Parallelogram | A = base × height |
| Trapezoid | A = ½(b₁ + b₂) × height |

## Circles

- **Radius (r):** distance from center to edge
- **Diameter (d):** d = 2r
- **Circumference:** C = 2πr = πd
- **Area:** A = πr²

π ≈ 3.14159`,
    keyPoints: [
      'The sum of interior angles in a triangle is always 180°; in a quadrilateral it is 360°',
      'The Pythagorean Theorem states a² + b² = c² for right triangles',
      'Area of a rectangle = length × width; area of a triangle = ½ × base × height',
      'Circle circumference = 2πr; circle area = πr²',
      'Complementary angles sum to 90°; supplementary angles sum to 180°',
    ],
    recommendedPractice: [
      'Calculate the area and perimeter of five different shapes using the formulas',
      'Use the Pythagorean Theorem to find the missing side of three right triangles',
      'Draw and label all types of angles and triangles from memory',
      'Solve a real-world problem: find the area of a room to calculate how much carpet is needed',
    ],
  },

  {
    title: 'Fractions, Decimals, and Percentages',
    category: 'Mathematics',
    level: 'Beginner',
    estimatedReadingTime: '~18 min',
    description: 'Understand fractions, convert between fractions and decimals, and master percentage calculations used in everyday life.',
    content: `## Fractions

A fraction represents a part of a whole. It has a **numerator** (top) and a **denominator** (bottom).

Example: ¾ means 3 out of 4 equal parts.

**Types of fractions:**
- Proper fraction: numerator < denominator (¾)
- Improper fraction: numerator > denominator (7/4)
- Mixed number: whole number + fraction (1¾)

**Adding fractions:** Same denominator → add numerators.
- ½ + ⅓ → find common denominator (6) → 3/6 + 2/6 = 5/6

**Multiplying fractions:** Multiply numerators and denominators.
- ⅔ × ¾ = 6/12 = ½

**Dividing fractions:** Multiply by the reciprocal.
- ⅔ ÷ ¾ = ⅔ × 4/3 = 8/9

## Decimals

Decimals are another way to write fractions using place values.

**Place values:** 0.1 = tenths, 0.01 = hundredths, 0.001 = thousandths

**Converting fraction to decimal:** Divide numerator by denominator.
- ¾ = 3 ÷ 4 = 0.75

**Converting decimal to fraction:**
- 0.6 = 6/10 = 3/5

## Percentages

A percentage is a fraction out of 100.

**Converting:**
- Fraction to percent: (numerator ÷ denominator) × 100
  - ¾ = 0.75 × 100 = 75%
- Percent to decimal: divide by 100
  - 35% = 0.35
- Percent to fraction: write over 100 and simplify
  - 40% = 40/100 = 2/5

**Finding a percentage of a number:**
- 20% of 150 = 0.20 × 150 = 30

**Percentage increase/decrease:**
- % change = (new - old) / old × 100
- Price went from $80 to $100: (100-80)/80 × 100 = 25% increase`,
    keyPoints: [
      'A fraction has a numerator (top) and denominator (bottom); it represents part of a whole',
      'To add fractions, find a common denominator first',
      'To divide fractions, multiply by the reciprocal of the divisor',
      'Percent means "per hundred"; to convert a decimal to percent, multiply by 100',
      'Percentage change = (new value − old value) ÷ old value × 100',
    ],
    recommendedPractice: [
      'Convert five fractions to decimals and five decimals to fractions',
      'Calculate 15%, 25%, and 40% of different numbers',
      'Add and subtract three pairs of fractions with different denominators',
      'Solve a real-world problem: a shirt costs $60 and is 30% off — what is the sale price?',
    ],
  },

  // ── BIOLOGY ──────────────────────────────────────────────────────────────────

  {
    title: 'Cell Biology: Structure and Function',
    category: 'Biology',
    level: 'High School',
    estimatedReadingTime: '~22 min',
    description: 'Explore the fundamental unit of life — the cell. Learn about cell organelles, their functions, and the differences between prokaryotic and eukaryotic cells.',
    content: `## What is a Cell?

The cell is the basic structural and functional unit of all living organisms. Every living thing — from bacteria to plants to humans — is made of cells.

**Two main types of cells:**
- **Prokaryotic cells:** No true nucleus; DNA floats freely in cytoplasm. Example: bacteria.
- **Eukaryotic cells:** Have a true nucleus enclosed in a membrane. Example: plant and animal cells.

## Cell Organelles and Their Functions

### The Nucleus
The control center of the cell. Contains DNA (genetic information) and directs cell activities. Surrounded by the **nuclear membrane (envelope)**.

### Cell Membrane
A thin, flexible barrier surrounding all cells. Controls what enters and exits the cell. Made of a **phospholipid bilayer**.

### Cytoplasm
The jelly-like fluid filling the cell. Holds organelles in place and allows substances to move through the cell.

### Mitochondria
The **powerhouse of the cell**. Produces energy (ATP) through cellular respiration. Has its own DNA.

### Ribosomes
Tiny structures that **build proteins** by reading mRNA instructions. Found on the rough ER or floating freely in cytoplasm.

### Endoplasmic Reticulum (ER)
- **Rough ER:** Covered with ribosomes; makes and transports proteins.
- **Smooth ER:** No ribosomes; makes lipids and detoxifies chemicals.

### Golgi Apparatus
The cell's **post office**. Receives proteins from the ER, modifies them, packages them, and ships them to their destination.

### Lysosomes (animal cells)
Contain digestive enzymes that break down waste, food particles, and old cell parts. The cell's **recycling center**.

### Vacuoles
Storage organelles.
- Animal cells: small, temporary vacuoles
- Plant cells: one large central vacuole that stores water and maintains cell pressure (turgor pressure)

### Chloroplasts (plant cells only)
Site of **photosynthesis**. Contains chlorophyll, which captures sunlight to make glucose. Has its own DNA.

### Cell Wall (plant cells only)
Rigid outer layer outside the cell membrane, made of **cellulose**. Provides structural support and protection.

## Plant vs. Animal Cells

| Feature | Plant Cell | Animal Cell |
|---------|-----------|-------------|
| Cell wall | ✓ | ✗ |
| Chloroplasts | ✓ | ✗ |
| Large vacuole | ✓ | ✗ (small) |
| Centrioles | ✗ | ✓ |
| Shape | Rectangular | Irregular |`,
    keyPoints: [
      'Prokaryotic cells lack a nucleus; eukaryotic cells have a membrane-bound nucleus containing DNA',
      'The mitochondria produces ATP (energy) through cellular respiration',
      'Ribosomes build proteins; the Golgi apparatus packages and ships them',
      'Plant cells have a cell wall, chloroplasts, and a large central vacuole — animal cells do not',
      'The cell membrane controls what enters and exits the cell via the phospholipid bilayer',
    ],
    recommendedPractice: [
      'Draw and label a plant cell and an animal cell from memory, including all major organelles',
      'Create a comparison table of prokaryotic vs. eukaryotic cells with at least five differences',
      'Match each organelle to its function without looking at notes',
      'Write a short paragraph explaining how a protein gets from a ribosome to outside the cell',
    ],
  },

  {
    title: 'Photosynthesis and Cellular Respiration',
    category: 'Biology',
    level: 'Intermediate',
    estimatedReadingTime: '~20 min',
    description: 'Understand how plants convert sunlight into energy and how cells release that energy through respiration — two processes that power all life on Earth.',
    content: `## Photosynthesis

Photosynthesis is the process by which plants, algae, and some bacteria convert **light energy** into **chemical energy** (glucose).

**Location:** Chloroplasts (specifically the thylakoid membranes and stroma)

**Overall equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

In words: Carbon dioxide + water + sunlight → glucose + oxygen

### Two Stages of Photosynthesis

**1. Light-dependent reactions (in thylakoid membranes)**
- Chlorophyll absorbs sunlight
- Water molecules are split (photolysis), releasing O₂
- ATP and NADPH are produced (energy carriers)

**2. Calvin Cycle / Light-independent reactions (in stroma)**
- Uses ATP and NADPH from stage 1
- CO₂ is fixed into glucose (sugar)
- Does not directly require light

## Cellular Respiration

Cellular respiration is the process by which cells break down glucose to release **ATP energy** for cell functions.

**Location:** Cytoplasm (glycolysis) and mitochondria (Krebs cycle + electron transport chain)

**Overall equation:**
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energy)

### Three Stages of Cellular Respiration

**1. Glycolysis (cytoplasm)**
- Glucose (6C) is split into two pyruvate molecules (3C each)
- Produces 2 ATP and 2 NADH
- Does NOT require oxygen

**2. Krebs Cycle / Citric Acid Cycle (mitochondrial matrix)**
- Pyruvate is converted to Acetyl-CoA
- Releases CO₂
- Produces ATP, NADH, and FADH₂

**3. Electron Transport Chain (inner mitochondrial membrane)**
- Uses NADH and FADH₂
- Produces most of the ATP (~32-34 ATP per glucose)
- Oxygen is the final electron acceptor, forming water

## Photosynthesis vs. Respiration

| | Photosynthesis | Respiration |
|---|---|---|
| Location | Chloroplasts | Mitochondria |
| Reactants | CO₂, H₂O, light | Glucose, O₂ |
| Products | Glucose, O₂ | CO₂, H₂O, ATP |
| Energy | Stores energy | Releases energy |
| Organisms | Plants, algae | All living cells |`,
    keyPoints: [
      'Photosynthesis converts light energy into glucose: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
      'Cellular respiration releases ATP from glucose: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
      'Photosynthesis has two stages: light-dependent reactions (thylakoids) and the Calvin Cycle (stroma)',
      'Cellular respiration has three stages: glycolysis, Krebs Cycle, and electron transport chain',
      'Photosynthesis and respiration are complementary: the products of one are the reactants of the other',
    ],
    recommendedPractice: [
      'Write both overall equations from memory and label all reactants and products',
      'Create a diagram showing where each stage of both processes takes place in the cell',
      'Explain how cutting down forests affects the balance of CO₂ and O₂ in the atmosphere',
      'Compare aerobic respiration vs. anaerobic fermentation in terms of ATP yield',
    ],
  },

  // ── ENGLISH ──────────────────────────────────────────────────────────────────

  {
    title: 'Grammar Fundamentals: Parts of Speech',
    category: 'English',
    level: 'Beginner',
    estimatedReadingTime: '~20 min',
    description: 'Build a strong foundation in English grammar by mastering the eight parts of speech and how they work together in sentences.',
    content: `## Why Grammar Matters

Grammar is the system of rules that governs how we use language. Understanding grammar helps you communicate clearly, write effectively, and understand what you read.

## The Eight Parts of Speech

### 1. Noun
A noun names a person, place, thing, or idea.
- **Common nouns:** dog, city, book (general)
- **Proper nouns:** London, Emma, Monday (specific, always capitalized)
- **Abstract nouns:** love, freedom, courage (ideas or feelings)
- **Collective nouns:** team, flock, family (groups)

### 2. Pronoun
A pronoun replaces a noun to avoid repetition.
- **Personal:** I, you, he, she, it, we, they
- **Possessive:** my, your, his, her, its, our, their
- **Reflexive:** myself, yourself, himself
- Example: "Sarah loves Sarah's cat" → "Sarah loves her cat"

### 3. Verb
A verb expresses action or state of being.
- **Action verbs:** run, write, think, eat
- **Linking verbs:** am, is, are, was, were, seem, become
- **Helping verbs:** will, can, should, must (used with main verbs)

**Verb tenses:** past, present, future
- "I walked" / "I walk" / "I will walk"

### 4. Adjective
An adjective describes or modifies a noun or pronoun.
- "The **tall** tree" / "She is **intelligent**" / "**Three** students"
- Adjectives answer: What kind? How many? Which one?

### 5. Adverb
An adverb modifies a verb, adjective, or another adverb.
- Modifying a verb: "She runs **quickly**"
- Modifying an adjective: "He is **very** tall"
- Many adverbs end in -ly (happily, slowly, carefully)
- Adverbs answer: How? When? Where? How much?

### 6. Preposition
A preposition shows the relationship between a noun/pronoun and another word.
- Common prepositions: in, on, at, by, for, with, to, from, under, between
- Example: "The book is **on** the table"

### 7. Conjunction
A conjunction connects words, phrases, or clauses.
- **Coordinating (FANBOYS):** For, And, Nor, But, Or, Yet, So
  - "I like tea **and** coffee"
- **Subordinating:** because, although, when, if, while
  - "She stayed home **because** it was raining"

### 8. Interjection
An interjection expresses strong emotion, often followed by an exclamation mark.
- "**Wow!** That's amazing." / "**Oh no,** I forgot my keys."`,
    keyPoints: [
      'Nouns name people, places, things, or ideas; proper nouns are always capitalized',
      'Verbs express action or state of being and must agree with their subject in number',
      'Adjectives modify nouns; adverbs modify verbs, adjectives, or other adverbs',
      'Conjunctions connect words or clauses; FANBOYS are the coordinating conjunctions',
      'Pronouns replace nouns to avoid repetition; they must agree with the noun they replace',
    ],
    recommendedPractice: [
      'Identify all eight parts of speech in five sentences from a book or article',
      'Write one original sentence for each part of speech that clearly demonstrates it',
      'Rewrite a paragraph using pronouns to replace repeated nouns',
      'Underline all adjectives in blue and all adverbs in red in a short passage',
    ],
  },

  {
    title: 'Essay Writing: Structure and Techniques',
    category: 'English',
    level: 'High School',
    estimatedReadingTime: '~25 min',
    description: 'Learn how to plan, structure, and write a compelling essay — from crafting a strong thesis to writing effective body paragraphs and conclusions.',
    content: `## What is an Essay?

An essay is a piece of writing that presents an argument or explores an idea in an organized, logical way. Strong essays are clear, focused, and well-supported with evidence.

## The Five-Paragraph Essay Structure

The most common essay structure has:
1. **Introduction**
2. **Body Paragraph 1**
3. **Body Paragraph 2**
4. **Body Paragraph 3**
5. **Conclusion**

For longer essays, you can have more body paragraphs — but the structure remains the same.

## The Introduction

The introduction has three parts:

**1. Hook** — Grabs the reader's attention.
- Start with a surprising fact, question, quote, or anecdote.
- Avoid: "In this essay, I will…"

**2. Background/Context** — Provides necessary background on the topic.

**3. Thesis Statement** — The most important sentence in your essay. States your main argument in one or two sentences.
- Weak: "I will talk about climate change."
- Strong: "Immediate government policy changes are essential to combat climate change because current emissions levels threaten global food security and biodiversity."

## Body Paragraphs (PEEL Structure)

Each body paragraph should follow the **PEEL** format:

- **P — Point:** State the main idea of the paragraph (topic sentence)
- **E — Evidence:** Provide facts, quotes, statistics, or examples
- **E — Explanation:** Explain how the evidence supports your point
- **L — Link:** Connect back to the thesis or transition to the next point

**Example topic sentence:** "One major consequence of climate change is the increased frequency of extreme weather events."

## Transitions

Transitions connect ideas between paragraphs and within paragraphs.
- Adding ideas: furthermore, in addition, moreover
- Contrasting: however, on the other hand, nevertheless
- Showing cause/effect: therefore, as a result, consequently
- Summarizing: in conclusion, to sum up, overall

## The Conclusion

The conclusion should:
1. **Restate** the thesis (in different words)
2. **Summarize** the main points briefly
3. **End with a final thought** — a call to action, prediction, or broader implication

Avoid introducing new information in the conclusion.

## Editing Checklist

- Does every paragraph have a clear topic sentence?
- Is every claim supported by evidence?
- Are all sentences complete (subject + verb)?
- Have you checked spelling and grammar?
- Does the essay flow logically from introduction to conclusion?`,
    keyPoints: [
      'A thesis statement presents the main argument of your essay in one or two focused sentences',
      'Each body paragraph follows PEEL: Point, Evidence, Explanation, Link',
      'The introduction hooks the reader, provides context, and ends with the thesis',
      'Transitions connect ideas between paragraphs to create a logical flow',
      'The conclusion restates the thesis, summarizes main points, and ends with a final thought — no new information',
    ],
    recommendedPractice: [
      'Write a thesis statement for three different essay topics and get feedback on their clarity',
      'Take one body paragraph and check it against the PEEL format — add anything missing',
      'Read an essay and highlight all transition words to see how they connect ideas',
      'Write a complete five-paragraph essay on a topic you know well, then self-edit using the checklist',
    ],
  },

  // ── COMPUTER SCIENCE ─────────────────────────────────────────────────────────

  {
    title: 'Introduction to Programming: Core Concepts',
    category: 'Computer Science',
    level: 'Beginner',
    estimatedReadingTime: '~22 min',
    description: 'Learn the fundamental concepts that underpin all programming languages — variables, data types, loops, conditionals, and functions.',
    content: `## What is Programming?

Programming is the process of writing instructions (code) that a computer can execute to perform tasks. A **program** is a set of instructions; a **programming language** is the syntax used to write them.

Popular languages include Python, JavaScript, Java, C++, and many more.

## Variables and Data Types

A **variable** is a named container that stores data.

\`\`\`python
name = "Alice"   # String
age = 17         # Integer
gpa = 3.8        # Float (decimal)
is_student = True  # Boolean
\`\`\`

**Common data types:**
- **String:** Text, enclosed in quotes → "Hello"
- **Integer:** Whole numbers → 42
- **Float:** Decimal numbers → 3.14
- **Boolean:** True or False only

## Operators

**Arithmetic:** + - * / // (floor division) % (remainder) ** (power)

**Comparison:** == (equal) != (not equal) > < >= <=

**Logical:** and, or, not

## Conditionals (if / else)

Conditionals let your program make decisions.

\`\`\`python
score = 85
if score >= 90:
    print("A grade")
elif score >= 75:
    print("B grade")
else:
    print("C or below")
\`\`\`

## Loops

Loops repeat code multiple times.

**For loop** — runs a set number of times:
\`\`\`python
for i in range(5):
    print(i)  # prints 0, 1, 2, 3, 4
\`\`\`

**While loop** — runs while a condition is True:
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
\`\`\`

## Functions

A **function** is a reusable block of code that performs a specific task.

\`\`\`python
def greet(name):
    return "Hello, " + name + "!"

print(greet("Alice"))  # Output: Hello, Alice!
\`\`\`

Functions help avoid repeating code and make programs easier to read and maintain.

## Lists (Arrays)

A list stores multiple values in a single variable.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])   # apple (index starts at 0)
fruits.append("mango")  # add an item
print(len(fruits))  # 4
\`\`\`

## Comments

Comments explain code for humans; the computer ignores them.

\`\`\`python
# This is a comment
x = 5  # This sets x to 5
\`\`\`

## Debugging

Debugging is the process of finding and fixing errors (bugs) in code.

**Types of errors:**
- **Syntax error:** Incorrect code structure (missing colon, wrong indentation)
- **Runtime error:** Code crashes while running (dividing by zero)
- **Logic error:** Code runs but gives wrong output`,
    keyPoints: [
      'Variables store data; the main data types are String, Integer, Float, and Boolean',
      'Conditionals (if/elif/else) allow programs to make decisions based on conditions',
      'For loops iterate a fixed number of times; while loops run until a condition becomes false',
      'Functions are reusable blocks of code defined with def; they improve readability and reduce repetition',
      'Lists store multiple values; indexing starts at 0 in most programming languages',
    ],
    recommendedPractice: [
      'Write a program that asks for the user\'s age and prints whether they are a minor or adult',
      'Create a function that takes two numbers and returns their sum, difference, and product',
      'Write a loop that prints the multiplication table for any number the user enters',
      'Build a simple number-guessing game using variables, conditionals, and a while loop',
    ],
  },

  {
    title: 'Data Structures: Arrays, Stacks, and Queues',
    category: 'Computer Science',
    level: 'Intermediate',
    estimatedReadingTime: '~24 min',
    description: 'Understand the essential data structures used in programming — arrays, stacks, and queues — and learn when and why to use each one.',
    content: `## What Are Data Structures?

A data structure is a way of organizing and storing data in a computer so it can be accessed and modified efficiently. Choosing the right data structure can make your program dramatically faster.

## Arrays

An **array** is a collection of elements stored in contiguous memory, accessed by index.

**Key properties:**
- Fixed size (in many languages)
- Random access: O(1) — you can get any element instantly by index
- Insert/delete in the middle: O(n) — requires shifting elements

\`\`\`python
arr = [10, 20, 30, 40, 50]
print(arr[2])    # 30  — O(1) access
arr.append(60)   # Add to end — O(1)
arr.insert(1, 15)  # Insert at index 1 — O(n)
\`\`\`

**Use arrays when:** you need fast access by index and know the size in advance.

## Stacks

A **stack** is a Last-In, First-Out (LIFO) structure. Think of a stack of plates — you can only add or remove from the top.

**Operations:**
- **push:** add an item to the top
- **pop:** remove the item from the top
- **peek:** look at the top item without removing it

\`\`\`python
stack = []
stack.append("page1")   # push
stack.append("page2")   # push
stack.append("page3")   # push
print(stack.pop())      # "page3" — last in, first out
print(stack.pop())      # "page2"
\`\`\`

**Real-world uses:** browser back button, undo/redo in text editors, function call stack.

## Queues

A **queue** is a First-In, First-Out (FIFO) structure. Think of a line at a ticket counter — first person in line is served first.

**Operations:**
- **enqueue:** add an item to the back
- **dequeue:** remove the item from the front

\`\`\`python
from collections import deque
queue = deque()
queue.append("customer1")   # enqueue
queue.append("customer2")   # enqueue
queue.append("customer3")   # enqueue
print(queue.popleft())      # "customer1" — first in, first out
\`\`\`

**Real-world uses:** print spooler, task scheduling, breadth-first search.

## Comparison Table

| Structure | Order | Add | Remove | Access by Index |
|-----------|-------|-----|--------|----------------|
| Array | Any | O(1) end | O(n) | O(1) |
| Stack | LIFO | O(1) top | O(1) top | O(n) |
| Queue | FIFO | O(1) back | O(1) front | O(n) |

## Big O Notation

Big O notation describes the time complexity (performance) of an operation as input size grows.
- **O(1):** Constant — same speed regardless of size
- **O(n):** Linear — time grows proportionally with input
- **O(n²):** Quadratic — time grows exponentially (avoid for large inputs)`,
    keyPoints: [
      'Arrays store elements in contiguous memory with O(1) index access but O(n) mid-insertion',
      'Stacks are LIFO — last item added is the first removed; used for undo operations and call stacks',
      'Queues are FIFO — first item added is the first removed; used for task scheduling and BFS',
      'Big O notation measures time complexity: O(1) is constant, O(n) is linear, O(n²) is quadratic',
      'Choose a data structure based on which operations (access, insert, delete) you need to be fastest',
    ],
    recommendedPractice: [
      'Implement a stack and a queue from scratch using a Python list',
      'Simulate a browser back-button using a stack: push pages, pop to go back',
      'Simulate a print queue: enqueue 5 documents and dequeue them in order',
      'Solve this problem: given a string, use a stack to check if brackets are balanced (e.g. "{[()]}" is valid)',
    ],
  },

  // ── SCIENCE ──────────────────────────────────────────────────────────────────

  {
    title: "Newton's Laws of Motion",
    category: 'Science',
    level: 'High School',
    estimatedReadingTime: '~20 min',
    description: "Understand Isaac Newton's three fundamental laws of motion that describe how forces affect the movement of objects — the foundation of classical mechanics.",
    content: `## Who was Isaac Newton?

Sir Isaac Newton (1643–1727) was an English mathematician and physicist. In 1687, he published his three laws of motion in "Principia Mathematica," which formed the foundation of classical (Newtonian) mechanics and remained the basis of physics for over 200 years.

## Newton's First Law — Law of Inertia

**"An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction, unless acted upon by an unbalanced force."**

**Inertia** is the tendency of an object to resist changes in its state of motion.

- A book on a table stays still (at rest) unless something pushes it.
- A moving soccer ball slows down because of friction (an unbalanced force), not on its own.

**Mass and inertia:** More mass = more inertia = harder to start or stop moving.

**Real-life example:** When a car brakes suddenly, passengers lurch forward because their bodies want to keep moving.

## Newton's Second Law — Law of Acceleration

**F = ma**
**Force = Mass × Acceleration**

Where:
- F = force (measured in Newtons, N)
- m = mass (measured in kilograms, kg)
- a = acceleration (measured in m/s²)

**Key relationships:**
- More force → more acceleration (if mass is constant)
- More mass → less acceleration (if force is constant)

**Example:** A 5 kg box is pushed with 20 N of force.
a = F/m = 20/5 = 4 m/s²

**Real-life example:** It is harder to push a loaded shopping cart than an empty one (more mass = less acceleration for the same force).

## Newton's Third Law — Law of Action-Reaction

**"For every action, there is an equal and opposite reaction."**

Forces always come in pairs. When object A exerts a force on object B, object B exerts an equal and opposite force on object A.

**Examples:**
- A rocket expels gas downward → gas pushes rocket upward
- You push against a wall → wall pushes back on your hand
- A fish pushes water backward with its fins → water pushes the fish forward

**Important:** Action and reaction forces act on DIFFERENT objects.

## Key Terms

- **Force:** A push or pull on an object (measured in Newtons)
- **Mass:** Amount of matter in an object (kg)
- **Weight:** Force of gravity on an object; Weight = mass × g (g = 9.8 m/s²)
- **Net force:** The total force on an object (sum of all forces)
- **Acceleration:** Rate of change in velocity (m/s²)`,
    keyPoints: [
      "Newton's First Law: objects stay at rest or in motion unless acted on by an unbalanced force (inertia)",
      "Newton's Second Law: F = ma — force equals mass times acceleration",
      "Newton's Third Law: every action has an equal and opposite reaction acting on a different object",
      'Weight = mass × gravitational acceleration (9.8 m/s² on Earth)',
      'Greater mass means greater inertia — the object is harder to accelerate or decelerate',
    ],
    recommendedPractice: [
      'Calculate the acceleration of a 10 kg object pushed with 50 N, 30 N, and 5 N of force',
      'Find three examples of each of Newton\'s three laws in everyday life and explain each',
      'Explain why passengers wear seatbelts using Newton\'s First Law',
      'Draw a free-body diagram for a book resting on a table, labeling all forces',
    ],
  },

  {
    title: 'The Scientific Method',
    category: 'Science',
    level: 'All Levels',
    estimatedReadingTime: '~15 min',
    description: 'Learn the step-by-step process scientists use to investigate questions, test hypotheses, and draw conclusions from evidence.',
    content: `## What is the Scientific Method?

The scientific method is a systematic approach to investigation used by scientists to answer questions about the natural world. It ensures that conclusions are based on evidence and can be tested by others.

## The Six Steps

### Step 1: Observation / Question
Science starts with noticing something interesting or asking a question about the world.

- "Why do plants grow taller near the window?"
- "Does the type of music affect how fast students read?"

A good scientific question is **testable** and **measurable**.

### Step 2: Background Research
Before designing an experiment, research what is already known about the topic using books, journals, and reliable websites.

### Step 3: Hypothesis
A **hypothesis** is an educated guess about the answer to your question, based on research.

Format: **"If [independent variable], then [dependent variable], because [reason]."**

Example: "If plants receive more sunlight, then they will grow taller, because sunlight provides energy for photosynthesis."

### Step 4: Experiment
Design an experiment to test your hypothesis.

**Key concepts:**
- **Independent variable:** The one variable you intentionally change
- **Dependent variable:** What you measure (the outcome)
- **Controlled variables:** Everything else kept the same to ensure a fair test
- **Control group:** The group that doesn't receive the treatment (used for comparison)
- **Experimental group:** The group that receives the treatment

**Example:** Testing sunlight's effect on plant growth:
- Independent: hours of sunlight (2h, 4h, 8h)
- Dependent: plant height after 2 weeks
- Controlled: same soil, water, temperature, pot size

### Step 5: Data Collection and Analysis
Record all observations and measurements during the experiment. Organize data in tables and create graphs to identify patterns.

- **Qualitative data:** Descriptions (color, texture, appearance)
- **Quantitative data:** Numbers (height, weight, time, temperature)

### Step 6: Conclusion
Analyze your results and determine whether they support or refute your hypothesis.

A conclusion should:
- State whether the hypothesis was supported or not
- Summarize the data that supports the conclusion
- Acknowledge sources of error
- Suggest future experiments

**Important:** A hypothesis that is NOT supported is still valuable — it eliminates possibilities and directs future research.

## Peer Review

After a study, other scientists **review the methods and results** before publication. This process ensures accuracy and catches errors. Peer-reviewed research is the gold standard of science.`,
    keyPoints: [
      'The scientific method has six steps: observation, research, hypothesis, experiment, analysis, conclusion',
      'A hypothesis must be testable and follow the if-then-because format',
      'The independent variable is changed; the dependent variable is measured; controlled variables stay the same',
      'The control group receives no treatment and is used as a baseline for comparison',
      'A hypothesis that is proven wrong is still useful — it narrows down possibilities for future research',
    ],
    recommendedPractice: [
      'Write a testable hypothesis for: "Does listening to music affect test scores?"',
      'Design a full experiment plan for your hypothesis, identifying all three types of variables',
      'Read a short scientific article and identify which steps of the scientific method were used',
      'Conduct a simple experiment at home (e.g., does water temperature affect how fast sugar dissolves?) and record your results',
    ],
  },

  // ── HISTORY ──────────────────────────────────────────────────────────────────

  {
    title: 'World War II: Causes, Events, and Consequences',
    category: 'History',
    level: 'High School',
    estimatedReadingTime: '~28 min',
    description: 'A comprehensive overview of the Second World War — its causes rooted in WWI, major theaters of conflict, turning points, and lasting impact on the modern world.',
    content: `## Background and Causes

World War II (1939–1945) was the deadliest conflict in human history, involving over 70 nations and resulting in 70–85 million deaths.

**Key causes:**

**1. Legacy of World War I and the Treaty of Versailles (1919)**
The treaty imposed harsh penalties on Germany:
- Blamed for the war (War Guilt Clause)
- Lost territory and overseas colonies
- Had to pay massive reparations
- Military severely limited
This caused deep resentment in Germany.

**2. Rise of Fascism and Totalitarianism**
- **Germany:** Adolf Hitler and the Nazi Party rose to power in 1933, exploiting economic hardship and nationalism
- **Italy:** Benito Mussolini established a Fascist state
- **Japan:** Military-controlled government pursued aggressive expansion in Asia

**3. The Great Depression (1929)**
Global economic collapse led to mass unemployment and political extremism.

**4. Policy of Appeasement**
Britain and France allowed Hitler to expand (annexing Austria and Czechoslovakia's Sudetenland) hoping to avoid war. This encouraged further aggression.

## Major Events

**1939 — War Begins**
- Germany invades Poland (September 1, 1939)
- Britain and France declare war on Germany

**1940 — Fall of France**
- Germany conquers France in 6 weeks
- Miracle of Dunkirk: 338,000 Allied troops evacuated from beaches
- Battle of Britain: Germany attempts to destroy the RAF; fails

**1941 — War Expands**
- Germany invades the Soviet Union (Operation Barbarossa, June 1941) — opening the Eastern Front
- Japan attacks Pearl Harbor, Hawaii (December 7, 1941)
- United States enters the war

**1942–1943 — Turning Points**
- Battle of Stalingrad (Aug 1942–Feb 1943): Massive Soviet victory; Germany loses 300,000 troops
- Battle of Midway (1942): U.S. defeats Japan in the Pacific
- North Africa campaign ends with Allied victory

**1944 — Allied Advance**
- D-Day: June 6, 1944 — Allied invasion of Normandy, France (largest seaborne invasion in history)
- Liberation of Paris; Soviet advance from the East

**1945 — End of the War**
- Germany surrenders: May 8, 1945 (V-E Day)
- Atomic bombs dropped on Hiroshima (August 6) and Nagasaki (August 9)
- Japan surrenders: September 2, 1945 (V-J Day)

## The Holocaust

The Holocaust was the systematic murder of six million Jews (and millions of others including Roma, disabled people, and political opponents) by the Nazi regime. It took place in concentration camps and occupied territories throughout Europe.

## Consequences and Legacy

- **United Nations** founded in 1945 to prevent future world wars
- **Cold War** begins: tension between the USA (capitalism) and USSR (communism)
- **Decolonization:** weakened European powers lose colonies across Asia and Africa
- **State of Israel** established in 1948 (partly in response to the Holocaust)
- **Nuremberg Trials:** Nazi war criminals prosecuted for crimes against humanity
- **Marshall Plan:** USA provides $13 billion to rebuild Western Europe`,
    keyPoints: [
      'WWII was caused by the harsh Treaty of Versailles, rise of fascism, Great Depression, and failed appeasement policy',
      'The war began when Germany invaded Poland in September 1939; Britain and France declared war in response',
      'Key turning points: Battle of Stalingrad (Eastern Front), Battle of Midway (Pacific), and D-Day (June 6, 1944)',
      'The Holocaust was the systematic genocide of six million Jews and millions of others by the Nazi regime',
      'WWII ended in 1945 and led to the United Nations, the Cold War, and widespread decolonization',
    ],
    recommendedPractice: [
      'Create a timeline of 10 major events of WWII from 1939 to 1945 with a one-sentence description of each',
      'Write a paragraph explaining why the Battle of Stalingrad was a turning point in the war',
      'Compare the causes of WWI and WWII — what was similar and what was different?',
      'Research one country\'s specific experience in WWII and write a half-page summary',
    ],
  },

  {
    title: 'Ancient Civilizations: Egypt, Greece, and Rome',
    category: 'History',
    level: 'All Levels',
    estimatedReadingTime: '~25 min',
    description: 'Journey through three of history\'s greatest civilizations — Ancient Egypt, Greece, and Rome — and discover how they shaped the modern world.',
    content: `## Ancient Egypt (c. 3100–30 BCE)

Ancient Egypt is one of the world's oldest civilizations, centered along the Nile River in northeastern Africa.

### Key Features

**The Nile River**
Egypt depended entirely on the Nile. Annual flooding deposited rich silt, making farming possible in a desert. The Nile also served as the main highway for trade and travel.

**Pharaohs and Government**
Egypt was ruled by pharaohs, who were considered both kings and gods. They controlled all land, resources, and people. Famous pharaohs include Ramesses II, Tutankhamun, and Cleopatra VII.

**Religion**
Egyptians were polytheistic (believed in many gods). Major gods:
- Ra/Amun-Ra: sun god, king of gods
- Osiris: god of the afterlife
- Isis: goddess of magic and motherhood
- Anubis: god of embalming and the dead

Egyptians believed in an afterlife. They mummified bodies and buried them with treasures to use in the next life.

**Achievements:**
- Hieroglyphics (picture writing system)
- The Great Pyramid of Giza (built c. 2560 BCE)
- Papyrus paper
- Advanced medicine and surgery
- 365-day calendar

---

## Ancient Greece (c. 800–146 BCE)

Ancient Greece was not one unified country but a collection of independent city-states (poleis), the most important being Athens and Sparta.

### Key Features

**Democracy**
Athens under Cleisthenes (508 BCE) developed the world's first democracy — though only free male citizens could vote.

**Philosophy**
Greek philosophers sought to understand the world through reason:
- **Socrates:** "I know that I know nothing" — taught through questioning (Socratic method)
- **Plato:** Student of Socrates; wrote "The Republic"; theory of ideal Forms
- **Aristotle:** Student of Plato; studied logic, biology, ethics, and politics; tutor of Alexander the Great

**The Olympics**
The first Olympic Games were held in Olympia in 776 BCE, held every four years to honor Zeus.

**Achievements:**
- Democracy and the idea of citizenship
- Advances in mathematics (Pythagoras, Euclid)
- Medicine (Hippocrates — "father of medicine")
- Epic literature: Homer's Iliad and Odyssey
- Architecture: the Parthenon

---

## Ancient Rome (c. 753 BCE – 476 CE)

Rome grew from a small city on the Tiber River to control an empire stretching from Britain to Mesopotamia.

### Key Features

**The Roman Republic (509–27 BCE)**
Rome was governed by elected officials: two consuls (like presidents), the Senate, and assemblies. This inspired modern republican governments.

**The Roman Empire (27 BCE – 476 CE)**
Augustus Caesar became the first emperor. At its peak, the Roman Empire encompassed 50 million people.

**Roman Law**
Roman law (including concepts like "innocent until proven guilty") forms the basis of legal systems in Europe and the Americas.

**Achievements:**
- Roads (over 80,000 km of roads connected the empire)
- Aqueducts (bringing fresh water to cities)
- Latin language (ancestor of French, Spanish, Italian, Portuguese, Romanian)
- Architecture: Colosseum, Pantheon, aqueducts
- Spread of Christianity (became the state religion in 380 CE)

**Fall of Rome:** The Western Roman Empire fell in 476 CE due to economic problems, military pressure from Germanic tribes, and political instability.`,
    keyPoints: [
      'Ancient Egypt was built around the Nile River; pharaohs were considered divine rulers and the afterlife was central to Egyptian religion',
      'Ancient Greece developed democracy in Athens and produced philosophers (Socrates, Plato, Aristotle) who shaped Western thought',
      'The Roman Republic introduced elected governance and law; the Roman Empire spread Latin and Roman culture across Europe',
      'Greek philosophy introduced systematic reasoning; Roman law introduced principles still used today including "innocent until proven guilty"',
      'All three civilizations made lasting contributions to architecture, writing, mathematics, and government that still influence the modern world',
    ],
    recommendedPractice: [
      'Create a comparison table with Egypt, Greece, and Rome showing their government, religion, and key achievements',
      'Choose one achievement from each civilization and explain how it still influences life today',
      'Draw a map marking Egypt (Nile Valley), Greece (Mediterranean), and Rome (Italy and the empire)',
      'Research the fall of one civilization and write a paragraph explaining the main causes',
    ],
  },

  // ── ELEMENTARY BASICS ─────────────────────────────────────────────────────────

  {
    title: 'Addition and Subtraction: Building Number Sense',
    category: 'Elementary Basics',
    level: 'Elementary',
    estimatedReadingTime: '~12 min',
    description: 'Build a solid foundation in addition and subtraction through simple strategies, number lines, and real-world examples designed for young learners.',
    content: `## What is Addition?

Addition means putting numbers **together** to find the total.

The **+** symbol means "plus" or "and."

**Example:** 3 + 4 = 7
We have 3 apples and we get 4 more — now we have 7 apples altogether.

## Addition Words to Know
- **Sum:** the answer to an addition problem (3 + 4 = **7**)
- **Addends:** the numbers being added (3 and 4 are addends)
- **Total / Altogether / In all:** words that tell you to add

## Adding on a Number Line

A number line helps us see addition visually.

To add 4 + 3:
- Start at 4 on the number line
- Jump 3 places to the right
- Land on 7 ✓

## What is Subtraction?

Subtraction means **taking away** part of a group.

The **−** symbol means "minus" or "take away."

**Example:** 9 − 4 = 5
We have 9 cookies and eat 4 — there are 5 left.

## Subtraction Words to Know
- **Difference:** the answer to a subtraction problem (9 − 4 = **5**)
- **Minuend:** the starting number (9)
- **Subtrahend:** the number we take away (4)
- **How many are left? How many more? How many fewer?** — words that signal subtraction

## Subtracting on a Number Line

To subtract 9 − 4:
- Start at 9 on the number line
- Jump 4 places to the **left**
- Land on 5 ✓

## The Relationship Between Addition and Subtraction

Addition and subtraction are opposites — they undo each other. We call these **fact families**.

**Fact family for 3, 4, and 7:**
- 3 + 4 = 7
- 4 + 3 = 7
- 7 − 3 = 4
- 7 − 4 = 3

Knowing one fact helps you figure out the others!

## Adding and Subtracting Double-Digit Numbers

**Example: 34 + 25**

Line up the digits by place value:
- Ones: 4 + 5 = 9
- Tens: 3 + 2 = 5
- Answer: 59

**Example: 47 − 23**
- Ones: 7 − 3 = 4
- Tens: 4 − 2 = 2
- Answer: 24

**Regrouping (Carrying and Borrowing):**
When ones column adds to 10 or more, carry the ten to the tens column.

**Example: 28 + 15**
- Ones: 8 + 5 = 13 → write 3, carry 1
- Tens: 2 + 1 + 1 (carried) = 4
- Answer: 43`,
    keyPoints: [
      'Addition means combining groups; the answer is called the sum',
      'Subtraction means taking away; the answer is called the difference',
      'On a number line, addition means jumping right and subtraction means jumping left',
      'Fact families show how addition and subtraction are related (e.g., 3+4=7, 7-3=4, 7-4=3)',
      'When adding double-digit numbers, add ones first, then tens; carry over when the sum is 10 or more',
    ],
    recommendedPractice: [
      'Solve 10 addition problems and 10 subtraction problems using a number line',
      'Write all four fact family equations for the numbers 5, 8, and 13',
      'Add 36 + 27 and 54 + 38 using the column method with regrouping',
      'Make up a word problem about addition and one about subtraction, then solve both',
    ],
  },

  {
    title: 'Reading Comprehension: Understanding What You Read',
    category: 'Elementary Basics',
    level: 'Elementary',
    estimatedReadingTime: '~14 min',
    description: 'Develop essential reading comprehension skills — finding the main idea, identifying details, making inferences, and understanding story structure.',
    content: `## What is Reading Comprehension?

Reading comprehension means **understanding** what you read — not just saying the words, but knowing what they mean, why they matter, and how they connect.

Good readers think **before**, **during**, and **after** reading.

## Before You Read

**Preview the text:**
- Look at the title. What do you think it will be about?
- Look at pictures, headings, or bold words.
- Ask yourself: "What do I already know about this topic?"

This is called **activating prior knowledge**.

## The Main Idea

The **main idea** is the most important point the author is making — what the whole passage is mostly about.

**How to find the main idea:**
1. Ask: "What is this mostly about?"
2. Look at the first and last sentences of each paragraph (topic sentences and conclusions)
3. If you had to tell a friend in one sentence what you read, what would you say?

**Supporting details** are facts or examples that explain or prove the main idea.

## During Reading: Active Reading Strategies

**1. Ask questions as you read:**
- Who? What? When? Where? Why? How?

**2. Make connections:**
- Text-to-Self: Does this remind me of something in my life?
- Text-to-Text: Does this remind me of another book?
- Text-to-World: Does this connect to something happening in the world?

**3. Visualize:**
Close your eyes and picture what is happening. Create a "movie" in your mind.

**4. Monitor your understanding:**
If something confuses you, re-read that part slowly. Look up words you don't know.

## Vocabulary in Context

When you find an unfamiliar word, use **context clues** — the words and sentences around it — to figure out the meaning.

**Example:** "The boy was famished after running for an hour. He immediately ate two sandwiches."
- Clue: ate two sandwiches right away → "famished" means very hungry

## Making Inferences

An inference is a conclusion you make using clues from the text plus your own knowledge.

Authors don't always tell you everything directly — you have to "read between the lines."

**Example:** "Maya walked into the classroom, clutching her permission slip. She bounced in her seat all morning."
- The text doesn't say Maya was excited, but you can infer she was.

## Story Structure

Fictional texts usually follow this structure:
- **Setting:** When and where the story takes place
- **Characters:** Who the story is about
- **Problem / Conflict:** The challenge the characters face
- **Events:** What happens as they try to solve the problem
- **Resolution:** How the problem is solved

## After You Read

- **Summarize:** Retell the main points in your own words (without looking back)
- **Reflect:** What did you learn? What surprised you? What questions do you still have?
- **Connect:** How does this relate to your own life or other things you know?`,
    keyPoints: [
      'The main idea is what the whole passage is mostly about; supporting details back it up with facts or examples',
      'Before reading, preview the title, headings, and images to activate prior knowledge',
      'Use context clues — surrounding words and sentences — to figure out the meaning of unknown words',
      'Making inferences means using text clues plus your own knowledge to draw conclusions the author implies but does not state',
      'Fiction follows a structure: setting, characters, problem, events, and resolution',
    ],
    recommendedPractice: [
      'Read a short passage and write one sentence stating the main idea',
      'Find three supporting details in a paragraph that support the main idea',
      'Practice making inferences: read five sentences and write what you can infer from each',
      'After reading a short story, complete a story map with setting, characters, problem, events, and resolution',
    ],
  },

];

// ─── Seed Function ─────────────────────────────────────────────────────────────

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    let inserted = 0;
    let updated = 0;

    for (const resource of resources) {
      const result = await Resource.findOneAndUpdate(
        { title: resource.title },
        { $set: { ...resource, status: 'published' } },
        { upsert: true, new: true, runValidators: true }
      );

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        console.log(`  [NEW]     ${resource.category.padEnd(20)} — ${resource.title}`);
        inserted++;
      } else {
        console.log(`  [UPDATED] ${resource.category.padEnd(20)} — ${resource.title}`);
        updated++;
      }
    }

    console.log('');
    console.log(`Seed complete: ${inserted} inserted, ${updated} updated, ${resources.length} total.`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
})();
