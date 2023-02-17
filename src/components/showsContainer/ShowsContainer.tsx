import { useState } from 'react'
import ShowPost, { PostProps } from '../showPost/ShowPost'
import SideNav from '../sideNav/SideNav';
import './showsContainer.css'

const shows: PostProps[] = [
    {
        title: "Das promessas que a gente fez",
        date: 2022,
        institution: "Galeria Portas VilaSeca",
        city: "Rio de Janeiro - RJ, Brasil",
        description: "Portas Vilaseca tem o prazer de apresentar “Das promessas que a gente fez”, primeira exposição individual de Kika Carvalho como artista representada na galeria. Com texto crítico do curador Marcelo Campos, a mostra reúne cerca de 30 obras da produção mais recente da artista capixaba, entre pinturas, desenhos, colagens e impressões fotográficas em cianotipia. Em comum, são obras que têm na cor azul uma insígnia em constante investigação pela artista. Partindo de sua relação ultramarina com o continente-mãe e de uma inquietação especulativa em busca de histórias escondidas, Carvalho segue um percurso fluido, saindo de Vitória (ES), passando por Salvador e Nova Viçosa (BA) até chegar em Luanda (Angola), onde participou recentemente do Programa de Residências Angola AIR. Neste movimento incessante, afetos se constroem, certezas se desmoronam e mais dúvidas vêm à tona.",
        images: {
            url: "https://www.portasvilaseca.com.br/wp/wp-content/uploads/2021/04/KC_070_web.jpg",
        },
    },
    {
        title: "Crônicas Cariocas",
        date: 2021,
        institution: "MAR - Museu de Arte do Rio",
        city: "Rio de Janeiro - RJ, Brasil",
        description: "Idealizada para escutar e discutir o Rio de Janeiro que não está nos livros, Crônicas Cariocas é sem dúvidas a maior exposição que Museu de Arte do Rio recebeu no ano de 2021. Em cartaz até o fim de julho de 2022, a mostra apresenta mais de 110 artistas e quase 600 obras de arte. A curadoria é assinado pelos curadores da casa Marcelo Campo e Amanda Bonan em parceria com o historiador Luiz Antônio Simas e a escritora Conceição Evaristo, que juntos apresentam um olhar atento e contemporâneo à vida carioca em suas particularidades mais singelas. Como menciona Marcelo Campos, a exposição “fala da cidade suburbana, cujo afeto é o amálgama das relações e histórias miúdas. Um Rio que reza e dança, que inventa seus próprios deuses, enquanto se organiza no trabalho informal e na poesia dos trens e das praças. Um Rio que viu seus cinemas fecharem, suas linhas de ônibus deixarem de ligar as zonas Sul e Norte, mas que, ainda assim, nasce e renasce todos os dias”. É com este sentimento dúbio de forças, próprios desta cidade, que a mostra se estrutura.",
        images: {
            url: "https://www.portasvilaseca.com.br/wp/wp-content/uploads/2021/04/KC_070_web.jpg",
        },
    },
    {
        title: "Enciclopédia Negra",
        date: 2021,
        institution: "Pinacoteca do Estado de São Paulo",
        city: "São Paulo - SP, Brasil",
        description: "Pela primeira vez, a exposição torna pública as 103 obras realizadas por artistas contemporâneos para um livro homônimo de autoria dos pesquisadores Flávio Gomes e Lilia M. Schwarcz e do artista Jaime Lauriano, publicado em março de 2021 pela Companhia das Letras. A mostra é um desdobramento da publicação e também se conecta com a nova apresentação da coleção do museu que se apoia em questionamentos contemporâneos e reverbera narrativas mais inclusivas e diversas. As obras especialmente produzidas para o projeto foram doadas ao museu pelos artistas e integrarão a coleção da Pinacoteca de São Paulo.",
        images: {
            url: "https://www.portasvilaseca.com.br/wp/wp-content/uploads/2021/04/KC_070_web.jpg",
        },
    }
]

interface PostsProps {
    posts: PostProps[];
}

const ShowsContainer: React.FC<PostsProps> = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState<PostsProps | null>(null);
  
    const handlePostClick = (post: PostProps) => {
      setSelectedPost(post);
    };
  
    return (
      <div>
        <SideNav posts={posts} handlePostClick={handlePostClick} />
        <ShowPost selectedPost={selectedPost} />
      </div>
    );
  };
  
  export default ShowsContainer;