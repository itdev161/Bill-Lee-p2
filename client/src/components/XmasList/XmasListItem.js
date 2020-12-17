import React from 'react';
import { useHistory } from 'react-router-dom';
import slugify from 'slugify';
import './styles.css'

const XmasListItem = props => {
  const { list, clickList, deleteList, editList } = props;
  const history = useHistory();

  const handleClickList = list => {
    const slug = slugify(list.title, { lower: true });

    clickList(list);
    history.push(`/lists/${slug}`);
  };

  const handleEditList = list => {
    editList(list);
    history.push(`/edit-list/${list._id}`);
  };

  return (
    <div>
      <div className="XmasListItem" onClick={() => handleClickList(list)}>
        <h2>{list.title}</h2>
        <p>{list.body}</p>
      </div>
      <div className="listControls">
        <button onClick={() => deleteList(list)}>Delete</button>
        <button onClick={() => handleEditList(list)}>Edit</button>
      </div>
    </div>
  );
};

export default XmasListItem;