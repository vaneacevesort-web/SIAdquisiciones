import { Request, Response } from 'express';
import AdqDependencias from '../models/AdqDependencias';
import AdqCentrosCosto from '../models/AdqCentrosCosto';
import AdqOrganismosOPDS from '../models/AdqOrganismosOPDS';
import AdqOrganosDesconcentrados from '../models/AdqOrganosDesconcentrados';

export const getDependencias = async (req: Request, res: Response): Promise<any> => {
  try {
    const dependencias = await AdqDependencias.findAll({
      order: [['nombre', 'ASC']]
    });

    return res.json({
      msg: 'Dependencias obtenidas',
      data: dependencias
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener dependencias'
    });
  }
};

export const getCentrosCosto = async (req: Request, res: Response): Promise<any> => {
  const { id_dependencia } = req.params;

  try {
    const centros = await AdqCentrosCosto.findAll({
      where: { id_dependencia },
      order: [['nombre', 'ASC']]
    });

    return res.json({
      msg: 'Centros de costo obtenidos',
      data: centros
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener centros de costo'
    });
  }
};

export const getOrganismosOPDS = async (req: Request, res: Response): Promise<any> => {
  try {
    const organismos = await AdqOrganismosOPDS.findAll({
      order: [['nombre', 'ASC']]
    });

    return res.json({
      msg: 'Organismos OPDS obtenidos',
      data: organismos
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener organismos OPDS'
    });
  }
};

export const getOrganosDesconcentrados = async (req: Request, res: Response): Promise<any> => {
  try {
    const organos = await AdqOrganosDesconcentrados.findAll({
      order: [['nombre', 'ASC']]
    });

    return res.json({
      msg: 'Órganos desconcentrados obtenidos',
      data: organos
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener órganos desconcentrados'
    });
  }
};