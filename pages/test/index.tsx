import { getLayout } from "components/Layout/BaseLayout/BaseLayout"
import { PageWrapper } from "components/PageWrapper/PageWrapper"
import path from "path"
import fs from 'fs/promises'

export const getStaticProps = async () => {
  
  //process.cwd() - корневая папка проекта
  const getParseData = async (): Promise<{title: string}> => {
    const filePath = path.join(process.cwd(), 'public', 'staticData.json')

    //fs - модуль для чтения данных из файловой системы
    try {
      const jsonData = await fs.readFile(filePath)
      return JSON.parse(jsonData.toString())
    } catch (err) {
      return {title: 'no title'}
    }

  }

  const { title } = await getParseData()

  return {
    props: {
      title
    }
  }
}

type Props = {
  title: string
}

const Test = (props: Props) => {

  const {title} = props
  
  return (
    <PageWrapper>
        {title}
    </PageWrapper>
  )
}

Test.getLayout = getLayout

export default Test