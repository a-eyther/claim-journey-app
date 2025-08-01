import { useState } from 'react';
import { ArrowLeft, RefreshCw, FileText, Calendar, CreditCard, User, Building2, Activity, Package, Clock, AlertCircle, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ClaimData, TimelineEvent, Procedure, Document } from '@/types/claim';

// Mock data
const mockClaimData: ClaimData = {
  referenceId: "2831-MC011A-00",
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
    code: "2831-MC011A-00",
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

const timelineEvents: TimelineEvent[] = [
  {
    id: 0,
    title: 'Pre-Authorization Approved',
    date: 'February 2, 2025 at 9:54 AM',
    actor: 'SYS/TPA',
    status: 'PRE_AUTH_APPROVED',
    details: 'System automatically approved pre-authorization based on clinical criteria. All 3 procedures cleared for treatment.',
    icon: 'CheckCircle',
    iconColor: 'green',
    procedures: ['2831-MC011A-00', '2831-MC011A-IMP7-00', '2831-MC011A-IMP7-01']
  },
  {
    id: 1,
    title: 'Claim Submitted',
    date: 'February 3, 2025 at 4:46 PM',
    actor: 'Swasthya Margdarshak',
    status: 'CLAIM_APPROVAL_PENDING_AT_ANALYSER',
    details: 'Post-treatment claim documents submitted. Patient has been discharged and claim entered into analyst review queue.',
    icon: 'FileText',
    iconColor: 'yellow',
    documents: ['Discharge Summary', 'Final Bill', 'Treatment Records']
  },
  {
    id: 2,
    title: 'Query Raised',
    date: 'February 7, 2025 at 4:34 PM',
    actor: 'TPA Analyst',
    status: 'CLAIM_QUERY_BY_ANALYSER',
    details: 'Analyst identified missing documentation required for claim approval.',
    icon: 'HelpCircle',
    iconColor: 'blue',
    query: {
      reason: 'Incomplete documentation',
      requirements: [
        'OT notes with in and out time',
        'Post stent flow documentation',
        'Still blocks documentation',
        'ECG with seal and sign',
        'Stent invoice'
      ],
      deadline: 'February 10, 2025'
    }
  },
  {
    id: 3,
    title: 'Query Response Submitted',
    date: 'February 15, 2025 at 6:25 PM',
    actor: 'Swasthya Margdarshak (Hanuman Ram Kumawat)',
    status: 'QUERY_REPLIED',
    details: 'Hospital submitted all requested documents. Query has been resolved.',
    icon: 'MessageSquare',
    iconColor: 'blue',
    response: 'All requested documents uploaded: OT notes with timestamps, post stent flow report, blocks documentation, sealed ECG report, and detailed stent invoice.'
  },
  {
    id: 4,
    title: 'Claim Under Review',
    date: 'February 20, 2025 at 4:49 PM',
    actor: 'TPA',
    status: 'CLAIM_APPROVAL_PENDING',
    details: 'Query resolved successfully. Claim moved to final approval queue for processing.',
    icon: 'Clock',
    iconColor: 'yellow'
  },
  {
    id: 5,
    title: 'Claim Approved',
    date: 'February 21, 2025 at 7:09 PM',
    actor: 'TPA',
    status: 'CLAIM_PACKAGE_APPROVED',
    details: 'All procedures and packages approved after successful verification of submitted documents.',
    icon: 'CheckCircle',
    iconColor: 'green'
  },
  {
    id: 6,
    title: 'Payment Completed',
    date: 'February 24, 2025 at 12:00 AM',
    actor: 'System',
    status: 'CLAIM_PACKAGE_APPROVED_AND_PAID',
    details: 'Payment of ₹85,000 processed successfully.',
    icon: 'DollarSign',
    iconColor: 'green',
    payment: {
      amount: '₹85,000',
      mode: 'NEFT',
      status: 'PAYMENT DONE'
    }
  }
];

const procedures: Procedure[] = [
  {
    name: "Cardiac Catheterization",
    code: "2831-MC011A-00",
    amount: 50000,
    status: "approved"
  },
  {
    name: "Stent Implant - Type 1",
    code: "2831-MC011A-IMP7-00",
    amount: 20000,
    status: "approved"
  },
  {
    name: "Stent Implant - Type 2",
    code: "2831-MC011A-IMP7-01",
    amount: 15000,
    status: "approved"
  }
];

const documents: Document[] = [
  {
    name: "Pre-Authorization Form",
    uploadedOn: "Feb 2, 2025 at 9:30 AM",
    type: "pre-auth"
  },
  {
    name: "Discharge Summary",
    uploadedOn: "Feb 3, 2025 at 4:30 PM",
    type: "discharge"
  },
  {
    name: "OT Notes & Stent Documentation",
    uploadedOn: "Feb 15, 2025 at 6:25 PM",
    type: "ot-notes"
  },
  {
    name: "ECG Report (Sealed & Signed)",
    uploadedOn: "Feb 15, 2025 at 6:25 PM",
    type: "ecg"
  },
  {
    name: "Stent Invoice",
    uploadedOn: "Feb 15, 2025 at 6:25 PM",
    type: "invoice"
  }
];

export function ClaimJourney() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
              <h1 className="text-2xl font-semibold text-foreground">Claim Journey</h1>
              <p className="text-sm text-muted-foreground">Track and manage claim #{mockClaimData.referenceId}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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

              {/* Query Information */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Query Details
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Query Raised:</span>
                    <span className="font-medium">{mockClaimData.query.raised}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Remark:</span>
                    <p className="font-medium text-xs mt-1">{mockClaimData.query.remark}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Timeline */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Claim Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Continuous timeline line */}
                <div className="absolute left-[36px] top-[24px] bottom-[24px] w-0.5 bg-border" />
                
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={cn(
                      "relative flex gap-4 cursor-pointer hover:bg-muted/30 p-4 rounded-xl transition-all hover:shadow-sm",
                      index < timelineEvents.length - 1 ? "pb-8" : "pb-4"
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10",
                        event.iconColor === 'green' && "bg-green-50 text-green-600 border border-green-200",
                        event.iconColor === 'yellow' && "bg-amber-50 text-amber-600 border border-amber-200",
                        event.iconColor === 'blue' && "bg-blue-50 text-blue-600 border border-blue-200",
                        event.iconColor === 'red' && "bg-red-50 text-red-600 border border-red-200",
                        event.iconColor === 'purple' && "bg-purple-50 text-purple-600 border border-purple-200"
                      )}
                    >
                      {getTimelineIcon(event.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{event.date} • By {event.actor}</p>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      
                      {event.query && (
                        <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <p className="font-semibold text-sm text-amber-800 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Documents Required:
                          </p>
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
                    </div>
                  </div>
                ))}
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
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approved Amount
                      </p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(mockClaimData.approvedAmount)}</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Deductions</p>
                      <p className="text-2xl font-bold text-foreground">₹0</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Paid Amount
                      </p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(mockClaimData.paidAmount)}</p>
                      <p className="text-xs text-muted-foreground mt-2">Payment Date: {mockClaimData.paymentDate}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-5 bg-muted/30 border border-border/50 rounded-xl hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">Uploaded on {doc.uploadedOn}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg">View</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="metrics">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Total Processing Time
                      </p>
                      <p className="text-2xl font-bold text-foreground">22 days</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Pre-Auth Response Time</p>
                      <p className="text-2xl font-bold text-foreground">2 hours</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Query Resolution Time</p>
                      <p className="text-2xl font-bold text-foreground">8 days</p>
                    </div>
                    <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Discharge to Payment Time</p>
                      <p className="text-2xl font-bold text-foreground">21 days</p>
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