import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Icon from 'react-fontawesome';

import * as ViewMessage from '../../elements/ViewMessage/ViewMessage';
import AlbumGrid from '../../components/AlbumGrid/AlbumGrid';
import { filterTracks, sortTracks, sortIntoAlbums } from '../../lib/utils-library';
import SORT_ORDERS from '../../constants/sort-orders';
import { RootState } from '../../store/reducers';

import { TrackModel, AlbumModel } from 'src/shared/types/museeks';

import appStyles from '../../App.module.css';
import styles from './Albums.module.css';
import { IconBase } from 'react-icons';

const Albums: React.FC = () => {
  const library = useSelector((state: RootState) => state.library);
  const player = useSelector((state: RootState) => state.player);
  const playlists = useSelector((state: RootState) => state.playlists.list);
  const tracks = useSelector((state: RootState) => {
    const { search, tracks, sort } = state.library;

    // Filter and sort TracksList
    // sorting being a costly operation, do it after filtering
    const filteredTracks = sortTracks(filterTracks(tracks.library, search), SORT_ORDERS[sort.by][sort.order]);

    return filteredTracks;
  }
  );
  const sortedAlbums = sortIntoAlbums(tracks);

  function albumContains(_albumName: string): TrackModel[] { 
    let albumContents = tracks.filter((track) => {
       return track.album === _albumName;
    });
    return(albumContents);
  }

  let albumsWithTracks:AlbumModel[];

  const getLibraryComponent = useMemo(() => {
    const { playerStatus } = player;

    // Loading library
    if (library.loading) {
      return (
        <ViewMessage.Notice>
          <p>Loading library...</p>
        </ViewMessage.Notice>
      );
    }

    // Empty library
    if (tracks.length === 0 && library.search === '') {
      if (library.refreshing) {
        return (
          <ViewMessage.Notice>
            <p>Your library is being scanned =)</p>
            <ViewMessage.Sub>hold on...</ViewMessage.Sub>
          </ViewMessage.Notice>
        );
      }

      return (
        <ViewMessage.Notice>
          <p>Too bad, there is no music in your library =(</p>
          <ViewMessage.Sub>
            <span>you can always just drop files and folders anywhere or</span>{' '}
            <Link to='/settings/library' draggable={false}>
              add your music here
            </Link>
          </ViewMessage.Sub>
        </ViewMessage.Notice>
      );
    }

    // All good !
    return (
      <AlbumGrid 
        type='library'
        playerStatus={playerStatus}
        albums={sortedAlbums}
        tracks={tracks}
        albumPlayingName={"Sex & Food"}
      />
    );
  }, [library, playlists, player, tracks]);

  return <div className={`${appStyles.view} ${styles.viewLibrary}`}>{getLibraryComponent}</div>;
};

export default Albums;
