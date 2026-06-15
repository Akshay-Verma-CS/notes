export type PatternCategory = "Creational" | "Structural" | "Behavioral";

export type DiagramKind =
  | "singleton"
  | "builder"
  | "factory"
  | "abstract-factory"
  | "prototype"
  | "adapter"
  | "composite"
  | "decorator"
  | "proxy"
  | "flyweight"
  | "chain"
  | "state"
  | "observer"
  | "strategy"
  | "template";

export type PatternNote = {
  slug: string;
  title: string;
  category: PatternCategory;
  summary: string;
  diagram: DiagramKind;
  quickFacts: Array<{ label: string; value: string }>;
  problem: string;
  mentalModel: string;
  recognize: string;
  useWhen: string[];
  tradeoffs: string[];
  misconceptions: string[];
  example: string;
  studyQuestions: string[];
};

export type RoadmapTrack = {
  title: string;
  status: "Live" | "Planned";
  description: string;
  href: string;
};

export const roadmapTracks: RoadmapTrack[] = [
  {
    title: "Design Patterns",
    status: "Live",
    description:
      "Creational, structural, and behavioral notes with diagrams and reusable study blocks.",
    href: "/design-patterns/"
  },
  {
    title: "DSA Notes",
    status: "Planned",
    description:
      "Complexity tables, problem templates, and progressively deeper algorithm notes.",
    href: "#"
  },
  {
    title: "LLD Notes",
    status: "Planned",
    description:
      "Objects, responsibilities, UML, and design trade-offs for interview prep.",
    href: "#"
  },
  {
    title: "HLD Notes",
    status: "Planned",
    description:
      "System design, scaling, failure modes, and architecture decision logs.",
    href: "#"
  }
];

const categoryFact = {
  Creational: "Focuses on object creation.",
  Structural: "Focuses on object composition.",
  Behavioral: "Focuses on communication and responsibility."
} as const;

const note = (pattern: PatternNote) => pattern;

export const designPatterns: PatternNote[] = [
  note({
    slug: "singleton",
    title: "Singleton",
    category: "Creational",
    summary:
      "Keeps one shared instance and one controlled access point for code that truly needs to stay singular.",
    diagram: "singleton",
    quickFacts: [
      { label: "Category", value: categoryFact.Creational },
      { label: "Best signal", value: "One object must own shared state or expensive setup." },
      { label: "Main risk", value: "It quietly becomes global state." }
    ],
    problem:
      "Sometimes a service is conceptually unique: a configuration registry, a cache, a logger, or a hardware bridge. If every caller creates its own copy, the system can drift, duplicate work, or lose the single source of truth.",
    mentalModel:
      "Treat construction like a gatekeeper. The class can still be ordinary, but the point of creation is hidden and the returned instance is reused instead of rebuilt.",
    recognize:
      "You see code asking for the same object over and over, and the object carries identity rather than just data.",
    useWhen: [
      "The object is expensive to initialize and reused everywhere.",
      "Consistency matters more than isolated copies.",
      "You want a controlled lifecycle for a shared service."
    ],
    tradeoffs: [
      "It introduces hidden global coupling.",
      "Tests can become order-sensitive if state leaks between cases.",
      "A singleton can be misused as a shortcut for dependency design."
    ],
    misconceptions: [
      "A singleton is not the same as a static helper class.",
      "It does not automatically make code simpler.",
      "You still need to manage initialization and teardown."
    ],
    example:
      "A metrics client that buffers data and flushes it on a schedule is a good fit if the application needs one central buffer, not many competing ones.",
    studyQuestions: [
      "What state would break if two copies existed?",
      "How would I test this without sharing state across tests?",
      "Could dependency injection give me the same benefit with less coupling?"
    ]
  }),
  note({
    slug: "builder",
    title: "Builder",
    category: "Creational",
    summary:
      "Separates the steps of construction from the final object so you can create complex products without a giant constructor.",
    diagram: "builder",
    quickFacts: [
      { label: "Category", value: categoryFact.Creational },
      { label: "Best signal", value: "Many optional fields or multiple construction steps." },
      { label: "Main risk", value: "Too many small classes if the object is actually simple." }
    ],
    problem:
      "When creation has multiple required steps, the constructor becomes noisy. Parameter lists explode, and it becomes hard to tell which combinations are valid.",
    mentalModel:
      "Think of a builder as a guided assembly line. Each step adds a part, and the final `build()` method hands back a coherent product.",
    recognize:
      "The same object can be assembled in different flavors, or the order of setup matters more than one constructor can express.",
    useWhen: [
      "You need a readable way to create a product with many optional parts.",
      "The construction sequence should be explicit.",
      "You want to reuse the same process for multiple representations."
    ],
    tradeoffs: [
      "It adds ceremony for simple objects.",
      "The builder itself can become another API to maintain.",
      "It can hide invalid combinations until the build step."
    ],
    misconceptions: [
      "Builder is not just a fluent setter chain.",
      "It is about shaping construction, not only prettifying syntax.",
      "It is most useful when the product is genuinely complex."
    ],
    example:
      "A test question paper builder can set difficulty mix, topic coverage, duration, and marking scheme before emitting the final paper object.",
    studyQuestions: [
      "Which fields are truly optional and which are just overexposed?",
      "Does the product need an order of construction that a plain constructor cannot express?",
      "Would a named factory method be enough instead?"
    ]
  }),
  note({
    slug: "factory",
    title: "Factory",
    category: "Creational",
    summary:
      "Moves the choice of concrete type away from callers so object creation follows intention instead of `new` scattered everywhere.",
    diagram: "factory",
    quickFacts: [
      { label: "Category", value: categoryFact.Creational },
      { label: "Best signal", value: "Callers know the goal, not the exact class." },
      { label: "Main risk", value: "It can become a glorified switch statement." }
    ],
    problem:
      "If every caller decides which concrete class to instantiate, the codebase becomes coupled to implementation details. That makes future changes painful because creation logic is spread out everywhere.",
    mentalModel:
      "Ask a dedicated chooser to translate a requirement into a concrete object. The caller says what it wants, while the factory decides how to realize it.",
    recognize:
      "You see repeated `if` or `switch` blocks that all answer the same question: which implementation should this request use?",
    useWhen: [
      "The caller should not know which concrete class will be created.",
      "Creation rules may change based on configuration or runtime input.",
      "You want a single place to update when products evolve."
    ],
    tradeoffs: [
      "A simple factory can be overused instead of just using a constructor.",
      "Selection logic must live somewhere and can still grow large.",
      "Too much indirection can obscure the actual product type."
    ],
    misconceptions: [
      "Factory is not always the full Factory Method pattern.",
      "The goal is not to hide object identity forever.",
      "It should clarify, not disguise, the creation decision."
    ],
    example:
      "A formatter factory could choose JSON, CSV, or Markdown output objects based on the export target.",
    studyQuestions: [
      "Where should the choice of concrete type live?",
      "Will the caller care about the implementation later?",
      "Could a simple named constructor be clearer?"
    ]
  }),
  note({
    slug: "abstract-factory",
    title: "Abstract Factory",
    category: "Creational",
    summary:
      "Creates families of related objects that are designed to work together and share the same theme.",
    diagram: "abstract-factory",
    quickFacts: [
      { label: "Category", value: categoryFact.Creational },
      { label: "Best signal", value: "You need matching variants across several product types." },
      { label: "Main risk", value: "Harder to add new product kinds later." }
    ],
    problem:
      "Some systems don't just need one product. They need a whole family of coordinated products: buttons, panels, and menus; or localizers, formatters, and validators. Mixing families produces inconsistent behavior.",
    mentalModel:
      "Think of it as a factory of factories. One abstract doorway produces everything needed for a particular theme so the pieces stay compatible.",
    recognize:
      "The code chooses not only which object to build, but also which coherent set of objects should come from the same family.",
    useWhen: [
      "Multiple related product types must share a consistent variant.",
      "The application can switch between families at runtime.",
      "You want to hide concrete classes from the consumer."
    ],
    tradeoffs: [
      "Adding a new product type means changing the whole family interface.",
      "The number of classes grows quickly.",
      "It is powerful only when families matter more than individual objects."
    ],
    misconceptions: [
      "Abstract Factory is not the same as a single factory function.",
      "It does not mean you need dozens of classes for every problem.",
      "Its value comes from consistency across a product suite."
    ],
    example:
      "A UI theme factory can produce matching text fields, buttons, and cards for either a warm editorial theme or a cool minimal theme.",
    studyQuestions: [
      "What must stay consistent across the family?",
      "Would a single factory method lose too much context?",
      "How painful is it to add one more product type?"
    ]
  }),
  note({
    slug: "prototype",
    title: "Prototype",
    category: "Creational",
    summary:
      "Builds new objects by copying an existing one and then tailoring the clone.",
    diagram: "prototype",
    quickFacts: [
      { label: "Category", value: categoryFact.Creational },
      { label: "Best signal", value: "Construction is expensive but similar objects are common." },
      { label: "Main risk", value: "Deep copy rules can get messy." }
    ],
    problem:
      "If creating a fresh object requires lots of setup, copying a working exemplar can be cheaper and clearer than rebuilding from scratch.",
    mentalModel:
      "Treat one object as the blueprint for another. The new instance starts from known-good state and then receives only the deltas.",
    recognize:
      "You need a new object that is almost the same as an existing one, often with a few fields changed.",
    useWhen: [
      "Object initialization is costly.",
      "You want to create many variations of the same base object.",
      "The exact class is not as important as the captured state."
    ],
    tradeoffs: [
      "Cloning nested structures can be subtle.",
      "Identity and references may not copy the way you expect.",
      "If the object graph is small, copying may be needless complexity."
    ],
    misconceptions: [
      "Prototype is not just `Object.assign` in disguise.",
      "The main idea is repeatable duplication with intent.",
      "You still need to define what copying means."
    ],
    example:
      "A drafting tool can duplicate a template note, preserve formatting, and let the author tweak the title or section order.",
    studyQuestions: [
      "Which state should be copied and which should be shared?",
      "Would a builder be clearer if the object is not already known-good?",
      "How will deep references behave after cloning?"
    ]
  }),
  note({
    slug: "adapter",
    title: "Adapter",
    category: "Structural",
    summary:
      "Translates one interface into another so existing code can work with a mismatched dependency.",
    diagram: "adapter",
    quickFacts: [
      { label: "Category", value: categoryFact.Structural },
      { label: "Best signal", value: "You have a useful class with the wrong shape." },
      { label: "Main risk", value: "It only fixes the interface mismatch, not the underlying design." }
    ],
    problem:
      "Real systems grow around legacy classes, third-party APIs, and old interfaces. Rewriting everything is unrealistic, but callers still need a consistent contract.",
    mentalModel:
      "Adapter is a translator. It understands both sides and forwards calls after reshaping the message.",
    recognize:
      "A client wants a clean API, but the concrete dependency speaks a different language.",
    useWhen: [
      "You need to integrate legacy or third-party code.",
      "A dependency exposes a useful feature under the wrong interface.",
      "You want a compatibility layer without changing the original class."
    ],
    tradeoffs: [
      "It adds one more layer to debug.",
      "If you overuse adapters, the real mismatch stays hidden.",
      "The adapter can become a dumping ground for translation rules."
    ],
    misconceptions: [
      "Adapter is not the same as Decorator.",
      "It changes the interface, not necessarily the behavior.",
      "It can be class-based or object-based."
    ],
    example:
      "A payment adapter can wrap a vendor SDK so the rest of your app always calls a `charge()` method with your own domain objects.",
    studyQuestions: [
      "Which side owns the stable interface?",
      "Is the mismatch one-off or a sign the boundary should be redesigned?",
      "What data needs translation and what can pass through untouched?"
    ]
  }),
  note({
    slug: "composite",
    title: "Composite",
    category: "Structural",
    summary:
      "Treats individual objects and groups of objects the same way by placing them in a tree-shaped hierarchy.",
    diagram: "composite",
    quickFacts: [
      { label: "Category", value: categoryFact.Structural },
      { label: "Best signal", value: "Your data naturally forms nested parts and whole structures." },
      { label: "Main risk", value: "The common interface can become too generic." }
    ],
    problem:
      "Folders contain files, menus contain items, and DOM nodes contain children. Without a shared abstraction, every traversal becomes special-cased and recursive logic spreads everywhere.",
    mentalModel:
      "Think of composite as a recursive contract: leaf and branch both answer the same questions, even though only branches have children.",
    recognize:
      "You have a tree and you want code to process any node without checking whether it is a leaf or container first.",
    useWhen: [
      "The structure is naturally hierarchical.",
      "Clients should not care whether they are handling a leaf or a container.",
      "You want uniform traversal or rendering logic."
    ],
    tradeoffs: [
      "The shared interface may expose operations that make no sense for leaves.",
      "The tree can be harder to enforce if not all nodes truly fit the same contract.",
      "Recursive structures can be tricky to reason about when side effects appear."
    ],
    misconceptions: [
      "Composite is not just a tree data structure.",
      "It is about uniform treatment, not only nesting.",
      "The leaf and the branch should share a meaningful abstraction."
    ],
    example:
      "A note outline can contain headings, lists, and nested subheadings while exposing a single `render()` and `wordCount()` style API.",
    studyQuestions: [
      "What behavior should be common to all nodes?",
      "Does the leaf actually need to support the same methods as the composite?",
      "How will you traverse the tree without leaking recursion everywhere?"
    ]
  }),
  note({
    slug: "decorator",
    title: "Decorator",
    category: "Structural",
    summary:
      "Adds responsibilities by wrapping an object in layers instead of subclassing it into many combinations.",
    diagram: "decorator",
    quickFacts: [
      { label: "Category", value: categoryFact.Structural },
      { label: "Best signal", value: "You need combinable features around the same core object." },
      { label: "Main risk", value: "Order sensitivity and extra wrapper objects." }
    ],
    problem:
      "Subclassing every feature combination creates a class explosion. If logging, caching, validation, and compression can be mixed independently, inheritance quickly becomes a maze.",
    mentalModel:
      "Decorators are transparent layers. Each layer keeps the same interface, performs extra work, and passes the call onward.",
    recognize:
      "You want to attach behavior dynamically, especially when several features can be stacked in different orders.",
    useWhen: [
      "Features are orthogonal and can be mixed and matched.",
      "You want runtime composition without subclassing.",
      "The core object should remain simple."
    ],
    tradeoffs: [
      "Too many layers can make debugging harder.",
      "Behavior may depend on the order of wrapping.",
      "It can be overkill for a single optional feature."
    ],
    misconceptions: [
      "Decorator is not the same as adapter.",
      "It adds responsibility without changing the interface.",
      "The wrapper should feel like the same object from the outside."
    ],
    example:
      "A text editor action can be wrapped with autosave, analytics, and permission checks without changing the editor core.",
    studyQuestions: [
      "Could inheritance express this cleanly, or does the combination space explode?",
      "What should each wrapper add, and what should it forward untouched?",
      "Will wrapper order ever matter for correctness?"
    ]
  }),
  note({
    slug: "proxy",
    title: "Proxy",
    category: "Structural",
    summary:
      "Stands in front of a real object and controls how, when, or whether the object is accessed.",
    diagram: "proxy",
    quickFacts: [
      { label: "Category", value: categoryFact.Structural },
      { label: "Best signal", value: "You need a gatekeeper around the real subject." },
      { label: "Main risk", value: "Extra indirection can hide performance costs." }
    ],
    problem:
      "Sometimes you do not want direct access to the real object. It may be expensive, remote, sensitive, or simply too eager to load.",
    mentalModel:
      "Proxy and real subject share an interface, but the proxy adds policy: lazy loading, caching, access checks, or logging.",
    recognize:
      "You need the same API, yet the object behind it should be protected or delayed.",
    useWhen: [
      "You want lazy initialization of expensive resources.",
      "You need access control or audit logging.",
      "You want a local stand-in for a remote service."
    ],
    tradeoffs: [
      "It can mask latency if the proxy does more work than expected.",
      "The real object and proxy can drift if behavior is not kept aligned.",
      "Debugging can get confusing when the proxy adds hidden behavior."
    ],
    misconceptions: [
      "Proxy is not merely a decorator with different intent.",
      "It usually protects or optimizes access rather than adding core features.",
      "The caller should not have to change its code."
    ],
    example:
      "A document proxy can load the actual PDF only when the preview pane is opened, instead of at app startup.",
    studyQuestions: [
      "What policy belongs in the proxy rather than the real object?",
      "Can this be solved with a simpler cache or wrapper?",
      "Will callers be surprised by delayed work?"
    ]
  }),
  note({
    slug: "flyweight",
    title: "Flyweight",
    category: "Structural",
    summary:
      "Shares common intrinsic state so a huge number of tiny objects can stay memory efficient.",
    diagram: "flyweight",
    quickFacts: [
      { label: "Category", value: categoryFact.Structural },
      { label: "Best signal", value: "You have many similar objects with repeated data." },
      { label: "Main risk", value: "External state management becomes harder." }
    ],
    problem:
      "If a system creates thousands or millions of near-identical objects, memory usage and allocation overhead can dominate. Most of those objects repeat the same data.",
    mentalModel:
      "Keep the shared core inside a flyweight and move the varying context outside. The object becomes a lightweight holder around the parts that truly differ.",
    recognize:
      "A large collection repeats text, icons, glyphs, terrain tiles, or other mostly identical values.",
    useWhen: [
      "You need to represent many similar items efficiently.",
      "Intrinsic state can be shared safely.",
      "The varying context can be supplied from the outside."
    ],
    tradeoffs: [
      "The code now has to manage external state carefully.",
      "Identity can be less intuitive because many views point to the same shared core.",
      "It adds indirection to reduce memory, so it only pays off at scale."
    ],
    misconceptions: [
      "Flyweight is not just object pooling.",
      "The split between intrinsic and extrinsic state is the key idea.",
      "The pattern only matters when object count is genuinely high."
    ],
    example:
      "A note-taking canvas could store one shared style object per typography variant while each rendered token carries only its position and text.",
    studyQuestions: [
      "What can be shared safely across all instances?",
      "What context must remain outside the object?",
      "Is the memory win large enough to justify the complexity?"
    ]
  }),
  note({
    slug: "chain-of-responsibility",
    title: "Chain of Responsibility",
    category: "Behavioral",
    summary:
      "Lets a request travel through a sequence of handlers until one decides to act on it.",
    diagram: "chain",
    quickFacts: [
      { label: "Category", value: categoryFact.Behavioral },
      { label: "Best signal", value: "Several handlers could process the same request." },
      { label: "Main risk", value: "Tracing the final handler can be difficult." }
    ],
    problem:
      "When request handling depends on a series of filters, validations, or policies, hard-coding the routing logic quickly becomes brittle.",
    mentalModel:
      "Pass the baton down a line. Each handler can either process, enrich, or forward the request to the next link.",
    recognize:
      "You see layered validation, middleware, or fallback handlers where the first applicable step should win.",
    useWhen: [
      "Multiple objects can handle the same event or request.",
      "You want to decouple sender from receiver.",
      "The processing order matters more than one fixed implementation."
    ],
    tradeoffs: [
      "The chain can be hard to debug if nothing handles the request.",
      "Performance depends on how far the request travels.",
      "The order of handlers becomes a key design decision."
    ],
    misconceptions: [
      "The chain is not just a list of callbacks.",
      "Each handler should have a single, clear responsibility.",
      "It works best when the request may stop early."
    ],
    example:
      "A content moderation pipeline could route a message through profanity, spam, and policy checks before accepting it.",
    studyQuestions: [
      "What happens if no handler wants the request?",
      "Should handlers mutate the request or only observe it?",
      "How do you make the ordering explicit and testable?"
    ]
  }),
  note({
    slug: "state",
    title: "State",
    category: "Behavioral",
    summary:
      "Lets an object alter its behavior when its internal state changes, without giant conditional blocks.",
    diagram: "state",
    quickFacts: [
      { label: "Category", value: categoryFact.Behavioral },
      { label: "Best signal", value: "Behavior changes sharply based on lifecycle stage." },
      { label: "Main risk", value: "State explosion if transitions are poorly designed." }
    ],
    problem:
      "A class with many `if` or `switch` branches tied to status tends to become unreadable. As the workflow grows, the logic becomes harder to reason about and easier to break.",
    mentalModel:
      "Each state is its own mini-behavior object. The context delegates to the current state, and the state can swap itself when transitions happen.",
    recognize:
      "A domain object has modes like draft, published, archived, locked, or cancelled, and the behavior depends on the current mode.",
    useWhen: [
      "The same object behaves differently in different states.",
      "State transitions are part of the domain model.",
      "You want to eliminate condition-heavy control flow."
    ],
    tradeoffs: [
      "It creates more classes than a simple enum.",
      "Transitions must be designed carefully or the system becomes hard to follow.",
      "It can be too much if only one or two branches exist."
    ],
    misconceptions: [
      "State is not just a strategy with a lifecycle.",
      "The transitions are central, not accidental.",
      "The object is still the same context even when behavior changes."
    ],
    example:
      "A payment can move from pending to authorized to captured, and each stage exposes different permitted actions.",
    studyQuestions: [
      "Which behaviors truly depend on state, not on just a flag?",
      "What are the legal transitions between states?",
      "Is the object becoming a state machine whether you admit it or not?"
    ]
  }),
  note({
    slug: "observer",
    title: "Observer",
    category: "Behavioral",
    summary:
      "Broadcasts changes from one subject to many listeners that care about updates.",
    diagram: "observer",
    quickFacts: [
      { label: "Category", value: categoryFact.Behavioral },
      { label: "Best signal", value: "One event should ripple out to multiple dependents." },
      { label: "Main risk", value: "Notification storms and subscription leaks." }
    ],
    problem:
      "When one object changes and several other views, caches, or dependent services must react, tight coupling makes the system brittle.",
    mentalModel:
      "The subject publishes an update, and each observer decides how to respond. The sender doesn't need to know the details of every listener.",
    recognize:
      "You have dashboards, caches, UI panels, or services that must stay in sync with a central source of truth.",
    useWhen: [
      "Many things need to react to a single change.",
      "You want loose coupling between the source and the consumers.",
      "Subscribers may come and go over time."
    ],
    tradeoffs: [
      "Ordering of notifications can matter.",
      "Observers can accidentally create cycles.",
      "Subscription cleanup must be handled carefully."
    ],
    misconceptions: [
      "Observer is not the same thing as polling.",
      "The subject should not know the observer's concrete internals.",
      "It is about dependency direction as much as about callbacks."
    ],
    example:
      "A note editor can notify live word count, outline, and autosave panels whenever the document changes.",
    studyQuestions: [
      "Which parts should subscribe, and which should query on demand?",
      "How will observers unsubscribe safely?",
      "What happens if one observer throws an error?"
    ]
  }),
  note({
    slug: "strategy",
    title: "Strategy",
    category: "Behavioral",
    summary:
      "Encapsulates interchangeable algorithms so the caller can swap the behavior without changing the surrounding code.",
    diagram: "strategy",
    quickFacts: [
      { label: "Category", value: categoryFact.Behavioral },
      { label: "Best signal", value: "Different algorithms solve the same task in different ways." },
      { label: "Main risk", value: "The caller must choose or discover the right strategy." }
    ],
    problem:
      "When an algorithm choice lives inside a big conditional, the code becomes rigid. Adding a new approach means modifying the original block again.",
    mentalModel:
      "Keep the calling flow fixed and inject the algorithm as a separate object. The strategy becomes the interchangeable brain behind the same contract.",
    recognize:
      "Sorting, pricing, routing, or scoring can be done by multiple approaches, and the application needs to pick one at runtime.",
    useWhen: [
      "You have a family of related algorithms.",
      "You want to switch behavior without branching everywhere.",
      "The algorithm should be replaceable independently of the caller."
    ],
    tradeoffs: [
      "Adds indirection and more objects.",
      "The caller must still decide which strategy to use.",
      "Strategies can become too similar if variation is tiny."
    ],
    misconceptions: [
      "Strategy is not just a function pointer, though it can be implemented that way.",
      "It is about encapsulating variation cleanly.",
      "The behavior should be swappable, not hardcoded."
    ],
    example:
      "A revision scheduler can switch between spaced repetition, cram mode, and exam mode without changing the study flow.",
    studyQuestions: [
      "What varies algorithmically and what stays fixed?",
      "Does each strategy expose the same input and output expectations?",
      "Could a simple function parameter be enough?"
    ]
  }),
  note({
    slug: "template-method",
    title: "Template Method",
    category: "Behavioral",
    summary:
      "Defines the skeleton of an algorithm while letting subclasses fill in selected steps.",
    diagram: "template",
    quickFacts: [
      { label: "Category", value: categoryFact.Behavioral },
      { label: "Best signal", value: "Several workflows share the same structure." },
      { label: "Main risk", value: "Inheritance can become brittle if the template grows too large." }
    ],
    problem:
      "Many algorithms have a common outline but differ in a few steps. Copy-pasting the whole flow wastes effort and makes maintenance harder.",
    mentalModel:
      "The base class owns the recipe. Subclasses customize the ingredients or filling steps, but the overall cooking order stays fixed.",
    recognize:
      "You can describe one stable workflow with a few variation points, often in parsing, rendering, or export pipelines.",
    useWhen: [
      "The sequence of steps should not change.",
      "Some steps vary across subclasses.",
      "You want the base class to guarantee the overall invariant."
    ],
    tradeoffs: [
      "It relies on inheritance, which can limit flexibility.",
      "Hooks can be hard to discover.",
      "Subclasses may end up depending on base-class details."
    ],
    misconceptions: [
      "Template Method is not the same as Strategy.",
      "The variation lives in overridden steps, not in injected objects.",
      "A small amount of inheritance is not automatically a smell here."
    ],
    example:
      "A document exporter can define the export pipeline once while subclasses customize the heading, body serialization, and footer.",
    studyQuestions: [
      "What must remain fixed in the skeleton?",
      "Which steps should be overridable and which should not?",
      "Would composition be better if the variation grows?"
    ]
  })
];

export function getPatternBySlug(slug: string) {
  return designPatterns.find((pattern) => pattern.slug === slug);
}

export function getPatternIndex(slug: string) {
  return designPatterns.findIndex((pattern) => pattern.slug === slug);
}

export function getCategoryPatterns(category: PatternCategory) {
  return designPatterns.filter((pattern) => pattern.category === category);
}

export const categories: PatternCategory[] = [
  "Creational",
  "Structural",
  "Behavioral"
];

export const categorySummary: Record<PatternCategory, string> = {
  Creational:
    "Creation patterns help you decide where construction happens, how many instances exist, and how product families stay consistent.",
  Structural:
    "Structural patterns help objects fit together cleanly, whether that means translating interfaces, stacking behavior, or sharing memory.",
  Behavioral:
    "Behavioral patterns help code decide who reacts, who handles, and how algorithms or states evolve over time."
};
