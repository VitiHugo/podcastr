import { createContext, useState, ReactNode, useContext } from 'react';

interface Episode {
  id: string
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  hasNext: boolean
  hasPrevious: boolean

  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  togglePlay: () => void
  setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData);

interface PlayerContextProviderProps {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  
  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext() {
    if(hasNext)
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)    
  }

  function playPrevious() {
    if(hasPrevious)
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  return (
    <PlayerContext.Provider 
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        play,
        playList,
        playNext,
        playPrevious,
        togglePlay,
        setPlayingState
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}