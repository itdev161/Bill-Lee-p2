import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import XmasList from './components/XmasList/XmasList';
import List from './components/List/List';
import CreateList from './components/List/CreateList';
import EditList from './components/List/EditList';


class App extends React.Component {
  state = {
    lists: [],
    list: null,
    token: null,
    user: null
  };

  componentDidMount() {
    this.authenticateUser();
  }

  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('user');
      this.setState({ user: null });
    }

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios
        .get('http://localhost:5000/api/auth', config)
        .then(response => {
          localStorage.setItem('user', response.data.name);
          this.setState(
            {
              user: response.data.name,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch(error => {
          localStorage.removeItem('user');
          this.setState({ user: null });
          console.error(`Error logging in: ${error}`);
        });
    }
  };

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios
        .get('http://localhost:5000/api/lists', config)
        .then(response => {
          this.setState({
            posts: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`);
        });
    }
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null, token: null });
  };

  viewList = list => {
    console.log(`view ${list.title}`);
    this.setState({
      list: list
    });
  };

  deleteList = list => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios
        .delete(`http://localhost:5000/api/lists/${list._id}`, config)
        .then(response => {
          const newLists = this.state.lists.filter(p => p._id !== list._id);
          this.setState({
            lists: [...newLists]
          });
        })
        .catch(error => {
          console.error(`Error deleting list: ${error}`);
        });
    }
  };

  editList = list => {
    this.setState({
      list: list
    });
  };

  onListCreated = list => {
    const newLists = [...this.state.lists, list];

    this.setState({
      lists: newLists
    });
  };

  onListUpdated = list => {
    console.log('updated list: ', list);
    const newLists = [...this.state.lists];
    const index = newLists.findIndex(p => p._id === list._id);

    newLists[index] = list;

    this.setState({
      lists: newLists
    });
  };

  render() {
    let { user, lists, list, token } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    };

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Christmas List</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                {user ? (
                  <Link to="/new-list">New List</Link>
                ) : (
                  <Link to="/register">Register</Link>
                )}
              </li>
              <li>
                {user ? (
                  <Link to="" onClick={this.logOut}>
                    Log out
                  </Link>
                ) : (
                  <Link to="/login">Log in</Link>
                )}
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {user ? (
                  <React.Fragment>
                    <div>Hello {user}!</div>
                    <XmasList
                      lists={lists}
                      clickList={this.viewList}
                      deleteList={this.deleteList}
                      editList={this.editList}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>Please Register or Login</React.Fragment>
                )}
              </Route>
              <Route path="/lists/:listId">
                <List list={list} />
              </Route>
              <Route path="/new-list">
                <CreateList token={token} onListCreated={this.onListCreated} />
              </Route>
              <Route path="/edit-list/:listId">
                <EditList
                  token={token}
                  list={list}
                  onListUpdated={this.onListUpdated}
                />
              </Route>
              <Route
                exact
                path="/register"
                render={() => <Register {...authProps} />}
              />
              <Route
                exact
                path="/login"
                render={() => <Login {...authProps} />}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;