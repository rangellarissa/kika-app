export type Show = {
    ano: string,
    id: number,
    imagem?: Image;
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