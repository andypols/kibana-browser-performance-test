import './monitor.css';
import React, {useEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import EasyEdit, {Types} from 'react-easy-edit';
import {getBrowserName, getElasticIndexUrl} from './get-settings';

const ClickToEdit = ({value, onSave}) => {
  const [editMode, setEditMode] = useState(false)

  if(editMode) {
    return (
      <EasyEdit
        editing={true}
        type={Types.TEXT}
        value={value}
        onSave={onSave}
        onCancel={(cancel) => setEditMode(false)}
        saveButtonLabel="Save"
        cancelButtonLabel="Cancel"
      />
    )

  }

  return (
    <strong onClick={() => setEditMode(true)}>{value}</strong>
  )
}

export default () => {
  const [browserName, setBrowserName] = useState("");
  const [elasticIndexUrl, setElasticIndexUrl] = useState("");

  const saveBrowserName = (value) => {
    chrome.storage.sync.set({browserName: value}, function() {
      console.log('Value is set to ' + value);
    });
  }

  const saveElasticIndexUrl = (value) => {
    chrome.storage.sync.set({elasticIndexUrl: value}, function() {
      console.log('Value is set to ' + value);
    });
  }

  useEffect(() => {
    getBrowserName()
      .then(value => {
        setBrowserName(isEmpty(value) ? 'Please give browser a unique name (double click)' : value)
      });

    getElasticIndexUrl()
      .then(value => {
        setElasticIndexUrl(isEmpty(value) ? 'Please set performance data URL (double click)' : value)
      });
  })

  return (
    <React.Fragment>
      <h1>Browser Performance Monitor</h1>

      <section className="container">
        <div className="one">Sending the following stats to:</div>
        <div className="two"><ClickToEdit value={elasticIndexUrl} onSave={saveElasticIndexUrl}/></div>
      </section>

      <section className="container">
        <div className="one">The performance stats will be identified using browser:</div>
        <div className="two"><ClickToEdit value={browserName} onSave={saveBrowserName}/></div>
      </section>

      <ul>
        <li>System CPU</li>
        <li>Websocket message frequency</li>
        <li>Heap Usage</li>
        <li>Dom Nodes</li>
        <li>Layouts/second</li>
      </ul>
    </React.Fragment>
  );
}