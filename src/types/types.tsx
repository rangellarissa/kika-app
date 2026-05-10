export type Show = {
    ano: string;
    id: number;
    images?: string[];
    individual: boolean;
    local: string;
    texto: string;
    titulo: string;
    slug: string;
};

export type Residency = {
    id: number;
    ano: string;
    imagens?: Image[];
    local: string;
    texto: string;
    titulo: string;
    instituicao: string;
    slug: string;
};

export type ResearchProps = {
    id: number;
    data: string;
    imagem?: Image;
    texto: string;
    titulo: string;
    autora: string;
};

export type Image = {
    id?: number;
    imageURL: string;
    legenda?: string;
    conteudo?: string;
    destaque: boolean;
};

export type Artist = {
    id: number;
    name: string;
    description: string;
    date: string;
};

export type Obra = {
    id: number;
    titulo: string;
    ano: string;
    tecnica: string;
    disponivel: boolean;
    imagem: Image;
    dimensoes: string;
    ordem: number;
}

export type Novidade = {
    id: number;
    titulo: string;
    imagem: Image;
    texto: string;
}

export type Newsletter = {
    id: number;
    titulo: string;
    novidades: Novidade[];
    links: string[];
}

export type Projects = {
    id: number;
    titulo: string;
    descricao: string;
    ano?: string;
    tecnica: string;
    local?: string;
    imagens: Image[];
}