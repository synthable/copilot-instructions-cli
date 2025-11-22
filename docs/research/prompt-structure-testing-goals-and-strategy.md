# UMS Prompt Structure Testing: Goals and Strategy

## Context: The Problem We're Solving

The Unified Module System (UMS) v2.x is a TypeScript-based framework for managing AI instructions as structured, composable modules. Each module contains components at different **cognitive levels**:

- **Level 2**: Universal Patterns (principles like "Never Swallow Errors")
- **Level 3**: Domain-Specific Guidance (concepts like "Resource-Based URLs")
- **Level 4**: Procedures (step-by-step implementation instructions)
- **Level 5**: Specifications (concrete values like "access token TTL: 15 minutes")

When building a persona prompt from multiple modules, we face a **critical architectural decision**: How should we organize the components in the final Markdown prompt?

---

## The Fundamental Question

**Does the structural organization of AI prompts affect LLM performance?**

Specifically, when an LLM receives a prompt with multi-level, multi-module guidance:
1. Does it navigate references better with certain structures?
2. Does it integrate guidance from multiple modules more effectively with certain structures?
3. Does it find and apply specific values (specifications) more accurately with certain structures?

**Hypothesis**: Modern LLMs are robust to different organizational structures, and content quality matters more than structural choice.

---

## Three Competing Hypotheses

### Hypothesis A: Cognitive Hierarchy (Global Level Sections)

**Strategy**: Split modules across global cognitive level sections.

**Structure**:
```
## Level 2: Universal Patterns
  ### error-handling: Principle: Never Swallow Errors
  ### authentication: Principle: Defense in Depth

## Level 3: Domain Concepts
  ### rest-api-design: Concept: Resource-Based URLs
  ### authentication: Concept: JWT Structure

## Level 4: Procedures
  ### rest-api-design: Implement REST Endpoints
  ### error-handling: Implement Error Handling
  ### authentication: Implement JWT Auth

## Level 5: Specifications
  ### rest-api-design: HTTP Status Codes
  ### authentication: Security Specifications
```

**Rationale**:
- All principles together (easier to see foundational concepts)
- All procedures together (easier to see implementation patterns)
- All specifications together (easier to look up values)
- Teaches cognitive hierarchy explicitly

**Potential Issues**:
- Modules are fragmented across sections
- Related guidance (e.g., all authentication content) is scattered
- Cross-references span long distances ("see authentication: JWT Structure in Level 3")

---

### Hypothesis B: Module Cohesion (Modules as Blocks)

**Strategy**: Keep each module together as a cohesive block, sort components by cognitive level within each module.

**Structure**:
```
## Module: rest-api-design
  ### Level 3: Concepts
    #### Resource-Based URLs
  ### Level 4: Procedures
    #### Implement REST Endpoints
  ### Level 5: Specifications
    #### HTTP Status Codes

## Module: error-handling
  ### Level 2: Principles
    #### Never Swallow Errors
  ### Level 4: Procedures
    #### Implement Error Handling

## Module: authentication
  ### Level 2: Principles
    #### Defense in Depth
  ### Level 3: Concepts
    #### JWT Structure
  ### Level 4: Procedures
    #### Implement JWT Auth
  ### Level 5: Specifications
    #### Security Specifications
```

**Rationale**:
- Preserves module context (all authentication guidance together)
- Short cross-references within modules ("see JWT Structure concept above")
- Natural progression: principles → concepts → procedures → specs
- Module boundaries are clear

**Potential Issues**:
- Can't easily scan "all Level 2 principles"
- Cognitive hierarchy is less visible
- May be harder to see patterns across modules

---

### Hypothesis C: Author Order (Sequential, No Reordering)

**Strategy**: Modules in persona order, components in authored order (no sorting).

**Structure**:
```
## Module: rest-api-design
  ### Concept: Resource-Based URLs
  ### Implement REST Endpoints
  ### HTTP Status Codes

## Module: error-handling
  ### Principle: Never Swallow Errors
  ### Implement Error Handling

## Module: authentication
  ### Principle: Defense in Depth
  ### Concept: JWT Structure
  ### Implement JWT Auth
  ### Security Specifications
```

**Rationale**:
- Simplest approach (no reordering)
- Preserves author's intended flow
- Module context maintained
- Lowest build complexity
- Modern LLMs may be robust to different organizations

**Potential Issues**:
- Cognitive levels not explicitly labeled
- No systematic organization
- Relies on author's intuition about ordering

---

## Test Design: Four Simple, Focused Tests

We've designed **four tests** that each evaluate a different aspect of prompt structure effectiveness. The tests use a simplified design system domain to keep prompts short (~600 tokens) while still demonstrating structural differences.

### Test Domain: Design System

**Two core modules**:
1. **color-system** (Levels 2, 3, 5): Accessibility principles, color contrast concepts, color specifications
2. **typography-system** (Levels 3, 4, 5): Font hierarchy concepts, implementation procedures, font specifications

**Extended modules** (may be referenced but not scored):
3. **mobile-typography**: Mobile-specific typography guidance
4. **dark-mode-colors**: Dark mode color specifications
5. **print-typography**: Print-specific typography guidance
6. **accessibility-testing**: Testing procedures for accessibility

**Why this domain?**
- ✅ Simple and familiar (everyone understands colors and fonts)
- ✅ Clear cognitive level distinctions (principles vs procedures vs specs)
- ✅ Enables cross-module integration tests
- ✅ Has concrete specifications for lookup tests
- ✅ Short enough to test quickly (~600 tokens)
- ✅ Extended modules let us test knowledge scope handling

---

### Test 1: Cross-Reference Navigation

**Purpose**: Evaluate how well the LLM navigates and cites specific concepts from the guidance.

**Task Prompt**:
```
Using the guidance provided, explain why text must have a 4.5:1 contrast ratio.

Your answer must:
1. Reference the specific concept that explains this
2. Connect it to the underlying principle
3. Give one example of good contrast
4. Cite which cognitive level you found each piece of information
```

**Expected Answer Pattern**:
- References "Color Contrast Ratios" concept by name (Level 3)
- Connects to "Inclusive Design" principle (Level 2)
- Example: Black on white = 21:1 ratio
- Cites Level 2 for principle, Level 3 for concept

**Scoring** (100 points):
- 25 pts: References "Color Contrast Ratios" concept
- 25 pts: Provides correct example from guidance
- 25 pts: Cites correct cognitive levels
- 25 pts: Connects to broader principles

**What This Tests**:
- **Hypothesis A**: Must navigate from Level 3 section to find concept, then to Level 2 section for principle (long navigation)
- **Hypothesis B**: All color-system content in one module (short navigation)
- **Hypothesis C**: Sequential reading, may be easiest to find

**Expected Result**: All hypotheses should perform well (~100%) as navigation is straightforward regardless of structure.

---

### Test 2: Multi-Module Integration

**Purpose**: Evaluate how well the LLM integrates requirements from multiple modules.

**Task Prompt**:
```
You need to implement accessible typography for body text.

Using the guidance provided, list 3-5 most important requirements, citing which module each comes from.

Format:
1. [Requirement] - from [module name]
2. [Requirement] - from [module name]
3. [Requirement] - from [module name]
4. [Requirement] - from [module name] (optional)
5. [Requirement] - from [module name] (optional)
```

**Expected Answer** (any 3-5 of these):
1. Body text MUST be at least 16px - from typography-system
2. Line height MUST be at least 1.5x the font size - from typography-system
3. Text MUST have 4.5:1 contrast ratio minimum - from color-system
4. Color must not be the only means of conveying information - from color-system
5. Define base font size - from typography-system
6. Choose a scale ratio - from typography-system
7. Use proper color specifications - from color-system

**Scoring** (100 points):
- 50 pts: Valid requirements (10 pts each, max 5)
- 50 pts: Correct module attribution (10 pts each, max 5)

**CRITICAL RUBRIC SCOPE:**
This test is designed to measure integration of the **core modules only** (typography-system and color-system). 

**Extended modules handling:**
- Requirements from mobile-typography, dark-mode-colors, print-typography, or accessibility-testing are **valid knowledge** but **out of scope** for this specific test
- LLMs may cite these extended modules, demonstrating broader system knowledge
- These citations should be scored as 0 points per the rubric, but noted as indicators of comprehensive understanding
- This is a **test design choice**, not a deficiency in the model's response

**What This Tests**:
- Can the LLM effectively pull requirements from multiple core modules?
- Can the LLM correctly attribute requirements to source modules?
- How often does the LLM demonstrate extended knowledge beyond test scope?

**What This Does NOT Test**:
- Comprehensive system knowledge (extended modules are not scored)
- Real-world scenarios (which would benefit from extended knowledge)

**Expected Result**: Scores may vary (60-80%) primarily due to extended module citations, not structural differences. Models demonstrating extended knowledge may score lower despite having superior understanding.

**Key Question**: Does structure affect the ability to integrate from multiple modules, or are differences attributable to knowledge scope?

---

### Test 3: Specification Lookup

**Purpose**: Evaluate how well the LLM finds and recalls exact values from specifications.

**Task Prompt**:
```
Answer these questions using exact values from the specifications:

1. What is the minimum contrast ratio for normal text?
2. What is the base font size?
3. What is the required line height?
4. What is the H1 font size?
5. What is the scale ratio?
```

**Expected Exact Answers**:
1. 4.5:1
2. 16px
3. 1.5
4. 48px
5. 1.5

**Scoring** (100 points):
- 20 pts per correct answer
- Binary: correct or incorrect (no partial credit)
- Must include units where applicable (px, :1, etc.)

**What This Tests**:
- **Hypothesis A**: All specs in Level 5 section together (easy to scan)
- **Hypothesis B**: Specs split across color-system and typography-system modules
- **Hypothesis C**: Sequential, need to scan through both modules

**Expected Result**: All hypotheses should perform well (~100%) as specification lookup is straightforward in all structures.

**Key Question**: Does grouping all specifications together (Hypothesis A) make lookup easier, or are LLMs equally capable regardless?

---

### Test 4: Practical Application & Synthesis

**Purpose**: Evaluate how well the LLM synthesizes guidance across multiple levels and modules into practical implementation.

**Task Prompt**:
```
Write complete CSS for H1 and body text following all guidance provided.

Requirements:
1. Use exact specification values
2. Apply procedural guidance (scale ratio calculations)
3. Satisfy all constitutional principles (accessibility, readability)
4. Include comments citing which module/level each rule comes from

Format:
/* [module]: [level] - [justification] */
selector {
  property: value;
}
```

**Expected Output Pattern**:
```css
/* typography-system: Level 5 - Base font size specification */
/* typography-system: Level 4 - Body text MUST be at least 16px */
body {
  font-size: 16px;
  line-height: 1.5; /* Level 5 spec, Level 4 minimum */
  color: #000000; /* color-system: Level 5 */
  background-color: #FFFFFF; /* color-system: Level 5 */
}

/* typography-system: Level 5 - H1 size from specifications */
/* typography-system: Level 3 - Part of type scale concept */
h1 {
  font-size: 48px;
  color: #000000; /* Maintains 21:1 contrast ratio */
}
```

**Scoring** (100 points):
- 40 pts: Specification accuracy (8 pts × 5 values: body font-size, line-height, color, background, h1 font-size)
- 30 pts: Procedure application (uses scale ratio, applies line-height rule, references calculation method)
- 20 pts: Principle adherence (accessibility contrast, readability hierarchy)
- 10 pts: Citation quality (cites correct module and level for rules)

**Hallucination Tracking**:
Track any fabricated values (values not in specifications):
- Hallucination rate = (incorrect values / total values checked) × 100%
- Target: 0% hallucination rate

**What This Tests**:
- Can the LLM synthesize across all cognitive levels (2, 3, 4, 5)?
- Does structure affect the ability to apply procedures correctly?
- Does structure affect specification accuracy (hallucination rate)?

**Expected Result**: All hypotheses should perform well (~100%) as synthesis capability depends on content quality, not structure.

---

## The Three Test Prompts

### Hypothesis A Prompt (Cognitive Hierarchy)

```markdown
# Design System Guide

---

## Level 2: Universal Principles

### color-system: Accessibility Principle

Ensure all users can perceive content regardless of ability.

**Concept: Inclusive Design**

Design must accommodate users with visual impairments.

**Rationale**: 8% of men and 0.5% of women have some form of color blindness.

**Key principle**: Color must not be the only means of conveying information.

---

## Level 3: Domain Concepts

### color-system: Color Contrast Concept

**Concept: Color Contrast Ratios**

Text must have sufficient contrast against its background.

**Rationale**: Low contrast makes text difficult to read, especially for users with visual impairments.

**Standard**: WCAG AA requires minimum 4.5:1 ratio for normal text.

**Examples**:
- Good: Black text (#000000) on white background (#FFFFFF) = 21:1 ratio
- Bad: Light gray (#AAAAAA) on white background (#FFFFFF) = 2.3:1 ratio

---

### typography-system: Font Hierarchy Concept

**Concept: Type Scale**

Use a consistent size progression to establish visual hierarchy.

**Rationale**: Consistent scale creates rhythm and makes content scannable.

**Common approach**: Use a ratio (e.g., 1.5x) between sizes.

**Examples**:
- Heading 1: 48px
- Heading 2: 32px (48 ÷ 1.5)
- Body: 16px

---

## Level 4: Implementation Procedures

### typography-system: Implement Font Hierarchy

**Purpose**: Apply consistent typography across the application.

**Process**:
1. Define base font size (typically 16px for body text)
2. Choose a scale ratio (see typography-system: Font Hierarchy Concept in Level 3)
3. Calculate heading sizes using the ratio
4. Apply sizes from specifications (see typography-system: Font Specifications in Level 5)
5. Test readability across devices

**Constraints**:
- Body text MUST be at least 16px
- Line height MUST be at least 1.5x the font size

---

## Level 5: Specifications

### color-system: Color Specifications

```json
{
  "contrast_ratios": {
    "minimum_normal_text": "4.5:1",
    "minimum_large_text": "3:1",
    "recommended": "7:1"
  },
  "primary_colors": {
    "text": "#000000",
    "background": "#FFFFFF",
    "accent": "#0066CC"
  }
}
```

---

### typography-system: Font Specifications

```json
{
  "base_size": "16px",
  "scale_ratio": 1.5,
  "line_height": "1.5",
  "sizes": {
    "h1": "48px",
    "h2": "32px",
    "h3": "24px",
    "body": "16px",
    "small": "12px"
  }
}
```

---

*Total: 6 components from 2 modules, organized by cognitive level*
```

**Token count**: ~650 tokens

---

### Hypothesis B Prompt (Module Cohesion)

```markdown
# Design System Guide

---

## Module: color-system

*Cognitive levels: 2, 3, 5*

### Level 2: Accessibility Principle

**Concept: Inclusive Design**

Ensure all users can perceive content regardless of ability.

Design must accommodate users with visual impairments.

**Rationale**: 8% of men and 0.5% of women have some form of color blindness.

**Key principle**: Color must not be the only means of conveying information.

---

### Level 3: Color Contrast

**Concept: Color Contrast Ratios**

Text must have sufficient contrast against its background.

**Rationale**: Low contrast makes text difficult to read, especially for users with visual impairments.

**Standard**: WCAG AA requires minimum 4.5:1 ratio for normal text.

**Examples**:
- Good: Black text (#000000) on white background (#FFFFFF) = 21:1 ratio
- Bad: Light gray (#AAAAAA) on white background (#FFFFFF) = 2.3:1 ratio

---

### Level 5: Specifications

**Color Specifications**

```json
{
  "contrast_ratios": {
    "minimum_normal_text": "4.5:1",
    "minimum_large_text": "3:1",
    "recommended": "7:1"
  },
  "primary_colors": {
    "text": "#000000",
    "background": "#FFFFFF",
    "accent": "#0066CC"
  }
}
```

---

## Module: typography-system

*Cognitive levels: 3, 4, 5*

### Level 3: Font Hierarchy

**Concept: Type Scale**

Use a consistent size progression to establish visual hierarchy.

**Rationale**: Consistent scale creates rhythm and makes content scannable.

**Common approach**: Use a ratio (e.g., 1.5x) between sizes.

**Examples**:
- Heading 1: 48px
- Heading 2: 32px (48 ÷ 1.5)
- Body: 16px

---

### Level 4: Implementation

**Purpose**: Apply consistent typography across the application.

**Process**:
1. Define base font size (typically 16px for body text)
2. Choose a scale ratio (see Font Hierarchy concept above)
3. Calculate heading sizes using the ratio
4. Apply sizes from specifications (see Font Specifications below)
5. Test readability across devices

**Constraints**:
- Body text MUST be at least 16px
- Line height MUST be at least 1.5x the font size

---

### Level 5: Specifications

**Font Specifications**

```json
{
  "base_size": "16px",
  "scale_ratio": 1.5,
  "line_height": "1.5",
  "sizes": {
    "h1": "48px",
    "h2": "32px",
    "h3": "24px",
    "body": "16px",
    "small": "12px"
  }
}
```

---

*Total: 6 components from 2 modules, organized by module with internal sorting*
```

**Token count**: ~620 tokens

---

### Hypothesis C Prompt (Author Order)

```markdown
# Design System Guide

---

## Module: color-system

### Accessibility Principle

**Concept: Inclusive Design**

Ensure all users can perceive content regardless of ability.

Design must accommodate users with visual impairments.

**Rationale**: 8% of men and 0.5% of women have some form of color blindness.

**Key principle**: Color must not be the only means of conveying information.

---

### Color Contrast

**Concept: Color Contrast Ratios**

Text must have sufficient contrast against its background.

**Rationale**: Low contrast makes text difficult to read, especially for users with visual impairments.

**Standard**: WCAG AA requires minimum 4.5:1 ratio for normal text.

**Examples**:
- Good: Black text (#000000) on white background (#FFFFFF) = 21:1 ratio
- Bad: Light gray (#AAAAAA) on white background (#FFFFFF) = 2.3:1 ratio

---

### Color Specifications

```json
{
  "contrast_ratios": {
    "minimum_normal_text": "4.5:1",
    "minimum_large_text": "3:1",
    "recommended": "7:1"
  },
  "primary_colors": {
    "text": "#000000",
    "background": "#FFFFFF",
    "accent": "#0066CC"
  }
}
```

---

## Module: typography-system

### Font Hierarchy

**Concept: Type Scale**

Use a consistent size progression to establish visual hierarchy.

**Rationale**: Consistent scale creates rhythm and makes content scannable.

**Common approach**: Use a ratio (e.g., 1.5x) between sizes.

**Examples**:
- Heading 1: 48px
- Heading 2: 32px (48 ÷ 1.5)
- Body: 16px

---

### Implementation

**Purpose**: Apply consistent typography across the application.

**Process**:
1. Define base font size (typically 16px for body text)
2. Choose a scale ratio (see Font Hierarchy concept above)
3. Calculate heading sizes using the ratio
4. Apply sizes from specifications (see Font Specifications below)
5. Test readability across devices

**Constraints**:
- Body text MUST be at least 16px
- Line height MUST be at least 1.5x the font size

---

### Font Specifications

```json
{
  "base_size": "16px",
  "scale_ratio": 1.5,
  "line_height": "1.5",
  "sizes": {
    "h1": "48px",
    "h2": "32px",
    "h3": "24px",
    "body": "16px",
    "small": "12px"
  }
}
```

---

*Total: 6 components from 2 modules in authored order*
```

**Token count**: ~580 tokens

---

## Evaluation Method

### Simple, Objective Scoring

Each test uses **binary or clear-cut criteria** to avoid subjective judgment:

**Test 1 Checklist**:
- [ ] References "Color Contrast Ratios" concept (25 pts)
- [ ] Connects to "Inclusive Design" principle (25 pts)
- [ ] Provides correct example (black on white) (25 pts)
- [ ] Cites Level 2 and Level 3 correctly (25 pts)

**Test 2 Checklist**:
- Count valid requirements from CORE modules (×10 pts each, max 50)
- Count correct module attributions for CORE modules (×10 pts each, max 50)
- Note: Extended module citations demonstrate knowledge but are out of test scope

**Test 3 Checklist**:
- [ ] Q1: 4.5:1 (20 pts)
- [ ] Q2: 16px (20 pts)
- [ ] Q3: 1.5 (20 pts)
- [ ] Q4: 48px (20 pts)
- [ ] Q5: 1.5 (20 pts)

**Test 4 Checklist**:
- Specification accuracy: 8 pts × 5 values (40 pts)
- Procedure application: 10 pts × 3 criteria (30 pts)
- Principle adherence: 10 pts × 2 criteria (20 pts)
- Citation quality: 5 pts × 2 criteria (10 pts)

### Evaluation Can Be Done By:
1. **Manual checking** (5-10 minutes per test)
2. **LLM evaluator** (using structured evaluation prompt with clear rubric)
3. **Automated script** (parse JSON responses for Test 3)

---

## Testing Protocol

### Phase 1: Model Testing Matrix

Test each hypothesis with multiple models:

| Model               | Hypothesis A | Hypothesis B | Hypothesis C |
| ------------------- | ------------ | ------------ | ------------ |
| **Claude Sonnet 4** | Test 1-4     | Test 1-4     | Test 1-4     |
| **GPT-4 Turbo**     | Test 1-4     | Test 1-4     | Test 1-4     |
| **GPT-4o**          | Test 1-4     | Test 1-4     | Test 1-4     |
| **Gemini Pro**      | Test 1-4     | Test 1-4     | Test 1-4     |

**Total**: 4 models × 3 hypotheses × 4 tests = **48 test runs**

### Settings:
- Temperature: 0.7 (consistent but not completely deterministic)
- Max tokens: 2000 (enough for detailed responses)
- System prompt: None (let the prompt structure speak for itself)

---

### Phase 2: Results Analysis

For each model, calculate:

| Test      | Hypothesis A | Hypothesis B | Hypothesis C |
| --------- | ------------ | ------------ | ------------ |
| Test 1    | ___/100      | ___/100      | ___/100      |
| Test 2    | ___/100      | ___/100      | ___/100      |
| Test 3    | ___/100      | ___/100      | ___/100      |
| Test 4    | ___/100      | ___/100      | ___/100      |
| **TOTAL** | ___/400      | ___/400      | ___/400      |

**Cross-model comparison**:
- Which hypothesis wins most often?
- Are results consistent across models?
- Do different models prefer different structures?

**Extended knowledge tracking**:
- How often do models cite extended modules in Test 2?
- Is extended knowledge correlated with lower Test 2 scores?
- Does this indicate superior or inferior understanding?

---

## What We're Trying to Learn

### Primary Questions

1. **Does structure matter significantly?**
   - If all three hypotheses score within 5-10%: structure has minimal impact
   - If there's a clear winner (>15% difference): structure significantly impacts performance
   - If differences exist but are <15%: structure has modest but not critical impact

2. **Which structure is optimal (if any)?**
   - Hypothesis A: Teaches cognitive hierarchy explicitly
   - Hypothesis B: Preserves module context
   - Hypothesis C: Simplest approach

3. **What are the trade-offs?**
   - Does cognitive hierarchy (A) help with cross-references but hurt integration?
   - Does module cohesion (B) help with integration but hurt specification lookup?
   - Is simpler always better (C)?

### Secondary Questions

4. **Are results model-dependent?**
   - Do Claude, GPT-4, and Gemini prefer different structures?
   - Are some models more robust to structure than others?

5. **Which test is most sensitive to structure?**
   - Test 1 (navigation): Expected to be structure-insensitive
   - Test 2 (integration): May show variance (but watch for rubric scope effects)
   - Test 3 (lookup): Expected to be structure-insensitive
   - Test 4 (synthesis): Expected to be structure-insensitive

6. **What patterns emerge?**
   - Do certain structures excel at certain tasks?
   - Can we identify failure modes for each structure?
   - How often do models demonstrate extended knowledge?

---

## Expected Outcomes & Implications

### Scenario 1: Hypothesis A Wins (Cognitive Hierarchy)

**Pattern**: Hypothesis A scores >15% higher than others consistently

**Interpretation**: LLMs benefit from explicit cognitive organization
- Easier to locate all principles together
- Easier to scan all specifications together
- Cross-reference navigation is manageable despite distance

**UMS v2.5 Design Decision**: 
- Default to cognitive hierarchy rendering
- Split modules across level sections
- Use namespace prefixes for navigation

**Likelihood**: Low (based on test design expectations)

---

### Scenario 2: Hypothesis B Wins (Module Cohesion)

**Pattern**: Hypothesis B scores >15% higher than others consistently

**Interpretation**: LLMs benefit from preserved context
- Easier to integrate related guidance
- Module boundaries help chunk information
- Short cross-references are more natural

**UMS v2.5 Design Decision**:
- Default to module-cohesive rendering
- Keep modules as blocks
- Sort components within modules

**Likelihood**: Low-Medium (slight theoretical advantage)

---

### Scenario 3: Hypothesis C Wins (Author Order)

**Pattern**: Hypothesis C scores >15% higher than others consistently

**Interpretation**: Simplicity wins; reordering adds no value or introduces problems
- LLMs are robust to different organizations
- Adding structure is cognitive overhead
- Author's intended flow is optimal

**UMS v2.5 Design Decision**:
- Default to author order (no reordering)
- Simplify build pipeline
- Focus optimization efforts elsewhere

**Likelihood**: Medium (simplicity often wins)

---

### Scenario 4: No Significant Difference (<15% spread)

**Pattern**: All three hypotheses score within 90-100% range with <15% spread

**Interpretation**: Structure has minimal impact; content quality matters more
- Modern LLMs are highly robust to organizational differences
- Structure choice is a matter of author preference, not performance
- Focus should be on content quality, not structural optimization

**UMS v2.5 Design Decision**:
- Default to simplest approach (Author Order - Hypothesis C)
- Allow configuration for user preference
- Document that structure choice is preference-based
- Focus development effort on content quality tools

**Likelihood**: High (modern LLMs are very capable)

---

### Scenario 5: Mixed/Inconsistent Results

**Pattern**: Different structures win on different tests, or results vary by model

**Interpretation**: Structure benefits are task-specific or model-specific
- Different structures for different use cases
- Need user-configurable rendering
- Consider model-specific optimizations

**UMS v2.5 Design Decision**:
```yaml
# persona.build.yml
rendering:
  strategy: "module-cohesion"  # or "cognitive-hierarchy" or "author-order"
  optimize_for: "claude-sonnet"  # optional model-specific tuning
```

**Likelihood**: Low-Medium (would indicate complex interactions)

---

## Success Metrics

### Statistical Significance Requirements

**For a hypothesis to be considered "significantly better":**
- ✅ 3+ models show the same winner (75% model agreement)
- ✅ Score difference >15% between winner and others (was 10%, raised for robustness)
- ✅ Difference NOT primarily attributable to Test 2 rubric scope
- ✅ Pattern consistent across at least 2 different test types
- ✅ Pattern is explainable (not random variance)

**If no hypothesis meets these criteria:**
- Conclude structure has minimal impact
- Recommend simplest approach (Hypothesis C)

### Qualitative Analysis

Beyond scores, look for:
- **Failure patterns**: Where does each hypothesis struggle?
- **Citation quality**: How naturally do LLMs reference guidance?
- **Integration depth**: Do they just list requirements or synthesize them?
- **Error modes**: What goes wrong with each structure?
- **Extended knowledge**: How often do models cite modules beyond test scope?
- **Hallucination rates**: Does structure affect specification accuracy?

---

## Interpreting Test 2 Results

### Understanding Score Variance

**Test 2 is unique** because it has explicit scope limitations:

**Scenario A**: Model scores 60%
- 3 valid requirements from core modules (30 pts)
- 3 correct attributions (30 pts)
- Total: 60%
- **Interpretation**: Model followed core module focus

**Scenario B**: Model scores 80%
- 4 valid requirements from core modules (40 pts)
- 4 correct attributions (40 pts)
- Total: 80%
- **Interpretation**: Model provided comprehensive core module coverage

**Scenario C**: Model scores 60% but cites extended modules
- 3 valid requirements from core modules (30 pts)
- 3 correct attributions (30 pts)
- 2 valid requirements from extended modules (0 pts per rubric)
- **Interpretation**: Model demonstrates broader knowledge but out of test scope

### What Low Test 2 Scores Actually Mean

**If a model scores 60-80% on Test 2:**
- ✅ Model can integrate from multiple modules
- ✅ Model can attribute requirements correctly
- ❓ Model may be citing extended modules (check response)
- ❌ Does NOT mean the model is failing at integration

**Red flags for actual integration problems:**
- Incorrect module attributions
- Fabricated requirements not in guidance
- Missing obvious core requirements
- Inconsistent citation patterns

**Green flags (even with 60-80% scores):**
- All cited requirements are factually correct
- Module attributions are accurate
- Extended modules demonstrate comprehensive knowledge
- Core requirements are well-covered

---

## Next Steps After Initial Testing

### 1. Analyze Results

**If clear winner (>15% difference):**
- Document which hypothesis won
- Analyze why it won
- Look for failure patterns in losing hypotheses
- Validate with extended testing

**If no clear winner (<15% difference):**
- Document that structure has minimal impact
- Recommend simplest approach (Hypothesis C)
- Focus on content quality improvements
- Skip extended structural testing

### 2. Scale Testing (Only if clear winner emerges)

If we find a clear winner, validate with:
- **Longer prompts**: 2K, 6K, 20K tokens
- **More modules**: 5, 10, 20 modules
- **Complex tasks**: Multi-module synthesis tasks
- **Real-world scenarios**: Production persona prompts

### 3. Real-World Validation (Only if clear winner emerges)

Test with actual UMS use cases:
- Backend engineer persona (20+ modules)
- Frontend developer persona (15+ modules)
- Full-stack architect persona (40+ modules)

### 4. Production Implementation

**Based on results:**

**Scenario: No clear winner**
- Update UMS v2.5 spec: Default to author order (simplest)
- Add configuration option for user preference
- Document that structure is preference, not performance
- Focus on content quality tools

**Scenario: Clear winner**
- Update UMS v2.5 spec: Default to winning strategy
- Implement in build tool
- Document findings in ADR
- Add configuration options for alternatives
- Provide migration guide for existing modules

---

## Deliverables

### Test Results Document

```markdown
# UMS Prompt Structure Testing Results

## Executive Summary
- Clear Winner: [Yes/No]
- If Yes: [Hypothesis X] with [X/400] average score
- If No: All hypotheses scored 90%+, structure has minimal impact
- Confidence: [High/Medium/Low]

## Model-by-Model Results
[Table of scores across all models and hypotheses]

## Test-by-Test Analysis
- Test 1: [Scores and interpretation]
- Test 2: [Scores and extended module analysis]
- Test 3: [Scores and interpretation]
- Test 4: [Scores and hallucination rates]

## Key Findings
1. [Primary finding about structure impact]
2. [Finding about model robustness]
3. [Finding about extended knowledge]
4. [Finding about failure patterns]
5. [Recommendation for UMS v2.5]

## Recommendation
[Specific guidance for UMS v2.5 implementation]
```

### Updated Specification

Update `unified_module_system_v2_5_spec.md`:
- Section 6: Build and Synthesis Processes
- Section 6.2: Markdown Rendering Rules
- Add: Default rendering strategy
- Add: Configuration options
- Add: Rationale based on testing results

### Architecture Decision Record

Document the decision and rationale:
- `docs/architecture/adr/000X-prompt-rendering-strategy.md`
- Include testing methodology
- Include results summary
- Include decision rationale
- Include alternatives considered

---

## Timeline

**Week 1**: Initial testing
- Day 1-2: Run all tests with Claude Sonnet 4 (12 runs)
- Day 3-4: Run all tests with GPT-4 Turbo and GPT-4o (24 runs)
- Day 5: Run all tests with Gemini Pro (12 runs)

**Week 2**: Analysis and decision
- Day 1-2: Analyze results, calculate statistics
- Day 3: Determine if clear winner exists (>15% difference)
- Day 4-5: If no clear winner: Document and recommend simplest approach
- Day 4-5: If clear winner: Plan validation testing

**Week 3**: Implementation or extended testing
- If no clear winner: Update spec, implement simplest approach (3 days)
- If clear winner: Run validation tests with longer prompts (5 days)

**Week 4**: Documentation and close-out
- Day 1-3: Write ADR and update specification
- Day 4-5: Update build tools and documentation

---

## Questions This Testing Will Answer

✅ **Does prompt structure significantly impact LLM performance?**

✅ **If yes, which structural approach produces the best results?**

✅ **If no, what is the simplest maintainable approach?**

✅ **Are results consistent across different LLM models?**

✅ **What are the specific strengths and weaknesses of each approach?**

✅ **Should UMS v2.5 standardize on one approach or support multiple?**

✅ **How should we render multi-level, multi-module prompts by default?**

✅ **Does extended module knowledge affect scoring, and what does that tell us?**

---

## Critical Assumptions

### What We're Testing

✅ **Structural organization** of multi-level, multi-module prompts

✅ **Navigation and reference** capabilities across different structures

✅ **Integration and synthesis** across modules and levels

✅ **Specification lookup** accuracy

### What We're NOT Testing

❌ **Content quality** (kept constant across all hypotheses)

❌ **Prompt length** (all prompts ~600 tokens)

❌ **Module selection** (same modules in all hypotheses)

❌ **Writing style** (identical content, only structure changes)

### Why This Matters

If we find **no significant difference**, it tells us:
- Modern LLMs are highly robust to structural variations
- We should optimize for **author convenience** (simplest approach)
- We should focus effort on **content quality**, not structure

If we find **significant difference**, it tells us:
- Structure optimization is worth the complexity
- We should implement the winning strategy as default
- We should provide configuration for edge cases

---

## Conclusion

This testing strategy uses **simple, focused tests** to answer a **fundamental architectural question**: How should we organize AI instruction prompts?

By testing three clear hypotheses with objective evaluation criteria across multiple models, we'll gather empirical data to make an informed design decision for UMS v2.5.

**Most likely outcome**: Structure matters less than expected (all score 90%+), leading us to adopt the simplest approach (Author Order) and focus optimization efforts on content quality rather than structural organization.

**Alternative outcome**: Clear structural winner emerges (>15% difference), justifying the implementation complexity of that approach.

The results will directly inform the specification and implementation of the prompt rendering system, ensuring that UMS produces optimally-structured prompts for AI consumption - or confirms that "optimal" simply means "simple and maintainable."