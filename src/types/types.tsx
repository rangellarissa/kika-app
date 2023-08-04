export type Show = {
    ano: string,
    id: number,
    imagens?: string[],
    individual: boolean,
    local: string,
    texto: string,
    titulo: string,
};

export type Image = {
    id?: number;
    imageURL: string;
    legenda?: string;
    conteudo?: string;
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
    destaque: boolean;
    imagem: Image;
}

export type Novidade = {
    id: number;
    titulo: string;
    imagens: string[];
    texto: string;
}

export type Newsletter = {
    id: number;
    titulo: string;
    novidades: Novidade[];
    links: string[];
}