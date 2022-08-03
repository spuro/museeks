import electron from 'electron';
import { Menu } from '@electron/remote';
import React, { useCallback, useEffect, useMemo, useState, Component } from 'react';
import KeyBinding from 'react-keybinding-component';
import chunk from 'lodash-es/chunk';
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router';
import TrackRow from '../TrackRow/TrackRow';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar';

import * as LibraryActions from '../../store/actions/LibraryActions';
//import * as PlaylistsActions from '../../store/actions/PlaylistsActions';
import * as PlayerActions from '../../store/actions/PlayerActions';
import * as QueueActions from '../../store/actions/QueueActions';

import { isLeftClick, isRightClick } from '../../lib/utils-events';
import { isCtrlKey, isAltKey } from '../../lib/utils-platform';
import { PlaylistModel, TrackModel, PlayerStatus, AlbumModel } from '../../../shared/types/museeks';
import { RootState } from '../../store/reducers';

import scrollbarStyles from '../CustomScrollbar/CustomScrollbar.module.css';
import headerStyles from '../Header/Header.module.css';
import styles from './AlbumGrid.module.css';
import AlbumGridHeader from '../AlbumGridHeader/AlbumGridHeader';
import { sortedLastIndex } from 'lodash';
import Slider from 'react-rangeslider';
import ProgressBar from '../ProgressBar/ProgressBar';
import Cover from '../Cover/Cover';
import Button from 'src/renderer/elements/Button/Button';
import Albums from 'src/renderer/views/Albums/Albums';
//import Albums from 'src/renderer/views/Albums/Albums';

import { fetchCover } from 'src/shared/lib/utils-cover';

const { shell } = electron;

const CHUNK_LENGTH = 20;
const ROW_HEIGHT = 30; // FIXME
const TILES_TO_DISPLAY = 5;
const TILE_HEIGHT = ROW_HEIGHT * CHUNK_LENGTH;

// --------------------------------------------------------------------------
// TrackList
// --------------------------------------------------------------------------

interface Props {
  type: string;
  playerStatus: string;
  albums: AlbumModel[];
  tracks: TrackModel[];
  albumPlayingName: string | null;
}

interface TileProps {
  type: string;
  albumName: string;
  tracks: TrackModel[];
  onClick: (event: React.MouseEvent | React.KeyboardEvent, trackId: string) => void;
  coverPath: string;
}

interface TileState{
  coverPath: string | null;
}

let tileHeight = '200px';
let tileWidth = '200px';

class AlbumTile extends React.Component<TileProps, TileState>{ 
  constructor(props: TileProps) {
    super(props);

    this.state = {
      coverPath: null,
    };

    this.fetchInitialCover = this.fetchInitialCover.bind(this);
  }

  async playAlbum(){
    QueueActions.clear();
    QueueActions.setQueue(this.props.tracks);
    QueueActions.start(0);
  }

  onClick = () => {
    console.log(`Playing album: ${this.props.albumName}`);
    this.playAlbum();
  }

  async componentDidMount() {
    await this.fetchInitialCover();
  }

  async componentDidUpdate(prevProps: TileProps) {
    if (prevProps.coverPath !== this.props.coverPath) {
      const coverPath = await fetchCover(this.props.coverPath);
      this.setState({ coverPath });
    }
  }

  async fetchInitialCover() {
    const coverPath = await fetchCover(this.props.tracks[0].path);
    this.setState({ coverPath });
  }


  render() {
    if (this.state.coverPath) {
      const coverPath = encodeURI(this.state.coverPath).replace(/'/g, "\\'").replace(/"/g, '\\"');
      //const inlineStyles = { backgroundImage: `url('${coverPath}')` };

      return <div className={styles.albumTile} onClick={this.onClick}>
          <img src={coverPath}/>
        </div>
    }
    return (
      <div className={`${styles.albumTile} isEmpty`}>
        <div className={styles.cover__note} onClick={this.onClick}>♪</div>
      </div>
    );
  }
}


const AlbumView: React.FC<Props> = (props) => {

  const [renderView, setRenderView] = useState<HTMLElement | null>(null);

  // FIXME: find a way to use a real ref for the render view
  useEffect(() => {
    const element = document.querySelector(`.${scrollbarStyles.renderView}`);

    if (element instanceof HTMLElement) setRenderView(element);
  }, []);

  const onEnter = useCallback(async (i: number, albums: TrackModel[]) => {
    if (i !== -1) PlayerActions.start(albums, albums[i]._id);
  }, []);

  return (
    <div className={styles.albumGrid}>
      <div className={styles.header}>
        <AlbumGridHeader />
      </div>
      <div className={styles.gridContainer}>
        {
          props.albums.map((album) => 
          {
            return(
            <AlbumTile albumName={album.albumName} tracks={album.tracks} />
            )
          })
        }
      </div>
    </div>
  );
};

export default AlbumView;
