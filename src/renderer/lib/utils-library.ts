import { current } from '@reduxjs/toolkit';
import orderBy from 'lodash-es/orderBy';
import { TrackModel, AlbumModel } from '../../shared/types/museeks';
import * as utils from './utils';

/**
 * Filter an array of tracks by string
 */
export const filterTracks = (tracks: TrackModel[], search: string): TrackModel[] => {
  // Avoid performing useless searches
  if (search.length === 0) return tracks;

  return tracks.filter(
    (track) =>
      track.loweredMetas.artist.toString().includes(search) ||
      track.loweredMetas.album.includes(search) ||
      track.loweredMetas.genre.toString().includes(search) ||
      track.loweredMetas.title.includes(search)
  );
};

/**
 * Sort an array of tracks (alias to lodash.orderby)
 */
export const sortTracks = (tracks: TrackModel[], sort: any[]): TrackModel[] => {
  return orderBy(tracks, ...sort);
};

/*
  Sorts the tracks into albums and exports AlbumModel[] type
*/
export const sortIntoAlbums = (tracks: TrackModel[]): AlbumModel[] => {
  const uniqueAlbums = [...new Set(tracks.map(track => track.album))];
  let albums:AlbumModel[] = [];
  
  for (let index = 0; index < uniqueAlbums.length; index++) {
    let currentAlbum:AlbumModel = {
      albumName: uniqueAlbums[index],
      tracks: tracks.filter((track) => {
        return track.album === uniqueAlbums[index];
     }),
    }
    albums.push(currentAlbum);
  }
  return(albums)
}

/**
 * Format a list of tracks to a nice status
 */
export const getStatus = (tracks: TrackModel[]): string => {
  const status = utils.parseDuration(tracks.map((d) => d.duration).reduce((a, b) => a + b, 0));
  return `${tracks.length} tracks [Across ${sortIntoAlbums(tracks).length} albums], ${status}`;
};
