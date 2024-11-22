import React from "react";
import { Card, CardBody } from "reactstrap";
import { GaugeComponent } from "react-gauge-component";

function GaugeCard({ title, value, min, max, unit, arcColors }) {
  return (
    <Card className="h-90">
      <CardBody>
        <h6 style={{ margin: "0 0 10px", fontSize: "1rem", textAlign: "center" }}>{title}</h6>
        <GaugeComponent
          type="semicircle"
          value={value}
          minValue={min}
          maxValue={max}
          arc={{
            colorArray: arcColors,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (val) => `${val} ${unit}`,
            },
          }}
          pointer={{
            type: "blob",
            animationDelay: 0,
            length: 0.8,
            width: 15,
          }}
        />
      </CardBody>
    </Card>
  );
}

export default GaugeCard;
