import type { ReactNode } from "react";
import { MusicPlayerProvider } from "../../contexts/MusicPlayerContext";

type ConditionalMusicProviderProps = {
  isLoggedIn: boolean;
  children: ReactNode;
}

function ConditionalMusicProvider({isLoggedIn, children}: ConditionalMusicProviderProps) {
  // Only initialize the Spotify SDK player if the user is logged in to Spotify.
  if (!isLoggedIn) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <MusicPlayerProvider>
      {children}
    </MusicPlayerProvider>
  )
}

export default ConditionalMusicProvider;