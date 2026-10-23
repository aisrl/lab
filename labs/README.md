# AISRL Labs Workspace

This directory contains the codebases, environments, and automated grading suites for each lab submodule.

## Structure

```text
labs/
├── pillar-1/
│   ├── 01-chip-location/
│   │   ├── starter/          # Code provided to the learner
│   │   ├── tests/            # Automated pytest self-grader
│   │   └── solution/         # Reference solution (optional/instructor)
│   ├── 04-zkml/              # Claimed by Michael
│   └── ...
└── pillar-2/
    ├── 07-weight-exfiltration/ # Claimed by Ashanti
    └── ...
```

## Running Labs Locally

1. Navigate to the specific lab directory:
   ```bash
   cd labs/pillar-1/01-chip-location/starter
   ```
2. Install the lab dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the automated self-grader:
   ```bash
   pytest ../tests
   ```
