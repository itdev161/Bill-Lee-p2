import React from 'react';

const List = props => {
  const { list } = props;

  return (
    <div>
      <h1>{list.title}</h1>
      <p>{list.body}</p>
    </div>
  );
};

export default List;