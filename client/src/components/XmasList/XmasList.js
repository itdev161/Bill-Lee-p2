import React from 'react';
import XmasListItem from './XmasListItem';


const XmasList = props => {
  const { lists, clickList, deleteList, editList } = props;
  return lists.map(list => (
    <XmasListItem
      key={list._id}
      list={list}
      clickList={clickList}
      deleteList={deleteList}
      editList={editList}
    />
  ));
};

export default XmasList;