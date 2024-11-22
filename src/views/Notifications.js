
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Row,
  Col,
} from "reactstrap";

function Notifications() {
  const notificationAlertRef = React.useRef(null);

  return (
    <>
      <div className="content">
        <div className="react-notification-alert-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        {/* Aquí eliminamos las secciones adicionales */}
      </div>
    </>
  );
}

export default Notifications;
