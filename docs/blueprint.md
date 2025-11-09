# **App Name**: ControlSage

## Core Features:

- User Management: Role-based access control (RBAC) with Admin, Control Owner, Auditor, and Viewer roles. Authentication via email/password.
- Asset Management: Add and categorize IT assets (servers, applications, etc.) with metadata like owner, classification, and lifecycle status.
- Control Management: Create and manage controls (ISO 27001, NIST, etc.). Assign controls to specific assets or groups. Track control type and compliance framework mapping.
- Evidence Tracking: Upload or link evidence for implemented controls. Status tracking (Not Implemented, In Progress, Implemented, Verified).
- Risk & Compliance Dashboard: Visual summary of compliance posture per framework, asset, or department. Risk scoring based on control gaps.
- AI-Driven Control Suggestions: AI tool that suggests relevant controls based on asset type and risk profile.
- Audit & Reporting: Export compliance reports (PDF, Excel). Maintain a log of all changes to controls, assets, and evidence.

## Style Guidelines:

- Primary color: Deep Indigo (#4F46E5) to evoke trust and security.
- Background color: Light Gray (#F9FAFB), almost white.
- Accent color: Sky Blue (#38B2AC) for interactive elements and highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Use a set of consistent, minimalist icons from Phosphor or similar for asset types, control statuses, etc.
- Clean, well-structured layout using TailwindCSS grid and flexbox for responsive design.
- Subtle animations on data updates or state transitions.