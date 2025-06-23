"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "../../swagger.json";

type Props = {};

const ReactSwagger = ({}: Props) => {
  return <SwaggerUI spec={spec} />;
};
export default ReactSwagger; 