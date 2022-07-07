import { GetStaticProps } from 'next';
import { format, parseISO} from 'date-fns';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Image from 'next/image';
import enUS from 'date-fns/locale/en-US';

import styles from '../styles/home.module.scss';
import Link from 'next/link';

interface Episode {
  id: string,
  title: string,
  members: string,
  thumbnail: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string,
}

interface HomeProps { 
  latestEpisodes: Episode[],
  allEpisodes: Episode[],
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Latests Releases</h2>
        <ul>
          {latestEpisodes.map(ep => {
            return (
              <li key={ep.id}>
                <Image
                  width={192}
                  height={192}
                  src={ep.thumbnail}
                  alt={ep.title} 
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${ep.id}`}>
                    <a>{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Play episode" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
				<h2>All episodes</h2>

				<table cellSpacing={0}>
					<thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Participants</th>
              <th>Date</th>
              <th>Duration</th>
              <th></th>
            </tr>
					</thead>
					<tbody>
						{allEpisodes.map((ep) => { 
							return (
								<tr key={ep.id}>
									<td className={styles.imageTableData}>
										<Image 
											width={120}
											height={120}
											src={ep.thumbnail}
											alt={ep.title}
											objectFit="cover"
										/>
									</td>
									<td>
                    <Link href={`/episodes/${ep.id}`}>
										  <a>{ep.title}</a>
                    </Link>
									</td>
									<td>{ep.members}</td>
									<td className={styles.publishedAtTableData}>{ep.publishedAt}</td>
									<td>{ep.durationAsString}</td>
									<td>
										<button type="button">
											<img src="/play-green.svg" alt="Play episode" />
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => { 
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(ep => {
    return {
      id: ep.id,
      title: ep.title,
      thumbnail: ep.thumbnail,
      members: ep.members,
      publishedAt: format(parseISO(ep.published_at), 'MMM d yy', { locale: enUS }),
      duration: Number(ep.file.duration),
      durationAsString: convertDurationToTimeString(Number(ep.file.duration)),
      url: ep.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8
  }
}