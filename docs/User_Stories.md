# User Stories - BizFlow

## 1. User Personas

### 1.1 Sarah - The Business Owner
- **Age:** 38, owns a retail/consulting business with 12 employees
- **Tech Savvy:** Medium
- **Goals:** 
  - Have complete visibility into business performance
  - Reduce time spent on administrative tasks
  - Make data-driven decisions
- **Pain Points:** 
  - Juggling multiple tools (QuickBooks, Excel, Google Sheets, Email)
  - No unified view of customers, sales, and inventory
  - Difficult to track team productivity

### 1.2 Mike - The Sales Manager
- **Age:** 32, manages sales team and customer relationships
- **Tech Savvy:** Medium-High
- **Goals:**
  - Track sales pipeline and close more deals
  - Quickly create quotes and invoices
  - Understand customer history before calls
- **Pain Points:**
  - Lost quotes in email threads
  - Manual invoice creation is time-consuming
  - Can't see which leads are most promising

### 1.3 Emma - The Employee
- **Age:** 26, works on projects and manages tasks
- **Tech Savvy:** High
- **Goals:**
  - Clear visibility of assigned tasks
  - Easy time tracking
  - Collaborate with team members
- **Pain Points:**
  - Unclear priorities
  - Manual timesheets are tedious
  - Lack of project context

---

## 2. Epics & User Stories

### Epic 1: User Onboarding & Authentication
**Goal:** Enable secure access to the platform.

#### Story 1.1: Register Business Account (Owner)
**As a** Business Owner  
**I want to** register my organization on BizFlow  
**So that** I can create a workspace for my team

*Acceptance Criteria:*
- [ ] Registration form collects: Business Name, Owner Name, Email, Password
- [ ] New Organization is created with unique slug
- [ ] User is assigned "Owner" role for that Organization
- [ ] Redirected to Dashboard upon success

#### Story 1.2: Invite Team Members
**As a** Business Owner / Manager
**I want to** invite employees via email
**So that** they can join my organization

*Acceptance Criteria:*
- [ ] "Invite Member" action in Team settings
- [ ] Enter Email and Role (Manager/Employee)
- [ ] Invitation link sent to email (expires in 7 days)
- [ ] View pending invitations status

#### Story 1.3: User Login & Join
**As a** User / Invited Employee
**I want to** login or accept an invitation
**So that** I can access the workspace

*Acceptance Criteria:*
- [ ] Login with Email and Password
- [ ] "Accept Invite" page validates token
- [ ] Employee sets Name and Password to join
- [ ] Access is scoped to the specific Organization

---

### Epic 2: Dashboard & Overview
**Goal:** Provide at-a-glance business insights.

#### Story 2.1: Business Dashboard
**As a** Business Owner  
**I want to** see key metrics on my dashboard  
**So that** I can quickly assess business health

*Acceptance Criteria:*
- [ ] Display total revenue (MTD, YTD)
- [ ] Display total expenses (MTD, YTD)
- [ ] Display profit/loss
- [ ] Show count of: Open tasks, Pending invoices, Low stock items
- [ ] Recent activities feed (last 10 activities)

---

### Epic 3: CRM - Customer Management
**Goal:** Manage customer relationships effectively.

#### Story 3.1: Create Contact
**As a** Sales Manager  
**I want to** create a new contact  
**So that** I can track customer information

*Acceptance Criteria:*
- [ ] Form captures: Name, Email, Phone, Company, Type (Customer/Supplier)
- [ ] Optional fields: Address, Notes
- [ ] Validate email format
- [ ] Save and view confirmation

#### Story 3.2: Manage Sales Pipeline
**As a** Sales Manager  
**I want to** track leads through pipeline stages  
**So that** I can focus on hot leads and close deals

*Acceptance Criteria:*
- [ ] Create lead with: Contact, Deal Value, Expected Close Date
- [ ] Move leads between stages: New → Qualified → Proposal → Won/Lost
- [ ] View pipeline board (Kanban-style)
- [ ] Filter by stage, value, date

#### Story 3.3: View Contact History
**As a** Sales Manager  
**I want to** see all interactions with a customer  
**So that** I have context before reaching out

*Acceptance Criteria:*
- [ ] Display all quotes sent to contact
- [ ] Display all invoices for contact
- [ ] Display activity log (calls, meetings logged)
- [ ] Sorted by most recent first

---

### Epic 4: Sales - Quotes & Invoices
**Goal:** Streamline quote-to-cash process.

#### Story 4.1: Create Quote
**As a** Sales Manager  
**I want to** create a quote for a customer  
**So that** I can send them pricing

*Acceptance Criteria:*
- [ ] Select customer from contacts
- [ ] Add line items: Product, Quantity, Unit Price
- [ ] Auto-calculate subtotal, tax, total
- [ ] Save as Draft or Send
- [ ] Generate PDF for download/email

#### Story 4.2: Convert Quote to Invoice
**As a** Sales Manager  
**I want to** convert an accepted quote to an invoice  
**So that** I can bill the customer

*Acceptance Criteria:*
- [ ] "Convert to Invoice" button on quote
- [ ] All line items copied to invoice
- [ ] Invoice status set to "Draft"
- [ ] Invoice number auto-generated

#### Story 4.3: Track Invoice Payments
**As a** Business Owner  
**I want to** mark invoices as paid  
**So that** I can track outstanding receivables

*Acceptance Criteria:*
- [ ] Invoice status: Draft, Sent, Paid, Overdue
- [ ] "Record Payment" action with date and amount
- [ ] Support partial payments
- [ ] Overdue invoices highlighted in red

---

### Epic 5: Inventory Management
**Goal:** Track product stock efficiently.

#### Story 5.1: Create Product
**As a** Business Owner  
**I want to** add products to my catalog  
**So that** I can use them in sales and track inventory

*Acceptance Criteria:*
- [ ] Form captures: SKU, Name, Description, Category
- [ ] Price (sale price) and Cost fields
- [ ] Initial stock quantity
- [ ] Low stock threshold alert setting

#### Story 5.2: Monitor Stock Levels
**As a** Business Owner  
**I want to** see current stock levels for all products  
**So that** I can reorder before running out

*Acceptance Criteria:*
- [ ] Product list shows current quantity
- [ ] Low stock items highlighted in yellow/red
- [ ] Filter by: Category, Low Stock, Out of Stock
- [ ] Search by SKU or name

#### Story 5.3: Record Stock Movement
**As a** Employee  
**I want to** record stock in/out transactions  
**So that** inventory is accurate

*Acceptance Criteria:*
- [ ] Select product and quantity
- [ ] Movement type: Stock In, Stock Out, Adjustment
- [ ] Optional reference and notes
- [ ] Stock level updates automatically

---

### Epic 6: Project & Task Management
**Goal:** Organize work and track progress.

#### Story 6.1: Create Project
**As a** Manager  
**I want to** create a project  
**So that** I can organize related tasks

*Acceptance Criteria:*
- [ ] Form captures: Project Name, Description, Deadline
- [ ] Assign project manager
- [ ] Status: Active, On Hold, Completed
- [ ] Save and redirect to project view

#### Story 6.2: Create and Assign Tasks
**As a** Manager  
**I want to** create tasks within a project and assign to team members  
**So that** work gets done

*Acceptance Criteria:*
- [ ] Task form: Title, Description, Assignee, Due Date
- [ ] Task status: To Do, In Progress, Done
- [ ] Priority: Low, Medium, High
- [ ] Tasks displayed in list or board view

#### Story 6.3: Log Time on Task
**As an** Employee  
**I want to** log hours worked on a task  
**So that** time is tracked for billing/payroll

*Acceptance Criteria:*
- [ ] Time entry form: Date, Hours, Task, Description
- [ ] View total hours logged per task
- [ ] View total hours logged per employee
- [ ] Export time entries for payroll

---

### Epic 7: HR - Employee Management
**Goal:** Manage team information.

#### Story 7.1: Add Employee
**As a** Business Owner  
**I want to** add employees to the system  
**So that** I can manage team information

*Acceptance Criteria:*
- [ ] Form captures: Name, Email, Phone, Department
- [ ] Role selection: Employee, Manager, Owner
- [ ] Hire date and salary (optional)
- [ ] Send welcome email with login credentials

#### Story 7.2: View Employee Directory
**As a** Manager  
**I want to** view all employees  
**So that** I can quickly find contact info

*Acceptance Criteria:*
- [ ] List view with: Name, Email, Department, Role
- [ ] Search by name or email
- [ ] Filter by department
- [ ] Click employee to view full profile

---

### Epic 8: Accounting & Expenses
**Goal:** Track financial transactions.

#### Story 8.1: Record Expense
**As an** Employee  
**I want to** record a business expense  
**So that** it's tracked in accounting

*Acceptance Criteria:*
- [ ] Expense form: Date, Amount, Category, Description
- [ ] Categories: Rent, Utilities, Salaries, Marketing, Travel, etc.
- [ ] Optional: Attach receipt image
- [ ] Save and show confirmation

#### Story 8.2: View Profit & Loss
**As a** Business Owner  
**I want to** see a profit and loss statement  
**So that** I understand financial performance

*Acceptance Criteria:*
- [ ] Display total revenue (from paid invoices)
- [ ] Display total expenses (by category)
- [ ] Calculate and display profit/loss
- [ ] Filter by date range: This Month, Last Month, This Year, Custom
- [ ] Export to PDF or CSV

---

## 3. General Acceptance Criteria (All Stories)
- ✅ **Responsive Design:** All pages work on desktop and tablet
- ✅ **Loading States:** Show spinner during async operations
- ✅ **Error Handling:** Clear, actionable error messages
- ✅ **Validation:** Client-side and server-side input validation
- ✅ **Permissions:** Users can only access features allowed by their role
