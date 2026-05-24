export type Knowledge = {
  id: string;
  title: string;
  description: string;
  filePath: string;
  tags: string;
  uploadedAt: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  survivorId: string;
};

export type Survivor = {
  id: string;
  name: string;
  age: number;
  sector: string;
  registeredAt: string;
  skills: Skill[];
};

export type Shelter = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  capacity: number;
  status: string;
  createdAt: string;
};

export type Tutorial = {
  id: string;
  title: string;
  category: string;
  content: string;
  difficulty: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  sector: string;
  location: string;
  contactType: string;
  message: string;
  status: string;
  submittedAt: string;
};

export type Stats = {
  totalDocuments: number;
  totalSurvivors: number;
  totalSkills: number;
  totalShelters: number;
  totalTutorials: number;
  recentDocuments: Knowledge[];
  recentSurvivors: Survivor[];
};
