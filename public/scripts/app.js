function comparator(a,b) {
  if(a.first_name < b.first_name)
    return -1;
  if(a.first_name > b.first_name)
    return 1
  return 0;
}

var UserRow = React.createClass({
  render: function(){
    var name = this.props.user.first_name + " " + this.props.user.last_name;

    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.user.email}</td>
        <td>{this.props.user.country}</td>
        <td>{this.props.user.ip_address}</td>
      </tr>
    );
  }
});

var UserList = React.createClass({
  render: function(){
    var rows = [];

    var my_data = this.props.data.sort(comparator);
    var sliced_data = my_data.slice(this.props.first, this.props.last);

    sliced_data.forEach(function(user){
      var name = user.first_name + ' ' + user.last_name;
      if(name.indexOf(this.props.nameFilterText) === -1 || user.country.indexOf(this.props.countryFilterText) === -1) {
        return;
      }
      rows.push(<UserRow user={user} key={user.id} />);

    }.bind(this));

    return (
      <table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

var NameSearchBar = React.createClass({
  handleChange: function(){
    this.props.onUserInput(
      ReactDOM.findDOMNode(this.refs.nameFilterTextInput).value
    );
  },
  render: function(){
    return (
        <form>
          <input 
            className="form-control" 
            type="text" 
            placeholder="Search for name..." 
            value={this.props.nameFilterText} 
            ref="nameFilterTextInput" 
            onChange={this.handleChange} />
        </form>
    );
  }
});

var CountrySearchBar = React.createClass({
  handleChange: function(){
    this.props.onUserInput(
      ReactDOM.findDOMNode(this.refs.countryFilterTextInput).value
    );
  },
  render: function(){
    return (
        <form>
          <input 
            className="form-control" 
            type="text" 
            placeholder="Search for country..." 
            value={this.props.countryFilterText} 
            ref="countryFilterTextInput" 
            onChange={this.handleChange} />
        </form>
    );
  }
});

var Previous = React.createClass({
  render: function(){
    return (
      <a href="">Previous</a>
    );
  }
});

var Next = React.createClass({
  handleClick: function(){
    this.props.handleNext(
      this.props.first+20,
      this.props.last+20
    );
  },
  render: function(){
    return (
      <a onClick={this.handleClick}>Next</a>
    );
  }
});

var FilterableTable = React.createClass({
  getInitialState: function(){
    return { 
      data: [],
      nameFilterText: '',
      countryFilterText: '',
      first: 0,
      last: 0
    };
  },
  handleNameFilter: function(nameFilterText){
    this.setState({
      nameFilterText: nameFilterText
    });
  },
  handleCountryFilter: function(countryFilterText){
    this.setState({
      countryFilterText: countryFilterText
    });
  },
  componentDidMount: function() {
    this.loadUsersFromDatabase();
    this.setState({
      first: 0,
      last: 20
    });
  },
  handleNext: function(first, last){    
    this.setState({
      first: first,
      last: last
    });
  },
  loadUsersFromDatabase: function(){
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      cache: false,
      success: function(data){
        this.setState({ data:data });
      }.bind(this),
      failure: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            
            <NameSearchBar 
              nameFilterText={this.state.nameFilterText} 
              onUserInput={this.handleNameFilter} />

          </div>
          <div className="col-lg-6">
          
            <CountrySearchBar
              countryFilterText={this.state.countryFilterText}
              onUserInput={this.handleCountryFilter} />

          </div>

        </div>
        <div className="row">
          <div className="col-lg-12">
            
            <UserList 
              data={this.state.data} 
              nameFilterText={this.state.nameFilterText} 
              countryFilterText={this.state.countryFilterText} 
              first={this.state.first} 
              last={this.state.last} />

          </div>
        </div>
        <div className="row">
          <div className="col-lg-11">
            <Previous />
          </div>
          <div className="col-lg-1">
            <div className="pull-right">
              <Next first={this.state.first} last={this.state.last} handleNext={this.handleNext} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<FilterableTable url="/api/users"/>, document.getElementById('content'));

