export interface ClaimData {
  referenceId: string;
  scheme: string;
  status: 'paid' | 'pending' | 'query' | 'rejected';
  claimAmount: number;
  approvedAmount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMode: string;
  lastUpdated: string;
  patient: {
    name: string;
    gender: string;
    idType: string;
    idNumber: string;
    mobileNo: string;
  };
  hospital: {
    name: string;
    nabh: boolean;
    department: string;
  };
  treatment: {
    admissionDate: string;
    dischargeDate: string;
    lengthOfStay: number;
    speciality: string;
  };
  package: {
    code: string;
    name: string;
  };
  timeline: {
    submission: string;
    lastUpdated: string;
    paymentDate: string;
  };
  query: {
    raised: string;
    remark: string;
  };
}

export interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  actor: string;
  status: string;
  details: string;
  icon: string;
  iconColor: 'green' | 'yellow' | 'blue' | 'red' | 'purple' | 'primary';
  query?: {
    reason: string;
    requirements: string[];
    deadline: string;
  };
  response?: string;
  documents?: string[];
  procedures?: string[];
  payment?: {
    amount: string;
    mode: string;
    status: string;
  };
}

export interface Procedure {
  name: string;
  code: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'query';
}

export interface Document {
  name: string;
  uploadedOn: string;
  type: string;
}