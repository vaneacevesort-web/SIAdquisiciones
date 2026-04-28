import { Request, Response } from 'express';
import AdqDependencias from '../models/AdqDependencias';
import AdqCentrosCosto from '../models/AdqCentrosCosto';
import AdqOrganismosOPDS from '../models/AdqOrganismosOPDS';
import AdqOrganosDesconcentrados from '../models/AdqOrganosDesconcentrados';
import AdqCatCapitulos from '../models/AdqCatCapitulos';
import AdqCatSubcapitulos from '../models/AdqCatSubcapitulos';
import AdqCatPartidasGenericas from '../models/AdqCatPartidasGenericas';
import AdqCatPartidasEspecificas from '../models/AdqCatPartidasEspecificas';

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

export const getCapitulos = async (req: Request, res: Response): Promise<any> => {
  try {
    const capitulos = await AdqCatCapitulos.findAll({
      order: [['codigo', 'ASC']]
    });

    return res.json({
      msg: 'Capítulos obtenidos',
      data: capitulos
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener capítulos'
    });
  }
};

export const getSubcapitulos = async (req: Request, res: Response): Promise<any> => {
  const { id_capitulo } = req.params;

  try {
    const subcapitulos = await AdqCatSubcapitulos.findAll({
      where: { id_capitulo },
      order: [['codigo', 'ASC']]
    });

    return res.json({
      msg: 'Subcapítulos obtenidos',
      data: subcapitulos
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener subcapítulos'
    });
  }
};

export const getPartidasGenericas = async (req: Request, res: Response): Promise<any> => {
  const { id_subcapitulo } = req.params;

  try {
    const partidas = await AdqCatPartidasGenericas.findAll({
      where: { id_subcapitulo },
      order: [['codigo', 'ASC']]
    });

    return res.json({
      msg: 'Partidas genéricas obtenidas',
      data: partidas
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener partidas genéricas'
    });
  }
};

export const getPartidasEspecificas = async (req: Request, res: Response): Promise<any> => {
  const { id_partida_generica } = req.params;

  try {
    const partidas = await AdqCatPartidasEspecificas.findAll({
      where: { id_partida_generica },
      order: [['codigo', 'ASC']]
    });

    return res.json({
      msg: 'Partidas específicas obtenidas',
      data: partidas
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Error al obtener partidas específicas'
    });
  }
};