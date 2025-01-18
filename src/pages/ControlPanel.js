import React, { useState } from 'react';
import CountOfString from '../components/CountOfString';
import EventDetails from '../components/EventDetails';

const ControlPanel = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  return (
    <div className="controlPanel-container">
      <h1>Админская Панель</h1>

      {selectedKey ? (
        <EventDetails selectedKey={selectedKey} onBack={() => setSelectedKey(null)} />
      ) : (
        <CountOfString onDetailsClick={setSelectedKey} />
      )}
    </div>
  );
};

export default ControlPanel;
