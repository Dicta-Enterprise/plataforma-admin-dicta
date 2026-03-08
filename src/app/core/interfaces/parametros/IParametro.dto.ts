

export interface ParameterData {
  name: string;
  size: string;
  type: string;
}

export interface Parameter {
  data: ParameterData;
  children?: Parameter[];
}