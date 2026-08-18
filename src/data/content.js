// Edit everything below to swap in your own information.
// Content is kept separate from components so you never touch layout code
// just to change a sentence.

export const profile = {
  name: 'Dwi Saputra',
  role: 'Backend Engineer',
  focus: 'Distributed systems & developer tooling',
  location: 'Bandung, ID',
  status: 'Open to backend / infra roles',
  bio: [
    "I build the parts of a product that don't have a UI: queues, schedulers, replication, and the internal tools that keep a team from repeating the same three Slack questions every week.",
    'Six years split between fintech infrastructure and a two-person startup where I was the only backend person, which taught me more about failure modes than any staging environment ever did.',
  ],
  stack: [
    'Go', 'Rust', 'PostgreSQL', 'Kafka', 'Redis', 'gRPC', 'Terraform', 'Kubernetes', 'TypeScript',
  ],
}

export const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
  { label: 'Email', href: 'mailto:hello@example.com' },
]

// Each project uses a short git-style hash as its marker instead of 01/02/03 —
// it doubles as a nod to the medium (commits) rather than decoration.
export const projects = [
  {
    hash: 'a3f9c1e',
    year: '2025',
    name: 'Ledger Queue',
    role: 'Design & implementation',
    description:
      'A write-ahead log and exactly-once delivery queue for a payments platform processing roughly 40M events a day, built to replace a Kafka setup that was losing ordering guarantees under partition rebalance.',
    tags: ['Rust', 'RocksDB', 'gRPC'],
    href: '#',
  },
  {
    hash: '7b2d40a',
    year: '2024',
    name: 'Runbook',
    role: 'Sole engineer',
    description:
      'Internal CLI and dashboard that turns on-call postmortems into executable runbooks, so the second time a service falls over, the fix is a command instead of a scavenger hunt through old incident docs.',
    tags: ['Go', 'PostgreSQL', 'React'],
    href: '#',
  },
  {
    hash: 'e51a908',
    year: '2023',
    name: 'Shard Router',
    role: 'Core contributor',
    description:
      'A consistent-hashing router sitting in front of 12 PostgreSQL shards, cutting p99 query latency by 38% by moving hot-key detection out of application code and into the routing layer itself.',
    tags: ['Go', 'Redis', 'Terraform'],
    href: '#',
  },
  {
    hash: '19c6f7d',
    year: '2022',
    name: 'Migrate',
    role: 'Open source, maintainer',
    description:
      'A zero-downtime schema migration tool for PostgreSQL that shadow-writes to a new table before cutover, used in production by a handful of teams outside the original company.',
    tags: ['Rust', 'PostgreSQL'],
    href: '#',
  },
]

// Experience is presented as a commit log because the content genuinely is
// chronological — each entry is a real transition, not a decorative number.
export const experience = [
  {
    hash: 'HEAD',
    date: '2023 — now',
    title: 'Senior Backend Engineer',
    org: 'Ledger & Co.',
    note: 'Payments infrastructure team. Own the event pipeline and on-call rotation for 6 services.',
  },
  {
    hash: 'f4a19c2',
    date: '2021 — 2023',
    title: 'Backend Engineer (Employee #2)',
    org: 'Runbook Labs',
    note: 'First backend hire. Built the API, the database layer, and most of the deploy pipeline from scratch.',
  },
  {
    hash: '88de301',
    date: '2019 — 2021',
    title: 'Software Engineer',
    org: 'Studio Delapan',
    note: 'Rotated across three internal tools teams. Shipped a batch-processing service still in production today.',
  },
  {
    hash: '3a0c771',
    date: '2018 — 2019',
    title: 'Backend Intern',
    org: 'Studio Delapan',
    note: 'First production commit, first production incident, first postmortem. Learned fast.',
  },
]
