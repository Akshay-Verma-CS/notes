export type HldTable = {
  headers: string[];
  rows: string[][];
};

export type HldSubsection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
};

export type HldSection = {
  id: string;
  title: string;
  eyebrow: string;
  lead: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
  table?: HldTable;
  subsections?: HldSubsection[];
  callout?: {
    title: string;
    body: string;
    tone: "emerald" | "amber" | "blue";
  };
};

export type HldNote = {
  slug: string;
  title: string;
  category: "Concurrency" | "Storage" | "Caching";
  summary: string;
  readingTime: string;
  level: string;
  quickFacts: Array<{ label: string; value: string }>;
  image?: {
    src: string;
    alt: string;
    caption: string;
    sourceLabel: string;
    sourceUrl: string;
    licenseLabel: string;
    licenseUrl: string;
  };
  sections: HldSection[];
  studyQuestions: string[];
  sources: Array<{ label: string; url: string }>;
};

const note = (item: HldNote) => item;

export const hldNotes: HldNote[] = [
  note({
    slug: "locking-contention",
    title: "Locking & Contention",
    category: "Concurrency",
    summary:
      "Locks protect invariants. Contention turns that correctness boundary into a queue, and at scale the queue becomes the architecture.",
    readingTime: "18 min read",
    level: "Senior engineer",
    quickFacts: [
      {
        label: "Core invariant",
        value: "Only one conflicting mutation may cross a correctness boundary at a time."
      },
      {
        label: "Capacity ceiling",
        value: "A serialized critical section of S seconds cannot exceed roughly 1 / S operations per second."
      },
      {
        label: "Production signal",
        value: "Low useful CPU, rising lock wait, flat throughput, and rapidly worsening p99 latency."
      },
      {
        label: "Design objective",
        value: "Remove shared state, partition it, or make conflicts cheap enough to retry."
      }
    ],
    sections: [
      {
        id: "why-locks-exist",
        title: "Why locking exists",
        eyebrow: "01 / Correctness",
        lead:
          "Concurrency is not dangerous because operations happen at the same time. It is dangerous because their reads and writes can interleave while an invariant is temporarily broken.",
        paragraphs: [
          "A lock establishes mutual exclusion around that vulnerable interval. The important design question is not “do we need a lock?” but “which invariant is protected, and what is the smallest operation that must be atomic?”",
          "Without an atomic boundary, two workers can both read a balance of 100, independently calculate 120 and 80, then overwrite each other. The final value becomes 80 instead of 100. The same pattern appears as lost inventory, duplicate jobs, reused coupon codes, and corrupted state machines."
        ],
        code:
          "Balance = 100\nA: read 100 ───────── write 120\nB:      read 100 ───────── write 80\nResult: 80  // A's update was lost",
        callout: {
          title: "The invariant comes first",
          body:
            "Name the invariant before choosing the primitive. A database uniqueness constraint, atomic compare-and-swap, queue partition, or idempotency key may protect it more cleanly than an application mutex.",
          tone: "emerald"
        }
      },
      {
        id: "contention-model",
        title: "Contention is the real cost",
        eyebrow: "02 / Queueing",
        lead:
          "A lock with one caller is almost free. Contention begins when independent work converges on the same serialization point.",
        paragraphs: [
          "Once arrival rate approaches the lock holder's service rate, wait time grows non-linearly. More threads do not create more capacity; they create a longer queue, more context switching, larger memory pressure, and wider tail latency.",
          "Amdahl's law explains the ceiling: if a meaningful fraction of a request is serialized, adding cores produces diminishing returns. Queueing explains the production failure mode: the average may look acceptable while p99 and p999 explode behind one slow lock holder."
        ],
        table: {
          headers: ["Symptom", "What it usually means", "What to measure"],
          rows: [
            [
              "Throughput plateaus",
              "The critical section is at capacity",
              "Hold time, acquisitions/sec, queue depth"
            ],
            [
              "Low CPU + high latency",
              "Workers are parked or blocked",
              "Blocked threads, DB lock waits, scheduler time"
            ],
            [
              "High CPU + little progress",
              "Spinning, retries, or cache-line contention",
              "Retry rate, CAS failures, context switches"
            ],
            [
              "p99 spikes",
              "Convoys or one slow holder amplify the queue",
              "Wait-time histogram, longest holders"
            ]
          ]
        }
      },
      {
        id: "lock-types",
        title: "Lock types and trade-offs",
        eyebrow: "03 / Primitives",
        lead:
          "Choose the weakest primitive that preserves the invariant. Stronger coordination usually costs more and fails in more interesting ways.",
        subsections: [
          {
            title: "Mutex and monitor",
            paragraphs: [
              "One owner enters the critical section. This is the simplest local primitive and often the right default when the section is short, contention is low, and ownership stays in one process."
            ],
            bullets: [
              "Prefer scoped ownership so unlock happens on every exit path.",
              "Never perform unpredictable network or disk I/O while holding it."
            ]
          },
          {
            title: "Read-write lock",
            paragraphs: [
              "Multiple readers proceed concurrently while writers remain exclusive. It helps only when reads dominate, read sections are not trivial, and writer starvation is controlled."
            ],
            bullets: [
              "A plain mutex can outperform it when critical sections are tiny.",
              "A read-heavy benchmark can hide unacceptable writer latency."
            ]
          },
          {
            title: "Spinlock and atomics",
            paragraphs: [
              "A spinlock burns CPU while waiting and is appropriate only when hold times are shorter than a scheduler handoff. Atomics and lock-free structures avoid a blocking lock but still contend on cache lines and require careful memory-ordering reasoning."
            ]
          },
          {
            title: "Database locks",
            paragraphs: [
              "Row locks, predicate locks, advisory locks, and isolation levels protect state at the system of record. They are usually safer than an application lock for database invariants because they share the transaction's commit and rollback boundary."
            ],
            bullets: [
              "Keep transaction scope small and access rows in a stable order.",
              "Inspect query plans: a missing index can lock or scan far more rows than intended."
            ]
          },
          {
            title: "Distributed leases",
            paragraphs: [
              "A distributed lock is normally a time-bounded lease, not permanent ownership. The holder may pause, lose connectivity, and continue acting after its lease expired. Correct designs therefore need fencing tokens or an equivalent monotonic version checked by the protected resource."
            ]
          }
        ]
      },
      {
        id: "failure-modes",
        title: "Failure modes beyond waiting",
        eyebrow: "04 / Reliability",
        lead:
          "Contention hurts performance, but incorrect lock composition can stop progress or violate correctness.",
        table: {
          headers: ["Failure", "Mechanism", "Mitigation"],
          rows: [
            [
              "Deadlock",
              "A waits for B while B waits for A",
              "Global lock order, timeout, deadlock detection"
            ],
            [
              "Starvation",
              "One waiter is repeatedly bypassed",
              "Fair queues, bounded retries, writer preference"
            ],
            [
              "Priority inversion",
              "A high-priority task waits behind a low-priority holder",
              "Priority inheritance or shorter ownership"
            ],
            [
              "Lock convoy",
              "One stalled holder creates a queue that drains serially",
              "Partition, reduce scope, reject overload"
            ],
            [
              "Thundering herd",
              "Many waiters wake and retry together",
              "Jitter, admission control, single-flight"
            ]
          ]
        },
        callout: {
          title: "Timeout is not correctness",
          body:
            "A timeout limits waiting; it does not prove the previous owner stopped. Retried operations still need idempotency, and external side effects need a fencing or deduplication strategy.",
          tone: "amber"
        }
      },
      {
        id: "reduce-contention",
        title: "How to reduce contention",
        eyebrow: "05 / Design",
        lead:
          "The highest-leverage fixes change ownership or data flow. Micro-optimizing the lock implementation comes later.",
        subsections: [
          {
            title: "Shrink the critical section",
            paragraphs: [
              "Compute, validate, allocate, and call dependencies before acquiring the lock. Inside it, perform only the state transition that must be atomic."
            ],
            code:
              "// Bad\nlock(); fetchRemoteData(); update(); unlock();\n\n// Better\nconst next = await fetchRemoteData();\nlock(); apply(next); unlock();"
          },
          {
            title: "Partition ownership",
            paragraphs: [
              "Replace one global lock with per-tenant, per-account, per-SKU, or striped locks. A good partition key spreads traffic and aligns with the invariant."
            ],
            code: "lockIndex = stableHash(resourceId) % 256"
          },
          {
            title: "Prefer optimistic concurrency when conflicts are rare",
            paragraphs: [
              "Read a version, calculate the update, then commit only if the version is unchanged. A failed compare becomes an explicit retry instead of time spent waiting."
            ],
            code:
              "UPDATE inventory\nSET available = available - 1, version = version + 1\nWHERE sku = ? AND version = ? AND available > 0;"
          },
          {
            title: "Serialize intentionally",
            paragraphs: [
              "A partitioned queue or single-writer actor can turn accidental lock competition into explicit ownership. This is especially effective when operations for the same key must already be ordered."
            ]
          },
          {
            title: "Batch and combine",
            paragraphs: [
              "Aggregate counters, coalesce duplicate cache fills, and commit multiple state changes under one acquisition. Batching trades freshness for fewer handoffs."
            ]
          },
          {
            title: "Apply overload control",
            paragraphs: [
              "Bound queues, fail fast, rate-limit hot keys, and use exponential backoff with jitter. Unbounded retries feed the very contention that caused the timeout."
            ]
          }
        ]
      },
      {
        id: "distributed-locking",
        title: "Distributed locking requires a protocol",
        eyebrow: "06 / Distributed systems",
        lead:
          "Across machines, process pauses, network partitions, failover, and clock behavior make “I own the lock” a claim that can become stale.",
        paragraphs: [
          "A robust design defines acquisition, lease duration, renewal, release, and what the protected resource does with stale owners. Use a unique owner token for release so one client cannot delete another client's renewed lease.",
          "For correctness-critical writes, issue an increasing fencing token on every successful acquisition. The database, storage service, or worker receiving the operation rejects tokens older than the latest one it has observed."
        ],
        code:
          "lease acquired → fencing token 41 → resource accepts\nlease expires\nnew owner      → fencing token 42 → resource accepts\nold owner wakes→ fencing token 41 → resource rejects",
        bullets: [
          "Make the business operation idempotent even when the lock is expected to prevent duplicates.",
          "Do not treat Redis replication alone as linearizable consensus.",
          "Prefer a database constraint or transactional write when the invariant already lives in that database.",
          "Document the behavior when lease renewal fails halfway through work."
        ],
        callout: {
          title: "Senior-level test",
          body:
            "Pause the lock holder longer than the lease, let another owner acquire it, then resume the first holder. If both can commit, the lock does not protect correctness.",
          tone: "blue"
        }
      },
      {
        id: "production-diagnosis",
        title: "Diagnosing contention in production",
        eyebrow: "07 / Operations",
        lead:
          "Instrument the queue, not only the work. An operation can be fast after acquisition while users spend seconds waiting to enter it.",
        bullets: [
          "Record acquisition count, hold time, wait time, timeout count, and queue depth as histograms.",
          "Tag by lock class or shard, but cap cardinality; separately sample the hottest resource keys.",
          "Correlate DB lock graphs, blocked thread dumps, retry volume, and request traces.",
          "Alert on p99 wait time and saturation before timeout rate becomes the first signal.",
          "Load-test skewed keys and bursty arrivals. Uniform traffic hides hot-key contention."
        ],
        table: {
          headers: ["Question", "Evidence"],
          rows: [
            ["Is the lock necessary?", "The exact invariant and conflicting operations"],
            ["Is the scope minimal?", "Hold-time trace with work inside the section"],
            ["Is traffic skewed?", "Top keys, Gini coefficient, per-shard QPS"],
            ["Can it fail safely?", "Timeout, crash, pause, and duplicate-execution tests"]
          ]
        }
      }
    ],
    studyQuestions: [
      "What invariant is protected, and can the system of record enforce it directly?",
      "What is the critical section's service rate and expected utilization at peak load?",
      "Can ownership be partitioned without creating cross-partition transactions?",
      "What happens if the owner pauses beyond a lease and later resumes?",
      "Which metric reveals contention before user-visible timeouts begin?"
    ],
    sources: [
      {
        label: "Original Locking & Contention notes",
        url: "https://historical-scapula-315.notion.site/Locking-Contention-344a1aed12b9809b90abf16f7d3c734a"
      }
    ]
  }),
  note({
    slug: "database-sharding",
    title: "Database Sharding",
    category: "Storage",
    summary:
      "Sharding partitions ownership and load across databases. The shard key decides whether that complexity buys scale or merely relocates the bottleneck.",
    readingTime: "20 min read",
    level: "Senior engineer",
    quickFacts: [
      {
        label: "Logical shard",
        value: "A partition of the keyspace, such as tenants A–F or hash bucket 117."
      },
      {
        label: "Physical shard",
        value: "The database deployment that currently owns one or more logical shards."
      },
      {
        label: "Primary objective",
        value: "Scale storage, write throughput, connections, and failure isolation horizontally."
      },
      {
        label: "Largest risk",
        value: "A shard key that fights the access pattern creates fan-out, hotspots, and painful resharding."
      }
    ],
    sections: [
      {
        id: "sharding-model",
        title: "What sharding changes",
        eyebrow: "01 / Mental model",
        lead:
          "A sharded database replaces one global ownership boundary with a routing function: given an operation, determine the logical shard, then find the physical node that owns it.",
        paragraphs: [
          "The distinction between logical and physical shards is operationally important. If applications route directly to machine 12, moving data changes application behavior. If they route to logical bucket 117, the control plane can move that bucket between machines without changing the key-to-bucket function.",
          "Sharding is horizontal partitioning of rows or key ranges. Vertical partitioning separates columns or business capabilities and is often part of service decomposition, but it solves a different dimension of scale."
        ],
        code:
          "request → shard key → logical shard → routing map → physical database",
        callout: {
          title: "Do the cheaper work first",
          body:
            "Before sharding, verify indexing, query shape, connection pooling, caching, archiving, read replicas, and vertical capacity. Sharding permanently expands the operational surface.",
          tone: "amber"
        }
      },
      {
        id: "shard-key",
        title: "Choosing the shard key",
        eyebrow: "02 / Data ownership",
        lead:
          "The shard key is an architectural API. It determines locality, balance, transaction boundaries, failure blast radius, and how much data must move later.",
        bullets: [
          "High cardinality: enough distinct values to spread load.",
          "Stable: changing the key should not require moving the entity's entire history.",
          "Present on the hot path: routing should not require another database lookup.",
          "Aligned with transactions: data changed together should usually live together.",
          "Resistant to skew: one tenant, celebrity, timestamp, or status must not dominate a shard."
        ],
        table: {
          headers: ["Candidate", "Strength", "Typical failure"],
          rows: [
            [
              "tenant_id",
              "Strong locality and tenant isolation",
              "One very large tenant becomes a hot shard"
            ],
            [
              "user_id",
              "Even distribution for user-centric traffic",
              "Cross-user feeds and social graphs fan out"
            ],
            [
              "time range",
              "Efficient retention and range scans",
              "Current range receives nearly all writes"
            ],
            [
              "random/hash bucket",
              "Excellent distribution",
              "Range queries and global aggregates scatter"
            ]
          ]
        }
      },
      {
        id: "partitioning-methods",
        title: "Partitioning methods",
        eyebrow: "03 / Strategies",
        lead:
          "There is no universally best sharding function. The right method preserves locality for the dominant workload while keeping load and growth manageable.",
        subsections: [
          {
            title: "Hash-based sharding",
            paragraphs: [
              "Hash the shard key and map the result to a bucket. Distribution is usually even and point lookups are direct, but ordered scans and range queries fan out."
            ],
            code: "logicalBucket = hash(userId) % bucketCount"
          },
          {
            title: "Range-based sharding",
            paragraphs: [
              "Assign contiguous key or time ranges to shards. Routing and range scans are simple, but monotonic keys concentrate new writes on the latest range and unequal ranges grow at different speeds."
            ],
            bullets: [
              "Split busy ranges before they reach hard storage limits.",
              "Use a compound key or hash prefix when the newest time window is too hot."
            ]
          },
          {
            title: "Directory-based sharding",
            paragraphs: [
              "A lookup service maps an entity or logical bucket to a physical shard. It supports custom placement and easy movement, but the directory becomes control-plane infrastructure that needs replication, caching, versioning, and safe invalidation."
            ]
          },
          {
            title: "Geographic sharding",
            paragraphs: [
              "Place data by region to reduce latency or meet residency requirements. Cross-region users, disaster recovery, and global uniqueness still require an explicit design."
            ]
          },
          {
            title: "Vertical partitioning",
            paragraphs: [
              "Move cohesive columns or capabilities into independently owned stores, such as identity and profile. This improves isolation and team ownership, but joins and atomic transactions become distributed workflows."
            ],
            code:
              "Identity: user_id, email, password_hash\nProfile:  user_id, avatar, biography, last_seen"
          }
        ]
      },
      {
        id: "consistent-hashing",
        title: "Consistent hashing and virtual buckets",
        eyebrow: "04 / Stable routing",
        lead:
          "A naive modulo function remaps most keys when the number of shards changes. Consistent hashing limits movement by placing nodes and keys on a ring.",
        paragraphs: [
          "Virtual nodes improve balance by giving each physical node many positions on the ring. On membership change, only ranges adjacent to the changed positions move.",
          "For databases, a fixed set of logical buckets is often easier to operate than mapping every key directly to a server ring. Keys map permanently to buckets; a metadata table maps buckets to physical shards. Rebalancing moves whole buckets, keeps routing explainable, and supports throttled migrations."
        ],
        code:
          "key ─hash→ one of 4096 logical buckets\nbucket ─lookup→ current physical shard",
        callout: {
          title: "Control plane versus data plane",
          body:
            "Clients can cache the bucket map in the data plane, while a strongly controlled metadata service changes ownership. Version both sides so stale routers cannot silently write to the old shard.",
          tone: "blue"
        }
      },
      {
        id: "query-model",
        title: "Queries, joins, and transactions",
        eyebrow: "05 / Application impact",
        lead:
          "Sharding is successful when the common request touches one shard. Every global invariant or scatter-gather query spends part of the scale-out budget.",
        table: {
          headers: ["Concern", "Preferred design", "Fallback"],
          rows: [
            [
              "Joins",
              "Co-locate related rows by shard key",
              "Denormalize or join in a derived read model"
            ],
            [
              "Transactions",
              "Keep the write aggregate on one shard",
              "Saga/outbox with compensation and idempotency"
            ],
            [
              "Secondary indexes",
              "Local index prefixed by shard key",
              "Async global search/index service"
            ],
            [
              "Aggregates",
              "Precompute per-shard summaries",
              "Fan out asynchronously and merge"
            ],
            [
              "Unique IDs",
              "UUID, ULID, Snowflake-style allocator",
              "Range allocation per shard"
            ]
          ]
        },
        paragraphs: [
          "A request fan-out to N shards inherits the slowest shard's latency and multiplies resource consumption. Bound concurrency, use deadlines, return partial results only when the product permits it, and avoid putting full-cluster scans on synchronous user paths."
        ]
      },
      {
        id: "resharding",
        title: "Resharding without a flag day",
        eyebrow: "06 / Migration",
        lead:
          "Plan movement before the first shard fills up. Resharding is a live data migration with concurrent reads and writes, not a one-time copy.",
        subsections: [
          {
            title: "A safe migration sequence",
            bullets: [
              "Create destination capacity and record a versioned migration plan.",
              "Backfill historical rows with idempotent, checkpointed jobs.",
              "Capture concurrent changes with dual writes or change-data capture.",
              "Verify counts, checksums, and business invariants.",
              "Switch reads through a versioned router and monitor mismatches.",
              "Stop old writes, retain rollback data, then garbage-collect later."
            ]
          },
          {
            title: "Avoid unbounded dual writes",
            paragraphs: [
              "Two independent synchronous writes can diverge on partial failure. Prefer an authoritative write plus an outbox or log that reliably drives the secondary copy."
            ]
          },
          {
            title: "Throttle the move",
            paragraphs: [
              "Migration competes with production for CPU, I/O, cache, and replication bandwidth. Apply rate limits and pause automatically when latency or replica lag crosses a threshold."
            ]
          }
        ]
      },
      {
        id: "hotspots",
        title: "Hot shards and tenant skew",
        eyebrow: "07 / Failure modes",
        lead:
          "Balanced row counts do not imply balanced work. One shard can be hot because of request rate, write amplification, expensive queries, or a single oversized tenant.",
        bullets: [
          "Measure per-shard QPS, CPU, I/O, storage, connections, cache hit rate, and replication lag.",
          "Promote a large tenant to a dedicated shard without changing every other tenant's mapping.",
          "Salt or sub-shard a hot key only if the read path can cheaply merge the pieces.",
          "Separate write-heavy and read-heavy projections when one physical layout cannot serve both.",
          "Use admission control so one tenant cannot exhaust a shard shared with others."
        ],
        callout: {
          title: "Capacity has two dimensions",
          body:
            "Track both bytes and operations. A tiny shard can be CPU-bound; a quiet shard can be storage-bound. Rebalancing policy must understand both.",
          tone: "emerald"
        }
      },
      {
        id: "operating-shards",
        title: "Operating a sharded fleet",
        eyebrow: "08 / Production",
        lead:
          "A sharded database is a fleet with a control plane. Schema changes, backups, failover, and incident response must work across all shards without assuming they are identical.",
        bullets: [
          "Roll out schema changes in backward-compatible phases and track completion per shard.",
          "Back up shard data and routing metadata to the same recoverable point in time.",
          "Test restore and shard replacement; a backup is not a recovery plan.",
          "Expose the shard ID in logs and traces, but do not leak physical host identity into business logic.",
          "Automate drift detection for schema, configuration, indexes, and replication health.",
          "Keep spare capacity for failover and migration instead of running every shard near saturation."
        ]
      }
    ],
    studyQuestions: [
      "Which request supplies the shard key, and how often will it fan out?",
      "Which rows must transact together, and can they share the same ownership key?",
      "How will one oversized tenant move to dedicated capacity?",
      "What is the versioned routing protocol during a live migration?",
      "Can backups restore both data and routing metadata to a consistent point?"
    ],
    sources: [
      {
        label: "Original Database Sharding notes",
        url: "https://historical-scapula-315.notion.site/Database-sharding-33ca1aed12b9806c86a2d409210ce35d"
      }
    ]
  }),
  note({
    slug: "redis-architecture",
    title: "Redis Architecture",
    category: "Caching",
    summary:
      "Redis architecture is a set of deliberate choices across topology, replication, persistence, partitioning, and failure semantics, not simply “an in-memory cache.”",
    readingTime: "28 min read",
    level: "Senior engineer",
    quickFacts: [
      {
        label: "Execution model",
        value: "Commands for a shard are primarily serialized; modern Redis can use threads for network I/O and background work."
      },
      {
        label: "Replication",
        value: "Asynchronous by default, tracked with replication IDs and byte offsets."
      },
      {
        label: "High availability",
        value: "Sentinel manages failover for non-clustered Redis; Redis Cluster combines sharding and failover."
      },
      {
        label: "Durability",
        value: "No persistence, RDB snapshots, AOF logging, or a deliberate combination of RDB and AOF."
      }
    ],
    image: {
      src: "/notes/articles/redis-cluster-architecture.png",
      alt:
        "Redis Cluster with three primaries, two replicas per primary, and the 16,384 hash slots split across the primaries.",
      caption:
        "A Redis Cluster distributes 16,384 hash slots across primaries and keeps replicas available for failover.",
      sourceLabel: "MangKyu's Diary",
      sourceUrl: "https://mangkyu.tistory.com/419",
      licenseLabel: "CC BY-NC-ND 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-nd/4.0/"
    },
    sections: [
      {
        id: "core-model",
        title: "The core Redis process",
        eyebrow: "01 / Foundations",
        lead:
          "Redis is an in-memory data structure server. Its speed comes from memory access, compact command paths, and serialized mutation semantics inside each shard, not from the absence of architectural trade-offs.",
        paragraphs: [
          "The server accepts commands over RESP, looks up keys in an in-memory dictionary, applies operations to native data structures, and returns a response. Most command execution remains serialized, which makes individual operations atomic but means one slow O(N) command, big key, Lua script, or blocked event loop can delay unrelated clients on that shard.",
          "Modern Redis can use I/O threads for socket reads and writes, while persistence, lazy freeing, and replication can involve background work. “Single-threaded” is therefore a useful command-execution mental model, not a complete description of every subsystem."
        ],
        bullets: [
          "Keep command complexity and key size bounded.",
          "Pipeline to reduce network round trips, not to make expensive commands free.",
          "Use latency monitoring and slow logs to find event-loop stalls."
        ]
      },
      {
        id: "topologies",
        title: "Four common Redis architectures",
        eyebrow: "02 / Topology",
        lead:
          "The deployment topology determines capacity, failover behavior, client responsibilities, and which failure modes the application must tolerate.",
        table: {
          headers: ["Topology", "What it provides", "What it does not provide"],
          rows: [
            [
              "Standalone",
              "Lowest complexity and latency",
              "Automatic failover or horizontal scale"
            ],
            [
              "Primary + replicas",
              "Read copies and a promotion target",
              "Automatic discovery/election by itself"
            ],
            [
              "Sentinel",
              "Monitoring, discovery, and failover for one writable primary",
              "Write sharding"
            ],
            [
              "Redis Cluster",
              "Sharding, replica failover, and horizontal write capacity",
              "Transparent cross-slot operations"
            ]
          ]
        },
        subsections: [
          {
            title: "1. Standalone Redis",
            paragraphs: [
              "One Redis process owns the whole keyspace. It is appropriate for development, disposable caches, and workloads where infrastructure can recreate the node within the recovery objective."
            ]
          },
          {
            title: "2. Primary-replica high availability",
            paragraphs: [
              "Clients write to a primary. One or more replicas asynchronously replay its command stream. Replicas can serve stale-tolerant reads and become promotion candidates, but a separate failover mechanism is still required."
            ]
          },
          {
            title: "3. Redis Sentinel",
            paragraphs: [
              "Multiple Sentinel processes monitor a non-clustered primary-replica group, agree on failure, elect a failover leader, promote a replica, reconfigure the remaining replicas, and tell Sentinel-aware clients where the new primary lives."
            ]
          },
          {
            title: "4. Redis Cluster",
            paragraphs: [
              "Multiple primaries each own a subset of 16,384 hash slots. Replicas protect each primary. Cluster-aware clients route directly to the slot owner and react to MOVED or ASK redirections during topology changes."
            ]
          }
        ]
      },
      {
        id: "replication",
        title: "Replication: stream, identity, and offset",
        eyebrow: "03 / Replication internals",
        lead:
          "Redis replication is asynchronous by default. The primary does not wait for every replica to apply every write, so low latency comes with a window where acknowledged data can be lost during failover.",
        paragraphs: [
          "Every primary has a replication ID representing a dataset history and an offset representing a position in the replication byte stream. A replica periodically acknowledges how far it has processed. The pair (replication ID, offset) identifies a precise point in that history.",
          "The primary keeps a circular replication backlog. If a disconnected replica reconnects with a known replication ID and an offset still present in the backlog, `PSYNC` transfers only the missing stream. Backlog size therefore determines how long a replica can be disconnected and still avoid a full copy."
        ],
        code:
          "primary: replid = 8c7...  offset = 1,420,000\nreplica: replid = 8c7...  offset = 1,400,000\nPSYNC → send the missing 20,000 bytes from backlog",
        callout: {
          title: "Backlog sizing",
          body:
            "A practical lower bound is peak replication bytes per second multiplied by the longest disconnect you want to heal with partial sync, plus headroom for bursts.",
          tone: "blue"
        }
      },
      {
        id: "synchronization",
        title: "Partial and full synchronization",
        eyebrow: "04 / Recovery path",
        lead:
          "A reconnect is cheap only when primary and replica share a known history and the missing bytes still exist in the backlog.",
        subsections: [
          {
            title: "Partial resynchronization",
            bullets: [
              "Replica reconnects and sends its prior replication ID and processed offset with PSYNC.",
              "Primary recognizes the history and finds the offset in its backlog.",
              "Primary streams only the missing commands; normal replication resumes."
            ]
          },
          {
            title: "Full resynchronization",
            bullets: [
              "Primary forks or starts a background save to create an RDB snapshot.",
              "Writes arriving during the snapshot are buffered for the replica.",
              "The RDB is transferred, or streamed directly with diskless replication.",
              "Replica replaces its dataset and loads the snapshot into memory.",
              "Primary sends buffered writes, then continues the live command stream."
            ]
          },
          {
            title: "Operational cost",
            paragraphs: [
              "A full sync consumes CPU, memory, network, and often disk. Loading the new dataset can briefly block the replica. Several replicas reconnecting after an outage can produce a synchronization storm, so capacity and backlog size matter."
            ]
          },
          {
            title: "Replication history after failover",
            paragraphs: [
              "A promoted replica creates a new primary replication ID but remembers the old ID and switch offset as a secondary history. Other replicas can often partially resynchronize with it instead of requesting a full copy."
            ]
          }
        ]
      },
      {
        id: "sentinel",
        title: "Sentinel, quorum, and failover",
        eyebrow: "05 / High availability",
        lead:
          "Sentinel separates detecting a failure from authorizing a topology change. Confusing its configured quorum with the majority needed to elect a failover leader is a common design mistake.",
        paragraphs: [
          "A Sentinel marks the primary subjectively down (`SDOWN`) when it cannot reach it within the configured timeout. It asks peer Sentinels for their view; once the configured quorum agrees, the primary becomes objectively down (`ODOWN`) and a failover may be attempted.",
          "To actually lead the failover, a Sentinel needs authorization from a majority of known Sentinels. With five Sentinels and quorum two, two observations can trigger the process, but at least three votes are still required to authorize a leader."
        ],
        table: {
          headers: ["Phase", "Decision", "Why it matters"],
          rows: [
            [
              "SDOWN",
              "One Sentinel suspects the primary",
              "Local network failure must not immediately change topology"
            ],
            [
              "ODOWN",
              "Configured quorum agrees",
              "Controls failure-detection sensitivity"
            ],
            [
              "Leader election",
              "Majority authorizes one Sentinel",
              "Prevents concurrent failover leaders"
            ],
            [
              "Promotion",
              "Best eligible replica becomes primary",
              "Replica priority, offset, and health affect data loss"
            ],
            [
              "Reconfiguration",
              "Other replicas and clients learn the new primary",
              "The system converges on one topology"
            ]
          ]
        },
        callout: {
          title: "Sentinel does not make replication synchronous",
          body:
            "A failover can lose writes that were acknowledged by the old primary but not replicated to the promoted replica. Sentinel improves availability; it does not convert Redis into a linearizable CP database.",
          tone: "amber"
        }
      },
      {
        id: "wait-consistency",
        title: "Acknowledgements are not consensus",
        eyebrow: "06 / Consistency",
        lead:
          "The `WAIT` command can reduce the probability of losing a write by waiting until a requested number of replicas acknowledge an offset, but it does not provide strong consistency.",
        paragraphs: [
          "An acknowledged replica may not have durably persisted the write, and failover selection or simultaneous failures can still discard it. `WAIT` is best understood as a bounded replication acknowledgement, not a transaction commit protocol.",
          "Redis can also reject writes when fewer than a configured number of replicas are connected within a maximum lag. This bounds the risk window during degraded operation but still does not prove a specific write is durable."
        ],
        code:
          "SET order:123 confirmed\nWAIT 1 200  // wait up to 200 ms for one replica acknowledgement",
        bullets: [
          "Decide whether the data is reconstructable, important, or correctness-critical.",
          "Keep a durable system of record for state Redis is not designed to own safely.",
          "Make consumers idempotent because retry and failover can duplicate effects."
        ]
      },
      {
        id: "cluster",
        title: "Redis Cluster: slots and routing",
        eyebrow: "07 / Horizontal scale",
        lead:
          "Redis Cluster partitions the keyspace into 16,384 hash slots. Primaries own slots; replicas copy their primary's slots and can be promoted when that primary fails.",
        code: "slot = CRC16(key) mod 16384",
        paragraphs: [
          "A cluster-aware client caches the slot map. If it contacts the wrong node, `MOVED` tells it the slot has a stable owner elsewhere. During migration, `ASK` tells it to send only the current operation to a temporary destination after `ASKING`.",
          "Hash tags force related keys into the same slot by hashing the substring inside braces, such as `cart:{user-42}` and `inventory:{user-42}`. This enables multi-key operations, but a popular tag can create a hot slot."
        ],
        table: {
          headers: ["Mechanism", "Purpose", "Application consequence"],
          rows: [
            [
              "16,384 hash slots",
              "Stable layer between keys and nodes",
              "Reshard by moving slots, not changing every key's hash"
            ],
            [
              "MOVED",
              "Permanent redirection",
              "Refresh the cached slot map"
            ],
            [
              "ASK",
              "Temporary migration redirection",
              "Route one command without treating ownership as final"
            ],
            [
              "Hash tags",
              "Co-locate multiple keys",
              "Enables cross-key commands but can concentrate load"
            ],
            [
              "Cluster bus",
              "Gossip, failure detection, configuration propagation",
              "Requires node-to-node connectivity in addition to client ports"
            ]
          ]
        }
      },
      {
        id: "cluster-failover",
        title: "Cluster health and failover",
        eyebrow: "08 / Distributed control",
        lead:
          "Redis Cluster has no separate Sentinel tier. Cluster nodes exchange heartbeat and topology information over the cluster bus and coordinate replica promotion.",
        paragraphs: [
          "A node first marks a peer as possibly failing. A primary is considered failed when enough other primaries responsible for slots report it. An eligible replica then requests votes from primaries and, if elected, takes over its former primary's slots with a newer configuration epoch.",
          "The cluster favors availability only while enough slot-owning primaries can communicate. With the default full-coverage setting, an uncovered slot makes the cluster stop serving queries; operators can allow healthy slots to continue, but applications must then handle partial keyspace availability. Network partitions can make the minority side unavailable, and asynchronous replication still leaves a write-loss window."
        ],
        bullets: [
          "Place each primary and its replicas in different failure domains.",
          "Keep at least three primaries for a production cluster; size replicas to meet failure objectives.",
          "Test client behavior during MOVED, ASK, timeout, failover, and slot migration.",
          "Do not assume replicas automatically scale reads; clients must explicitly choose and tolerate stale reads."
        ]
      },
      {
        id: "persistence",
        title: "Persistence models",
        eyebrow: "09 / Durability",
        lead:
          "Persistence is a recovery policy. Select it from acceptable data loss, restart time, write latency, and operational complexity rather than enabling every option by reflex.",
        table: {
          headers: ["Mode", "Recovery behavior", "Trade-off"],
          rows: [
            [
              "None",
              "Dataset disappears on restart",
              "Fastest and appropriate only for rebuildable data"
            ],
            [
              "RDB",
              "Load the latest point-in-time snapshot",
              "Compact and fast restore; loses changes after the snapshot"
            ],
            [
              "AOF",
              "Replay logged writes",
              "Smaller loss window; more I/O and potentially slower recovery"
            ],
            [
              "RDB + AOF",
              "Use AOF as the more complete recovery history",
              "Stronger recovery options with additional resource cost"
            ]
          ]
        },
        subsections: [
          {
            title: "RDB snapshots",
            paragraphs: [
              "Redis forks a child that writes a point-in-time view while the parent continues serving traffic. Snapshot frequency defines the broad data-loss window."
            ]
          },
          {
            title: "Append-only file",
            paragraphs: [
              "AOF records write commands and can fsync always, every second, or according to the operating system. `everysec` is a common latency/durability compromise with roughly a one-second loss window under some crashes."
            ]
          },
          {
            title: "AOF rewrite",
            paragraphs: [
              "Redis periodically rewrites the AOF into a compact representation of the current dataset so historical commands do not grow forever."
            ]
          }
        ]
      },
      {
        id: "forking",
        title: "Forking and copy-on-write",
        eyebrow: "10 / Memory behavior",
        lead:
          "Forking lets Redis persist a consistent snapshot without copying the entire dataset immediately. Parent and child initially share memory pages.",
        paragraphs: [
          "When the parent modifies a shared page, the operating system copies that page so the child continues to see the old snapshot. This copy-on-write behavior is elegant, but a write-heavy workload during RDB creation or AOF rewrite can create substantial temporary memory usage.",
          "Large page tables also make `fork()` itself noticeable, and slow storage extends the period in which copy-on-write accumulates. Production capacity must include memory headroom beyond the steady-state dataset."
        ],
        bullets: [
          "Monitor fork latency, copy-on-write bytes, persistence duration, and memory fragmentation.",
          "Avoid scheduling multiple memory-heavy background operations together.",
          "Test snapshotting under realistic write rates, not an idle dataset."
        ]
      },
      {
        id: "production-design",
        title: "Production design checklist",
        eyebrow: "11 / Operations",
        lead:
          "Redis incidents are often capacity or semantics incidents: a hot key, oversized value, reconnect storm, eviction surprise, stale read, or misunderstood failover window.",
        table: {
          headers: ["Area", "Questions to answer"],
          rows: [
            [
              "Data ownership",
              "Cache, system of record, queue, or coordination layer?"
            ],
            [
              "Memory",
              "Dataset size, fragmentation, buffers, fork headroom, eviction policy?"
            ],
            [
              "Keys",
              "Hot keys, big keys, TTL distribution, hash-tag concentration?"
            ],
            [
              "Availability",
              "Topology, failure domains, client discovery, retry budget?"
            ],
            [
              "Durability",
              "RPO/RTO, AOF policy, backup and restore test?"
            ],
            [
              "Replication",
              "Backlog size, lag alert, full-sync capacity, read staleness?"
            ]
          ]
        },
        bullets: [
          "Add TTL jitter to avoid synchronized expiry and cache stampedes.",
          "Use single-flight or request coalescing when many clients miss the same key.",
          "Cap client connections, pipelines, and output buffers.",
          "Keep retry budgets below the remaining request deadline and always add jitter.",
          "Observe `used_memory`, RSS, fragmentation, evictions, hit rate, latency, slow log, replication lag, and rejected connections.",
          "Run game days for primary loss, replica lag, full resync, slot migration, and exhausted memory."
        ],
        callout: {
          title: "The architectural question",
          body:
            "If Redis vanished for ten minutes, would the application become slower, become unavailable, or become incorrect? That answer should drive topology, persistence, and recovery investment.",
          tone: "emerald"
        }
      }
    ],
    studyQuestions: [
      "Which Redis topology fits the write scale and availability objective?",
      "How large must the replication backlog be to survive a normal disconnect with PSYNC?",
      "What is the difference between Sentinel quorum and the majority required to authorize failover?",
      "Why can `WAIT` reduce data loss without providing strong consistency?",
      "How do MOVED and ASK differ during Redis Cluster routing?",
      "How much copy-on-write memory can persistence consume at peak write rate?"
    ],
    sources: [
      {
        label: "Original Redis Architecture notes",
        url: "https://historical-scapula-315.notion.site/Redis-Architecture-343a1aed12b9802e8bc6ee0127eec466"
      },
      {
        label: "Redis replication documentation",
        url: "https://redis.io/docs/latest/operate/oss_and_stack/management/replication/"
      },
      {
        label: "Redis Sentinel documentation",
        url: "https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/"
      },
      {
        label: "Redis Cluster specification",
        url: "https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/"
      },
      {
        label: "Redis persistence documentation",
        url: "https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/"
      }
    ]
  })
];

export function getHldNoteBySlug(slug: string) {
  return hldNotes.find((noteItem) => noteItem.slug === slug);
}

export function getHldNoteIndex(slug: string) {
  return hldNotes.findIndex((noteItem) => noteItem.slug === slug);
}
