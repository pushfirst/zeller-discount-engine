# zeller-discount-engine
A TypeScript-based discount calculation engine built as part of the Zeller Hiring Code Challenge.

## 🧭 Implementation Plan

**Goal:**  
Build a modular, testable, and OOP-driven **discount calculation engine** — demonstrating design clarity, SOLID principles, and clean code practices.

### Design Focus
- **OOP Principles:** Single Responsibility, Open/Closed, Dependency Inversion  
- **Patterns Used:** Strategy, Factory, Chain of Responsibility  
- **Practices:** Test-driven approach, money handled in cents, no frameworks or UI

### Approach Checklist
- [x] Understand the problem scope and identify rule types  
- [x] Define OOP contracts (`DiscountRule`, `CartLine`, `Checkout`)  
- [x] Apply **Strategy Pattern** for interchangeable discount rules  
- [x] Implement **Discount Rule 1 – Buy X Pay Y** with unit tests  
- [x] Implement **Discount Rule 2 – Bulk Buy** with unit tests  
- [x] Integrate both rules via **Checkout Engine (Context)**  
- [x] Implement **RuleFactory** for config-driven instantiation  
- [ ] (Optional) Apply **Chain of Responsibility** for sequential rule execution  
- [x] Validate correctness with Jest tests for all cases  
- [ ] Final polish – review, documentation, and commit

