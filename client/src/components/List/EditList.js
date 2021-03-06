import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const EditList = ({ token, list, onListUpdated }) => {
  let history = useHistory();
  const [listData, setListData] = useState({
    title: list.title,
    body: list.body
  });
  const { title, body } = listData;

  const onChange = e => {
    const { name, value } = e.target;

    setListData({
      ...listData,
      [name]: value
    });
  };

  const update = async () => {
    if (!title || !body) {
      console.log('Title and body are required');
    } else {
      const newList = {
        title: title,
        body: body
      };

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };

        // Create the List
        const body = JSON.stringify(newList);
        const res = await axios.put(
          `http://localhost:5000/api/Lists/${list._id}`,
          body,
          config
        );

        // Call the handler and redirect
        onListUpdated(res.data);
        history.push('/');
      } catch (error) {
        console.error(`Error creating list: ${error.response.data}`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Edit List</h2>
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => onChange(e)}
      />
      <textarea
        name="body"
        cols="30"
        rows="10"
        value={body}
        onChange={e => onChange(e)}
      ></textarea>
      <button onClick={() => update()}>Submit</button>
    </div>
  );
};

export default EditList;