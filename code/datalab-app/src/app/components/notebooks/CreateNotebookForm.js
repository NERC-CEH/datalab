import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';

class CreateNotebookForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    const notebook = {
      name: this.state.name,
      type: 'jupyter',
    };
    this.props.createNotebook(notebook);
    this.setState({ name: '' });
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ width: '400px' }}>
        <h3>Create Notebook</h3>
        <Form>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Notebook Name' value={this.state.value} onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit' primary onClick={this.handleSubmit}>Submit</Button>
        </Form>
      </div>
    );
  }
}

CreateNotebookForm.propTypes = {
  createNotebook: PropTypes.func.isRequired,
};

export default CreateNotebookForm;
