import { API } from "assets/api/api"
import { CharacterType, ResponseType } from "assets/api/rick-and-morty-api"
//import { CharacterCard } from "components/Card/CharacterCard/CharacterCard"
import { Header } from "components/Header/Header"
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import dynamic from "next/dynamic"

const CharacterCard = dynamic(()=> import('components/Card/CharacterCard/CharacterCard')
.then(module => module.CharacterCard),
  // {ssr: false,
  //   loading: () => <h1>Loading.. </h1>
  // }
)

export const getStaticProps = async () => {
  const characters = await API.rickAndMorty.getCharacters()

  return {
    props: {
      characters
    },
    //revalidate: 60
  }
}

type Props = {
  characters: ResponseType<CharacterType>
}


const Characters = (props: Props) => {

  const {characters} = props
  
  const characterList = characters.results.map(character=>(
    <CharacterCard key={character.id} character={character} />
  ))

  return (
    <PageWrapper>
        {characterList}
    </PageWrapper>
  )
}

Characters.getLayout = getLayout

export default Characters