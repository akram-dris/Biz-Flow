// ==============================================
// COMMON TYPES
// ==============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    success: false;
    error: {
        message: string;
        code: string;
        statusCode: number;
        timestamp: string;
        path: string;
    };
}

// ==============================================
// AUTH TYPES
// ==============================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export type UserRole = 'OWNER' | 'MANAGER' | 'EMPLOYEE';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterRequest {
    organizationName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// ==============================================
// CRM TYPES
// ==============================================

export type ContactType = 'CUSTOMER' | 'SUPPLIER';

export interface Contact {
    id: string;
    type: ContactType;
    companyName?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type LeadStage = 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';

export interface Lead {
    id: string;
    contactId: string;
    title: string;
    description?: string;
    dealValue?: number;
    stage: LeadStage;
    expectedCloseDate?: string;
    probability: number;
    assignedToId?: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
}

// ==============================================
// SALES TYPES
// ==============================================

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Quote {
    id: string;
    quoteNumber: string;
    contactId: string;
    status: QuoteStatus;
    issueDate: string;
    expiryDate?: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    contactId: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ==============================================
// INVENTORY TYPES
// ==============================================

export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    categoryId?: string;
    salePrice: number;
    costPrice?: number;
    stockQuantity: number;
    lowStockThreshold: number;
    unit: string;
    isActive: boolean;
    imageUrl?: string;
    barcode?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCategory {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
    isActive: boolean;
}

// ==============================================
// PROJECTS TYPES
// ==============================================

export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate?: string;
    deadline?: string;
    budget?: number;
    actualCost: number;
    progressPercent: number;
    contactId?: string;
    managerId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    estimatedHours?: number;
    actualHours: number;
    assigneeId?: string;
    parentTaskId?: string;
    createdAt: string;
    updatedAt: string;
}

// ==============================================
// HR TYPES
// ==============================================

export interface Department {
    id: string;
    name: string;
    description?: string;
    managerId?: string;
    isActive: boolean;
}

export interface Employee {
    id: string;
    userId: string;
    departmentId?: string;
    employeeNumber?: string;
    jobTitle?: string;
    phone?: string;
    hireDate: string;
    terminationDate?: string;
    salary?: number;
    employmentType: string;
    isActive: boolean;
}

// ==============================================
// ACCOUNTING TYPES
// ==============================================

export interface Expense {
    id: string;
    categoryId: string;
    amount: number;
    expenseDate: string;
    description: string;
    vendor?: string;
    reference?: string;
    projectId?: string;
    isReimbursable: boolean;
    isReimbursed: boolean;
    submittedById: string;
    approvedById?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseCategory {
    id: string;
    name: string;
    description?: string;
    type: string;
    isActive: boolean;
}
