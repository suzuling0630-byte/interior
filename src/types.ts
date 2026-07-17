export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  detailDescription: string;
  year: string;
  location: string;
  dimensions?: string;
  keyMaterials?: string[];
  curatedItems?: Array<{
    name: string;
    description: string;
    material: string;
  }>;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  service: string;
  timestamp: string;
}
