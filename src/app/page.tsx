import { getPage } from '@/lib/wordpress';

export default async function Home(){
  const page = await getPage('home');


  return(
    <div>{page.acf.hero_headline}</div>
  );
}
