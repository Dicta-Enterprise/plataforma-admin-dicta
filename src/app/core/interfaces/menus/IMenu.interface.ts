export interface IMenu {
    idMenu: number;
    idPadre: number;
    items: IItems[];
    nombre: string;
  }
  
  export interface IItems {
    padre: IPadre;
    idMenu: number;
    nombre: string;
    ruta?: string;
    idPadre: number;
    icono: string;
    items?: IItems[];
  }
  
  export interface IPadre {
    idMenu: number;
    nombre: string;
    idPadre: number;
    ruta?: string; 
    icono?: string; 
  }