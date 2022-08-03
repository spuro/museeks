import React from 'react';
import { connect } from 'react-redux';

import Slider from 'react-rangeslider';

import Icon from 'react-fontawesome';

import TracksListHeaderCell from '../TracksListHeaderCell/TracksListHeaderCell';

import { SortBy, SortOrder } from '../../../shared/types/museeks';
import { RootState } from '../../store/reducers';
import { LibrarySort } from '../../store/reducers/library';

import styles from './AlbumGridHeader.module.css';
import { nothing } from 'immer';

interface OwnProps {
  
}

interface InjectedProps {
  sort?: LibrarySort;
}

type Props = OwnProps & InjectedProps;

class AlbumGridHeader extends React.Component<Props> {
  static getIcon = (sort: LibrarySort | undefined, sortType: SortBy) => {
    if (sort && sort.by === sortType) {
      if (sort.order === SortOrder.ASC) {
        return 'angle-up';
      }

      // Must be DSC then
      return 'angle-down';
    }

    return null;
  };

  render() {
    return (
      <div className={styles.albumGridHeader}>
        <Icon name='coffee' fixedWidth />
        <div className={styles.slider}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            tooltip={false}
            value={0.5}
            //onChange={10}
          />
        </div>
      </div>
    );
  }
}

export default (AlbumGridHeader);
