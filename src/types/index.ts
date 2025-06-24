
export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface Participant {
  id: string;
  professionalId: string;
  signature?: string;
  signedAt?: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  participants: Participant[];
  createdAt: Date;
}
