import { API } from "assets/api/api"
import { CharacterType, ResponseType } from "assets/api/rick-and-morty-api"
import { CharacterCard } from "components/Card/CharacterCard/CharacterCard"
import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import styled from "styled-components"

  // делаем пути для наших персонажей
export const getStaticPaths: GetStaticPaths = async () => {
  const {results} = await API.rickAndMorty.getCharacters()

  const paths = results.map(character => ({
    params: {id: String(character.id)}
  }))

  //paths: [{params:{id:1}},{params:{id:2}},{params:{id:3}},{params:{id:4}}]
  // по дэфолту с апишки нам приходит первая страница данных (их 20) с помощью getCharacters
  //если мы в адрес передаём /characters/30 например, а на сервере у нас сгенерировано 20
  //fallback: false - то мы получим 404(типо не жди, не будет тут ничего)
  //fallback: true - генерирует в фоне, используем лоадер 
  //fallback: 'blocking' - блокирует UI пока не сгенерирует новую страницу количество страниц сгенерированных на серваке станет 21 
  return {
    paths,
    fallback:false
  }
}

  //создаем страницы , если персонажей 20, то будет 20 страниц
export const getStaticProps: GetStaticProps = async ({params}) => {

  // если нет в урле после / ничего, то берем из пустого обьекта 
  const {id} = params || {}

  const character = await API.rickAndMorty.getCharacter(id as string)

  if (!character) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      character
    }
  }
}

type Props = {
  character: CharacterType
}


const Character = (props: Props) => {

  const {character} = props

  const router = useRouter()

  //fallback: true 
  if (router.isFallback) return <h1>Loading...</h1>

  // в query называется именно id, потому что файл называется [id].tsx
  const characterId = router.query.id

  const goToCharacters = () => {
    router.push('/characters')
  }

  return (
    <PageWrapper>
      <Container>
        <IdText>ID: {characterId}</IdText>
        <CharacterCard key={character.id} character={character} />
        <Button onClick={goToCharacters}>GO TO CHARACTERS</Button>
      </Container>
    </PageWrapper>
  )
}

Character.getLayout = getLayout

export default Character

const Container = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 20px;
`

const Button = styled.button`
  width: 330px;
  height: 60px;
  border-radius: 4px;
  border: none;
  bacjground: #facaff;
  &:hover {
  cursor: pointer;
    background: #fa52d3;
    color: white;
  }
`

const IdText = styled.div`
  font-size: 38px;
`