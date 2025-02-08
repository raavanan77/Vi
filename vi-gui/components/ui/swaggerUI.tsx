import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUIComponent = () => {
  return (
    <div className="swagger-container">
      <SwaggerUI
        url="http://localhost:8000/swagger.json"  // Your Django backend swagger JSON URL
        docExpansion="list"
        deepLinking={true}
      />
    </div>
  );
};

export default SwaggerUIComponent;