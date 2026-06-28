export type HldNote = {
  slug: string;
  title: string;
  category: "Concurrency" | "Storage" | "Caching";
  summary: string;
  diagram: "locking" | "sharding" | "redis";
  quickFacts: Array<{ label: string; value: string }>;
  problem: string;
  mentalModel: string;
  recognize: string;
  useWhen: string[];
  tradeoffs: string[];
  reduceContention: string[];
  misconceptions: string[];
  example: string;
  studyQuestions: string[];
};

const note = (item: HldNote) => item;

export const hldNotes: HldNote[] = [
  note({
    slug: "locking-contention",
    title: "Locking & Contention",
    category: "Concurrency",
    summary:
      "Protects shared mutable state with exclusive access, but the real design skill is shrinking the critical section and reducing hot-spot contention before the lock becomes the bottleneck.",
    diagram: "locking",
    quickFacts: [
      {
        label: "Category",
        value: "Concurrency control for systems with shared mutable state."
      },
      {
        label: "Best signal",
        value: "Many workers touch the same invariant, row, cache key, or counter."
      },
      {
        label: "Main risk",
        value: "Tail latency, deadlocks, lock convoys, and throughput collapse under load."
      }
    ],
    problem:
      "When multiple threads, processes, or requests update the same resource, concurrent interleavings can violate invariants. Locking serializes access so the state stays correct, but a hot lock can become the bottleneck if too many callers are queued behind it.",
    mentalModel:
      "Treat a lock as a permission token for a critical section. Whoever holds the token gets to mutate the protected resource; everyone else waits, retries, or backs off. Contention is the pressure on that token, not just the existence of a lock.",
    recognize:
      "You see one hot row, one counter, one cache entry, or one shared object that absorbs most writes. Latency climbs while throughput flattens, and lock wait time starts showing up in metrics or logs.",
    useWhen: [
      "A shared invariant must never be updated by two actors at the same time.",
      "The side effect is not safely repeatable, so accidental double execution would hurt correctness.",
      "You need a simple, explicit boundary around a critical section."
    ],
    tradeoffs: [
      "Correctness improves, but parallelism drops around the protected region.",
      "Coarse-grained locks are simple but create more waiting.",
      "Fine-grained locks improve concurrency but make ordering, debugging, and deadlocks harder."
    ],
    reduceContention: [
      "Shrink the critical section and keep I/O, network calls, and slow allocations outside it.",
      "Prefer optimistic concurrency with version checks or compare-and-swap when conflicts are rare.",
      "Partition the hot key into shards or per-tenant buckets so work spreads across multiple locks.",
      "Use read-write locks only when reads dominate and the implementation stays simple.",
      "Keep a strict lock ordering if multiple locks are unavoidable, and add backoff or timeout behavior."
    ],
    misconceptions: [
      "A lock is not a performance optimization by itself; it is a safety boundary.",
      "More locks do not automatically mean more throughput, especially if the same hot key still funnels through one spot.",
      "Distributed locks are not the default answer; if state can be partitioned or made idempotent, that is usually cleaner."
    ],
    example:
      "An inventory reservation service can use optimistic version checks per SKU or per warehouse shard instead of one global lock. The service updates the stock row inside a tiny transaction, retries only on conflicts, and keeps all external calls outside the critical section.",
    studyQuestions: [
      "What invariant am I protecting, and what is the smallest region that must stay atomic?",
      "Can I replace pessimistic locking with optimistic concurrency or idempotency?",
      "Which hot key, shard, or row is actually causing the queue to form?",
      "How will the system behave if the lock holder crashes or stalls?"
    ]
  }),
  note({
    slug: "database-sharding",
    title: "Database Sharding",
    category: "Storage",
    summary:
      "Splits a dataset across multiple shards so write load, storage growth, and query traffic do not collapse onto one database node, but it only works well when the shard key matches the access pattern.",
    diagram: "sharding",
    quickFacts: [
      {
        label: "Category",
        value: "Data partitioning for scale-out storage and request handling."
      },
      {
        label: "Best signal",
        value: "One database node is too hot, too large, or too constrained for the workload."
      },
      {
        label: "Main risk",
        value: "Cross-shard queries, resharding pain, hotspots, and operational complexity."
      }
    ],
    problem:
      "A single database can eventually hit CPU, I/O, storage, or connection limits. Even if the schema is fine, the workload may concentrate on a few tables or keys. Sharding spreads data across multiple partitions so the system can grow horizontally, but a poor shard key can simply move the bottleneck from the database to the routing layer.",
    mentalModel:
      "Think of sharding as range or hash based bucketing with an explicit routing layer. Every request should know which shard owns the data, and every design choice should be judged by whether it keeps the hot path local.",
    recognize:
      "You hear about tenant isolation, user-based partitioning, celebrity or hot-key traffic, uneven growth, or a database that needs scale beyond one machine even after indexing and caching are done well.",
    useWhen: [
      "A single database cannot comfortably hold the working set or write volume.",
      "Natural tenancy or key locality lets requests be routed to one shard most of the time.",
      "You can tolerate higher operational complexity in exchange for scale-out capacity."
    ],
    tradeoffs: [
      "The system becomes harder to query, back up, rebalance, and operate.",
      "Cross-shard joins and transactions are expensive or unavailable.",
      "A bad shard key creates hotspots and uneven shard utilization."
    ],
    reduceContention: [
      "Pick a shard key that follows the dominant access pattern and keeps the hottest writes distributed.",
      "Use a lookup or routing service only if the indirection is justified and highly available.",
      "Plan for resharding from day one with versioned routing and data migration tooling.",
      "Keep global aggregates out of the synchronous write path when possible.",
      "Use idempotent writes and async fan-out for secondary indexes, analytics, or search projections."
    ],
    misconceptions: [
      "Sharding is not the same as replication; replication copies data for availability, while sharding partitions it for scale.",
      "It is not a free performance win because queries that cross shards can become slower than the original monolith.",
      "A single hot tenant can still overload one shard even when the cluster is large."
    ],
    example:
      "A multi-tenant billing system can shard by tenant id so each customer mostly writes to one primary shard. That keeps the hot write path local, while background jobs rebuild global reports from per-shard summaries instead of forcing every report to scan the whole cluster.",
    studyQuestions: [
      "What is the shard key, and does it match the most common access path?",
      "How will I rebalance data when a shard gets too hot or too large?",
      "Which queries must stay single-shard, and which can accept fan-out?",
      "What happens if the routing layer points to the wrong shard or is briefly unavailable?"
    ]
  }),
  note({
    slug: "redis-architecture",
    title: "Redis Architecture",
    category: "Caching",
    summary:
      "Uses an in-memory command engine with optional persistence, replication, and clustering so Redis can act as a fast cache, a durable-enough data structure store, or a distributed hot-path service.",
    diagram: "redis",
    quickFacts: [
      {
        label: "Category",
        value: "In-memory data structure store with caching and messaging features."
      },
      {
        label: "Best signal",
        value: "Low-latency reads, ephemeral counters, leaderboards, sessions, or queue-like workloads."
      },
      {
        label: "Main risk",
        value: "Memory pressure, eviction surprises, durability trade-offs, and cluster hot spots."
      }
    ],
    problem:
      "A regular database is often too slow for ultra-hot paths, while a pure cache may be too weak for business-critical state. Redis sits in the middle: it serves fast operations from memory, but the architecture has to account for persistence, replication, failover, and memory management if the data matters.",
    mentalModel:
      "Think of Redis as a fast command processor around an in-memory dictionary plus specialized data structures. Reads and writes are cheap because the hot path avoids disk, but the system must decide how to survive restarts, how to scale out, and what to do when memory runs out.",
    recognize:
      "You see sessions, rate limits, feature flags, leaderboards, job queues, pub/sub, distributed locks, or cache-aside reads. The design discussion quickly turns to TTLs, eviction policy, replica lag, and whether the source of truth lives elsewhere.",
    useWhen: [
      "You need sub-millisecond access to small, hot pieces of data.",
      "The workload fits Redis data structures better than a relational schema.",
      "You can define clear persistence and recovery expectations up front."
    ],
    tradeoffs: [
      "Memory is expensive, so data size and eviction policy matter a lot.",
      "Replication improves availability but introduces lag and failover complexity.",
      "Clustered Redis scales better, but cross-slot operations and resharding need discipline."
    ],
    reduceContention: [
      "Keep hot keys small and evenly distributed so one shard or instance does not absorb all traffic.",
      "Prefer TTLs and explicit invalidation rules so stale data does not become permanent by accident.",
      "Use persistence intentionally: RDB for periodic snapshots, AOF for a stronger durability story, or both if the recovery plan justifies the cost.",
      "Design for replica lag and failover windows instead of assuming reads are instantly consistent.",
      "Avoid using Redis as a dumping ground for arbitrarily large payloads or long-lived source-of-truth records."
    ],
    misconceptions: [
      "Redis is not just a cache; it can also be a data structure store, a queue backend, and a coordination primitive.",
      "A replica is not the same as a backup; replication helps availability, but it does not replace a tested restore story.",
      "Single-threaded command execution does not mean Redis is slow; it means the architecture bets on very fast in-memory operations and careful hot-key design."
    ],
    example:
      "A session service can store session blobs in Redis with TTLs, keep the canonical user profile in a primary database, and use replicas for read scaling. If the session key is missing, the app rebuilds it from the source of truth instead of assuming Redis is permanently durable.",
    studyQuestions: [
      "Is Redis the system of record, a cache, or a coordination layer in this design?",
      "What happens to the workload when memory pressure forces eviction?",
      "How should the app behave if a replica lags or a primary fails over?",
      "Which data should be persisted, and which should be rebuilt on demand?"
    ]
  })
];

export function getHldNoteBySlug(slug: string) {
  return hldNotes.find((noteItem) => noteItem.slug === slug);
}

export function getHldNoteIndex(slug: string) {
  return hldNotes.findIndex((noteItem) => noteItem.slug === slug);
}
