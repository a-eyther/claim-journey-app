import { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, MessageSquare, FileText, CreditCard, ChevronRight, User, Building2, Activity, Package, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ClaimData, TimelineEvent, Procedure } from '@/types/claim';

// Mock data for the current claim
const mockClaimData: ClaimData = {
  referenceId: "T05032537358490",
  scheme: "MAA-YOJANA",
  status: "paid",
  claimAmount: 85000,
  approvedAmount: 85000,
  paidAmount: 85000,
  paymentDate: "Feb 24, 2025",
  paymentMode: "NEFT",
  lastUpdated: "Feb 24, 2025",
  patient: {
    name: "Hanuman Ram Kumawat",
    gender: "Male",
    idType: "Aadhaar",
    idNumber: "XXXX-XXXX-8745",
    mobileNo: "98765XXXXX"
  },
  hospital: {
    name: "City Hospital Jaipur",
    nabh: true,
    department: "IPD"
  },
  treatment: {
    admissionDate: "Feb 2, 2025",
    dischargeDate: "Feb 3, 2025",
    lengthOfStay: 2,
    speciality: "Interventional Cardiology"
  },
  package: {
    code: "T05032537358490",
    name: "Cardiac Catheterization with Stent"
  },
  timeline: {
    submission: "Feb 3, 2025",
    lastUpdated: "Feb 24, 2025",
    paymentDate: "Feb 24, 2025"
  },
  query: {
    raised: "Feb 7, 2025",
    remark: "Provide OT notes with in/out time, post stent flow, still blocks, ECG with seal and sign, stent invoice"
  }
};

// Timeline events grouped by stages with all statuses from screenshots
const timelineEventsByStage: Record<string, TimelineEvent[]> = {
  'pre-auth-preprocessing': [
    {
      id: -4,
      title: 'Claim Submitted to Eyther',
      date: 'January 31, 2025 at 4:00 PM',
      actor: 'Hospital',
      status: 'CLAIM_SUBMITTED',
      details: 'Pre-authorization request submitted to Eyther for initial processing and verification.',
      icon: 'FileText',
      iconColor: 'blue'
    },
    {
      id: -3,
      title: 'Query Raised by Eyther',
      date: 'January 31, 2025 at 5:30 PM',
      actor: 'Eyther Analyst',
      status: 'QUERY_BY_EYTHER',
      details: 'Additional patient history and diagnostic reports requested for pre-auth evaluation.',
      icon: 'HelpCircle',
      iconColor: 'yellow',
      query: {
        reason: 'Incomplete patient history',
        requirements: [
          'Previous cardiac history if any',
          'Latest ECG report',
          'Angiography recommendation'
        ],
        deadline: 'February 1, 2025 at 12:00 PM'
      }
    },
    {
      id: -2,
      title: 'Query Response Submitted',
      date: 'February 1, 2025 at 10:00 AM',
      actor: 'Hospital',
      status: 'QUERY_REPLIED',
      details: 'Hospital submitted all requested documents. Query marked as resolved.',
      icon: 'MessageSquare',
      iconColor: 'blue',
      response: 'All requested documents uploaded: Previous cardiac history (none), ECG report dated 31/01/2025, Angiography recommendation from Dr. Sharma.'
    },
    {
      id: -1,
      title: 'Approved by Eyther',
      date: 'February 1, 2025 at 2:00 PM',
      actor: 'Eyther Medical Team',
      status: 'APPROVED_BY_EYTHER',
      details: 'Pre-authorization verified and approved by Eyther. Case forwarded to TPA for final approval.',
      icon: 'CheckCircle',
      iconColor: 'green'
    }
  ],
  'pre-auth': [
    {
      id: 0,
      title: 'Beneficiary Identification Done',
      date: 'February 1, 2025 at 2:30 PM',
      actor: 'Hospital Reception',
      status: 'BENEFICIARY_IDENTIFICATION_DONE',
      details: 'Patient identity verified successfully using Aadhaar authentication. Eligibility confirmed for MAA Yojana scheme.',
      icon: 'CheckCircle',
      iconColor: 'green'
    },
    {
      id: 1,
      title: 'Pre-Authorization Pending',
      date: 'February 1, 2025 at 3:15 PM',
      actor: 'Hospital',
      status: 'PRE_AUTH_PENDING',
      details: 'Pre-authorization request submitted for cardiac catheterization with stent procedures. Awaiting TPA approval.',
      icon: 'Clock',
      iconColor: 'yellow',
      procedures: ['PKG-001-CARDIAC', 'PKG-002-DES-2.5', 'PKG-003-ICU']
    },
    {
      id: 2,
      title: 'Pre-Authorization Approved',
      date: 'February 2, 2025 at 9:54 AM',
      actor: 'SYS/TPA',
      status: 'PRE_AUTH_APPROVED',
      details: 'System automatically approved pre-authorization based on clinical criteria. All 3 procedures cleared for treatment with total approved amount of ₹85,000.',
      icon: 'CheckCircle',
      iconColor: 'green',
      procedures: ['PKG-001-CARDIAC', 'PKG-002-DES-2.5', 'PKG-003-ICU']
    },
    {
      id: 3,
      title: 'Admission Completed',
      date: 'February 2, 2025 at 10:30 AM',
      actor: 'Hospital',
      status: 'ADMISSION_PENDING',
      details: 'Patient admitted to Interventional Cardiology department. Bed allocated and pre-operative procedures initiated.',
      icon: 'CheckCircle',
      iconColor: 'green'
    }
  ],
  'discharge-preprocessing': [
    {
      id: 4.1,
      title: 'Discharge Claim Submitted to Eyther',
      date: 'February 3, 2025 at 3:00 PM',
      actor: 'Hospital',
      status: 'DISCHARGE_CLAIM_SUBMITTED',
      details: 'Post-discharge claim documents submitted to Eyther for preliminary review and verification.',
      icon: 'FileText',
      iconColor: 'blue'
    },
    {
      id: 4.2,
      title: 'Initial Review by Eyther',
      date: 'February 3, 2025 at 3:30 PM',
      actor: 'Eyther Processing Team',
      status: 'EYTHER_REVIEW_IN_PROGRESS',
      details: 'Eyther team reviewing discharge documents, bills, and treatment records for completeness.',
      icon: 'Clock',
      iconColor: 'yellow'
    },
    {
      id: 4.3,
      title: 'Query Raised by Eyther',
      date: 'February 3, 2025 at 4:00 PM',
      actor: 'Eyther Analyst',
      status: 'DISCHARGE_QUERY_BY_EYTHER',
      details: 'Missing discharge summary details and itemized bill breakdown requested.',
      icon: 'HelpCircle',
      iconColor: 'yellow',
      query: {
        reason: 'Incomplete discharge documentation',
        requirements: [
          'Detailed discharge summary with medication list',
          'Itemized bill with consumables breakdown',
          'Post-operative notes'
        ],
        deadline: 'February 3, 2025 at 4:30 PM'
      }
    },
    {
      id: 4.4,
      title: 'Query Response Submitted',
      date: 'February 3, 2025 at 4:20 PM',
      actor: 'Hospital',
      status: 'DISCHARGE_QUERY_REPLIED',
      details: 'Hospital submitted all requested discharge documents promptly.',
      icon: 'MessageSquare',
      iconColor: 'blue',
      response: 'Updated discharge summary with complete medication list, detailed itemized bill, and post-operative notes uploaded.'
    },
    {
      id: 4.5,
      title: 'Approved by Eyther',
      date: 'February 3, 2025 at 4:45 PM',
      actor: 'Eyther Medical Team',
      status: 'DISCHARGE_APPROVED_BY_EYTHER',
      details: 'Discharge claim verified and approved by Eyther. Case forwarded to TPA L1 team for processing.',
      icon: 'CheckCircle',
      iconColor: 'green'
    }
  ],
  'discharge-l1': [
    {
      id: 4,
      title: 'Claim Submission Pending',
      date: 'February 3, 2025 at 2:00 PM',
      actor: 'Hospital',
      status: 'CLAIM_SUBMISSION_PENDING',
      details: 'Patient discharged. Hospital preparing final bill and discharge summary for claim submission.',
      icon: 'Clock',
      iconColor: 'yellow'
    },
    {
      id: 5,
      title: 'Claim Submitted',
      date: 'February 3, 2025 at 4:46 PM',
      actor: 'Swasthya Margdarshak',
      status: 'PENDING_L1',
      details: 'Post-treatment claim documents submitted successfully. Claim entered into L1 analyst review queue for initial assessment.',
      icon: 'FileText',
      iconColor: 'yellow',
      documents: ['Discharge Summary', 'Final Bill', 'Treatment Records', 'Pre-auth approval copy']
    },
    {
      id: 6,
      title: 'Query Raised by Analyst',
      date: 'February 7, 2025 at 4:34 PM',
      actor: 'TPA L1 Analyst',
      status: 'QUERY_RAISED',
      details: 'L1 Analyst identified missing critical documentation required for claim approval. Claim put on hold pending document submission.',
      icon: 'HelpCircle',
      iconColor: 'blue',
      query: {
        reason: 'Incomplete documentation - Missing operative notes and supporting invoices',
        requirements: [
          'OT notes with in and out time',
          'Post stent flow documentation',
          'Still blocks documentation', 
          'ECG with seal and sign',
          'Stent invoice with batch numbers'
        ],
        deadline: 'February 10, 2025'
      }
    },
    {
      id: 7,
      title: 'Query Response Submitted',
      date: 'February 15, 2025 at 6:25 PM',
      actor: 'Swasthya Margdarshak (Hanuman Ram Kumawat)',
      status: 'QUERY_REPLIED',
      details: 'Hospital submitted all requested documents within extended deadline. Query marked as resolved by hospital.',
      icon: 'MessageSquare',
      iconColor: 'blue',
      response: 'All requested documents uploaded: OT notes with timestamps (In: 11:30 AM, Out: 1:45 PM), post stent flow report showing 100% patency, blocks documentation, sealed ECG report dated 03/02/2025, and detailed stent invoice with batch numbers.'
    },
    {
      id: 8,
      title: 'L1 Review Completed',
      date: 'February 16, 2025 at 11:00 AM',
      actor: 'TPA L1 Analyst',
      status: 'APPROVED_L1',
      details: 'L1 analyst verified all documents and found claim to be in order. Recommended for L2 review with no deductions.',
      icon: 'CheckCircle',
      iconColor: 'green'
    }
  ],
  'discharge-l2': [
    {
      id: 9,
      title: 'L2 Review Initiated',
      date: 'February 16, 2025 at 2:30 PM',
      actor: 'TPA L2 Reviewer',
      status: 'PENDING_L2',
      details: 'Claim escalated to L2 reviewer for final medical assessment and approval. High-value claim requiring senior review.',
      icon: 'Clock',
      iconColor: 'yellow'
    },
    {
      id: 10,
      title: 'Claim Under Final Review',
      date: 'February 20, 2025 at 4:49 PM',
      actor: 'TPA Senior Medical Officer',
      status: 'CLAIM_APPROVAL_PENDING',
      details: 'Senior medical officer reviewing clinical documents and treatment appropriateness. Final decision pending.',
      icon: 'Clock',
      iconColor: 'yellow'
    },
    {
      id: 11,
      title: 'Claim Approved by L2',
      date: 'February 21, 2025 at 7:09 PM',
      actor: 'TPA Senior Medical Officer',
      status: 'APPROVED_L2',
      details: 'All procedures and packages approved after thorough medical review. Treatment found appropriate and within scheme guidelines. Full amount approved without deductions.',
      icon: 'CheckCircle',
      iconColor: 'green'
    }
  ],
  'payment': [
    {
      id: 12,
      title: 'Payment Processing Initiated',
      date: 'February 22, 2025 at 10:00 AM',
      actor: 'TPA Finance Team',
      status: 'APPROVED_L2_IN_PROCESS',
      details: 'Claim sent to finance team for payment processing. NEFT details verified with hospital bank account.',
      icon: 'Clock',
      iconColor: 'yellow'
    },
    {
      id: 13,
      title: 'Payment Approved',
      date: 'February 23, 2025 at 3:00 PM',
      actor: 'Finance Manager',
      status: 'CLAIM_PAID',
      details: 'Payment of ₹85,000 approved by finance manager. Amount queued for NEFT transfer in next batch.',
      icon: 'CheckCircle',
      iconColor: 'green',
      payment: {
        amount: '₹85,000',
        mode: 'NEFT',
        status: 'APPROVED'
      }
    },
    {
      id: 14,
      title: 'Payment Completed',
      date: 'February 24, 2025 at 12:00 AM',
      actor: 'System',
      status: 'CLAIM_PACKAGE_APPROVED_AND_PAID',
      details: 'Payment of ₹85,000 processed successfully via NEFT. Transaction reference: NEFT/2025/02/24/TXN1234567. Hospital account credited.',
      icon: 'DollarSign',
      iconColor: 'green',
      payment: {
        amount: '₹85,000',
        mode: 'NEFT',
        status: 'PAYMENT DONE'
      }
    }
  ]
};

const procedures: Procedure[] = [
  {
    name: "Cardiac Catheterization",
    code: "PKG-001-CARDIAC",
    amount: 50000,
    status: "approved"
  },
  {
    name: "Drug Eluting Stent - 2.5mm",
    code: "PKG-002-DES-2.5",
    amount: 20000,
    status: "approved"
  },
  {
    name: "Post-Op ICU Care",
    code: "PKG-003-ICU",
    amount: 15000,
    status: "approved"
  }
];

// Documents are now combined into a single PDF

// Define claim stages
const claimStages = [
  {
    id: 'pre-auth-preprocessing',
    name: 'Pre-auth Preprocessing by Eyther',
    icon: Activity,
    color: 'indigo',
    description: 'Initial verification and processing by Eyther'
  },
  {
    id: 'pre-auth',
    name: 'Pre-auth',
    icon: FileText,
    color: 'blue',
    description: 'Initial authorization and approval process'
  },
  {
    id: 'discharge-preprocessing',
    name: 'Discharge Preprocessing by Eyther',
    icon: Activity,
    color: 'indigo',
    description: 'Post-discharge verification by Eyther'
  },
  {
    id: 'discharge-l1',
    name: 'Discharge L1 Review',
    icon: Clock,
    color: 'yellow',
    description: 'First level review after patient discharge'
  },
  {
    id: 'discharge-l2',
    name: 'Discharge L2 Review',
    icon: AlertCircle,
    color: 'purple',
    description: 'Second level review and final approval'
  },
  {
    id: 'payment',
    name: 'Payment Stage',
    icon: CreditCard,
    color: 'green',
    description: 'Payment processing and completion'
  }
];

export function ClaimJourneyStages() {
  const [expandedStage, setExpandedStage] = useState<string | null>('pre-auth');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreprocessed, setIsPreprocessed] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageProgress = (stageId: string) => {
    const events = timelineEventsByStage[stageId] || [];
    if (events.length === 0) return 'pending';
    
    // Check if any event has an error/rejected status
    const hasError = events.some(event => 
      event.status.includes('REJECTED') || event.status.includes('ERROR')
    );
    if (hasError) return 'error';
    
    // Check if stage has pending statuses
    const hasPending = events.some(event =>
      event.status.includes('PENDING') && !event.status.includes('APPROVAL_PENDING')
    );
    
    // Check stage-specific completion
    switch(stageId) {
      case 'pre-auth-preprocessing':
        const hasEytherPreAuthApproval = events.some(e => e.status === 'APPROVED_BY_EYTHER');
        return hasEytherPreAuthApproval ? 'completed' : (hasPending ? 'in-progress' : 'pending');
      
      case 'pre-auth':
        const hasPreAuthApproval = events.some(e => e.status === 'PRE_AUTH_APPROVED');
        return hasPreAuthApproval ? 'completed' : (hasPending ? 'in-progress' : 'pending');
      
      case 'discharge-preprocessing':
        const hasEytherDischargeApproval = events.some(e => e.status === 'DISCHARGE_APPROVED_BY_EYTHER');
        return hasEytherDischargeApproval ? 'completed' : 'in-progress';
      
      case 'discharge-l1':
        const hasL1Approval = events.some(e => e.status === 'APPROVED_L1');
        return hasL1Approval ? 'completed' : 'in-progress';
      
      case 'discharge-l2':
        const hasL2Approval = events.some(e => e.status === 'APPROVED_L2');
        return hasL2Approval ? 'completed' : 'in-progress';
      
      case 'payment':
        const hasFinalPayment = events.some(e => e.status === 'CLAIM_PACKAGE_APPROVED_AND_PAID');
        return hasFinalPayment ? 'completed' : 'in-progress';
      
      default:
        return 'pending';
    }
  };

  const getTimelineIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle {...iconProps} />;
      case 'FileText':
        return <FileText {...iconProps} />;
      case 'HelpCircle':
        return <AlertCircle {...iconProps} />;
      case 'MessageSquare':
        return <MessageSquare {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'DollarSign':
        return <CreditCard {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-foreground">Claim Journey</h1>
                {isPreprocessed ? (
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Preprocessed by Eyther
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Preprocessed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Track claim {mockClaimData.referenceId} across all stages</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreprocessed(!isPreprocessed)}
            className="rounded-lg"
          >
            {isPreprocessed ? 'Show Not Preprocessed' : 'Show Preprocessed'}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Reference ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-foreground">{mockClaimData.referenceId}</p>
              <p className="text-sm text-muted-foreground mt-1">{mockClaimData.scheme}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="mb-2 bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Payment Completed
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Last updated: {mockClaimData.lastUpdated}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Claim Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-foreground">{formatCurrency(mockClaimData.claimAmount)}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium">{formatCurrency(mockClaimData.approvedAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(mockClaimData.paidAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payment Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-foreground">{mockClaimData.paymentDate}</p>
              <p className="text-sm text-muted-foreground mt-1">Mode: {mockClaimData.paymentMode}</p>
            </CardContent>
          </Card>
        </div>

        {/* Not Preprocessed Warning Banner */}
        {!isPreprocessed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">This claim was not preprocessed by Eyther</p>
                <p className="text-xs text-red-600 mt-0.5">Claims preprocessed by Eyther typically experience fewer queries and faster approvals</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Panel - Detailed Information */}
          <Card className="lg:col-span-1 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Complete Claim Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Information */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient Details
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Patient Name:</span>
                    <span className="font-medium">{mockClaimData.patient.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{mockClaimData.patient.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">ID Type:</span>
                    <span className="font-medium">{mockClaimData.patient.idType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">ID Number:</span>
                    <span className="font-medium">{mockClaimData.patient.idNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Mobile No:</span>
                    <span className="font-medium">{mockClaimData.patient.mobileNo}</span>
                  </div>
                </div>
              </div>

              {/* Hospital Information */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Hospital Details
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Hospital Name:</span>
                    <span className="font-medium">{mockClaimData.hospital.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">NABH Accreditation:</span>
                    <span className="font-medium">{mockClaimData.hospital.nabh ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Care Department:</span>
                    <span className="font-medium">{mockClaimData.hospital.department}</span>
                  </div>
                </div>
              </div>

              {/* Treatment Information */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Treatment Details
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Date of Admission:</span>
                    <span className="font-medium">{mockClaimData.treatment.admissionDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Date of Discharge:</span>
                    <span className="font-medium">{mockClaimData.treatment.dischargeDate}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Length of Stay:</span>
                    <span className="font-medium">{mockClaimData.treatment.lengthOfStay} days</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Speciality Name:</span>
                    <span className="font-medium">{mockClaimData.treatment.speciality}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Stage-based Timeline */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Claim Journey by Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {claimStages
                  .filter(stage => isPreprocessed || (!stage.id.includes('preprocessing')))
                  .map((stage) => {
                  const Icon = stage.icon;
                  const progress = getStageProgress(stage.id);
                  const isExpanded = expandedStage === stage.id;
                  const stageEvents = isPreprocessed ? (timelineEventsByStage[stage.id] || []) : (stage.id.includes('preprocessing') ? [] : timelineEventsByStage[stage.id] || []);

                  return (
                    <div key={stage.id} className="relative">
                      {/* Stage header */}
                      <div
                        className={cn(
                          "relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                          "hover:shadow-sm hover:border-primary/20",
                          isExpanded && "border-primary/30 shadow-sm bg-muted/20"
                        )}
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10",
                            progress === 'completed' && "bg-green-50 text-green-600 border-2 border-green-200",
                            progress === 'in-progress' && "bg-amber-50 text-amber-600 border-2 border-amber-200",
                            progress === 'error' && "bg-red-50 text-red-600 border-2 border-red-200",
                            progress === 'pending' && "bg-gray-50 text-gray-400 border-2 border-gray-200",
                            stage.color === 'indigo' && progress === 'completed' && "bg-indigo-50 text-indigo-600 border-2 border-indigo-200",
                            stage.color === 'indigo' && progress === 'in-progress' && "bg-indigo-50 text-indigo-600 border-2 border-indigo-200"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{stage.name}</h3>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stageEvents.length} event{stageEvents.length !== 1 ? 's' : ''} in this stage
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {progress === 'completed' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {progress === 'in-progress' && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                          {progress === 'error' && (
                            <Badge className="bg-red-100 text-red-700 border-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Action Required
                            </Badge>
                          )}
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </div>
                      </div>

                      {/* Expanded timeline events */}
                      {isExpanded && stageEvents.length > 0 && (
                        <div className="mt-4 ml-16">
                          {stageEvents.map((event, eventIndex) => (
                            <div
                              key={event.id}
                              className="relative"
                            >
                              {/* Line connecting to next event */}
                              {eventIndex < stageEvents.length - 1 && (
                                <div 
                                  className="absolute left-6 top-14 w-0.5 bg-border/40"
                                  style={{ height: 'calc(100% - 1rem)' }}
                                />
                              )}
                              
                              <div
                                className={cn(
                                  "relative flex gap-4 cursor-pointer hover:bg-muted/30 p-4 rounded-xl transition-all",
                                  eventIndex < stageEvents.length - 1 ? "pb-8" : ""
                                )}
                                onClick={() => handleEventClick(event)}
                              >
                                <div
                                  className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10",
                                    event.iconColor === 'green' && "bg-green-50 text-green-600 border-2 border-green-200",
                                    event.iconColor === 'yellow' && "bg-amber-50 text-amber-600 border-2 border-amber-200",
                                    event.iconColor === 'blue' && "bg-blue-50 text-blue-600 border-2 border-blue-200",
                                    event.iconColor === 'red' && "bg-red-50 text-red-600 border-2 border-red-200",
                                    event.iconColor === 'purple' && "bg-purple-50 text-purple-600 border-2 border-purple-200"
                                  )}
                                >
                                  {getTimelineIcon(event.icon)}
                                </div>
                                <div className="flex-1">
                                <h4 className="font-semibold text-base">{event.title}</h4>
                                <p className="text-sm text-muted-foreground mb-1">{event.date} • By {event.actor}</p>
                                <p className="text-sm text-gray-600">{event.details}</p>
                                
                                {/* Package Status for relevant events */}
                                {(event.status.includes('APPROVED') || event.status.includes('QUERY') || event.status.includes('PENDING')) && (
                                  <div className="mt-3 space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Package Status:</p>
                                    <div className="grid gap-2">
                                      {procedures.map((pkg, idx) => {
                                        // Simulate different statuses based on event type
                                        let pkgStatus = pkg.status;
                                        if (event.status === 'QUERY_RAISED' && idx === 1) {
                                          pkgStatus = 'query';
                                        } else if (event.status.includes('PENDING') && idx > 0) {
                                          pkgStatus = 'pending';
                                        }
                                        
                                        return (
                                          <div key={pkg.code} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg border border-border/30">
                                            <div className="flex-1">
                                              <p className="text-xs font-medium">{pkg.name}</p>
                                              <p className="text-[10px] text-muted-foreground">{pkg.code}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-medium">{formatCurrency(pkg.amount)}</span>
                                              <Badge 
                                                variant="secondary" 
                                                className={cn(
                                                  "text-[10px] px-2 py-0.5",
                                                  pkgStatus === 'approved' && "bg-green-100 text-green-700 border-green-200",
                                                  pkgStatus === 'pending' && "bg-yellow-100 text-yellow-700 border-yellow-200",
                                                  pkgStatus === 'query' && "bg-amber-100 text-amber-700 border-amber-200"
                                                )}
                                              >
                                                {pkgStatus === 'approved' ? 'Approved' : pkgStatus === 'pending' ? 'Pending' : 'Query'}
                                              </Badge>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                {event.query && (
                                  <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p className="font-semibold text-sm text-amber-800 mb-2 flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4" />
                                      Documents Required:
                                    </p>
                                    {event.status === 'QUERY_RAISED' && (
                                      <p className="text-xs text-amber-700 mb-2">Query raised for package: <span className="font-semibold">Drug Eluting Stent - 2.5mm (PKG-002-DES-2.5)</span></p>
                                    )}
                                    <ul className="list-disc list-inside text-xs text-amber-700 space-y-1 ml-6">
                                      {event.query.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {event.response && (
                                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="font-semibold text-sm text-blue-800 mb-1 flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      Response:
                                    </p>
                                    <p className="text-xs text-blue-700 ml-6">{event.response}</p>
                                  </div>
                                )}

                                {event.payment && (
                                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="font-semibold text-sm text-green-800 mb-2 flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      Payment Details:
                                    </p>
                                    <div className="ml-6 space-y-1">
                                      <p className="text-xs text-green-700">Amount: {event.payment.amount}</p>
                                      <p className="text-xs text-green-700">Mode: {event.payment.mode}</p>
                                      <p className="text-xs text-green-700">Status: {event.payment.status}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <Tabs defaultValue="procedures" className="w-full">
            <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-muted/30">
              <TabsTrigger 
                value="procedures" 
                className="rounded-none px-6 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                Procedures
              </TabsTrigger>
              <TabsTrigger 
                value="financial"
                className="rounded-none px-6 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                Financial Summary
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="rounded-none px-6 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="metrics"
                className="rounded-none px-6 py-3 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-sm"
              >
                Processing Metrics
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-6">
                <TabsContent value="procedures">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Procedure</TableHead>
                        <TableHead>Package Code</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procedures.map((procedure) => (
                        <TableRow key={procedure.code}>
                          <TableCell>{procedure.name}</TableCell>
                          <TableCell>{procedure.code}</TableCell>
                          <TableCell>{formatCurrency(procedure.amount)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-50 text-green-600 border-green-200 hover:bg-green-50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="financial">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Claimed Amount
                      </p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(mockClaimData.claimAmount)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total amount requested by hospital</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approved Amount
                      </p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(mockClaimData.approvedAmount)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Amount approved after final review</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Deductions</p>
                      <p className="text-2xl font-bold text-foreground">₹0</p>
                      <p className="text-xs text-muted-foreground mt-1">Amount deducted from claim</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Paid Amount
                      </p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(mockClaimData.paidAmount)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Final amount transferred to hospital</p>
                      <p className="text-xs text-muted-foreground mt-1">Payment Date: {mockClaimData.paymentDate}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Combined Claim Documents.pdf</h3>
                          <p className="text-sm text-muted-foreground">Contains all claim-related documents • 23 pages • 4.2 MB</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <FileText className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Full Screen
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-border/50 h-[600px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">PDF Viewer</p>
                          <p className="text-sm mt-2">Combined document includes:</p>
                          <ul className="text-xs mt-3 space-y-1">
                            <li>• Pre-authorization form</li>
                            <li>• Discharge summary</li>
                            <li>• OT notes with timestamps</li>
                            <li>• ECG reports (sealed & signed)</li>
                            <li>• Stent invoice with batch numbers</li>
                            <li>• All query responses</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Total Length of Stay
                      </p>
                      <p className="text-2xl font-bold text-foreground">{mockClaimData.treatment.lengthOfStay} days</p>
                      <p className="text-xs text-muted-foreground mt-1">Time patient stayed in hospital from admission to discharge</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Pre-auth Approval Time</p>
                      <p className="text-2xl font-bold text-foreground">2 hours</p>
                      <p className="text-xs text-muted-foreground mt-1">Time from pre-auth submission to approval</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Discharge Approval Time</p>
                      <p className="text-2xl font-bold text-foreground">18 days</p>
                      <p className="text-xs text-muted-foreground mt-1">Time from discharge claim submission to final approval</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Discharge to Payment Time</p>
                      <p className="text-2xl font-bold text-foreground">21 days</p>
                      <p className="text-xs text-muted-foreground mt-1">Duration from discharge to payment completion</p>
                    </div>
                  </div>
                </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{selectedEvent?.title}</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedEvent?.date} • By {selectedEvent?.actor}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Status:</p>
                <Badge variant="secondary">{selectedEvent.status}</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Details:</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.details}</p>
              </div>
              
              {/* Package Details Section */}
              {(selectedEvent.procedures || selectedEvent.status.includes('APPROVED')) && (
                <div>
                  <p className="text-sm font-medium mb-2">Package Details:</p>
                  <div className="space-y-2">
                    {procedures.map((procedure) => (
                      <div key={procedure.code} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{procedure.name}</p>
                            <p className="text-xs text-muted-foreground">{procedure.code}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(procedure.amount)}</p>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs",
                                procedure.status === 'approved' && "bg-green-100 text-green-700 border-green-200",
                                procedure.status === 'pending' && "bg-yellow-100 text-yellow-700 border-yellow-200",
                                procedure.status === 'rejected' && "bg-red-100 text-red-700 border-red-200"
                              )}
                            >
                              {procedure.status === 'approved' ? 'Approved' : procedure.status === 'pending' ? 'Under Review' : 'Rejected'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Package Amount:</span>
                        <span className="font-bold">{formatCurrency(procedures.reduce((sum, p) => sum + p.amount, 0))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedEvent.query && (
                <div>
                  <p className="text-sm font-medium mb-2">Query Details:</p>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm mb-2"><strong>Reason:</strong> {selectedEvent.query.reason}</p>
                    <p className="text-sm mb-2"><strong>Documents Required:</strong></p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedEvent.query.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                    <p className="text-sm mt-2"><strong>Response Deadline:</strong> {selectedEvent.query.deadline}</p>
                  </div>
                </div>
              )}
              
              {selectedEvent.response && (
                <div>
                  <p className="text-sm font-medium mb-2">Response Details:</p>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm">{selectedEvent.response}</p>
                  </div>
                </div>
              )}
              
              {selectedEvent.documents && (
                <div>
                  <p className="text-sm font-medium mb-2">Documents:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedEvent.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvent.payment && (
                <div>
                  <p className="text-sm font-medium mb-2">Payment Details:</p>
                  <div className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-2">
                    <p className="text-sm"><strong>Amount:</strong> {selectedEvent.payment.amount}</p>
                    <p className="text-sm"><strong>Mode:</strong> {selectedEvent.payment.mode}</p>
                    <p className="text-sm"><strong>Status:</strong> {selectedEvent.payment.status}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}