
export interface ProductResponse {
    current_page:   number;
    data:           Product[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  string;
    to:             number;
    total:          number;
}

export interface Product {
    id:          number | string;
    category_id: number;
    name:        string;
    images:      string[];
    slug:        string;
    description: string;
    price:       number;
    stock:       number;
    size:        null | string;
    material:    Material;
    dimensions:  null | string;
    gender:      null| string
    category:    Category;
}

export interface Category {
    id:   number;
    name: Name;
}

export enum Name {
    Camisetas = "Camisetas",
    Figuras3D = "Figuras 3D",
}

export enum Material {
    Algodón = "Algodón",
    Pla = "PLA",
    Resina = "Resina",
}

export interface Link {
    url:    string;
    label:  string;
    page:   number;
    active: boolean;
}
